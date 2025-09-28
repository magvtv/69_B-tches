<template>
  <GameLayout>
    <div class="finale-container">
      <div class="content">
      <!-- Celebration Section -->
      <div class="celebration-section">
        <h1 class="main-title">Ati Sasa Umemake It!</h1>
        <div class="subtitle">23 laughs, 23 candles</div>
        
        <!-- Animated Candles -->
        <div class="candles-celebration">
          <div 
            v-for="i in 23" 
            :key="i" 
            class="celebration-candle"
            :class="{ 'lit': i <= candlesLit }"
          ></div>
        </div>
      </div>
      
      <!-- Reward Section -->
      <div class="reward-section">
        <div class="reward-card">
          <CakeIcon class="reward-icon" />
          <h2 class="reward-title">Your First Token of Chaos</h2>
          <div class="reward-description">
            <p>Congratulations Harley! You've earned your first chaos token.</p>
            <p>Redeem this for 23 hugs and back + ass massages!</p>
          </div>
          
          <button @click="claimReward" class="claim-btn" v-if="!rewardClaimed">
            <span class="btn-text">Claim Reward</span>
            <GiftIcon class="btn-icon" />
          </button>
          
          <div v-if="rewardClaimed" class="reward-revealed">
            <div class="reward-code">CHAOS-TOKEN-23</div>
            <div class="reward-instructions">
              Show Joker this code to claim your hugs and back + ass massages!
            </div>
            
            <!-- Countdown Display -->
            <div v-if="isRedirecting" class="countdown-section">
              <div class="countdown-text">
                Redirecting to landing page in {{ redirectCountdown }} seconds...
              </div>
              <div class="countdown-bar">
                <div class="countdown-progress" :style="{ width: `${(3 - redirectCountdown) / 3 * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation -->
      <div class="navigation-section">
        <button @click="backToLevels" class="back-btn">
          <span class="btn-text">Back to Levels</span>
          <HomeIcon class="btn-icon" />
        </button>
      </div>
    </div>
    
    <!-- Confetti Effect -->
    <div v-if="showConfetti" class="confetti-container">
      <div v-for="i in 50" :key="i" class="confetti" :style="confettiStyle(i)"></div>
    </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemeMazeSupabaseStore } from '@/stores/memeMazeSupabase'
import GameLayout from '@/layouts/GameLayout.vue'
import {
  CakeIcon,
  GiftIcon,
  HomeIcon
} from '@heroicons/vue/24/solid'

// Define component name for linting
defineOptions({
  name: 'MemeMazeFinale'
})

const router = useRouter()
const memeMazeStore = useMemeMazeSupabaseStore()
const { markFinaleCompleted, initializeSession } = memeMazeStore

const rewardClaimed = ref(false)
const showConfetti = ref(false)
const redirectCountdown = ref(0)
const isRedirecting = ref(false)

const candlesLit = computed(() => memeMazeStore.candlesLit)

async function claimReward() {
  rewardClaimed.value = true
  showConfetti.value = true
  await markFinaleCompleted()
  
  // Start countdown and redirect after 3 seconds
  startRedirectCountdown()
}

function startRedirectCountdown() {
  isRedirecting.value = true
  redirectCountdown.value = 3
  
  const countdownInterval = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(countdownInterval)
      redirectToLandingPage()
    }
  }, 2000)
}

function redirectToLandingPage() {
  router.push('/levels/meme-maze')
}

function backToLevels() {
  router.push('/levels')
}

