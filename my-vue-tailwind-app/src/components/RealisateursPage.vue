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
              class="w-full text-left px-3 py-2 rounded-lg transition"
              :class="director.id === selectedDirector?.id ? 'bg-indigo-500/80' : 'hover:bg-gray-700/60'"
            >
              <p class="font-semibold">{{ director.name }}</p>
              <p v-if="director.knownForDepartment" class="text-sm text-gray-300">{{ director.knownForDepartment }}</p>
            </button>
          </li>
        </ul>
      </aside>
      <section
        v-if="selectedDirector"
        class="bg-gray-900 bg-opacity-80 rounded-2xl p-6 shadow-xl border border-gray-700"
      >
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-shrink-0">
            <img
              v-if="selectedDirector.profile"
              :src="selectedDirector.profile"
              :alt="`Portrait de ${selectedDirector.name}`"
              class="w-48 h-64 object-cover rounded-xl shadow-lg"
            />
            <div v-else class="w-48 h-64 flex items-center justify-center bg-gray-800 rounded-xl text-gray-500">
              Aucun portrait
            </div>
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <h2 class="text-3xl font-bold">{{ selectedDirector.name }}</h2>
              <span v-if="selectedDirector.age" class="inline-flex items-center rounded-full bg-indigo-500/70 px-3 py-1 text-sm">
                {{ selectedDirector.age }} ans
              </span>
            </div>
            <div class="space-y-2 text-gray-200">
              <p v-if="selectedDirector.birthday">
                <span class="font-semibold">Date de naissance :</span>
                {{ formatDate(selectedDirector.birthday) }}
              </p>
              <p v-if="selectedDirector.deathday">
                <span class="font-semibold">Décès :</span>
                {{ formatDate(selectedDirector.deathday) }}
              </p>
              <p v-if="selectedDirector.placeOfBirth">
                <span class="font-semibold">Lieu de naissance :</span>
                {{ selectedDirector.placeOfBirth }}
              </p>
              <p v-if="selectedDirector.knownForDepartment">
                <span class="font-semibold">Département :</span>
                {{ selectedDirector.knownForDepartment }}
              </p>
            </div>
            <div class="mt-6">
              <h3 class="text-xl font-semibold mb-2">Biographie</h3>
              <p class="text-gray-300 leading-relaxed whitespace-pre-line">
                {{ selectedDirector.biography }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <h3 class="text-2xl font-semibold mb-4">Films réalisés</h3>
          <div v-if="loadingDetails" class="text-gray-300">Chargement de la filmographie...</div>
          <div
            v-else-if="selectedDirector.knownForDirecting && selectedDirector.knownForDirecting.length"
            class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <article
              v-for="movie in selectedDirector.knownForDirecting"
              :key="movie.tmdbID"
              class="group bg-gray-800/70 rounded-xl overflow-hidden shadow border border-gray-700 hover:border-indigo-400 hover:shadow-lg transition cursor-pointer"
              @click="onMovieClick(movie.tmdbID)"
            >
              <img
                v-if="movie.Poster !== 'N/A'"
                :src="movie.Poster"
                :alt="`Affiche de ${movie.Title}`"
                class="h-56 w-full object-cover"
              />
              <div class="p-4 space-y-2">
                <h4 class="text-lg font-semibold group-hover:text-indigo-300 transition">{{ movie.Title }}</h4>
                <p class="text-sm text-gray-300">Année : {{ movie.Year }}</p>
                <p v-if="movie.Job" class="text-sm text-gray-400">Fonction : {{ movie.Job }}</p>
              </div>
            </article>
          </div>
          <div v-else class="text-gray-400">
            Aucun long métrage trouvé. Essayez un autre réalisateur.
          </div>
        </div>
      </section>
    </div>
    <div v-else-if="!loading" class="text-gray-400">Recherchez un nom pour découvrir un réalisateur.</div>
  </div>
</template>

<script>
import { searchPeople, getPersonDetails } from "../services/tmdb";

export default {
  name: "RealisateursPage",
  data() {
    return {
      searchQuery: "",
      directors: [],
      selectedDirector: null,
      loading: false,
      loadingDetails: false,
      error: "",
    };
  },
  methods: {
    async searchDirectors() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.directors = [];
        this.selectedDirector = null;
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
        if (this.directors.length) {
          await this.loadDirectorDetails(this.directors[0]);
        } else {
          this.selectedDirector = null;
          this.error = "Aucun réalisateur trouvé.";
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des réalisateurs:", err);
        this.error = err.message || "Erreur lors de la récupération des réalisateurs.";
      } finally {
        this.loading = false;
      }
    },
    async loadDirectorDetails(director) {
      if (!director || !director.id) {
        return;
      }
      if (this.selectedDirector && this.selectedDirector.id === director.id && !this.loadingDetails) {
        return;
      }
      this.loadingDetails = true;
      try {
        this.selectedDirector = await getPersonDetails(director.id);
      } catch (err) {
        console.error("Erreur lors du chargement des détails du réalisateur:", err);
        this.error = err.message || "Erreur lors du chargement des détails du réalisateur.";
      } finally {
        this.loadingDetails = false;
      }
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
