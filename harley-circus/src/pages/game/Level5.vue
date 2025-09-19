<template>
  <GameLayout>
    <div class="max-w-4xl mx-auto p-6 text-white">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          Level 5: Final Quest
        </h2>
        <p class="text-lg text-gray-300 dm-sans">Real-world QR reveal + final surprise</p>
      </div>
      
      <div class="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-600/20 text-center">
        <div class="mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-3xl">🚧</span>
          </div>
          <h3 class="text-2xl font-bold mb-4 dm-sans text-yellow-400">Coming Soon</h3>
          <p class="text-gray-300 dm-sans mb-6">This level is still being crafted with the finest chaos</p>
        </div>
        
        <div class="flex justify-center gap-4">
          <router-link 
            to="/game"
            class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            Back to Levels
          </router-link>
        </div>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import GameLayout from '@/layouts/GameLayout.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'

// TODO: Implement level 5
</script>

<style scoped>
</style>


