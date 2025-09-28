<template>
  <GameLayout>
    <div class="memes-container">
    <!-- Progress Bar with 23 Candles -->
    <div class="progress-section">
      <div class="flex items-center justify-center gap-2 mb-4">
        <CandlesProgress :key="`candles-${candlesLit}`" :lit="candlesLit" :total="23" />
      </div>
      <div class="progress-text" :class="{ 'text-pulse': candlesLit > 0 }">
        {{ candlesLit }}/23 Candles Lit
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
        <div class="reaction-buttons" v-if="!memeMazeStore.isComplete">
          <button @click="onReact('laugh')" class="react-btn laugh-btn">
            <FaceSmileIcon class="btn-icon" />
            <span class="btn-text">Got me</span>
          </button>
          <button @click="onReact('meh')" class="react-btn meh-btn">
            <FaceFrownIcon class="btn-icon" />
            <span class="btn-text">Meh</span>
          </button>
        </div>
        
        <!-- Completion Message and Restart Button -->
        <div v-if="memeMazeStore.isComplete" class="completion-section">
          <div class="completion-message">
            <h4>All Memes Viewed!</h4>
            <p>You've seen {{ memes.length }} memes!</p>
            <p class="candles-summary">{{ candlesLit }}/23 Candles Lit</p>
          </div>
          <div class="completion-actions">
            <button @click="restartMemes" class="restart-btn">
              <span>View Memes Again</span>
            </button>
            <button @click="() => router.push('/levels/meme-maze/number-play')" class="continue-btn">
              <span>Go to Number Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Joker Popup - Disabled -->
    <!-- <div v-if="showPopup" class="joker-popup" @click="hideJokerPopup">
      <div class="popup-content">
        <div class="joker-text">HAHAHA! {{ jokerMessage }}</div>
      </div>
    </div> -->
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemeMazeSupabaseStore } from '@/stores/memeMazeSupabase'
import GameLayout from '@/layouts/GameLayout.vue'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import {
  FaceSmileIcon,
  FaceFrownIcon
} from '@heroicons/vue/24/solid'

// Define component name for linting
defineOptions({
  name: 'MemeMazeMemes'
})

const router = useRouter()
const memeMazeStore = useMemeMazeSupabaseStore()
const { state, react, candlesLit, markMemesCompleted, initializeSession } = memeMazeStore

const memeImg = ref<HTMLImageElement | null>(null)
// Popup variables disabled - no more annoying popups!
// const showPopup = ref(false)
// const jokerMessage = ref('')

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
  // If we've completed all memes, show the last meme
  if (state.currentIndex >= memes.length) {
    return memes[memes.length - 1] || null
  }
  return memes[state.currentIndex] || null
})

function onImageLoad() {
  // Small delay to ensure smooth fade-in
  setTimeout(() => {
    if (memeImg.value) {
      memeImg.value.style.opacity = '1'
    }
  }, 50)
}

async function onReact(type: 'laugh' | 'meh') {
  // Don't process reactions if memes are already completed
  if (memeMazeStore.isComplete) return
  
  const reactionStartTime = Date.now()
  
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
    const reactionTime = Date.now() - reactionStartTime
    
    // Update the reaction with Supabase tracking
    await react(type, reactionTime)
    
    // Wait for the next tick to ensure reactivity updates
    await nextTick()
    
    // Force reactivity update by accessing the computed value
    console.log('Candles lit after reaction:', candlesLit)
    
    // Joker popup disabled - no more annoying popups!
    // if (type === 'laugh') {
    //   showJokerPopup()
    // }
    
    // Only auto-redirect if this was the first completion
    if (memeMazeStore.isComplete && !state.memesCompleted) {
      await markMemesCompleted()
      // Don't auto-redirect anymore, let user choose
    }
  }, 300)
}

// Joker popup functions disabled - no more annoying popups!
// function showJokerPopup() {
//   const messages = [
//     "HAHAHA! That one got you!",
//     "BRILLIANT! Another candle lit!",
//     "YES! You're on fire!",
//     "HAHAHA! Keep going!",
//     "PERFECT! More candles!",
//     "HAHAHA! You're doing great!",
//     "EXCELLENT! Almost there!",
//     "HAHAHA! One more candle!",
//     "AMAZING! You're almost done!",
//     "HAHAHA! Last few candles!"
//   ]
//   
//   jokerMessage.value = messages[Math.floor(Math.random() * messages.length)]
//   showPopup.value = true
//   
//   // Auto-hide after 2 seconds
//   setTimeout(() => {
//     showPopup.value = false
//   }, 2000)
// }

// function hideJokerPopup() {
//   showPopup.value = false
// }

