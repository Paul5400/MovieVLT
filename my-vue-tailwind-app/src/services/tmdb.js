const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1bbd01570b2ef7ab046523ecd3e1bdfc';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const DEFAULT_POSTER_SIZE = 'w500';
const DEFAULT_PROFILE_SIZE = 'w500';
const DEFAULT_LANGUAGE = 'fr-FR';

function buildUrl(path, params = {}) {
  const filteredParams = Object.entries({
    api_key: TMDB_API_KEY,
    language: DEFAULT_LANGUAGE,
    ...params,
  }).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});

  const query = new URLSearchParams(filteredParams);
  return `${TMDB_BASE_URL}${path}?${query.toString()}`;
}

async function fetchFromTMDB(path, params) {
  if (!TMDB_API_KEY) {
    throw new Error('Aucune clé API TMDB fournie. Définissez VITE_TMDB_API_KEY.');
  }

  const response = await fetch(buildUrl(path, params));

  if (!response.ok) {
    throw new Error(`Erreur TMDB (${response.status}): ${response.statusText}`);
  }

  const data = await response.json();

  if (data && data.success === false) {
    throw new Error(data.status_message || "Erreur lors de l'appel TMDB.");
  }

  return data;
}

function buildPosterUrl(path) {
  if (!path) {
    return 'N/A';
  }
  return `${TMDB_IMAGE_BASE_URL}/${DEFAULT_POSTER_SIZE}${path}`;
}

