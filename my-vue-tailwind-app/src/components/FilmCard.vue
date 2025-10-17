<!-- 
  FilmCard.vue - Carte d'affichage d'un film
  Composant réutilisable pour afficher un film avec poster, titre et note
-->
<template>
  <article
    class="group bg-gray-800/70 rounded-lg sm:rounded-xl overflow-hidden shadow border border-gray-700 hover:border-indigo-400 hover:shadow-lg transition-all transform hover:scale-105 active:scale-[0.98] cursor-pointer flex flex-col h-full"
    @click="$emit('show-movie', movie.tmdbID)"
  >
    <div class="relative h-48 sm:h-56 lg:h-64 w-full">
      <img
        v-if="movie.Poster && movie.Poster !== 'N/A'"
        :src="movie.Poster"
        :alt="`Affiche de ${movie.Title}`"
        class="h-full w-full object-cover"
      />
      <div v-else class="h-full w-full flex items-center justify-center bg-gray-700/50 text-gray-400 text-xs sm:text-sm">
        Pas d'affiche
      </div>
      
      <!-- Bouton favori -->
      <button
        @click.stop="toggleFavorite"
        class="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-sm bg-black/30 hover:bg-black/50 transition-all duration-200 transform hover:scale-110 z-10"
        :title="isMovieFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        <svg 
          class="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200" 
          :class="isMovieFavorite ? 'text-red-500 fill-current' : 'text-white'"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            :fill="isMovieFavorite ? 'currentColor' : 'none'"
          />
        </svg>
      </button>
    </div>
    <div class="p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 flex-grow flex flex-col">
      <h4 class="text-sm sm:text-base lg:text-lg font-semibold group-hover:text-indigo-300 transition flex-grow leading-tight">
        {{ movie.Title }}
      </h4>
      <div class="text-xs sm:text-sm space-y-1">
        <p class="text-gray-300">{{ movie.Year }}</p>
        <p v-if="movie.Character" class="text-gray-400 truncate">{{ movie.Character }}</p>
        <p v-if="movie.Job" class="text-gray-400 truncate">{{ movie.Job }}</p>
      </div>
    </div>
  </article>
</template>

<script>
import { isFavorite, toggleFavorite } from '../services/favorites';

export default {
  name: "FilmCard",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  emits: ['show-movie'],
  data() {
    return {
      isMovieFavorite: false
    };
  },
  mounted() {
    this.checkFavoriteStatus();
  },
  watch: {
    movie: {
      handler() {
        this.checkFavoriteStatus();
      },
      immediate: true
    }
  },
  methods: {
    checkFavoriteStatus() {
      if (this.movie && this.movie.tmdbID) {
        this.isMovieFavorite = isFavorite(this.movie.tmdbID, 'movie');
      }
    },
    toggleFavorite() {
      if (!this.movie || !this.movie.tmdbID) return;

      // Créer un objet film standardisé pour les favoris
      const movieForFavorites = {
        id: this.movie.tmdbID,
        title: this.movie.Title,
        poster_path: this.movie.Poster,
        release_date: this.movie.Year,
        vote_average: this.movie.imdbRating || 0,
        overview: this.movie.Plot || ''
      };

  // ajouter explicitement le type
  movieForFavorites.type = 'movie';
  const isNowFavorite = toggleFavorite(movieForFavorites);
      this.isMovieFavorite = isNowFavorite;

      // Émettre un événement pour informer les composants parents si nécessaire
      this.$emit('favorite-changed', {
        movie: this.movie,
        isFavorite: isNowFavorite
      });
    }
  }
};
</script>