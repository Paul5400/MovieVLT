<!-- filepath: /home/paul/Documents/Web/S5/MovieVLT/my-vue-tailwind-app/src/components/HomeFilms.vue -->
<template>
  <div class="p-4 text-white">
    <h2 class="text-3xl font-bold mb-6 text-center">Films Récents</h2>
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div
      v-if="movies && movies.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="(movie, index) in movies.slice(0, 10)"
        :key="movie.imdbID || index"
        class="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col"
      >
        <img
          v-if="movie.Poster !== 'N/A'"
          :src="movie.Poster"
          alt="Affiche du film"
          class="w-full h-48 object-cover"
        />
        <div class="p-4 flex-grow">
          <h3 class="text-xl font-semibold mb-2">{{ movie.Title }}</h3>
          <p class="text-sm text-gray-300">
            Année : {{ fixYear(movie.Year) }}
          </p>
        </div>
        <div class="p-4">
          <button
            @click="getMovieDetails(movie.imdbID)"
            class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded"
          >
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeFilms",
  data() {
    const currentYear = new Date().getFullYear().toString();
    return {
      movies: [],
      loading: false,
      error: null,
      apiKey: "321b3ca4", // Votre clé API OMDb
      searchQuery: currentYear,
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    fixYear(year) {
      const match = String(year).match(/\d{4}/);
      return match ? match[0] : year;
    },
    async fetchMovies() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${this.apiKey}&s=${encodeURIComponent(
            this.searchQuery
          )}&y=${this.searchQuery}`
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        this.movies = data.Search;
      } catch (err) {
        console.error("Erreur lors de la récupération des films :", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async getMovieDetails(imdbID) {
      // Récupère les détails complets du film et émet l'événement pour l'affichage.
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${this.apiKey}&i=${imdbID}&plot=full`
        );
        if (!response.ok)
          throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        if (data.Response === "False") throw new Error(data.Error);
        this.$emit("show-details", data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails :", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Ajoutez vos styles complémentaires si besoin */
</style>