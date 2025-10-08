<!-- 
  LoadingSpinner.vue - Composant de chargement réutilisable
  Affiche un spinner avec message personnalisable
-->
<template>
  <div class="flex items-center justify-center p-8">
    <div class="flex items-center space-x-3">
      <!-- Spinner animé -->
      <svg
        class="animate-spin h-6 w-6 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <!-- Message de chargement -->
      <span class="text-gray-300 font-medium">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    message: {
      type: String,
      default: "Chargement..."
    }
  }
};
</script>

<style scoped>
/* Animation de rotation pour le spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>