<!-- 
  App.vue - Composant racine de l'application MovieVLT
  Gère la navigation principale, la recherche globale et l'affichage dynamique des composants
-->
<template>
  <div class="relative min-h-screen">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-gray-900/80 via-gray-800/40 to-gray-900/80"></div>

    <!-- Header -->
    <header class="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" class="flex items-center justify-between px-6 py-4 lg:px-8">
        <div class="flex lg:flex-1">
          <a href="#" @click.prevent="navigateTo('films')" class="-m-1.5 p-1.5">
            <span class="sr-only">MovieVLT</span>
            <img
              src="/img/freepik-creative-cinema-production-logo-20250924143146QnTF-removebg-preview.webp"
              alt="MovieVLT Logo"
              class="h-20 w-auto"
            />
          </a>
        </div>
        <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
          >
            <span class="sr-only">Open main menu</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-6 w-6">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <a href="#" @click.prevent="navigateTo('films')" class="text-sm font-semibold text-white">Films</a>
          <a href="#" @click.prevent="navigateTo('acteurs')" class="text-sm font-semibold text-white">Acteurs</a>
          <a href="#" @click.prevent="navigateTo('realisateurs')" class="text-sm font-semibold text-white">Réalisateurs</a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <!-- Barre de recherche globale -->
          <div class="relative w-full max-w-xs">
            <input
              v-model="globalSearchQuery"
              @input="onGlobalSearchInput"
              @focus="openSearchDropdown"
              @keydown.enter.prevent="performGlobalSearch"
              @keydown.esc.stop.prevent="resetSearch"
              @blur="scheduleCloseDropdown"
              type="text"
              placeholder="Rechercher un film, un acteur, un réalisateur..."
              class="peer w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm text-gray-700 shadow-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
            <div
              v-if="searchDropdownOpen"
              class="absolute right-0 mt-2 w-full rounded-xl border border-gray-200 bg-white py-2 shadow-2xl"
              @mousedown.prevent
            >
              <div v-if="globalSearchLoading" class="px-4 py-2 text-sm text-gray-500">
                Recherche en cours...
              </div>
              <div v-else-if="globalSearchError" class="px-4 py-2 text-sm text-red-500">
                {{ globalSearchError }}
              </div>
              <template v-else>
                <div
                  v-if="!globalSearchResults.length"
                  class="px-4 py-2 text-sm text-gray-500"
                >
                  Aucun résultat trouvé.
                </div>
                <ul v-else class="max-h-72 overflow-y-auto">
                  <li
                    v-for="result in globalSearchResults"
                    :key="`${result.type}-${result.id}`"
                  >
                    <button
                      class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-all transform hover:scale-[1.02]"
                      @mousedown.prevent="selectSearchResult(result)"
                    >
                      <img
                        v-if="result.image"
                        :src="result.image"
                        :alt="result.title"
                        class="h-12 w-8 object-cover rounded"
                      />
                      <div
                        v-else
                        class="h-12 w-8 flex items-center justify-center rounded bg-gray-200 text-[10px] font-semibold uppercase text-gray-500"
                      >
                        {{ result.type === 'movie' ? 'Film' : 'Pers.' }}
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-semibold text-gray-900">{{ result.title }}</p>
                        <p class="text-xs text-gray-500">{{ result.subtitle }}</p>
                      </div>
                      <span
                        class="text-[10px] uppercase tracking-wide text-indigo-500 font-semibold"
                      >
                        {{ result.type === 'movie' ? 'Film' : 'Personne' }}
                      </span>
                    </button>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section avec overlay moderne -->
    <div class="relative isolate px-6 pt-14 lg:px-8">
      <!-- Background décoratif avec blur -->
      <div
        aria-hidden="true"
        class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          class="relative left-1/2 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 w-[36rem] h-[20rem]"
        ></div>
      </div>
      <!-- Overlay principal avec effet de flou en fond semi-transparent -->
      <section class="container-2xl mx-auto bg-slate-900 bg-opacity-90 backdrop-blur-[80px] bg-clip-padding py-32 sm:py-48 lg:py-56 text-center">
        <h1 class="text-5xl sm:text-7xl font-extrabold text-white mb-4">
          Vitrine des Films
        </h1>
        <p class="text-xl text-gray-200 mb-8">
          Découvrez les films récents, explorez les acteurs et réalisateurs.
        </p>
      </section>
    </div>

    <!-- Main Content: affichage dynamique en fonction de la navigation -->
    <section class="py-12">
      <div class="container mx-auto">
        <component
          :is="currentComponent"
          @show-actor-details="showActorDetails"
          @show-actor="showActorDetails"
          @show-movie="showMovieDetails"
          :film="selectedFilm"
          :person="selectedPerson"
          :initial-person-id="initialPersonId"
          @navigate="currentPage = $event"
          @back="handleBack"
        />
      </div>
    </section>
  </div>
</template>

<script>
import HomeFilms from "./components/HomeFilms.vue";
import ActeursPage from "./components/ActeursPage.vue";
import RealisateursPage from "./components/RealisateursPage.vue";
import FilmDetails from "./components/FilmDetails.vue";
import PersonDetails from "./components/PersonDetails.vue";
import FilmCard from "./components/FilmCard.vue";
import FilmFilters from "./components/FilmFilters.vue"; 
import {
  searchMulti,
  getMovieDetails as fetchMovieDetails,
  getPersonDetails as fetchPersonDetails,
} from "./services/tmdb";

