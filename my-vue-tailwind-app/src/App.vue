<template>
  <div class="bg-gray-900 min-h-screen">
    <!-- Header moderne -->
    <Header />

    <!-- Hero Section inspirée du template de base -->
    <section class="pt-28 pb-12 bg-gradient-to-br from-indigo-700 to-purple-700">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-5xl sm:text-7xl font-extrabold text-white mb-4">
          Vitrine des Films
        </h1>
        <p class="text-xl text-gray-200 mb-8">
          Découvrez les films récents, explorez les acteurs et les réalisateurs.
        </p>
        <div>
          <button class="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-100">
            Explorer
          </button>
        </div>
      </div>
    </section>

    <!-- Section principale : Affichage de FilmList ou FilmDetails -->
    <section class="py-12">
      <div class="container mx-auto">
        <FilmList v-if="!selectedFilm" @show-details="showDetails" />
        <FilmDetails v-else :film="selectedFilm" @back="selectedFilm = null" />
      </div>
    </section>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import FilmList from "./components/FilmList.vue";
import FilmDetails from "./components/FilmDetails.vue";

export default {
  name: "App",
  components: {
    Header,
    FilmList,
    FilmDetails
  },
  data() {
    return {
      selectedFilm: null
    };
  },
  methods: {
    showDetails(film) {
      this.selectedFilm = film;
    }
  }
};
</script>

<style>
/* Styles globaux additionnels si nécessaire */
</style>