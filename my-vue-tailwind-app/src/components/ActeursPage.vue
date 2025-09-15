<template>
  <div class="container mx-auto p-4">
    <div class="bg-gray-800 p-6 rounded-md shadow text-white">
      <h2 class="text-3xl font-bold mb-4">Liste d'Acteurs</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-700 rounded-lg">
          <p class="font-semibold">Acteur 1</p>
          <p>Détails sur l'acteur...</p>
        </div>
        <div class="p-4 bg-gray-700 rounded-lg">
          <p class="font-semibold">Acteur 2</p>
          <p>Détails sur l'acteur...</p>
        </div>
        <!-- Ajoutez d'autres cartes si nécessaire -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActeursPage",
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>