// Function to restart meme viewing
function restartMemes() {
  // Reset the current index to start from the beginning
  state.currentIndex = 0
  // Clear all reactions to start fresh
  state.reactions = Array(memes.length).fill(undefined)
  state.laughsCount = 0
  state.memesCompleted = false
  
  // Reset image opacity to ensure proper display
  if (memeImg.value) {
    memeImg.value.style.opacity = '0'
    setTimeout(() => {
      if (memeImg.value) {
        memeImg.value.style.opacity = '1'
      }
    }, 100)
  }
}

// Watch for current meme changes and reset image opacity
watch(() => state.currentIndex, async (newIndex) => {
  // Always reset image opacity when index changes, even if completed
  await nextTick()
  
  // Reset image opacity for the new meme
  if (memeImg.value) {
    memeImg.value.style.opacity = '0'
    // Trigger the load event to show the image
    setTimeout(() => {
      if (memeImg.value) {
        memeImg.value.style.opacity = '1'
      }
    }, 100)
  }
})

// Watch for candles lit changes to ensure reactivity
watch(() => candlesLit, (newCount) => {
  console.log('Candles lit updated:', newCount)
}, { immediate: true })

// Watch for reactions changes to ensure candles update
watch(() => state.reactions, (newReactions) => {
  console.log('Reactions updated:', newReactions.filter(r => r === 'laugh').length, 'laughs')
}, { deep: true })

// Initialize Supabase session when component mounts
onMounted(async () => {
  try {
    await initializeSession()
    console.log('Supabase session initialized for memes')
  } catch (error) {
    console.error('Failed to initialize Supabase session:', error)
  }
})

// Remove old candle animation code since we're using CandlesProgress component
</script>

<style scoped>
.memes-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--secondary-purple) 50%, var(--primary-purple) 100%);
  color: var(--text-white);
  font-family: "DM Sans", sans-serif;
  padding: 2rem;
}

.progress-section {
  text-align: center;
  margin-bottom: 2rem;
}

.progress-text {
  font-size: 1.2rem;
  color: var(--accent-green);
  font-weight: bold;
  font-family: "DM Sans", sans-serif;
  transition: all 0.3s ease;
}

.text-pulse {
  animation: text-pulse 0.6s ease-in-out;
}

@keyframes text-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.meme-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.meme-card {
  background: rgba(106, 13, 173, 0.2);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 2px solid var(--border-green);
  max-width: 600px;
  width: 100%;
}

.meme-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 15px;
  margin-bottom: 2rem;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.reaction-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.react-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
  font-family: "DM Sans", sans-serif;
}

.laugh-btn {
  background: linear-gradient(45deg, var(--accent-green), #32CD32);
  color: var(--dark-bg);
  font-family: "DM Sans", sans-serif;
}

.laugh-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(57, 255, 20, 0.4);
}

.meh-btn {
  background: linear-gradient(45deg, var(--primary-purple), #8A2BE2);
  color: var(--text-white);
  font-family: "DM Sans", sans-serif;
}

.meh-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(106, 13, 173, 0.4);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.joker-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.popup-content {
  background: linear-gradient(45deg, var(--accent-green), var(--primary-purple));
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  margin: 2rem;
  font-family: "DM Sans", sans-serif;
}

.joker-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-white);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: "DM Sans", sans-serif;
}

/* Completion section styles */
.completion-section {
  text-align: center;
  padding: 1rem 0;
}

.completion-message {
  margin-bottom: 2rem;
}

.completion-message h3 {
  font-size: 1.8rem;
  color: var(--accent-green);
  margin-bottom: 1rem;
  font-family: "DM Sans", sans-serif;
}

.completion-message p {
  font-size: 1.1rem;
  color: var(--text-white);
  margin-bottom: 0.5rem;
  font-family: "DM Sans", sans-serif;
}

.candles-summary {
  font-size: 1.3rem !important;
  color: var(--accent-green) !important;
  font-weight: bold !important;
}

.completion-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.restart-btn, .continue-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "DM Sans", sans-serif;
  min-width: 180px;
}

.restart-btn {
  background: linear-gradient(45deg, var(--primary-purple), #8A2BE2);
  color: var(--text-white);
}

.restart-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(106, 13, 173, 0.4);
}

.continue-btn {
  background: linear-gradient(45deg, var(--accent-green), #32CD32);
  color: var(--dark-bg);
}

.continue-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(57, 255, 20, 0.4);
}

/* Responsive design */
@media (max-width: 768px) {
  .memes-container {
    padding: 1rem;
  }
  
  .reaction-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .react-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .completion-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .restart-btn, .continue-btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>