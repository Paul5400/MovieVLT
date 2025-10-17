<!-- 
  FavoritesPage.vue - Page d'affichage des films favoris
  Affiche tous les films mis en favoris par l'utilisateur
-->
<template>
  <div class="px-4 py-6 sm:px-6 lg:px-10 lg:py-10 text-white">
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
      <div class="text-center lg:text-left">
        <h2 class="text-2xl sm:text-3xl font-bold flex items-center gap-3 justify-center lg:justify-start">
          <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Mes Favoris
        </h2>
        <p class="mt-2 text-sm sm:text-base text-gray-300">
          {{ filteredAndSortedFavorites.length }} {{ getTypeLabel() }} en favoris
        </p>
      </div>
      
      <!-- Actions -->
      <div class="flex gap-3 items-center" v-if="favorites.length > 0">
        <div>
          <label class="text-sm text-gray-300 mr-2">Afficher :</label>
          <select v-model="filterType" class="rounded bg-gray-800 text-white px-3 py-2 text-sm border border-gray-600">
            <option value="all">Tous les favoris</option>
            <option value="movie">Films seulement</option>
            <option value="person">Acteurs et Réalisateurs</option>
          </select>
        </div>
        <button
          @click="sortBy = sortBy === 'title' ? 'date' : 'title'"
          class="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition text-sm font-medium"
        >
          Trier par {{ sortBy === 'title' ? 'date' : 'titre' }}
        </button>
        <button
          @click="confirmClearAll"
          class="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
        >
          Tout supprimer
        </button>
      </div>
    </div>

    <!-- Message si aucun favori -->
    <div v-if="!favorites.length" class="text-center py-12">
      <svg class="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <h3 class="text-xl font-semibold text-gray-400 mb-2">Aucun favori trouvé</h3>
      <p class="text-gray-500 mb-6">Ajoutez des films et des personnes à vos favoris en cliquant sur le cœur dans leurs fiches respectives.</p>
      <button
        @click="$emit('navigate-to', 'films')"
        class="inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
      >
        Découvrir des films
      </button>
    </div>

    <!-- Grille des favoris (films & personnes) -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 animate-fade-in"
    >
      <article
        v-for="item in filteredAndSortedFavorites"
        :key="item.type + '-' + item.id"
        class="group bg-gray-800/70 rounded-lg sm:rounded-xl overflow-hidden shadow border border-gray-700 hover:border-indigo-400 hover:shadow-lg transition-all transform hover:scale-105 active:scale-[0.98] cursor-pointer flex flex-col h-full"
        @click="item.type === 'movie' ? $emit('show-movie', item.id) : $emit('show-actor-details', item.id)"
      >
        <div class="relative h-48 sm:h-56 lg:h-64 w-full">
          <img
            v-if="item.poster_path && item.poster_path !== 'N/A'"
            :src="item.poster_path"
            :alt="`Affiche de ${item.title || item.name}`"
            class="h-full w-full object-cover"
          />
          <div v-else class="h-full w-full flex items-center justify-center bg-gray-700/50 text-gray-400 text-xs sm:text-sm">
            Pas d'affiche
          </div>

          <!-- Bouton pour retirer des favoris -->
          <button
            @click.stop="removeFromFavorites(item.id, item.type)"
            class="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-sm bg-black/50 hover:bg-red-500/80 transition-all duration-200 transform hover:scale-110 z-10"
            title="Retirer des favoris"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        <div class="p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 flex-grow flex flex-col">
          <h4 class="text-sm sm:text-base lg:text-lg font-semibold group-hover:text-indigo-300 transition flex-grow leading-tight">
            {{ item.title || item.name }}
          </h4>
          <div class="text-xs sm:text-sm space-y-1">
            <p class="text-gray-300" v-if="item.release_date">{{ item.release_date }}</p>
            <div v-if="item.vote_average > 0" class="flex items-center gap-1">
              <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span class="text-gray-400" v-if="item.vote_average">{{ item.vote_average }}/10</span>
            </div>
            <p class="text-xs text-gray-500">
              Ajouté le {{ formatDate(item.addedAt) }}
            </p>
            <p class="text-xs text-gray-400 uppercase">{{ item.type }}</p>
          </div>
        </div>
      </article>
    </div>

    <!-- Modal de confirmation pour tout supprimer -->
    <div v-if="showConfirmDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="showConfirmDialog = false">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-white mb-3">Supprimer tous les favoris ?</h3>
        <p class="text-gray-300 mb-6">Cette action est irréversible. Tous vos films favoris seront supprimés.</p>
        <div class="flex gap-3">
          <button
            @click="showConfirmDialog = false"
            class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Annuler
          </button>
          <button
            @click="clearAllFavorites"
            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Supprimer tout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFavorites, removeFromFavorites, clearAllFavorites } from '../services/favorites';

export default {
  name: 'FavoritesPage',
  emits: ['show-movie', 'show-actor-details', 'navigate-to', 'favorites-changed'],
  data() {
    return {
      favorites: [],
      sortBy: 'date', // 'date' ou 'title'
      filterType: 'movie', // 'all' | 'movie' | 'person' - défaut sur films
      showConfirmDialog: false
    };
  },
  computed: {
    filteredFavorites() {
      if (this.filterType === 'all') return [...this.favorites];
      return this.favorites.filter(f => f.type === this.filterType);
    },
    filteredAndSortedFavorites() {
      const sorted = [...this.filteredFavorites];
      if (this.sortBy === 'title') {
        return sorted.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
      } else {
        return sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      }
    },
    // Garder sortedFavorites pour compatibilité si utilisé ailleurs
    sortedFavorites() {
      return this.filteredAndSortedFavorites;
    }
  },
  mounted() {
    this.loadFavorites();
  },
  methods: {
    loadFavorites() {
      this.favorites = getFavorites();
    },
    removeFromFavorites(itemId, itemType) {
      if (removeFromFavorites(itemId, itemType)) {
        this.loadFavorites();
        this.$emit('favorites-changed');
      }
    },
    confirmClearAll() {
      this.showConfirmDialog = true;
    },
    clearAllFavorites() {
      if (clearAllFavorites()) {
        this.favorites = [];
        this.showConfirmDialog = false;
        this.$emit('favorites-changed');
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },
    getTypeLabel() {
      switch (this.filterType) {
        case 'movie': return this.filteredAndSortedFavorites.length > 1 ? 'films' : 'film';
        case 'person': return this.filteredAndSortedFavorites.length > 1 ? 'personnes' : 'personne';
        case 'all': return this.filteredAndSortedFavorites.length > 1 ? 'éléments' : 'élément';
        default: return 'favoris';
      }
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>