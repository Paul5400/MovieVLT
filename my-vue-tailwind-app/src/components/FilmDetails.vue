<!-- 
  FilmDetails.vue - Page de détails d'un film
  Affiche les informations complètes d'un film avec acteurs cliquables
-->
<template>
  <div class="container mx-auto px-4 py-4">
    <div class="bg-gray-800 p-4 sm:p-6 rounded-lg shadow text-white">
      <!-- Header avec titre et image -->
      <div class="flex flex-col sm:flex-row sm:gap-6 mb-4 sm:mb-6">
        <div class="flex-1">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{{ film.Title }}</h2>
          <div class="space-y-2 text-sm sm:text-base">
            <p><span class="font-semibold">Année :</span> {{ fixYear(film.Year) }}</p>
            <p><span class="font-semibold">Genre :</span> {{ film.Genre }}</p>
            
            <!-- Réalisateur -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold">Réalisateur :</span>
              <button
                v-if="film.DirectorInfo"
                @click="onDirectorClick(film.DirectorInfo.id)"
                class="inline-flex items-center gap-2 bg-gray-700 hover:bg-indigo-600 px-3 py-2 rounded-full text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95"
              >
                <img
                  v-if="film.DirectorInfo.profile"
                  :src="film.DirectorInfo.profile"
                  :alt="film.DirectorInfo.name"
                  class="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                />
                <span>{{ film.DirectorInfo.name }}</span>
              </button>
              <span v-else>{{ film.Director }}</span>
            </div>
          </div>
        </div>
        
        <!-- Image à droite sur desktop, en haut sur mobile -->
        <div class="mt-4 sm:mt-0 flex justify-center sm:justify-start relative">
          <img
            v-if="film.Poster !== 'N/A'"
            :src="film.Poster"
            alt="Affiche"
            class="w-48 sm:w-56 lg:w-64 rounded-lg shadow-lg"
          />

          <!-- Bouton favoris sur la fiche film -->
          <button
            @click.stop="toggleFavoriteOnDetails"
            :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            class="absolute top-3 right-3 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110 shadow-lg border-2 border-white/20 backdrop-blur-sm"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" :class="isFavorite ? 'text-red-500' : 'text-white'">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Acteurs principaux -->
      <div v-if="film.CastMembers && film.CastMembers.length" class="mt-4 sm:mt-6">
        <h3 class="font-semibold mb-3 text-base sm:text-lg">Acteurs principaux :</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(actor, index) in film.CastMembers"
            :key="actor.id"
            @click="onActorClick(actor.id)"
            class="inline-flex items-center gap-2 bg-gray-700 hover:bg-indigo-600 px-3 py-2 rounded-full text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95"
          >
            <img
              v-if="actor.profile"
              :src="actor.profile"
              :alt="actor.name"
              class="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
            />
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span>{{ actor.name }}</span>
              <span v-if="actor.character" class="text-gray-300 text-xs hidden sm:inline">({{ actor.character }})</span>
            </div>
          </button>
        </div>
      </div>
      <!-- Fallback pour l'ancien format si CastMembers n'est pas disponible -->
      <div v-else-if="film.Actors" class="mt-4">
        <span class="font-semibold">Acteurs :</span> 
        <span class="text-sm sm:text-base">{{ film.Actors }}</span>
      </div>
      
      <!-- Synopsis -->
      <div class="mt-4 sm:mt-6">
        <h3 class="font-semibold mb-2 text-base sm:text-lg">Synopsis :</h3>
        <p class="text-sm sm:text-base leading-relaxed text-gray-300">{{ film.Plot }}</p>
      </div>
      
      <!-- Bouton retour -->
      <div class="mt-6 flex justify-center sm:justify-start">
        <button
          @click="$emit('back')"
          class="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-lg transition-colors text-sm sm:text-base font-medium"
        >
          Retour
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isFavorite, toggleFavorite } from '../services/favorites';
export default {
  name: "FilmDetails",
  props: {
    film: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFavorite: false
    };
  },
  mounted() {
    this.checkFavorite();
  },
  watch: {
    film: {
      handler() { this.checkFavorite(); },
      immediate: true
    }
  },
  methods: {
    // Extrait l'année à 4 chiffres d'une chaîne
    fixYear(year) {
      const match = String(year).match(/\d{4}/);
      return match ? match[0] : year;
    },
    // Gestion du clic sur un acteur pour afficher ses détails
    onActorClick(actorId) {
      this.$emit('show-actor', actorId);
    },
    // Gestion du clic sur un réalisateur pour afficher ses détails
    onDirectorClick(directorId) {
      this.$emit('show-director', directorId);
    },
    checkFavorite() {
      if (!this.film || !this.film.tmdbID) {
        this.isFavorite = false;
        return;
      }
      this.isFavorite = isFavorite(this.film.tmdbID, 'movie');
    },
    toggleFavoriteOnDetails() {
      if (!this.film || !this.film.tmdbID) return;
      const obj = {
        id: this.film.tmdbID,
        type: 'movie',
        title: this.film.Title,
        poster_path: this.film.Poster,
        release_date: this.film.Year
      };
      const nowFav = toggleFavorite(obj);
      this.isFavorite = nowFav;
      this.$emit('favorite-changed');
    }
  },
};
</script>

<style scoped>
/* Vos styles complémentaires si nécessaire */
</style>
