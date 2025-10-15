<!-- 
  FilmFilters.vue - Composant de filtrage pour les films
  Permet de filtrer par type, genre, année, note et tri avec interface interactive
-->
<template>
  <div class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl border border-white/20">
    <!-- Header avec bouton toggle pour mobile/tablette seulement -->
    <div class="flex items-center justify-between mb-4 lg:mb-6">
      <h3 class="text-lg sm:text-xl font-bold text-white">Filtres</h3>
      <div class="flex items-center gap-3">
        <button
          @click="resetFilters"
          class="text-xs sm:text-sm text-indigo-300 hover:text-white transition-colors duration-200"
        >
          Réinitialiser
        </button>
        <!-- Bouton toggle visible seulement sur mobile/tablette -->
        <button
          @click="filtersExpanded = !filtersExpanded"
          class="lg:hidden text-white hover:text-indigo-300 transition-colors flex items-center gap-2"
        >
          <span class="text-sm">{{ filtersExpanded ? 'Masquer' : 'Afficher' }}</span>
          <svg 
            :class="{ 'rotate-180': filtersExpanded }" 
            class="w-5 h-5 transform transition-transform"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filtres : toujours visibles sur desktop, collapsibles sur mobile/tablette -->
    <div 
      :class="[
        'grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end lg:justify-between lg:w-full gap-3 sm:gap-4 lg:gap-4 transition-all duration-300',
        filtersExpanded ? 'block' : 'hidden lg:flex'
      ]"
    >
      <!-- Filtre Type -->
      <div class="lg:flex-1 lg:min-w-0">
        <label class="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">Type</label>
        <select
          v-model="localFilters.type"
          @change="emitFilters"
          class="w-full rounded-lg border border-gray-300/30 bg-white/20 backdrop-blur-sm text-blue-900 px-3 py-2 sm:py-2 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Tous</option>
          <option value="movie">Films</option>
          <option value="tv">Séries TV</option>
        </select>
      </div>

      <!-- Filtre Genre -->
      <div class="lg:flex-1 lg:min-w-0">
        <label class="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">Genre</label>
        <select
          v-model="selectedGenreId"
          @change="updateGenreFilter"
          class="w-full rounded-lg border border-gray-300/30 bg-white/20 backdrop-blur-sm text-blue-900 px-3 py-2 sm:py-2 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Tous les genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- Filtre Année -->
      <div class="lg:flex-1 lg:min-w-0">
        <label class="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">Année</label>
        <select
          v-model="localFilters.year"
          @change="emitFilters"
          class="w-full rounded-lg border border-gray-300/30 bg-white/20 backdrop-blur-sm text-blue-900 px-3 py-2 sm:py-2 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Toutes</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Filtre Note minimale -->
      <div class="lg:flex-1 lg:min-w-0">
        <label class="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">
          Note minimale ({{ localFilters.vote_average_gte || 0 }}/10)
        </label>
        <input
          v-model.number="localFilters.vote_average_gte"
          @input="emitFilters"
          type="range"
          min="0"
          max="10"
          step="0.5"
          class="w-full h-2 bg-gray-200/30 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <!-- Filtre Tri -->
      <div class="lg:flex-1 lg:min-w-0">
        <label class="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2">Trier par</label>
        <select
          v-model="localFilters.sort_by"
          @change="emitFilters"
          class="w-full rounded-lg border border-gray-300/30 bg-white/20 backdrop-blur-sm text-blue-900 px-3 py-2 sm:py-2 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="popularity.desc">Popularité (↓)</option>
          <option value="popularity.asc">Popularité (↑)</option>
          <option value="release_date.desc">Date de sortie (↓)</option>
          <option value="release_date.asc">Date de sortie (↑)</option>
          <option value="vote_average.desc">Note (↓)</option>
          <option value="vote_average.asc">Note (↑)</option>
          <option value="title.asc">Titre (A-Z)</option>
          <option value="title.desc">Titre (Z-A)</option>
        </select>
      </div>
    </div>

    <!-- Indicateurs de filtres actifs -->
    <div 
      v-if="hasActiveFilters" 
      :class="[
        'mt-3 sm:mt-4 flex flex-wrap gap-2 transition-all duration-300',
        filtersExpanded ? 'flex' : 'hidden lg:flex'
      ]"
    >
      <span
        v-for="filter in activeFiltersDisplay"
        :key="filter.key"
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
      >
        {{ filter.label }}
        <button
          @click="removeFilter(filter.key)"
          class="ml-2 hover:text-white transition-colors"
        >
          ×
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import { getGenres } from '../services/tmdb';

