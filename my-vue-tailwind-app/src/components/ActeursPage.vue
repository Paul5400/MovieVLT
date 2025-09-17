
<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Recherche d'acteurs principaux</h1>
    <div class="flex mb-6">
      <input
        v-model="searchQuery"
        @keyup.enter="searchMovies"
        type="text"
        placeholder="Rechercher un film par nom..."
        class="flex-1 border rounded-l px-4 py-2 focus:outline-none"
      />
      <button
        @click="searchMovies"
        class="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
      >
        Rechercher
      </button>
    </div>
    <div v-if="loading" class="text-gray-500">Chargement...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <ul v-if="movies.length > 0">
      <li v-for="movie in movies" :key="movie.tmdbID || movie.imdbID" class="mb-6 border-b pb-4">
        <div class="flex items-center">
          <img v-if="movie.Poster && movie.Poster !== 'N/A'" :src="movie.Poster" alt="Poster" class="w-16 h-24 object-cover mr-4 rounded shadow" />
          <div>
            <h2 class="text-lg font-semibold">{{ movie.Title }} ({{ movie.Year }})</h2>
            <div v-if="movie.Actors" class="mt-1">
              <span class="font-medium">Acteurs principaux :</span> {{ movie.Actors }}
            </div>
            <div v-else class="text-gray-400">Aucun acteur trouvé.</div>
            <div v-if="movie.Director" class="mt-1 text-sm text-gray-300">
              <span class="font-medium">Réalisateur :</span> {{ movie.Director }}
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else-if="!loading && !error" class="text-gray-400">Aucun résultat.</div>
  </div>
</template>


<script>
import { searchMovies, getMovieDetails } from "../services/tmdb";

export default {
  name: "ActeursPage",
  data() {
    return {
      searchQuery: "",
      movies: [],
      loading: false,
      error: "",
    };
  },
  methods: {
    async searchMovies() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.movies = [];
        this.error = "";
        return;
      }
      this.loading = true;
      this.error = "";
      this.movies = [];
      try {
        const { results } = await searchMovies(query, { page: 1 });
        const topResults = results.slice(0, 10);
        const details = await Promise.all(
          topResults.map(async (movie) => {
            try {
              return await getMovieDetails(movie.tmdbID);
            } catch (innerError) {
              console.error("Erreur lors du chargement des détails du film:", innerError);
              return null;
            }
          })
        );
        this.movies = details.filter(Boolean);
        if (!this.movies.length) {
          this.error = "Aucun résultat trouvé.";
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        this.error = err.message || "Erreur lors de la récupération des données.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
