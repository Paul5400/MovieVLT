<!-- filepath: /home/paul/Documents/Web/S5/MovieVLT/my-vue-tailwind-app/src/components/HomeFilms.vue -->
<template>
  <div class="p-6 lg:p-10 text-white">
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
      <div>
        <h2 class="text-3xl font-bold">Vitrine des films</h2>
        <p class="mt-2 text-gray-300">Découvrez les sorties de l'année ou recherchez un film précis.</p>
      </div>
      <div class="w-full lg:w-auto">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            v-model="searchInput"
            @keyup.enter="onSearch"
            type="text"
            placeholder="Rechercher un film (ex: Dune Part Two)"
            class="w-full sm:w-80 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            @click="onSearch"
            class="inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-2 font-semibold hover:bg-indigo-600 transition"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading && !movies.length" class="text-center">Chargement...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div
      v-else-if="movies && movies.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <FilmCard
        v-for="(movie, index) in displayedMovies"
        :key="movie.tmdbID || movie.imdbID || index"
        :movie="movie"
        @show-movie="onMovieClick"
      />
    </div>
    <div v-else class="text-center text-gray-400">Aucun film à afficher.</div>

    <!-- Bouton "Voir plus" -->
    <div v-if="canLoadMore" class="mt-10 text-center">
      <button
        @click="loadMoreMovies"
        class="rounded-full bg-indigo-500 px-8 py-3 font-semibold text-white hover:bg-indigo-600 transition-transform hover:scale-105"
      >
        Voir plus
      </button>
    </div>
  </div>
</template>

<script>
import {
  discoverRecentMovies,
  searchMovies as searchMoviesByTitle,
} from "../services/tmdb";
import FilmCard from "./FilmCard.vue";

export default {
  name: "HomeFilms",
  components: {
    FilmCard,
  },
  data() {
    const currentYear = new Date().getFullYear();
    return {
      movies: [],
      loading: false,
      error: null,
      currentYear,
      searchInput: "",
      lastQuery: "",
      displayLimit: 10,
      moviesPerPage: 10,
    };
  },
  computed: {
    displayedMovies() {
      return this.movies.slice(0, this.displayLimit);
    },
    canLoadMore() {
      return this.movies.length > this.displayLimit;
    },
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    resetDisplayLimit() {
      this.displayLimit = 10;
    },
    async fetchMovies(query = "") {
      const trimmedQuery = query.trim();
      this.loading = true;
      this.error = null;
      try {
        if (trimmedQuery) {
          const { results } = await searchMoviesByTitle(trimmedQuery, { page: 1 });
          this.movies = results;
          this.resetDisplayLimit();
          this.lastQuery = trimmedQuery;
          if (!results.length) {
            this.error = "Aucun film trouvé pour cette recherche.";
          }
        } else {
          const { results } = await discoverRecentMovies({ year: this.currentYear });
          this.movies = results;
          this.resetDisplayLimit();
          this.lastQuery = "";
          if (!results.length) {
            this.error = "Aucun film récent trouvé pour le moment.";
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des films :", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.fetchMovies(this.searchInput);
    },
    onMovieClick(movieId) {
      this.$emit("show-movie", movieId);
    },
    loadMoreMovies() {
      this.displayLimit += this.moviesPerPage;
    },
  },
};
</script>

<style scoped>
</style>
