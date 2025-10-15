<!-- FilmDetails - Page détails film responsive -->
<template>
  <div class="container mx-auto px-4 py-4">
    <div class="bg-gray-800 p-4 sm:p-6 rounded-lg shadow text-white">
      <div class="flex flex-col sm:flex-row sm:gap-6 mb-4 sm:mb-6">
        <div class="flex-1">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{{ film.Title }}</h2>
          <div class="space-y-2 text-sm sm:text-base">
            <p><span class="font-semibold">Année :</span> {{ fixYear(film.Year) }}</p>
            <p><span class="font-semibold">Genre :</span> {{ film.Genre }}</p>
            
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
        
        <div class="mt-4 sm:mt-0 flex justify-center sm:justify-start">
          <img
            v-if="film.Poster !== 'N/A'"
            :src="film.Poster"
            alt="Affiche"
            class="w-48 sm:w-56 lg:w-64 rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <!-- Casting responsive -->
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
      <div v-else-if="film.Actors" class="mt-4">
        <span class="font-semibold">Acteurs :</span> 
        <span class="text-sm sm:text-base">{{ film.Actors }}</span>
      </div>
      
      <div class="mt-4 sm:mt-6">
        <h3 class="font-semibold mb-2 text-base sm:text-lg">Synopsis :</h3>
        <p class="text-sm sm:text-base leading-relaxed text-gray-300">{{ film.Plot }}</p>
      </div>
      
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
export default {
  name: "FilmDetails",
  props: {
    film: {
      type: Object,
      required: true,
    },
  },
  methods: {
    fixYear(year) {
      const match = String(year).match(/\d{4}/);
      return match ? match[0] : year;
    },
    onActorClick(actorId) {
      this.$emit('show-actor', actorId);
    },
    onDirectorClick(directorId) {
      this.$emit('show-director', directorId);
    },
  },
};
</script>

<style scoped>
</style>
