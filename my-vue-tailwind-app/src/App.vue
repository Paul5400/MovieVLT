<template>
  <div id="app" class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <HelloWorld msg="Welcome to Your Vue.js App with Tailwind CSS!" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    HelloWorld
  }
};
</script>

<style>
/* Global styles can be added here */
</style>