export default {
  name: 'FilmFilters',
  props: {
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['filtersChanged'],
  data() {
    return {
      localFilters: {
        type: '',
        year: '',
        genre_ids: [],
        vote_average_gte: 0,
        sort_by: 'popularity.desc',
        ...this.filters
      },
      genres: [],
      selectedGenreId: '',
      years: [],
      filtersExpanded: false // État d'expansion du menu filtres sur mobile
    };
  },
  computed: {
    hasActiveFilters() {
      return this.localFilters.type || 
             this.localFilters.year || 
             this.localFilters.genre_ids.length > 0 || 
             this.localFilters.vote_average_gte > 0 ||
             this.localFilters.sort_by !== 'popularity.desc';
    },
    activeFiltersDisplay() {
      const filters = [];
      
      if (this.localFilters.type) {
        filters.push({
          key: 'type',
          label: `Type: ${this.localFilters.type === 'movie' ? 'Films' : 'Séries TV'}`
        });
      }
      
      if (this.localFilters.year) {
        filters.push({
          key: 'year',
          label: `Année: ${this.localFilters.year}`
        });
      }
      
      if (this.localFilters.genre_ids.length > 0) {
        const genre = this.genres.find(g => g.id == this.localFilters.genre_ids[0]);
        filters.push({
          key: 'genre_ids',
          label: `Genre: ${genre ? genre.name : 'Inconnu'}`
        });
      }
      
      if (this.localFilters.vote_average_gte > 0) {
        filters.push({
          key: 'vote_average_gte',
          label: `Note ≥ ${this.localFilters.vote_average_gte}/10`
        });
      }
      
      if (this.localFilters.sort_by !== 'popularity.desc') {
        const sortLabels = {
          'popularity.asc': 'Tri: Popularité ↑',
          'release_date.desc': 'Tri: Date ↓',
          'release_date.asc': 'Tri: Date ↑',
          'vote_average.desc': 'Tri: Note ↓',
          'vote_average.asc': 'Tri: Note ↑',
          'title.asc': 'Tri: A-Z',
          'title.desc': 'Tri: Z-A'
        };
        filters.push({
          key: 'sort_by',
          label: sortLabels[this.localFilters.sort_by] || 'Tri personnalisé'
        });
      }
      
      return filters;
    }
  },
  async mounted() {
    await this.loadGenres();
    this.generateYears();
    
    // Synchroniser les filtres depuis les props
    if (this.filters.genre_ids && this.filters.genre_ids.length > 0) {
      this.selectedGenreId = this.filters.genre_ids[0];
    }
  },
  watch: {
    filters: {
      handler(newFilters) {
        this.localFilters = { ...this.localFilters, ...newFilters };
        if (newFilters.genre_ids && newFilters.genre_ids.length > 0) {
          this.selectedGenreId = newFilters.genre_ids[0];
        }
      },
      deep: true
    }
  },
  methods: {
    // Charge la liste des genres depuis l'API TMDB
    async loadGenres() {
      try {
        this.genres = await getGenres();
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
      }
    },
    // Génère la liste des années (1990 à aujourd'hui)
    generateYears() {
      const currentYear = new Date().getFullYear();
      this.years = [];
      for (let year = currentYear; year >= 1990; year--) {
        this.years.push(year);
      }
    },
    updateGenreFilter() {
      if (this.selectedGenreId) {
        this.localFilters.genre_ids = [parseInt(this.selectedGenreId)];
      } else {
        this.localFilters.genre_ids = [];
      }
      this.emitFilters();
    },
    // Émet les filtres nettoyés (sans valeurs vides) vers le parent
    emitFilters() {
      // Nettoyer les filtres vides
      const cleanedFilters = {};
      Object.keys(this.localFilters).forEach(key => {
        const value = this.localFilters[key];
        if (value !== '' && value !== 0 && !(Array.isArray(value) && value.length === 0)) {
          cleanedFilters[key] = value;
        }
      });
      
      this.$emit('filtersChanged', cleanedFilters);
    },
    // Réinitialise tous les filtres aux valeurs par défaut
    resetFilters() {
      this.localFilters = {
        type: '',
        year: '',
        genre_ids: [],
        vote_average_gte: 0,
        sort_by: 'popularity.desc'
      };
      this.selectedGenreId = '';
      this.emitFilters();
    },
    removeFilter(filterKey) {
      if (filterKey === 'genre_ids') {
        this.localFilters.genre_ids = [];
        this.selectedGenreId = '';
      } else if (filterKey === 'vote_average_gte') {
        this.localFilters.vote_average_gte = 0;
      } else if (filterKey === 'sort_by') {
        this.localFilters.sort_by = 'popularity.desc';
      } else {
        this.localFilters[filterKey] = '';
      }
      this.emitFilters();
    }
  }
};
</script>

<style scoped>
/* Style personnalisé pour le slider */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Styles pour les options dans les selects */
select option {
  background: #1f2937;
  color: white;
}
</style>