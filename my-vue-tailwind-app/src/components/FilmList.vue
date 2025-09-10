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
      <button @click="searchMovies" class="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-r-md">
        Rechercher
      </button>
    </div>
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-if="movies && movies.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="movie in movies"
        :key="movie.imdbID"
        class="bg-gray-800 p-4 rounded-md shadow"
      >
        <img
          v-if="movie.Poster !== 'N/A'"
          :src="movie.Poster"
          alt="Affiche"
          class="mb-2 w-full h-64 object-cover rounded-md"
        />
        <h3 class="text-xl font-semibold">{{ movie.Title }}</h3>
        <p class="mb-2">Année : {{ movie.Year }}</p>
        <button @click="getMovieDetails(movie.imdbID)" class="bg-indigo-500 hover:bg-indigo-400 px-3 py-1 rounded">
          Voir les détails
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilmList",
  data() {
    const currentYear = new Date().getFullYear().toString();
    return {
      // Recherche par défaut par l'année actuelle
      searchQuery: currentYear,
      movies: [],
      loading: false,
      error: null,
      apiKey: "321b3ca4" // Votre clé API OMDb
    };
  },
  mounted() {
    this.searchMovies();
  },
  methods: {
    async searchMovies() {
      this.loading = true;
      this.error = null;
      this.movies = [];
      const currentYear = new Date().getFullYear();
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${this.apiKey}&s=${encodeURIComponent(this.searchQuery)}&y=${currentYear}`
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        this.movies = data.Search;
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async getMovieDetails(imdbID) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${this.apiKey}&i=${imdbID}&plot=full`
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        this.$emit("show-details", data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>