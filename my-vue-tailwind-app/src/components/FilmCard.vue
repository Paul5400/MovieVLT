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
export default {
  name: "FilmCard",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  emits: ['show-movie'],
};
</script>