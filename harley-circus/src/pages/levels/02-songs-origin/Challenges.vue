<template>
  <GameLayout>
    <div class="max-w-4xl mx-auto p-6 text-white">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2
          class="text-3xl font-bold mb-2 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700"
        >
          Lyric Challenges
        </h2>
        <p class="text-gray-300 dm-sans">Test your memory with our favorite songs</p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loadingChallenges"
        class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-12 border border-green-700/30 text-center"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"
        ></div>
        <p class="text-gray-300 dm-sans">Loading challenges from Spotify...</p>
      </div>

      <!-- Progress -->
      <div v-else class="mb-8">
        <div class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-6 border border-green-700/30">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-300 dm-sans">Challenge Progress</span>
            <span class="text-green-400 dm-sans font-bold"
              >{{ currentChallengeIndex + 1 }} / {{ challenges.length }}</span
            >
          </div>
          <div class="flex justify-center">
            <CandlesProgress :lit="currentChallengeIndex + 1" :total="challenges.length" />
          </div>
        </div>
      </div>

      <!-- Current Challenge -->
      <div
        v-if="!loadingChallenges && currentChallenge && !showResults"
        class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30"
      >
        <AlbumCoverChallenge
          :challenge="currentChallenge"
          :is-last-challenge="currentChallengeIndex === challenges.length - 1"
          @select="handleOptionSelect"
          @next="nextChallenge"
        />
      </div>

      <!-- Results Screen -->
      <div
        v-if="showResults"
        class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30 text-center"
      >
        <div class="mb-6">
          <div
            class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-white font-bold text-3xl">🎵</span>
          </div>
          <h3 class="text-2xl font-bold mb-4 dm-sans text-green-400">Challenges Complete!</h3>
          <p class="text-gray-300 dm-sans mb-6">
            You scored {{ score }} out of {{ challenges.length }} challenges
          </p>
          <p class="text-gray-400 dm-sans text-sm mb-6">
            {{ Math.round((score / challenges.length) * 100) }}% accuracy
          </p>
        </div>

        <!-- Rewards -->
        <div v-if="recentRewards.length > 0" class="mb-6">
          <h4 class="text-lg font-bold mb-4 dm-sans text-green-400">Rewards Earned</h4>
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

        <div class="flex justify-center gap-4">
          <router-link
            to="/levels/02-songs-origin"
            class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            Back to Level
          </router-link>
          <button
            @click="restartChallenges"
            class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors dm-sans"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GameLayout from '@/layouts/GameLayout.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { useSongsOriginStore } from '@/stores/songsOriginStore'
import { rewardEngine } from '@/lib/rewardEngine'
import AlbumCoverChallenge from '@/components/AlbumCoverChallenge.vue'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import { useSongsOriginData } from '@/composables/useSongsOriginData'
import { useBackgroundAudio } from '@/composables/useBackgroundAudio'
import levelData from './meta.json'

// Define component name for linting
defineOptions({
  name: 'SongsOriginChallenges',
})

const store = useSongsOriginStore()
const backgroundAudio = useBackgroundAudio()
const { challenges: dynamicChallenges, loadChallenges } = useSongsOriginData()

// Challenge data - use dynamic if available, fallback to meta.json
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const challenges = ref<any[]>(levelData.challenges)
const currentChallengeIndex = ref(0)
const answered = ref(false)
const selectedOption = ref<number | null>(null)
const isCorrect = ref(false)
const score = ref(0)
const startTime = ref(0)
const showResults = ref(false)
const loadingChallenges = ref(true)

// Computed
const currentChallenge = computed(() => challenges.value[currentChallengeIndex.value])

const recentRewards = computed(() => {
  return rewardEngine.getAllRewards().slice(-4) // Last 4 rewards
})

// Methods
const handleOptionSelect = async (index: number) => {
  if (answered.value) return

  answered.value = true
  selectedOption.value = index
  isCorrect.value = index === currentChallenge.value.correctAnswer

  if (isCorrect.value) {
    score.value++
  }

  const responseTime = Date.now() - startTime.value

  // Track in store
  await store.answerChallenge(currentChallenge.value.id, index, isCorrect.value, responseTime)
}

const nextChallenge = () => {
  if (currentChallengeIndex.value < challenges.value.length - 1) {
    currentChallengeIndex.value++
    answered.value = false
    selectedOption.value = null
    isCorrect.value = false
    startTime.value = Date.now()
  } else {
    showResults.value = true
  }
}

const restartChallenges = () => {
  currentChallengeIndex.value = 0
  answered.value = false
  selectedOption.value = null
  isCorrect.value = false
  score.value = 0
  showResults.value = false
  startTime.value = Date.now()
}

// Initialize
onMounted(async () => {
  await store.initializeSession()

  // Resume background audio if it was playing
  if (backgroundAudio.audioElement.value && !backgroundAudio.isPlaying.value) {
    backgroundAudio.resume()
  }

  // Load dynamic challenges
  try {
    await loadChallenges()
    if (dynamicChallenges.value.length > 0) {
      challenges.value = dynamicChallenges.value
    }
  } catch (error) {
    console.error('Failed to load dynamic challenges, using fallback:', error)
  } finally {
    loadingChallenges.value = false
  }

  startTime.value = Date.now()
})
</script>

<style scoped>
.dm-sans {
  font-family: 'DM Sans', sans-serif;
}
</style>
