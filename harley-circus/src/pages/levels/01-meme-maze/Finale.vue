<template>
  <GameLayout>
    <div class="min-h-[70vh] flex items-center justify-center p-6 text-center text-white">
      <div>
        <h2 class="text-4xl font-extrabold mb-4">Happy Birthday Harley — You lit all 23 candles 🔥</h2>
        <p class="text-gray-300 mb-8">You earned a reward. Redeem for 23 kisses / hugs / dares.</p>
        <router-link to="/levels" class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold dm-sans">Back to Levels</router-link>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import GameLayout from '@/layouts/GameLayout.vue'
</script>

<style scoped>
</style>


