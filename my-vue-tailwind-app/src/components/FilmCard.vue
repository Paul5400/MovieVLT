<!-- 
  FilmCard.vue - Carte d'affichage d'un film
  Composant réutilisable pour afficher un film avec poster, titre et note
-->
<template>
  <article
    class="group bg-gray-800/70 rounded-xl overflow-hidden shadow border border-gray-700 hover:border-indigo-400 hover:shadow-lg transition-all transform hover:scale-105 active:scale-100 cursor-pointer flex flex-col"
    @click="$emit('show-movie', movie.tmdbID)"
  >
    <div class="relative h-56 w-full">
      <img
        v-if="movie.Poster && movie.Poster !== 'N/A'"
        :src="movie.Poster"
        :alt="`Affiche de ${movie.Title}`"
        class="h-full w-full object-cover"
      />
      <div v-else class="h-full w-full flex items-center justify-center bg-gray-700/50 text-gray-400">
        Pas d'affiche
      </div>
    </div>
    <div class="p-4 space-y-2 flex-grow flex flex-col">
      <h4 class="text-lg font-semibold group-hover:text-indigo-300 transition flex-grow">
        {{ movie.Title }}
      </h4>
      <p class="text-sm text-gray-300">Année : {{ movie.Year }}</p>
      <p v-if="movie.Character" class="text-sm text-gray-400">Rôle : {{ movie.Character }}</p>
      <p v-if="movie.Job" class="text-sm text-gray-400">Fonction : {{ movie.Job }}</p>
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