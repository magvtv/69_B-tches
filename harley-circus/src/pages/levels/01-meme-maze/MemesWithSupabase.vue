<template>
  <GameLayout>
    <div class="memes-container">
    <!-- Progress Bar with 23 Candles -->
    <div class="progress-section">
      <div class="flex items-center justify-center gap-2 mb-4">
        <CandlesProgress :lit="candlesLit" :total="23" />
      </div>
      <div class="progress-text" :class="{ 'text-pulse': candlesLit > 0 }">
        {{ candlesLit }}/23 Candles Lit
      </div>
      
      <!-- Supabase Status Indicator -->
      <div v-if="tracking.isInitialized" class="supabase-status">
        <div class="status-indicator success">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Progress Synced
        </div>
      </div>
    </div>

    <!-- Meme Display -->
    <div class="meme-section">
      <div class="meme-card" v-if="currentMeme">
        <img 
          ref="memeImg"
          :key="state.currentIndex"
          :src="currentMeme.src" 
          :alt="currentMeme.alt"
          @load="onImageLoad"
          class="meme-image"
        />
        
        <!-- Reaction Buttons -->
        <div class="reaction-buttons">
          <button @click="onReact('laugh')" class="react-btn laugh-btn">
            <FaceSmileIcon class="btn-icon" />
            <span class="btn-text">Got me</span>
          </button>
          <button @click="onReact('meh')" class="react-btn meh-btn">
            <FaceFrownIcon class="btn-icon" />
            <span class="btn-text">Meh</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading indicator for Supabase operations -->
    <div v-if="tracking.isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>Syncing progress...</span>
      </div>
    </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemeMazeSupabaseStore } from '@/stores/memeMazeSupabase'
import { useSupabaseTracking } from '@/composables/useSupabaseTracking'
import GameLayout from '@/layouts/GameLayout.vue'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import {
  FaceSmileIcon,
  FaceFrownIcon
} from '@heroicons/vue/24/solid'

// Define component name for linting
defineOptions({
  name: 'MemeMazeMemesWithSupabase'
})

const router = useRouter()
const memeMazeStore = useMemeMazeSupabaseStore()
const { state, react, candlesLit, markMemesCompleted } = memeMazeStore

// Initialize Supabase tracking
const tracking = useSupabaseTracking({
  levelSlug: '01-meme-maze',
  autoInitialize: true
})

const memeImg = ref<HTMLImageElement | null>(null)
const reactionStartTime = ref<number>(0)

// Sample memes - using actual meme files from public/images/memes
const memes = [
  { src: '/images/memes/meme-amejificha.jpg', alt: 'Meme 1' },
  { src: '/images/memes/meme-argue.webp', alt: 'Meme 2' },
  { src: '/images/memes/meme-big-table.webp', alt: 'Meme 3' },
  { src: '/images/memes/meme-email.jpg', alt: 'Meme 4' },
  { src: '/images/memes/meme-exams-2.jpg', alt: 'Meme 5' },
  { src: '/images/memes/meme-exams.png', alt: 'Meme 6' },
  { src: '/images/memes/meme-kids-laughing.webp', alt: 'Meme 7' },
  { src: '/images/memes/meme-mastingo.webp', alt: 'Meme 8' },
  { src: '/images/memes/meme-mgonjwa.webp', alt: 'Meme 9' },
  { src: '/images/memes/meme-mkisii.webp', alt: 'Meme 10' },
  { src: '/images/memes/meme-mshwari.jpg', alt: 'Meme 11' },
  { src: '/images/memes/meme-panties.jpg', alt: 'Meme 12' },
  { src: '/images/memes/meme-pineapples.png', alt: 'Meme 13' },
  { src: '/images/memes/meme-queen-cakes.webp', alt: 'Meme 14' },
  { src: '/images/memes/meme-scam.jpeg', alt: 'Meme 15' },
  { src: '/images/memes/meme-scammers.jpg', alt: 'Meme 16' },
  { src: '/images/memes/meme-time-waster.jpg', alt: 'Meme 17' },
  { src: '/images/memes/meme-upper-jaw.webp', alt: 'Meme 18' },
  { src: '/images/memes/meme-upwork.jpg', alt: 'Meme 19' },
  { src: '/images/memes/meme-victims.webp', alt: 'Meme 20' },
  { src: '/images/memes/meme-vita-tu.jpg', alt: 'Meme 21' },
  { src: '/images/memes/meme-vlogger.jpg', alt: 'Meme 22' },
  { src: '/images/memes/meme-who-am-i.jpg', alt: 'Meme 23' }
]

