<!-- 
  HomeFilms.vue - Page d'accueil des films avec filtres et recherche
  Affiche les films récents, permet la recherche et le filtrage avec pagination
-->
<template>
  <div class="p-6 lg:p-10 text-white">
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
      <div>
        <h2 class="text-3xl font-bold">Vitrine des films</h2>
        <p class="mt-2 text-gray-300">Découvrez les sorties de l'année ou recherchez un film précis.</p>
      </div>
    </div>

    <!-- Composant de filtres -->
    <FilmFilters 
      :filters="activeFilters"
      @filtersChanged="onFiltersChanged"
    />

    <!-- Barre de recherche -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 max-w-md mx-auto">
        <input
          v-model="searchInput"
          @input="onSearchInput"
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
    <div v-if="loading && !movies.length" class="text-center">Chargement...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div
      v-else-if="movies && movies.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in"
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
    <div v-if="movies.length > 0" class="mt-6 text-center">
      <p class="text-gray-300">
        {{ searchInput ? `${totalResults} résultats pour "${searchInput}"` : 
           `${totalResults} films trouvés` }}
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center space-x-2 mt-8">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
      >
        Précédent
      </button>
      
      <span class="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
        Page {{ currentPage }} sur {{ totalPages }}
      </span>
      
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
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
      movies: [],
      loading: false,
      error: null,
      currentYear,
      searchInput: "",
      lastQuery: "",
      searchDebounceTimer: null,
      
      // Pagination
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      
      // Filtres
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
    // Récupère les films selon les filtres et la recherche
    async fetchMovies() {
      this.loading = true;
      this.error = null;
      
      try {
        let result;
        
        if (this.searchInput.trim()) {
          // Recherche par titre
          result = await searchMoviesByTitle(this.searchInput.trim(), { page: this.currentPage });
        } else {
          // Utiliser les filtres pour découvrir des films
          const filters = {
            ...this.activeFilters,
            page: this.currentPage
          };
          
          // Si aucun filtre n'est actif, charger les films récents
          const hasActiveFilters = Object.values(this.activeFilters).some(value => 
            value && !(Array.isArray(value) && value.length === 0) && value !== 'popularity.desc'
          );
          
          if (hasActiveFilters) {
            result = await discoverMoviesWithFilters(filters);
          } else {
            // Films récents par défaut
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
    // Recherche avec débouncing (attendre 500ms après la dernière frappe)
    onSearchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      this.searchDebounceTimer = setTimeout(() => {
        this.currentPage = 1;
        this.fetchMovies();
      }, 500);
    },
    
    // Recherche immédiate
    onSearch() {
      this.currentPage = 1;
      this.fetchMovies();
    },
    
    // Gestion des changements de filtres
    onFiltersChanged(filters) {
      this.activeFilters = { ...filters };
      this.currentPage = 1;
      this.fetchMovies();
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchMovies();
        // Scroll vers le haut
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
