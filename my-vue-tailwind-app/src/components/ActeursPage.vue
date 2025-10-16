<!-- 
  ActeursPage.vue - Page de recherche et détails des acteurs
  Permet de rechercher des acteurs et afficher leurs détails avec filmographie
-->
<template>
  <div class="p-6 lg:p-10 max-w-6xl mx-auto text-white">
    <h1 class="text-3xl font-bold mb-6 text-center lg:text-left">Découvrir les acteurs</h1>
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      <input
        v-model="searchQuery"
        @keyup.enter="searchActors"
        type="text"
        placeholder="Rechercher un acteur (ex: Marion Cotillard)"
        class="flex-1 rounded-full px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        @click="searchActors"
        class="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 font-semibold hover:bg-indigo-600 transition"
      >
        Rechercher
      </button>
    </div>
    <div v-if="loading" class="text-gray-300">Recherche en cours...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="actors.length" class="grid gap-6 lg:grid-cols-[260px,1fr]">
      <aside class="bg-gray-800 bg-opacity-70 rounded-xl p-4 h-fit">
        <h2 class="text-lg font-semibold mb-3">Acteurs trouvés</h2>
        <ul class="space-y-2">
          <li
            v-for="actor in actors"
            :key="actor.id"
          >
            <button
              @click="loadActorDetails(actor)"
              class="w-full text-left px-3 py-2 rounded-lg transition-all transform hover:bg-gray-700/60 hover:translate-x-1"
            >
              <p class="font-semibold">{{ actor.name }}</p>
              <p v-if="actor.knownForDepartment" class="text-sm text-gray-300">{{ actor.knownForDepartment }}</p>
            </button>
          </li>
        </ul>
      </aside>
    </div>
    <div v-else-if="!loading" class="text-gray-400">Lance une recherche pour découvrir un acteur.</div>
  </div>
</template>


<script>
import { searchPeople, getPersonDetails } from "../services/tmdb";
import FilmCard from "./FilmCard.vue";

export default {
  name: "ActeursPage",
  components: {
    FilmCard,
  },
  props: {
    initialPersonId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      searchQuery: "",
      actors: [],
      loading: false,
      error: "",
    };
  },
  mounted() {
    if (this.initialPersonId) {
      this.$emit('show-actor-details', this.initialPersonId);
    }
  },
  methods: {
    async searchActors() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.actors = [];
        this.selectedActor = null;
        this.error = "";
        return;
      }
      this.loading = true;
      this.error = "";
      this.actors = [];
      try {
        const results = await searchPeople(query, { page: 1 });
        this.actors = results;
        if (!results.length) {
          this.error = "Aucun acteur trouvé.";
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des acteurs:", err);
        this.error = err.message || "Erreur lors de la récupération des acteurs.";
      } finally {
        this.loading = false;
      }
    },
    loadActorDetails(actor) {
      if (!actor || !actor.id) {
        return;
      }
      this.$emit('show-actor-details', actor.id);
    },
    formatDate(dateString) {
      if (!dateString) {
        return "";
      }
      try {
        return new Intl.DateTimeFormat("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(dateString));
      } catch (error) {
        return dateString;
      }
    },
    onMovieClick(movieId) {
      this.$emit('show-movie', movieId);
    }
  }
};
</script>

<style scoped>
</style>
