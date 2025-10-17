<!-- 
  PersonDetails.vue - Page de détails d'une personne (acteur/réalisateur)
  Affiche la biographie et la filmographie avec films cliquables
-->
<template>
  <div class="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
    <button
      @click="$emit('back')"
      class="mb-4 sm:mb-6 w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition"
    >
      ← Retour
    </button>
    <div class="bg-gray-900/90 text-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
      <div class="flex flex-col lg:flex-row">
        <!-- Section profil -->
        <div class="lg:w-1/3 bg-gray-800/60 p-4 sm:p-6 flex flex-col items-center justify-start">
          <img
            v-if="person.profile"
            :src="person.profile"
            :alt="`Portrait de ${person.name}`"
            class="w-40 h-52 sm:w-48 sm:h-60 lg:w-56 lg:h-72 object-cover rounded-xl sm:rounded-2xl shadow-lg"
          />
          <div v-else class="w-40 h-52 sm:w-48 sm:h-60 lg:w-56 lg:h-72 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gray-800 text-gray-500 text-center text-sm">
            Aucun portrait disponible
          </div>
          <div class="mt-4 sm:mt-6 space-y-2 text-center">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{{ person.name }}</h1>
            <p v-if="person.knownForDepartment" class="text-xs sm:text-sm text-indigo-200 uppercase tracking-wide">
              {{ person.knownForDepartment }}
            </p>
            <span
              v-if="person.age"
              class="inline-flex items-center rounded-full bg-indigo-500/70 px-3 py-1 text-xs sm:text-sm"
            >
              {{ person.age }} ans
            </span>
          </div>
          <!-- Bouton favoris personne -->
          <div class="mt-4">
            <button
              @click.stop="toggleFavoritePerson"
              :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-transform hover:scale-105"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" :class="isFavorite ? 'text-red-500' : 'text-white'">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="text-sm">Favoris</span>
            </button>
          </div>
          <div class="mt-4 sm:mt-6 w-full space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
            <p v-if="person.birthday">
              <span class="font-semibold text-white">Naissance :</span>
              {{ formatDate(person.birthday) }}
            </p>
            <p v-if="person.deathday">
              <span class="font-semibold text-white">Décès :</span>
              {{ formatDate(person.deathday) }}
            </p>
            <p v-if="person.placeOfBirth" class="break-words">
              <span class="font-semibold text-white">Lieu :</span>
              {{ person.placeOfBirth }}
            </p>
          </div>
        </div>
        <!-- Section contenu principal -->
        <div class="lg:w-2/3 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
          <!-- Biographie -->
          <section>
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Biographie</h2>
            <p class="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {{ person.biography }}
            </p>
          </section>
          
          <!-- Filmographie -->
          <section v-if="person.knownFor && person.knownFor.length">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Films marquants (interprète)</h2>
            <div class="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="movie in person.knownFor"
                :key="movie.tmdbID"
                class="group bg-gray-800/60 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-400 hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                @click="onMovieClick(movie.tmdbID)"
              >
                <img
                  v-if="movie.Poster !== 'N/A'"
                  :src="movie.Poster"
                  :alt="`Affiche de ${movie.Title}`"
                  class="h-40 sm:h-48 lg:h-56 w-full object-cover"
                />
                <div class="p-2 sm:p-3 lg:p-4 space-y-1">
                  <h3 class="text-sm sm:text-base lg:text-lg font-semibold group-hover:text-indigo-300 transition leading-tight">
                    {{ movie.Title }}
                  </h3>
                  <p class="text-xs sm:text-sm text-gray-400">{{ movie.Year }}</p>
                  <p v-if="movie.Character" class="text-xs sm:text-sm text-gray-400 truncate">{{ movie.Character }}</p>
                </div>
              </article>
            </div>
          </section>
          <!-- Réalisations -->
          <section v-if="person.knownForDirecting && person.knownForDirecting.length">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Créations marquantes (réalisateur)</h2>
            <div class="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="movie in person.knownForDirecting"
                :key="movie.tmdbID"
                class="group bg-gray-800/60 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-400 hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                @click="onMovieClick(movie.tmdbID)"
              >
                <img
                  v-if="movie.Poster !== 'N/A'"
                  :src="movie.Poster"
                  :alt="`Affiche de ${movie.Title}`"
                  class="h-40 sm:h-48 lg:h-56 w-full object-cover"
                />
                <div class="p-2 sm:p-3 lg:p-4 space-y-1">
                  <h3 class="text-sm sm:text-base lg:text-lg font-semibold group-hover:text-indigo-300 transition leading-tight">
                    {{ movie.Title }}
                  </h3>
                  <p class="text-xs sm:text-sm text-gray-400">{{ movie.Year }}</p>
                  <p v-if="movie.Job" class="text-xs sm:text-sm text-gray-400 truncate">{{ movie.Job }}</p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isFavorite, toggleFavorite } from '../services/favorites';

export default {
  name: "PersonDetails",
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { isFavorite: false };
  },
  mounted() {
    this.checkFavorite();
  },
  watch: {
    person: {
      handler() { this.checkFavorite(); },
      immediate: true
    }
  },
  methods: {
    // Formate une date en français
    formatDate(dateString) {
      if (!dateString) {
        return "";
      }
      try {
        return new Intl.DateTimeFormat("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(dateString));
      } catch (error) {
        return dateString;
      }
    },
    // Gestion du clic sur un film depuis la filmographie
    onMovieClick(movieId) {
      this.$emit('show-movie', movieId);
    },
    checkFavorite() {
      if (!this.person || !this.person.id) {
        this.isFavorite = false;
        return;
      }
      this.isFavorite = isFavorite(this.person.id, 'person');
    },
    toggleFavoritePerson() {
      if (!this.person || !this.person.id) return;
      const obj = {
        id: this.person.id,
        type: 'person',
        title: this.person.name,
        poster_path: this.person.profile || null
      };
      const nowFav = toggleFavorite(obj);
      this.isFavorite = nowFav;
      this.$emit('favorite-changed');
    }
  },
};
</script>

<style scoped>
</style>
