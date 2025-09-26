<template>
  <GameLayout>
    <div class="max-w-4xl mx-auto px-4 py-6 sm:p-6 md:p-8 text-white">
      <div class="text-center mb-6 sm:mb-8">
        <h2 class="text-3xl sm:text-4xl font-bold mb-2 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          Level 1: Meme Maze
        </h2>
        <p class="text-sm sm:text-lg text-gray-300 dm-sans">23 memes. React and light the candles.</p>
      </div>

      <div class="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-red-600/20">
        <div class="flex items-center justify-between mb-5 sm:mb-6 gap-3">
          <div class="text-xs sm:text-sm text-gray-400">Progress</div>
          <div class="overflow-x-auto max-w-[65%] sm:max-w-none">
            <div class="inline-flex">
              <CandlesProgress :lit="candlesLit" :total="23" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <router-link to="/levels/meme-maze/intro" class="block bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors">
            <div class="font-bold mb-1">Intro</div>
            <div class="text-sm text-gray-400">Quick rules and vibe check</div>
          </router-link>
          <router-link to="/levels/meme-maze/memes" class="block bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors">
            <div class="font-bold mb-1">Memes</div>
            <div class="text-sm text-gray-400">Swipe and react (😂 / 😐)</div>
          </router-link>
          <router-link to="/levels/meme-maze/numberplay" class="block bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors">
            <div class="font-bold mb-1">Number Play</div>
            <div class="text-sm text-gray-400">A teeny birthday-number hint</div>
          </router-link>
          <router-link to="/levels/meme-maze/finale" class="block bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors">
            <div class="font-bold mb-1">Finale</div>
            <div class="text-sm text-gray-400">Claim your playful reward</div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mobile sticky CTA -->
    <div class="fixed inset-x-0 bottom-0 md:hidden p-4">
      <div class="max-w-4xl mx-auto">
        <button @click="continueOrStart" class="w-full bg-red-600 hover:bg-red-700 px-6 py-4 rounded-xl font-bold dm-sans shadow-lg shadow-red-900/30" aria-label="Start or continue Meme Maze">
          {{ state.currentIndex > 0 ? 'Continue' : 'Start' }}
        </button>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import GameLayout from '@/layouts/GameLayout.vue'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import { useRouter } from 'vue-router'
import { useMemeMazeStore } from '@/stores/memeMaze'

const router = useRouter()
const { state, candlesLit } = useMemeMazeStore()

function continueOrStart() {
  router.push('/levels/meme-maze/memes')
}
</script>

<style scoped>
</style>