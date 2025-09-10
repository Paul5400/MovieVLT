<template>
  <div class="p-4 bg-white rounded-lg shadow max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Film en vedette</h1>
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else>
      <div v-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <h2 class="text-xl font-semibold mb-2">{{ movie.Title }}</h2>
        <p class="mb-1">Année : {{ movie.Year }}</p>
        <img v-if="movie.Poster !== 'N/A'" :src="movie.Poster" alt="Affiche du film" class="w-full rounded mb-2" />
        <p class="text-sm text-gray-700">Plot : {{ movie.Plot }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      movie: null,
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.fetchMovie();
  },
  methods: {
    async fetchMovie() {
      // Utilisation de l'endpoint par IMDb ID avec la clé API "321b3ca4"
      const imdbID = 'tt3896198';
      const apiKey = '321b3ca4';
      const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }
        this.movie = data;
      } catch (error) {
        console.error('Erreur lors du chargement du film:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
</style>