export default {
  name: "App",
  components: {
    HomeFilms,
    ActeursPage,
    RealisateursPage,
    FilmDetails,
    PersonDetails,
    FilmCard,
    FilmFilters,
  },
  data() {
    return {
      currentPage: "films", // "films" | "acteurs" | "realisateurs"
      selectedFilm: null,
      selectedPerson: null,
      initialPersonId: null, // Pour pré-charger une personne
      globalSearchQuery: "",
      globalSearchResults: [],
      globalSearchLoading: false,
      globalSearchError: "",
      searchDropdownOpen: false,
      searchDebounceTimer: null,
      searchBlurTimer: null,
    };
  },
  computed: {
    currentComponent() {
      if (this.selectedFilm) return "FilmDetails";
      if (this.selectedPerson) return "PersonDetails";
      if (this.currentPage === "films") return "HomeFilms";
      this.initialPersonId = null; // Réinitialiser quand on change de page manuellement
      // La prop initialPersonId est passée aux composants de page
      if (this.currentPage === "acteurs") return "ActeursPage";
      if (this.currentPage === "realisateurs") return "RealisateursPage";
      return "HomeFilms";
    },
  },
  methods: {
    // Navigation entre les différentes pages
    navigateTo(page) {
      this.currentPage = page;
      this.selectedFilm = null;
      this.selectedPerson = null;
      this.initialPersonId = null;
    },
    // Affiche les détails d'un acteur/réalisateur
    async showActorDetails(actorId) {
      try {
        const details = await fetchPersonDetails(actorId);
        this.selectedPerson = details;
        this.selectedFilm = null;
        this.initialPersonId = null;
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'acteur:", error);
      }
    },
    // Affiche les détails d'un film
    async showMovieDetails(movieId) {
      try {
        const details = await fetchMovieDetails(movieId);
        this.selectedFilm = details;
        this.selectedPerson = null;
        this.initialPersonId = null;
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du film:", error);
      }
    },
    handleBack() {
      if (this.selectedFilm) {
        this.selectedFilm = null;
      } else if (this.selectedPerson) {
        this.selectedPerson = null;
      }
      this.initialPersonId = null;
    },
    onGlobalSearchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      const query = this.globalSearchQuery.trim();
      if (!query) {
        this.globalSearchResults = [];
        this.globalSearchError = "";
        this.searchDropdownOpen = false;
        return;
      }
      this.searchDebounceTimer = setTimeout(() => {
        this.performGlobalSearch();
      }, 300);
    },
    async performGlobalSearch() {
      const query = this.globalSearchQuery.trim();
      if (!query) {
        this.globalSearchResults = [];
        this.globalSearchError = "";
        this.searchDropdownOpen = false;
        return;
      }
      this.globalSearchLoading = true;
      this.globalSearchError = "";
      this.searchDropdownOpen = true;
      try {
        const results = await searchMulti(query, { page: 1 });
        this.globalSearchResults = results.slice(0, 8);
        if (!this.globalSearchResults.length) {
          this.globalSearchError = "Aucun résultat trouvé.";
        }
      } catch (error) {
        console.error("Erreur lors de la recherche globale:", error);
        this.globalSearchError = error.message || "Erreur lors de la recherche.";
        this.globalSearchResults = [];
      } finally {
        this.globalSearchLoading = false;
      }
    },
    async selectSearchResult(result) {
      this.cancelCloseDropdown();
      this.searchDropdownOpen = false;
      if (!result) {
        return;
      }
      this.globalSearchQuery = result.title;
      try {
        if (result.type === "movie") {
          await this.openMovie(result.id);
        } else if (result.type === "person") {
          await this.openPerson(result);
        }
      } catch (error) {
        console.error("Erreur lors de la sélection du résultat:", error);
        this.globalSearchError = error.message || "Erreur lors de la récupération du résultat.";
      }
    },
    async openMovie(id) {
      this.globalSearchLoading = true;
      try {
        const details = await fetchMovieDetails(id);
        this.selectedFilm = details;
        this.selectedPerson = null;
        // On ne change pas la currentPage ici pour rester cohérent
      } finally {
        this.globalSearchLoading = false;
      }
    },
    async openPerson(personResult) {
      // Appelle directement la méthode qui charge et affiche les détails de la personne
      await this.showActorDetails(personResult.id);
    },
    openSearchDropdown() {
      this.cancelCloseDropdown();
      if (this.globalSearchResults.length || this.globalSearchError) {
        this.searchDropdownOpen = true;
      }
    },
    scheduleCloseDropdown() {
      this.cancelCloseDropdown();
      this.searchBlurTimer = setTimeout(() => {
        this.searchDropdownOpen = false;
      }, 200);
    },
    cancelCloseDropdown() {
      if (this.searchBlurTimer) {
        clearTimeout(this.searchBlurTimer);
        this.searchBlurTimer = null;
      }
    },
    resetSearch() {
      this.globalSearchQuery = "";
      this.globalSearchResults = [];
      this.globalSearchError = "";
      this.searchDropdownOpen = false;
    },
  },
  beforeUnmount() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    if (this.searchBlurTimer) {
      clearTimeout(this.searchBlurTimer);
    }
  },
};
</script>

<style>
</style>
