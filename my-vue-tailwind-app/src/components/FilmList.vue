<template>
  <div class="p-4 text-white">
    <h2 class="text-3xl font-bold mb-4 text-center">Rechercher des films</h2>
    <div class="flex justify-center mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Recherche..."
        class="px-4 py-2 rounded-l-md focus:outline-none text-black"
      />
      <button
        @click="searchMovies"
        class="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-r-md"
      >
        Rechercher
      </button>
    </div>
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div
      v-if="movies && movies.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
    >
      <div
        v-for="movie in movies"
        :key="movie.tmdbID || movie.imdbID"
        class="bg-gray-800 p-4 rounded-md shadow"
      >
        <img
          v-if="movie.Poster !== 'N/A'"
          :src="movie.Poster"
          alt="Affiche"
          class="mb-2 w-full h-64 object-cover rounded-md"
        />
        <h3 class="text-xl font-semibold">{{ movie.Title }}</h3>
        <p class="mb-2">
          Année:
          <span>{{ fixYear(movie.Year) }}</span>
        </p>
        <button
          @click="getMovieDetails(movie.tmdbID)"
          class="bg-indigo-500 hover:bg-indigo-400 px-3 py-1 rounded"
        >
          Voir les détails
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { searchMovies, getMovieDetails as fetchMovieDetails } from "../services/tmdb";

export default {
  name: "FilmList",
  data() {
    const currentYear = new Date().getFullYear().toString();
    return {
      searchQuery: currentYear,
      movies: [],
      loading: false,
      error: null,
      currentYear,
    };
  },
  mounted() {
    this.searchMovies();
  },
  methods: {
    fixYear(year) {
      const match = String(year).match(/\d{4}/);
      return match ? match[0] : year;
    },
    async searchMovies() {
      if (!this.searchQuery.trim()) {
        this.movies = [];
        this.error = null;
        return;
      }
      this.loading = true;
      this.error = null;
      this.movies = [];
      try {
        const { results } = await searchMovies(this.searchQuery, {
          page: 1,
          year: Number(this.currentYear) || undefined,
        });
        this.movies = results;
        if (!results.length) {
          this.error = "Aucun film trouvé pour cette recherche.";
        }
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async getMovieDetails(tmdbID) {
      if (!tmdbID) {
        this.error = "Identifiant TMDB manquant pour ce film.";
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const details = await fetchMovieDetails(tmdbID);
        this.$emit("show-details", details);
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Styles complémentaires si nécessaire */
</style>
