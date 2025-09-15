<template>
  <div class="bg-gray-900 min-h-screen">
    <!-- Header moderne avec navigation -->
    <Header @navigate="currentPage = $event" />

    <!-- Hero Section inspirée du template de base -->
    <section class="pt-28 pb-12 bg-gradient-to-br from-indigo-700 to-purple-700">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-5xl sm:text-7xl font-extrabold text-white mb-4">
          Vitrine des Films
        </h1>
        <p class="text-xl text-gray-200 mb-8">
          Découvrez les films récents, explorez les acteurs et réalisateurs.
        </p>
      </div>
    </section>

    <!-- Section principale qui affiche le composant en fonction de la navigation -->
    <section class="py-12">
      <div class="container mx-auto">
        <component
          :is="currentComponent"
          @show-details="showDetails"
          @navigate="currentPage = $event"
          @back="selectedFilm = null"
          :film="selectedFilm"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import HomeFilms from "./components/HomeFilms.vue";
import ActeursPage from "./components/ActeursPage.vue";
import RealisateursPage from "./components/RealisateursPage.vue";
import FilmDetails from "./components/FilmDetails.vue";

export default {
  name: "App",
  components: {
    Header,
    HomeFilms,
    ActeursPage,
    RealisateursPage,
    FilmDetails,
  },
  data() {
    return {
      currentPage: "films", // "films" | "acteurs" | "realisateurs"
      selectedFilm: null,
    };
  },
  computed: {
    currentComponent() {
      if (this.selectedFilm) return "FilmDetails";
      if (this.currentPage === "films") return "HomeFilms";
      if (this.currentPage === "acteurs") return "ActeursPage";
      if (this.currentPage === "realisateurs") return "RealisateursPage";
      return "HomeFilms";
    },
  },
  methods: {
    showDetails(film) {
      this.selectedFilm = film;
    },
  },
};
</script>

<style>
/* Styles globaux additionnels si nécessaire */
</style>