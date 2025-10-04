<template>
  <GameLayout>
    <div class="max-w-4xl mx-auto p-6 text-white">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2
          class="text-4xl font-bold mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700"
        >
          Level 2: Songs of Origins
        </h2>
        <p class="text-lg text-gray-300 dm-sans">The melodies that shaped our connection</p>
      </div>

      <!-- Background Audio Indicator -->
      <div
        v-if="backgroundAudio.isPlaying"
        class="bg-green-950/40 backdrop-blur-sm rounded-lg p-3 mb-6 border border-green-700/30"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-300 dm-sans">🎵 Playing in the background...</span>
          </div>
          <button
            @click="toggleBackgroundAudio"
            class="text-xs text-green-400 hover:text-green-300 dm-sans"
          >
            {{ backgroundAudio.isPlaying ? 'Pause' : 'Play' }}
          </button>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="mb-8">
        <div class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-6 border border-green-700/30">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-300 dm-sans">Progress</span>
            <span class="text-green-400 dm-sans font-bold"
              >{{ store.getStats().completedChallenges }} / 28</span
            >
          </div>
          <div class="flex justify-center">
            <CandlesProgress :lit="store.getStats().completedChallenges" :total="28" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Lyric Challenges -->
        <router-link
          to="/levels/02-songs-origin/challenges"
          class="block bg-gray-800/60 p-6 rounded-lg border border-gray-700 hover:border-green-500/50 transition-colors"
        >
          <div class="font-bold mb-2 text-green-400">Lyric Challenges</div>
          <div class="text-sm text-gray-400 mb-4">Test your memory with our favorite songs</div>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>🎵</span>
            <span>{{ store.getStats().completedChallenges }} completed</span>
          </div>
        </router-link>

        <!-- Voice Note Challenge -->
        <div
          @click="handleVoiceNoteClick"
          :class="[
            'block p-6 rounded-lg border transition-colors cursor-pointer',
            store.canAccessVoiceNote
              ? 'bg-gray-800/60 border-gray-700 hover:border-green-500/50'
              : 'bg-gray-900/40 border-gray-800 hover:border-gray-600 locked-section',
          ]"
        >
          <div class="font-bold mb-2 flex items-center">
            Voice Note Challenge
            <LockClosedIcon v-if="!store.canAccessVoiceNote" class="ml-2 w-4 h-4 text-gray-500" />
          </div>
          <div class="text-sm text-gray-400 mb-4">Record yourself singing 10 seconds</div>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>🎤</span>
            <span>{{ store.state.voiceNoteCompleted ? 'Completed' : 'Locked' }}</span>
          </div>
        </div>
      </div>

      <!-- Rewards Section -->
      <div v-if="store.getStats().completedChallenges > 0" class="mt-8">
        <div class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-6 border border-green-700/30">
          <h3 class="text-xl font-bold mb-4 dm-sans text-green-400">Your Rewards</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="reward in recentRewards"
              :key="reward.id"
              class="text-center p-3 bg-gray-800/50 rounded-lg"
            >
              <div class="text-2xl mb-2">{{ reward.icon }}</div>
              <div class="text-xs text-gray-300 dm-sans">{{ reward.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Level Complete -->
      <div v-if="store.isComplete" class="mt-8">
        <div
          class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30 text-center"
        >
          <div class="mb-6">
            <div
              class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-white font-bold text-3xl">✓</span>
            </div>
            <h3 class="text-2xl font-bold mb-4 dm-sans text-green-400">Level Complete!</h3>
            <p class="text-gray-300 dm-sans mb-6">
              You know these songs by heart... just like I know you 💕
            </p>
            <p class="text-gray-400 dm-sans text-sm mb-6">
              Score: {{ store.getStats().score }} / {{ store.getStats().totalChallenges }} correct
            </p>
          </div>

          <div class="flex justify-center gap-4">
            <router-link
              to="/levels"
              class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
            >
              <ArrowLeftIcon class="h-4 w-4" />
              Back to Levels
            </router-link>
            <button
              @click="restartLevel"
              class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors dm-sans"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GameLayout from '@/layouts/GameLayout.vue'
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/vue/24/solid'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import { useSongsOriginStore } from '@/stores/songsOriginStore'
import { rewardEngine } from '@/lib/rewardEngine'
import { useBackgroundAudio } from '@/composables/useBackgroundAudio'
import levelData from './meta.json'

const router = useRouter()
const store = useSongsOriginStore()
const backgroundAudio = useBackgroundAudio()

// Computed
const recentRewards = computed(() => {
  return rewardEngine.getAllRewards().slice(0, 8)
})

// Methods
const toggleBackgroundAudio = () => {
  if (backgroundAudio.isPlaying.value) {
    backgroundAudio.pause()
    store.setBackgroundAudioPlaying(false)
  } else {
    backgroundAudio.play()
    store.setBackgroundAudioPlaying(true)
  }
}

const handleVoiceNoteClick = () => {
  if (store.canAccessVoiceNote) {
    router.push('/levels/02-songs-origin/voice-note')
  }
}

const restartLevel = async () => {
  await store.reset()
}

// Handle user interaction to enable audio
const handleUserInteraction = () => {
  if (!backgroundAudio.isPlaying.value) {
    backgroundAudio.play()
    store.setBackgroundAudioPlaying(true)
  }
}

// Initialize
onMounted(async () => {
  await store.initializeSession()

  // Initialize background audio
  backgroundAudio.initAudio(
    levelData.backgroundAudio.file,
    levelData.backgroundAudio.volume,
    levelData.backgroundAudio.autoplay,
  )

  // Add click listener to enable audio on first user interaction
  document.addEventListener('click', handleUserInteraction, { once: true })
  document.addEventListener('keydown', handleUserInteraction, { once: true })
  document.addEventListener('touchstart', handleUserInteraction, { once: true })
})
</script>

<style scoped>
.dm-sans {
  font-family: 'DM Sans', sans-serif;
}

.locked-section {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
