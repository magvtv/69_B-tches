<template>
  <GameLayout>
    <div class="max-w-2xl mx-auto p-6 text-white text-center">
      <h3 class="text-2xl font-bold mb-4">Number Play</h3>
      <p class="text-gray-300 mb-6">A tiny riddle around your birthday numbers.</p>

      <div class="bg-black/40 border border-red-600/20 rounded-2xl p-6">
        <p class="mb-4">Find the hidden hint: 1 9 • 1 0 • 2 0 0 2</p>
        <router-link to="/levels/meme-maze/memes" class="underline text-red-300 hover:text-red-200">Back to Memes</router-link>
      </div>
    </div>
  </GameLayout>
  
</template>

<script setup lang="ts">
import GameLayout from '@/layouts/GameLayout.vue'
</script>

<style scoped>
</style>


