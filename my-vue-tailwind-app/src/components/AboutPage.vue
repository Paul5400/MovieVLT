<!-- AboutPage - Page à propos responsive -->
<template>
  <!-- Conteneur principal de la page -->
  <div class="px-4 py-6 sm:p-6 lg:p-10 max-w-4xl mx-auto text-white">
    <!-- Section d'en-tête avec le titre principal -->
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">À propos de MovieVLT</h1>
      <p class="text-base sm:text-lg lg:text-xl text-gray-300">Votre explorateur de films personnalisé</p>
    </div>

    <!-- Conteneur pour les différentes sections de la page -->
    <div class="space-y-8 sm:space-y-12">
      <!-- Section : Notre objectif -->
      <section class="bg-gray-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
        <!-- Titre de la section avec une icône -->
        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 flex items-center">
          <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          Notre objectif
        </h2>
        <!-- Contenu textuel expliquant l'objectif de l'application -->
        <div class="text-gray-200 leading-relaxed space-y-3 sm:space-y-4 text-sm sm:text-base">
          <p>
            <strong>MovieVLT</strong> est une application web moderne conçue pour simplifier la découverte et l'exploration du cinéma. 
            Notre mission est de vous offrir une expérience intuitive pour :
          </p>
          <!-- Liste des fonctionnalités principales de l'application -->
          <ul class="list-disc list-inside space-y-1 sm:space-y-2 ml-2 sm:ml-4">
            <li>Découvrir les films les plus populaires et récents</li>
            <li>Rechercher facilement vos films, acteurs et réalisateurs favoris</li>
            <li>Explorer les détails complets avec casting et synopsis</li>
            <li>Naviguer de manière fluide entre films, acteurs et réalisateurs</li>
            <li>Filtrer les contenus selon vos préférences</li>
          </ul>
          <p>
            Nous croyons que la découverte cinématographique doit être accessible, rapide et agréable pour tous.
          </p>
        </div>
      </section>

      <!-- Section : Créé par -->
      <section class="bg-gray-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
        <!-- Titre de la section avec une icône -->
        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 flex items-center">
          <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          Créé par
        </h2>
        <!-- Liste des créateurs de l'application -->
        <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <!-- Carte pour chaque créateur -->
          <div class="bg-gray-700/40 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
            <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span class="text-lg sm:text-xl lg:text-2xl font-bold text-white">PA</span>
            </div>
            <h3 class="text-base sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2">ANDRIEU Paul</h3>
          </div>
          <div class="bg-gray-700/40 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
            <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span class="text-lg sm:text-xl lg:text-2xl font-bold text-white">VL</span>
            </div>
            <h3 class="text-base sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2">LAMBERT Valentino</h3>
          </div>
        </div>
      </section>

      <!-- Section : Technologies utilisées -->
      <section class="bg-gray-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
        <!-- Titre de la section avec une icône -->
        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 flex items-center">
          <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Technologies utilisées
        </h2>
        <!-- Liste des technologies utilisées -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 text-center">
          <div class="bg-gray-700/40 rounded-lg p-3 sm:p-4">
            <div class="text-xl sm:text-2xl mb-1 sm:mb-2">⚡</div>
            <div class="font-semibold text-sm sm:text-base">Vue.js 3</div>
            <div class="text-xs sm:text-sm text-gray-400">Framework JavaScript</div>
          </div>
          <div class="bg-gray-700/40 rounded-lg p-3 sm:p-4">
            <div class="text-xl sm:text-2xl mb-1 sm:mb-2">🎨</div>
            <div class="font-semibold text-sm sm:text-base">Tailwind CSS</div>
            <div class="text-xs sm:text-sm text-gray-400">Styling moderne</div>
          </div>
          <div class="bg-gray-700/40 rounded-lg p-3 sm:p-4">
            <div class="text-xl sm:text-2xl mb-1 sm:mb-2">⚙️</div>
            <div class="font-semibold text-sm sm:text-base">Vite</div>
            <div class="text-xs sm:text-sm text-gray-400">Build tool rapide</div>
          </div>
          <div class="bg-gray-700/40 rounded-lg p-3 sm:p-4">
            <div class="text-xl sm:text-2xl mb-1 sm:mb-2">🎬</div>
            <div class="font-semibold text-sm sm:text-base">TMDB API</div>
            <div class="text-xs sm:text-sm text-gray-400">Base de données films</div>
          </div>
        </div>
      </section>

      <!-- Section finale : Remerciements -->
      <section class="text-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Merci de votre visite !</h2>
        <p class="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
          Nous espérons que MovieVLT vous aidera à découvrir de nouveaux films et à explorer l'univers du cinéma.
        </p>
        <!-- Bouton pour naviguer vers la page des films -->
        <button
          @click="$emit('navigate', 'films')"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6h6V4H9v2zm2 3v8"></path>
          </svg>
          Commencer l'exploration
        </button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  emits: ['navigate'] // Émet un événement "navigate" pour changer de page
};
</script>

<style scoped>
/* Styles spécifiques à la page AboutPage */
</style>