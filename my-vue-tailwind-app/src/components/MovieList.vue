<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-4 text-center">Films</h2>
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="bg-white rounded-lg shadow p-4 flex flex-col"
      >
        <img v-if="movie.poster" :src="movie.poster" alt="Affiche du film" class="w-full mb-4" />
        <h3 class="text-xl font-semibold">{{ movie.title }}</h3>
        <p class="mt-2 text-gray-600">Année : {{ movie.year }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieList',
  data() {
    return {
      movies: [],
      loading: true,
    }
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        // Attention : remplacez l'URL par l'endpoint exact selon la documentation de l'API
        const response = await fetch('https://api.publicapis.dev/open-movie-database-api/movies');
        const data = await response.json();
        // Selon la réponse de l'API, ajustez ici l'accès aux résultats
        this.movies = data.results || data;
      } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
/* Vous pouvez ajouter ici des styles spécifiques au composant */
</style>