const currentMeme = computed(() => {
  return memes[state.currentIndex] || null
})

function onImageLoad() {
  // Small delay to ensure smooth fade-in
  setTimeout(() => {
    if (memeImg.value) {
      memeImg.value.style.opacity = '1'
    }
  }, 50)
  
  // Track when user sees a meme
  reactionStartTime.value = Date.now()
  
  // Track meme view event
  tracking.trackEvent('meme_viewed', {
    memeIndex: state.currentIndex,
    memeSrc: currentMeme.value?.src,
    timestamp: Date.now()
  })
}

async function onReact(type: 'laugh' | 'meh') {
  // Calculate reaction time
  const reactionTime = Date.now() - reactionStartTime.value
  
  // Add visual feedback for the reaction
  const button = event?.target as HTMLElement
  if (button) {
    button.style.transform = 'scale(0.95)'
    setTimeout(() => {
      button.style.transform = ''
    }, 150)
  }

  // Fade out current image
  if (memeImg.value) {
    memeImg.value.style.opacity = '0'
  }
  
  // Wait for fade out, then react and show next meme
  setTimeout(async () => {
    // Use the Supabase-enhanced react function
    await memeMazeStore.react(type, reactionTime)
    
    // Track the reaction in Supabase
    await tracking.trackMemeReaction(
      state.currentIndex - 1, // The meme we just reacted to
      type,
      reactionTime
    )
    
    // Track progress
    await tracking.trackProgress('memes', false, {
      currentIndex: state.currentIndex,
      totalMemes: state.totalMemes,
      laughsCount: state.laughsCount,
      reactions: state.reactions
    })
    
    if (memeMazeStore.isComplete) {
      await markMemesCompleted()
      
      // Track completion
      await tracking.trackProgress('memes', true, {
        completed: true,
        totalReactions: state.reactions.filter(r => r !== undefined).length,
        laughsCount: state.laughsCount,
        timestamp: Date.now()
      })
      
      await tracking.trackEvent('memes_completed', {
        totalMemes: state.totalMemes,
        laughsCount: state.laughsCount,
        timestamp: Date.now()
      })
      
      setTimeout(() => {
        router.push('/levels/meme-maze/number-play')
      }, 1000)
    }
  }, 300)
}

// Load existing progress from Supabase on mount
onMounted(async () => {
  try {
    await memeMazeStore.loadProgressFromSupabase()
  } catch (error) {
    console.error('Failed to load progress from Supabase:', error)
  }
})

// Watch for changes in the store and sync with Supabase
watch(() => state.currentIndex, async (newIndex) => {
  if (tracking.isInitialized.value && newIndex > 0) {
    await tracking.trackProgress('memes', false, {
      currentIndex: newIndex,
      totalMemes: state.totalMemes,
      laughsCount: state.laughsCount
    })
  }
})

watch(() => state.laughsCount, async (newCount) => {
  if (tracking.isInitialized.value) {
    await tracking.trackEvent('laugh_count_updated', {
      laughsCount: newCount,
      totalMemes: state.totalMemes,
      timestamp: Date.now()
    })
  }
})
</script>

<style scoped>
.memes-container {
  @apply min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4;
}

.progress-section {
  @apply text-center mb-8;
}

.progress-text {
  @apply text-white text-lg font-semibold mb-2;
}

.text-pulse {
  animation: pulse 2s infinite;
}

.supabase-status {
  @apply mt-2;
}

.status-indicator {
  @apply inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium;
}

.status-indicator.success {
  @apply bg-green-100 text-green-800;
}

.meme-section {
  @apply flex justify-center items-center min-h-[60vh];
}

.meme-card {
  @apply bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full;
}

.meme-image {
  @apply w-full h-auto rounded-lg mb-6 transition-opacity duration-300;
  opacity: 0;
}

.reaction-buttons {
  @apply flex gap-4 justify-center;
}

.react-btn {
  @apply flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95;
}

.laugh-btn {
  @apply bg-green-500 hover:bg-green-600;
}

.meh-btn {
  @apply bg-gray-500 hover:bg-gray-600;
}

.btn-icon {
  @apply w-5 h-5;
}

.btn-text {
  @apply text-sm;
}

.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.loading-spinner {
  @apply bg-white rounded-lg p-6 flex items-center gap-3;
}

.spinner {
  @apply w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
