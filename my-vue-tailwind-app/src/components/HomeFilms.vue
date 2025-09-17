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
        v-for="(movie, index) in visibleMovies"
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
    <div
      v-if="movies && movies.length && showLoadMore"
      class="mt-8 flex justify-center"
    >
      <button
        @click="loadMore"
        :disabled="isLoadingMore"
        class="rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-600"
      >
        {{ isLoadingMore ? 'Chargement...' : 'Voir plus' }}
      </button>
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
      visibleCount: 10,
      currentPage: 1,
      totalPages: 1,
      lastQueryType: "discover",
      isLoadingMore: false,
    };
  },
  mounted() {
    this.fetchMovies();
  },
  computed: {
    visibleMovies() {
      return this.movies.slice(0, this.visibleCount);
    },
    showLoadMore() {
      if (!this.movies.length) {
        return false;
      }
      return this.movies.length > this.visibleCount || this.currentPage < this.totalPages;
    },
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
          const response = await searchMoviesByTitle(trimmedQuery, { page: 1 });
          this.movies = response.results;
          this.visibleCount = 10;
          this.lastQuery = trimmedQuery;
          this.currentPage = response.page || 1;
          this.totalPages = response.totalPages || 1;
          this.lastQueryType = "search";
          if (!response.results.length) {
            this.error = "Aucun film trouvé pour cette recherche.";
          }
        } else {
          const response = await discoverRecentMovies({ year: this.currentYear, page: 1 });
          this.movies = response.results;
          this.visibleCount = 10;
          this.lastQuery = "";
          this.currentPage = response.page || 1;
          this.totalPages = response.totalPages || 1;
          this.lastQueryType = "discover";
          if (!response.results.length) {
            this.error = "Aucun film récent trouvé pour le moment.";
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des films :", err);
        this.error = err.message;
      } finally {
        this.loading = false;
        this.isLoadingMore = false;
      }
    },
    onSearch() {
      this.fetchMovies(this.searchInput);
    },
    async loadMore() {
      if (this.isLoadingMore) {
        return;
      }
      if (this.visibleCount < this.movies.length) {
        this.visibleCount = Math.min(this.visibleCount + 10, this.movies.length);
        return;
      }
      if (this.currentPage >= this.totalPages) {
        return;
      }
      const loaded = await this.fetchNextPage();
      if (loaded) {
        this.visibleCount = Math.min(this.visibleCount + 10, this.movies.length);
      }
    },
    async fetchNextPage() {
      const nextPage = this.currentPage + 1;
      if (nextPage > this.totalPages) {
        return false;
      }
      this.isLoadingMore = true;
      this.error = null;
      try {
        let response;
        if (this.lastQueryType === "search" && this.lastQuery) {
          response = await searchMoviesByTitle(this.lastQuery, { page: nextPage });
        } else {
          response = await discoverRecentMovies({ year: this.currentYear, page: nextPage });
        }
        const newResults = response.results || [];
        if (newResults.length) {
          this.movies = this.movies.concat(newResults);
        }
        this.currentPage = response.page || nextPage;
        this.totalPages = response.totalPages || this.totalPages;
        return newResults.length > 0;
      } catch (err) {
        console.error("Erreur lors du chargement supplémentaire :", err);
        this.error = err.message;
        return false;
      } finally {
        this.isLoadingMore = false;
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