function buildProfileUrl(path) {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${DEFAULT_PROFILE_SIZE}${path}`;
}

function mapMovieSummary(movie) {
  return {
    tmdbID: movie.id,
    imdbID: `tmdb-${movie.id}`,
    Title: movie.title || movie.name || 'Titre inconnu',
    Year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
    Poster: buildPosterUrl(movie.poster_path),
    Overview: movie.overview || '',
  };
}

function mapMovieDetails(movie) {
  const summary = mapMovieSummary(movie);
  const genres = Array.isArray(movie.genres)
    ? movie.genres.map((genre) => genre.name).join(', ')
    : 'N/A';

  const director = movie.credits?.crew?.find((crewMember) => crewMember.job === 'Director');

  const actors = Array.isArray(movie.credits?.cast)
    ? movie.credits.cast.slice(0, 5).map((actor) => actor.name).join(', ')
    : '';

  return {
    ...summary,
    Genre: genres,
    Director: director?.name || 'Inconnu',
    Plot: movie.overview || 'Synopsis non disponible.',
    Runtime: movie.runtime || null,
    Actors: actors,
  };
}

export async function discoverRecentMovies({ year = new Date().getFullYear(), page = 1 } = {}) {
  const data = await fetchFromTMDB('/discover/movie', {
    sort_by: 'popularity.desc',
    primary_release_year: year,
    include_adult: false,
    page,
  });

  return {
    results: Array.isArray(data.results) ? data.results.map(mapMovieSummary) : [],
    page: data.page || page,
    totalPages: data.total_pages || 1,
    totalResults: data.total_results || 0,
  };
}

export async function searchMovies(query, { page = 1, year } = {}) {
  const data = await fetchFromTMDB('/search/movie', {
    query,
    page,
    include_adult: false,
    year,
  });

  return {
    results: Array.isArray(data.results) ? data.results.map(mapMovieSummary) : [],
    totalResults: data.total_results || 0,
    totalPages: data.total_pages || 0,
    page: data.page || page,
  };
}

export async function getMovieDetails(tmdbId) {
  const data = await fetchFromTMDB(`/movie/${tmdbId}`, {
    append_to_response: 'credits',
  });

  return mapMovieDetails(data);
}

export async function getMovieCredits(tmdbId) {
  const data = await fetchFromTMDB(`/movie/${tmdbId}/credits`);

  const actors = Array.isArray(data.cast)
    ? data.cast.slice(0, 5).map((actor) => actor.name).join(', ')
    : '';

  const director = Array.isArray(data.crew)
    ? data.crew.find((crewMember) => crewMember.job === 'Director')?.name || 'Inconnu'
    : 'Inconnu';

  return { actors, director };
}

function computeAge(birthday, deathday) {
  if (!birthday) {
    return null;
  }
  const birthDate = new Date(birthday);
  const endDate = deathday ? new Date(deathday) : new Date();
  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    endDate.getMonth() < birthDate.getMonth() ||
    (endDate.getMonth() === birthDate.getMonth() && endDate.getDate() < birthDate.getDate());
  if (beforeBirthday) {
    age -= 1;
  }
  return age;
}

function mapPersonSummary(person) {
  return {
    id: person.id,
    name: person.name,
    profile: buildProfileUrl(person.profile_path),
    knownForDepartment: person.known_for_department || '',
  };
}

function mapCreditItem(credit, extra = {}) {
  const title =
    credit.title ||
    credit.original_title ||
    credit.name ||
    credit.original_name ||
    'Titre inconnu';
  const dateSource = credit.release_date || credit.first_air_date || '';
  return {
    tmdbID: credit.id,
    Title: title,
    Poster: buildPosterUrl(credit.poster_path),
    Year: dateSource ? dateSource.slice(0, 4) : 'N/A',
    MediaType: credit.media_type || '',
    ...extra,
  };
}

function mapPersonDetails(person) {
  const summary = mapPersonSummary(person);
  const movieCredits = Array.isArray(person.combined_credits?.cast)
    ? person.combined_credits.cast
        .filter((credit) => credit.media_type === 'movie')
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 10)
        .map((credit) => mapCreditItem(credit, { Character: credit.character || '' }))
    : [];

  const directingCredits = Array.isArray(person.combined_credits?.crew)
    ? person.combined_credits.crew
        .filter((credit) => credit.job === 'Director')
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 10)
        .map((credit) => mapCreditItem(credit, { Job: credit.job || '' }))
    : [];

  return {
    ...summary,
    biography: person.biography || 'Aucune biographie disponible.',
    birthday: person.birthday || '',
    deathday: person.deathday || '',
    placeOfBirth: person.place_of_birth || '',
    age: computeAge(person.birthday, person.deathday),
    knownFor: movieCredits,
    knownForDirecting: directingCredits,
  };
}

export async function searchPeople(query, { page = 1 } = {}) {
  const data = await fetchFromTMDB('/search/person', {
    query,
    page,
    include_adult: false,
  });

  return Array.isArray(data.results) ? data.results.map(mapPersonSummary) : [];
}

export async function getPersonDetails(personId) {
  const data = await fetchFromTMDB(`/person/${personId}`, {
    append_to_response: 'combined_credits',
  });

  return mapPersonDetails(data);
}

function mapSearchResult(result) {
  if (!result || !result.media_type) {
    return null;
  }

  if (result.media_type === 'movie') {
    const year = result.release_date ? result.release_date.slice(0, 4) : '';
    return {
      id: result.id,
      type: 'movie',
      title: result.title || result.original_title || 'Titre inconnu',
      subtitle: year ? `Film · ${year}` : 'Film',
      image: buildPosterUrl(result.poster_path),
    };
  }

  if (result.media_type === 'person') {
    const department = result.known_for_department ? result.known_for_department : '';
    return {
      id: result.id,
      type: 'person',
      title: result.name || 'Nom inconnu',
      subtitle: department ? `Personne · ${department}` : 'Personne',
      image: buildProfileUrl(result.profile_path),
    };
  }

  return null;
}

export async function searchMulti(query, { page = 1 } = {}) {
  const data = await fetchFromTMDB('/search/multi', {
    query,
    page,
    include_adult: false,
  });

  return Array.isArray(data.results)
    ? data.results
        .map(mapSearchResult)
        .filter(Boolean)
    : [];
}

export {
  mapMovieSummary,
  mapMovieDetails,
  buildPosterUrl,
  buildProfileUrl,
  mapPersonSummary,
  mapPersonDetails,
  mapSearchResult,
};
