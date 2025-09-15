<template>
  <header class="bg-gray-800 border-b border-gray-700 fixed top-0 inset-x-0 z-50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo et titre -->
      <div class="flex items-center">
        <a href="#" @click.prevent="$emit('navigate', 'films')" class="flex items-center">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="MovieVLT Logo"
            class="h-8 w-auto"
          />
          <span class="ml-2 text-white font-bold text-xl">MovieVLT</span>
        </a>
      </div>
      <!-- Liens de navigation -->
      <nav class="hidden md:flex space-x-6">
        <a href="#" @click.prevent="$emit('navigate', 'films')" class="text-white hover:text-indigo-400">Films</a>
        <a href="#" @click.prevent="$emit('navigate', 'acteurs')" class="text-white hover:text-indigo-400">Acteurs</a>
        <a href="#" @click.prevent="$emit('navigate', 'realisateurs')" class="text-white hover:text-indigo-400">Réalisateurs</a>
      </nav>
      <!-- Champ de recherche (non fonctionnel pour cet exemple) -->
      <div class="flex items-center">
        <div class="relative">
          <input
            type="text"
            placeholder="Recherche..."
            class="bg-gray-700 text-white rounded-full pl-10 pr-4 py-1 focus:outline-none"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-4.35-4.35m1.35-3.65a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>