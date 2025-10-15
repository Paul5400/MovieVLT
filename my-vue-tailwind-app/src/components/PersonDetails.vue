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
        <div class="lg:w-2/3 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
          <section>
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Biographie</h2>
            <p class="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {{ person.biography }}
            </p>
          </section>
          
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
export default {
  name: "PersonDetails",
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  methods: {
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
    onMovieClick(movieId) {
      this.$emit('show-movie', movieId);
    },
  },
};
</script>

<style scoped>
</style>
