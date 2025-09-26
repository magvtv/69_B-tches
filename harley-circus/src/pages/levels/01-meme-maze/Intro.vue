<template>
  <GameLayout>
    <div class="max-w-4xl mx-auto p-6 text-white text-center">
      <h2 class="text-4xl font-bold mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-500">
        Meme Maze: Enter the Chaos
      </h2>
      <p class="text-gray-300 mb-8">Swipe or tap through 23 memes. React with 😂 or 😐. Light all candles.</p>

      <router-link to="/levels/meme-maze/memes"
        class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors dm-sans">
        Start
      </router-link>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import GameLayout from '@/layouts/GameLayout.vue'
</script>

<style scoped>
</style>


