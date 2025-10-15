<!-- HomeFilms - Page films avec recherche et filtres responsive -->
<template>
  <div class="px-4 py-6 sm:px-6 lg:px-10 lg:py-10 text-white">
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
      <div class="text-center lg:text-left">
        <h2 class="text-2xl sm:text-3xl font-bold">Vitrine des films</h2>
        <p class="mt-2 text-sm sm:text-base text-gray-300">Découvrez les sorties de l'année ou recherchez un film précis.</p>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 max-w-full sm:max-w-md mx-auto">
        <input
          v-model="searchInput"
          @input="onSearchInput"
          @keyup.enter="onSearch"
          type="text"
          placeholder="Rechercher un film (ex: Dune Part Two)"
          class="w-full sm:w-80 rounded-full px-4 py-3 sm:py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
        <button
          @click="onSearch"
          class="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-3 sm:py-2 font-semibold hover:bg-indigo-600 transition text-sm sm:text-base"
        >
          Rechercher
        </button>
      </div>
    </div>

    <!-- Composant de filtres responsive -->
    <FilmFilters 
      :filters="activeFilters"
      @filtersChanged="onFiltersChanged"
    />
    <div v-if="loading && !movies.length" class="text-center py-8">
      <div class="text-sm sm:text-base">Chargement...</div>
    </div>
    <div v-if="error" class="text-red-500 text-center py-8">
      <div class="text-sm sm:text-base">{{ error }}</div>
    </div>
    <div
      v-else-if="movies && movies.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 animate-fade-in"
    >
      <FilmCard
        v-for="(movie, index) in movies"
        :key="movie.tmdbID || movie.imdbID || index"
        :movie="movie"
        @show-movie="onMovieClick"
      />
    </div>
    <div v-else class="text-center text-gray-400">Aucun film à afficher.</div>

    <!-- Informations sur les résultats -->
    <div v-if="movies && movies.length && !loading" class="mb-4 sm:mb-6 text-center lg:text-left">
      <p class="text-sm sm:text-base text-gray-300">{{ movies.length }} films trouvés - Page {{ currentPage }} sur {{ totalPages }}</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 sm:mt-12 flex justify-center">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors text-sm sm:text-base"
      >
        Précédent
      </button>
      
      <span class="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-center text-sm sm:text-base">
        Page {{ currentPage }} sur {{ totalPages }}
      </span>
      
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors text-sm sm:text-base"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import {
  discoverRecentMovies,
  searchMovies as searchMoviesByTitle,
  getMovieDetails as fetchMovieDetails,
  discoverMoviesWithFilters,
} from "../services/tmdb";
import FilmCard from "./FilmCard.vue";
import FilmFilters from "./FilmFilters.vue";

export default {
  name: "HomeFilms",
  components: {
    FilmCard,
    FilmFilters,
  },
  emits: ["show-details"],
  data() {
    const currentYear = new Date().getFullYear();
    return {
      // Données films
      movies: [],
      loading: false,
      error: null,
      currentYear,
      searchInput: "",
      lastQuery: "",
      searchDebounceTimer: null,
      
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      
      activeFilters: {
        type: '',
        year: '',
        genre_ids: [],
        vote_average_gte: 0,
        sort_by: 'popularity.desc'
      }
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
        let result;
        
        if (this.searchInput.trim()) {
          result = await searchMoviesByTitle(this.searchInput.trim(), { page: this.currentPage });
        } else {
          const filters = {
            ...this.activeFilters,
            page: this.currentPage
          };
          
          const hasActiveFilters = Object.values(this.activeFilters).some(value => 
            value && !(Array.isArray(value) && value.length === 0) && value !== 'popularity.desc'
          );
          
          if (hasActiveFilters) {
            result = await discoverMoviesWithFilters(filters);
          } else {
            result = await discoverRecentMovies({ year: this.currentYear, page: this.currentPage });
          }
        }
        
        this.movies = result.results || [];
        this.totalResults = result.totalResults || 0;
        this.totalPages = result.totalPages || 0;
        this.currentPage = result.page || 1;
        
        if (!this.movies.length) {
          this.error = this.searchInput.trim() ? 
            "Aucun film trouvé pour cette recherche." : 
            "Aucun film trouvé pour ces critères.";
        }
        
      } catch (err) {
        console.error("Erreur lors de la récupération des films:", err);
        this.error = err.message || "Erreur lors de la récupération des films.";
        this.movies = [];
      } finally {
        this.loading = false;
      }
    },
    onSearchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      this.searchDebounceTimer = setTimeout(() => {
        this.currentPage = 1;
        this.fetchMovies();
      }, 500);
    },
    
    onSearch() {
      this.currentPage = 1;
      this.fetchMovies();
    },
    
    onFiltersChanged(filters) {
      this.activeFilters = { ...filters };
      this.currentPage = 1;
      this.fetchMovies();
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchMovies();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    onMovieClick(movieId) {
      this.$emit("show-movie", movieId);
    },
  },
  
  beforeUnmount() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }
};
</script>

<style scoped>
</style>
