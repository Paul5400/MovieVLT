<!-- filepath: /home/paul/Documents/Web/S5/MovieVLT/my-vue-tailwind-app/src/components/FilmDetails.vue -->
<template>
  <div class="container mx-auto p-4">
    <div class="bg-gray-800 p-6 rounded-md shadow text-white">
      <h2 class="text-3xl font-bold mb-4">{{ film.Title }}</h2>
      <p><span class="font-semibold">Année :</span> {{ fixYear(film.Year) }}</p>
      <p><span class="font-semibold">Genre :</span> {{ film.Genre }}</p>
      <p><span class="font-semibold">Réalisateur :</span> {{ film.Director }}</p>
      <p v-if="film.Actors"><span class="font-semibold">Acteurs :</span> {{ film.Actors }}</p>
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
    fixYear(year) {
      const match = String(year).match(/\d{4}/);
      return match ? match[0] : year;
    },
  },
};
</script>

<style scoped>
/* Vos styles complémentaires si nécessaire */
</style>
