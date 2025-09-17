const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1bbd01570b2ef7ab046523ecd3e1bdfc';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const DEFAULT_POSTER_SIZE = 'w500';
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

export async function discoverRecentMovies(year = new Date().getFullYear()) {
  const data = await fetchFromTMDB('/discover/movie', {
    sort_by: 'popularity.desc',
    primary_release_year: year,
    include_adult: false,
    page: 1,
  });

  return Array.isArray(data.results) ? data.results.map(mapMovieSummary) : [];
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

export { mapMovieSummary, mapMovieDetails, buildPosterUrl };
