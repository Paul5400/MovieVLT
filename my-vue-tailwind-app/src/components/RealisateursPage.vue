<template>
  <div class="p-6 lg:p-10 max-w-6xl mx-auto text-white">
    <h1 class="text-3xl font-bold mb-6 text-center lg:text-left">Explorer les réalisateurs</h1>
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      <input
        v-model="searchQuery"
        @keyup.enter="searchDirectors"
        type="text"
        placeholder="Rechercher un réalisateur (ex: Christopher Nolan)"
        class="flex-1 rounded-full px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        @click="searchDirectors"
        class="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 font-semibold hover:bg-indigo-600 transition"
      >
        Rechercher
      </button>
    </div>
    <div v-if="loading" class="text-gray-300">Recherche en cours...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="directors.length" class="grid gap-6 lg:grid-cols-[260px,1fr]">
      <aside class="bg-gray-800/80 rounded-xl p-4 h-fit">
        <h2 class="text-lg font-semibold mb-3">Réalisateurs trouvés</h2>
        <ul class="space-y-2">
          <li
            v-for="director in directors"
            :key="director.id"
          >
            <button
              @click="loadDirectorDetails(director)"
              class="w-full text-left px-3 py-2 rounded-lg transition-all transform hover:bg-gray-700/60 hover:translate-x-1"
            >
              <p class="font-semibold">{{ director.name }}</p>
              <p v-if="director.knownForDepartment" class="text-sm text-gray-300">{{ director.knownForDepartment }}</p>
            </button>
          </li>
        </ul>
      </aside>
      <!-- La section des détails est maintenant gérée par PersonDetails.vue -->
    </div>
    <div v-else-if="!loading" class="text-gray-400">Recherchez un nom pour découvrir un réalisateur.</div>
  </div>
</template>

<script>
import { searchPeople, getPersonDetails } from "../services/tmdb";
import FilmCard from "./FilmCard.vue";

export default {
  name: "RealisateursPage",
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
      directors: [],
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
    async searchDirectors() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.directors = [];
        this.error = "";
        return;
      }
      this.loading = true;
      this.error = "";
      this.directors = [];
      try {
        const results = await searchPeople(query, { page: 1 });
        const directorsOnly = results.filter((person) =>
          person.knownForDepartment && person.knownForDepartment.toLowerCase().includes("directing")
        );
        this.directors = directorsOnly.length ? directorsOnly : results;
        if (!this.directors.length) {
          this.error = "Aucun réalisateur trouvé.";
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des réalisateurs:", err);
        this.error = err.message || "Erreur lors de la récupération des réalisateurs.";
      } finally {
        this.loading = false;
      }
    },
    loadDirectorDetails(director) {
      if (!director || !director.id) {
        return;
      }
      this.$emit('show-actor-details', director.id);
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
      // Émettre un événement pour naviguer vers les détails du film
      this.$emit('show-movie', movieId);
    },
  },
};
</script>

<style scoped>
</style>
