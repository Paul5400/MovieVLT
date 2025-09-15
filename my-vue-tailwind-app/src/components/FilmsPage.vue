<template>
  <FilmList @show-details="$emit('show-details', $event)" />
</template>

<script>
import FilmList from "./FilmList.vue";

export default {
  name: "FilmsPage",
  components: {
    FilmList,
  },
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>