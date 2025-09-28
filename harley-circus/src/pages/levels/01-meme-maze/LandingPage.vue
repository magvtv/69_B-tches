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
          <!-- Vibe Check - Always accessible -->
          <router-link to="/levels/meme-maze/vibe-check" class="block bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors">
            <div class="font-bold mb-1">Vibe Check</div>
            <div class="text-sm text-gray-400">Quick vibe check</div>
          </router-link>
          
          <!-- Memes - Only accessible after vibe check -->
          <div 
            @click="handleSectionClick('memes')"
            data-section="memes"
            :class="[
              'block p-5 rounded-lg border transition-colors cursor-pointer',
              canAccessMemes 
                ? 'bg-gray-800/60 border-gray-700 hover:border-red-500/50' 
                : 'bg-gray-900/40 border-gray-800 hover:border-gray-600 locked-section'
            ]"
          >
            <div class="font-bold mb-1 flex items-center">
              Memes
              <LockClosedIcon v-if="!canAccessMemes" class="ml-2 w-4 h-4 text-gray-500" />
            </div>
            <div class="text-sm text-gray-400">Swipe and react</div>
          </div>
          
          <!-- Number Play - Only accessible after memes -->
          <div 
            @click="handleSectionClick('number-play')"
            data-section="number-play"
            :class="[
              'block p-5 rounded-lg border transition-colors cursor-pointer',
              canAccessNumberPlay 
                ? 'bg-gray-800/60 border-gray-700 hover:border-red-500/50' 
                : 'bg-gray-900/40 border-gray-800 hover:border-gray-600 locked-section'
            ]"
          >
            <div class="font-bold mb-1 flex items-center">
              Number Play
              <LockClosedIcon v-if="!canAccessNumberPlay" class="ml-2 w-4 h-4 text-gray-500" />
            </div>
            <div class="text-sm text-gray-400">A teeny tiny birthday-number hint</div>
          </div>
          
          <!-- Finale - Only accessible after all previous steps -->
          <div 
            @click="handleSectionClick('finale')"
            data-section="finale"
            :class="[
              'block p-5 rounded-lg border transition-colors cursor-pointer',
              canAccessFinale 
                ? 'bg-gray-800/60 border-gray-700 hover:border-red-500/50' 
                : 'bg-gray-900/40 border-gray-800 hover:border-gray-600 locked-section'
            ]"
          >
            <div class="font-bold mb-1 flex items-center">
              Finale
              <LockClosedIcon v-if="!canAccessFinale" class="ml-2 w-4 h-4 text-gray-500" />
            </div>
            <div class="text-sm text-gray-400">Claim your playful reward</div>
          </div>
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
import { computed } from 'vue'
import { LockClosedIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const { state, candlesLit, allCandlesLit } = useMemeMazeStore()

// Access control logic
const canAccessMemes = computed(() => {
  return state.vibeCheckCompleted || false
})

const canAccessNumberPlay = computed(() => {
  return state.vibeCheckCompleted && state.memesCompleted || false
})

const canAccessFinale = computed(() => {
  return allCandlesLit && state.finaleUnlocked || false
})

function handleSectionClick(section: string) {
  let canAccess = false
  
  switch (section) {
    case 'memes':
      canAccess = canAccessMemes.value
      break
    case 'number-play':
      canAccess = canAccessNumberPlay.value
      break
    case 'finale':
      canAccess = canAccessFinale.value
      break
  }
  
  if (canAccess) {
    router.push(`/levels/meme-maze/${section}`)
  } else {
    // Trigger wiggle animation
    const element = document.querySelector(`[data-section="${section}"]`)
    if (element) {
      element.classList.add('wiggle')
      setTimeout(() => {
        element.classList.remove('wiggle')
      }, 500)
    }
  }
}

function continueOrStart() {
  if (canAccessMemes.value) {
    router.push('/levels/meme-maze/memes')
  } else {
    router.push('/levels/meme-maze/vibe-check')
  }
}
</script>

<style scoped>
.locked-section {
  opacity: 0.6;
  cursor: not-allowed;
}

.wiggle {
  animation: wiggle 0.5s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-1deg); }
  75% { transform: translateX(5px) rotate(1deg); }
}

.locked-section:hover {
  transform: none !important;
}
</style>