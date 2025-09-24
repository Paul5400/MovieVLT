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
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div
      v-if="movies && movies.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="(movie, index) in movies.slice(0, 10)"
        :key="movie.tmdbID || movie.imdbID || index"
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
            @click="getMovieDetails(movie.tmdbID)"
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
import {
  discoverRecentMovies,
  searchMovies as searchMoviesByTitle,
  getMovieDetails as fetchMovieDetails,
} from "../services/tmdb";

export default {
  name: "HomeFilms",
  data() {
    const currentYear = new Date().getFullYear();
    return {
      movies: [],
      loading: false,
      error: null,
      currentYear,
      searchInput: "",
      lastQuery: "",
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
    async fetchMovies(query = "") {
      const trimmedQuery = query.trim();
      this.loading = true;
      this.error = null;
      try {
        if (trimmedQuery) {
          const { results } = await searchMoviesByTitle(trimmedQuery, { page: 1 });
          this.movies = results;
          this.lastQuery = trimmedQuery;
          if (!results.length) {
            this.error = "Aucun film trouvé pour cette recherche.";
          }
        } else {
          const { results } = await discoverRecentMovies({ year: this.currentYear });
          this.movies = results;
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
</style>