function confettiStyle(index: number) {
  const colors = ['#39FF14', '#6A0DAD', '#B22222', '#FFD700', '#FF69B4']
  const color = colors[index % colors.length]
  const left = Math.random() * 100
  const animationDelay = Math.random() * 2
  const animationDuration = 2 + Math.random() * 2
  
  return {
    left: `${left}%`,
    backgroundColor: color,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}

onMounted(async () => {
  // Initialize Supabase session
  try {
    await initializeSession()
    console.log('Supabase session initialized for finale')
  } catch (error) {
    console.error('Failed to initialize Supabase session:', error)
  }
  
  // Check if user has completed all candles
  if (candlesLit.value < 23) {
    // Redirect back to NumberPlay if not all candles are lit
    router.push('/levels/meme-maze/number-play')
    return
  }
  
  // Animate candles lighting up one by one
  const candles = document.querySelectorAll('.celebration-candle')
  candles.forEach((candle, index) => {
    setTimeout(() => {
      (candle as HTMLElement).style.opacity = '1'
    }, index * 100)
  })
})
</script>

<style scoped>
.finale-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--secondary-purple) 50%, var(--primary-purple) 100%);
  color: var(--text-white);
  font-family: "DM Sans", sans-serif;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.celebration-section {
  margin-bottom: 3rem;
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #39FF14, #6A0DAD, #FFD700);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px #39FF14;
  margin-bottom: 1rem;
  animation: glow 2s ease-in-out infinite alternate;
}

.subtitle {
  font-size: 1.5rem;
  color: #F5F5F5;
  margin-bottom: 2rem;
}

.candles-celebration {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.celebration-candle {
  width: 25px;
  height: 35px;
  background: linear-gradient(to bottom, #8B4513, #654321);
  border-radius: 12px 12px 0 0;
  position: relative;
  opacity: 0;
  transition: all 0.5s ease;
}

.celebration-candle.lit {
  opacity: 1;
  box-shadow: 0 0 15px #39FF14, 0 0 30px #39FF14;
}

.celebration-candle.lit::after {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FF6B35' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
  background-size: contain;
  animation: flicker 1s ease-in-out infinite;
}

.reward-section {
  margin-bottom: 3rem;
}

.reward-card {
  background: rgba(106, 13, 173, 0.2);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(57, 255, 20, 0.3);
  max-width: 500px;
  margin: 0 auto;
}

.reward-icon {
  width: 64px;
  height: 64px;
  color: #39FF14;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out infinite;
}

.reward-title {
  font-size: 2rem;
  color: #39FF14;
  margin-bottom: 1rem;
}

.reward-description {
  margin-bottom: 2rem;
}

.reward-description p {
  font-size: 1.1rem;
  color: #F5F5F5;
  margin-bottom: 0.5rem;
}

.claim-btn {
  background: linear-gradient(45deg, #39FF14, #6A0DAD);
  border: none;
  padding: 1.5rem 3rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(57, 255, 20, 0.4);
}

.claim-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(57, 255, 20, 0.6);
}

.reward-revealed {
  background: rgba(57, 255, 20, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #39FF14;
}

.reward-code {
  font-size: 1.5rem;
  font-weight: bold;
  color: #39FF14;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.reward-instructions {
  font-size: 1rem;
  color: #F5F5F5;
  margin-bottom: 1.5rem;
}

.countdown-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(57, 255, 20, 0.1);
  border-radius: 10px;
  border: 1px solid #39FF14;
}

.countdown-text {
  font-size: 1rem;
  color: #39FF14;
  margin-bottom: 0.5rem;
  text-align: center;
}

.countdown-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.countdown-progress {
  height: 100%;
  background: linear-gradient(90deg, #39FF14, #6A0DAD);
  border-radius: 4px;
  transition: width 1s linear;
}

.navigation-section {
  margin-top: 2rem;
}

.back-btn {
  background: linear-gradient(45deg, #6A0DAD, #8A2BE2);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(106, 13, 173, 0.4);
}

.btn-text {
  margin-right: 0.5rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti-fall linear infinite;
}

@keyframes glow {
  from { filter: drop-shadow(0 0 20px #39FF14); }
  to { filter: drop-shadow(0 0 40px #6A0DAD); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes flicker {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .candles-celebration {
    gap: 0.3rem;
  }
  
  .celebration-candle {
    width: 20px;
    height: 30px;
  }
  
  .reward-card {
    padding: 1.5rem;
  }
  
  .reward-title {
    font-size: 1.5rem;
  }
}
</style>