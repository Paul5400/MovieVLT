<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-4 text-center">Films</h2>
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="movie in movies"
        :key="movie.tmdbID || movie.imdbID"
        class="bg-white rounded-lg shadow p-4 flex flex-col"
      >
        <img v-if="movie.Poster !== 'N/A'" :src="movie.Poster" alt="Affiche du film" class="w-full mb-4 rounded" />
        <h3 class="text-xl font-semibold">{{ movie.Title }}</h3>
        <p class="mt-2 text-gray-600">Année : {{ movie.Year }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { discoverRecentMovies } from "../services/tmdb";

export default {
  name: "MovieList",
  data() {
    return {
      movies: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      this.loading = true;
      this.error = null;
      try {
        const { results } = await discoverRecentMovies();
        this.movies = results;
      } catch (error) {
        console.error("Erreur lors du chargement des films:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Vous pouvez ajouter ici des styles spécifiques au composant */
</style>
