<!-- filepath: /home/paul/Documents/Web/S5/MovieVLT/my-vue-tailwind-app/src/components/Header.vue -->
<template>
  <header class="absolute inset-x-0 top-0 z-50">
    <nav aria-label="Global" class="flex items-center justify-between p-6 lg:px-8">
      <div class="flex lg:flex-1">
        <a href="#" @click.prevent="$emit('navigate', 'films')" class="-m-1.5 p-1.5">
          <span class="sr-only">MovieVLT</span>
          <img
            src="/img/freepik-creative-cinema-production-logo-20250924143146QnTF-removebg-preview.webp"
            alt="MovieVLT Logo"
            class="h-16 w-auto"
          />
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200">
          <span class="sr-only">Open main menu</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-6 w-6">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <a href="#" @click.prevent="$emit('navigate', 'films')" class="text-sm font-semibold text-white">Films</a>
        <a href="#" @click.prevent="$emit('navigate', 'acteurs')" class="text-sm font-semibold text-white">Acteurs</a>
        <a href="#" @click.prevent="$emit('navigate', 'realisateurs')" class="text-sm font-semibold text-white">Réalisateurs</a>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm font-semibold text-white">Log in &rarr;</a>
      </div>
    </nav>
    <!-- (Optionnel) Mobile menu peut être ajouté ici si nécessaire -->
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
/* Le header est transparent afin de se fondre dans le hero.
   Vous pouvez ajuster ou ajouter des styles ici si besoin. */
</style>