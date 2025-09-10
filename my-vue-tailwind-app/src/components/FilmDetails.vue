<template>
  <div class="container mx-auto p-4 text-white">
    <div class="bg-gray-800 p-6 rounded-md shadow">
      <h1 class="text-3xl font-bold mb-4">{{ film.Title }}</h1>
      <p><span class="font-semibold">Année :</span> {{ film.Year }}</p>
      <p><span class="font-semibold">Genre :</span> {{ film.Genre }}</p>
      <p><span class="font-semibold">Réalisateur :</span> {{ film.Director }}</p>
      <p class="mt-4"><span class="font-semibold">Synopsis :</span> {{ film.Plot }}</p>
      <img
        v-if="film.Poster !== 'N/A'"
        :src="film.Poster"
        alt="Affiche"
        class="mt-4 w-64 rounded-md"
      />
      <button @click="$emit('back')" class="mt-4 bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded">
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
      required: true
    }
  }
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>