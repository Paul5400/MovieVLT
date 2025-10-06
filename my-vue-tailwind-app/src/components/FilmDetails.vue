<!-- 
  FilmDetails.vue - Page de détails d'un film
  Affiche les informations complètes d'un film avec acteurs cliquables
-->
<template>
  <div class="container mx-auto p-4">
    <div class="bg-gray-800 p-6 rounded-md shadow text-white">
      <h2 class="text-3xl font-bold mb-4">{{ film.Title }}</h2>
      <p><span class="font-semibold">Année :</span> {{ fixYear(film.Year) }}</p>
      <p><span class="font-semibold">Genre :</span> {{ film.Genre }}</p>
      <p><span class="font-semibold">Réalisateur :</span> {{ film.Director }}</p>
      
      <!-- Affichage des acteurs avec noms cliquables -->
      <div v-if="film.CastMembers && film.CastMembers.length" class="mt-2">
        <span class="font-semibold">Acteurs principaux :</span>
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="(actor, index) in film.CastMembers"
            :key="actor.id"
            @click="onActorClick(actor.id)"            class="inline-flex items-center gap-2 bg-gray-700 hover:bg-indigo-600 px-3 py-1 rounded-full text-sm transition-all transform hover:scale-105"
          >
            <img
              v-if="actor.profile"
              :src="actor.profile"
              :alt="actor.name"
              class="w-6 h-6 rounded-full object-cover"
            />
            <span>{{ actor.name }}</span>
            <span v-if="actor.character" class="text-gray-300 text-xs">({{ actor.character }})</span>
          </button>
        </div>
      </div>
      <!-- Fallback pour l'ancien format si CastMembers n'est pas disponible -->
      <p v-else-if="film.Actors"><span class="font-semibold">Acteurs :</span> {{ film.Actors }}</p>
      
      <p class="mt-4"><span class="font-semibold">Synopsis :</span> {{ film.Plot }}</p>
      <img
        v-if="film.Poster !== 'N/A'"
        :src="film.Poster"
        alt="Affiche"
        class="mt-4 w-64 rounded-md"
      />
      <button
        @click="$emit('back')"
        class="mt-4 bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded"
      >
        Retour
      </button>
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
    // Extrait l'année à 4 chiffres d'une chaîne
    fixYear(year) {
      const match = String(year).match(/\d{4}/);
      return match ? match[0] : year;
    },
    // Gestion du clic sur un acteur pour afficher ses détails
    onActorClick(actorId) {
      this.$emit('show-actor', actorId);
    },
  },
};
</script>

<style scoped>
/* Vos styles complémentaires si nécessaire */
</style>
