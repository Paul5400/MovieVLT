
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
              class="w-full text-left px-3 py-2 rounded-lg transition"
              :class="actor.id === selectedActor?.id ? 'bg-indigo-500/80' : 'hover:bg-gray-700/60'"
            >
              <p class="font-semibold">{{ actor.name }}</p>
              <p v-if="actor.knownForDepartment" class="text-sm text-gray-300">{{ actor.knownForDepartment }}</p>
            </button>
          </li>
        </ul>
      </aside>
      <section
        v-if="selectedActor"
        class="bg-gray-900 bg-opacity-80 rounded-2xl p-6 shadow-xl border border-gray-700"
      >
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-shrink-0">
            <img
              v-if="selectedActor.profile"
              :src="selectedActor.profile"
              :alt="`Portrait de ${selectedActor.name}`"
              class="w-48 h-64 object-cover rounded-xl shadow-lg"
            />
            <div v-else class="w-48 h-64 flex items-center justify-center bg-gray-800 rounded-xl text-gray-500">
              Aucun portrait
            </div>
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <h2 class="text-3xl font-bold">{{ selectedActor.name }}</h2>
              <span v-if="selectedActor.age" class="inline-flex items-center rounded-full bg-indigo-500/70 px-3 py-1 text-sm">
                {{ selectedActor.age }} ans
              </span>
            </div>
            <div class="space-y-2 text-gray-200">
              <p v-if="selectedActor.birthday">
                <span class="font-semibold">Date de naissance :</span>
                {{ formatDate(selectedActor.birthday) }}
              </p>
              <p v-if="selectedActor.deathday">
                <span class="font-semibold">Décès :</span>
                {{ formatDate(selectedActor.deathday) }}
              </p>
              <p v-if="selectedActor.placeOfBirth">
                <span class="font-semibold">Lieu de naissance :</span>
                {{ selectedActor.placeOfBirth }}
              </p>
              <p v-if="selectedActor.knownForDepartment">
                <span class="font-semibold">Reconnu pour :</span>
                {{ selectedActor.knownForDepartment }}
              </p>
            </div>
            <div class="mt-6">
              <h3 class="text-xl font-semibold mb-2">Biographie</h3>
              <p class="text-gray-300 leading-relaxed whitespace-pre-line">
                {{ selectedActor.biography }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <h3 class="text-2xl font-semibold mb-4">Films marquants</h3>
          <div v-if="loadingDetails" class="text-gray-300">Chargement de la filmographie...</div>
          <div v-else-if="selectedActor.knownFor && selectedActor.knownFor.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="movie in selectedActor.knownFor"
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
                <p v-if="movie.Character" class="text-sm text-gray-400">Rôle : {{ movie.Character }}</p>
              </div>
            </article>
          </div>
          <p v-else class="text-gray-400">Aucun film trouvé pour cet acteur.</p>
        </div>
      </section>
    </div>
    <div v-else-if="!loading" class="text-gray-400">Lance une recherche pour découvrir un acteur.</div>
  </div>
</template>


<script>
import { searchPeople, getPersonDetails } from "../services/tmdb";

export default {
  name: "ActeursPage",
  data() {
    return {
      searchQuery: "",
      actors: [],
      selectedActor: null,
      loading: false,
      loadingDetails: false,
      error: "",
    };
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
        if (results.length) {
          await this.loadActorDetails(results[0]);
        } else {
          this.selectedActor = null;
          this.error = "Aucun acteur trouvé.";
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des acteurs:", err);
        this.error = err.message || "Erreur lors de la récupération des acteurs.";
      } finally {
        this.loading = false;
      }
    },
    async loadActorDetails(actor) {
      if (!actor || !actor.id) {
        return;
      }
      if (this.selectedActor && this.selectedActor.id === actor.id && !this.loadingDetails) {
        return;
      }
      this.loadingDetails = true;
      try {
        this.selectedActor = await getPersonDetails(actor.id);
      } catch (err) {
        console.error("Erreur lors du chargement des détails de l'acteur:", err);
        this.error = err.message || "Erreur lors du chargement des détails de l'acteur.";
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
