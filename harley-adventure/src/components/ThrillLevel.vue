<template>
  <div class="thrill-level">
    <div class="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-lg p-8 text-white relative overflow-hidden">
      <!-- Adrenaline background elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="thrill-icons absolute inset-0">
          <div class="absolute top-4 left-4 text-4xl animate-bounce">🎢</div>
          <div class="absolute top-4 right-4 text-4xl animate-pulse">⚡</div>
          <div class="absolute bottom-4 left-4 text-4xl animate-bounce" style="animation-delay: 0.5s;">🏔️</div>
          <div class="absolute bottom-4 right-4 text-4xl animate-pulse" style="animation-delay: 1s;">🔥</div>
          <div class="absolute top-1/2 left-1/4 text-4xl animate-bounce" style="animation-delay: 1.5s;">🚁</div>
          <div class="absolute top-1/2 right-1/4 text-4xl animate-pulse" style="animation-delay: 2s;">💥</div>
        </div>
      </div>

      <div class="relative z-10">
        <h2 class="text-4xl font-bold mb-6 text-center">⚡ Adrenaline Rush Challenge 🔥</h2>
        
        <div v-if="!challengeCompleted" class="text-center">
          <p class="text-xl mb-6">Harley, you crave adventure and adrenaline... Let's see if you can handle this!</p>
          
          <!-- Fear Factor Challenge -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 class="text-2xl font-semibold mb-4">🎯 Fear Factor Challenge</h3>
            <p class="text-sm mb-4 text-gray-200">Choose your adventure level - the higher the risk, the better the reward</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div 
                v-for="(adventure, index) in adventures" 
                :key="index"
                @click="selectAdventure(adventure)"
                class="p-4 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-all duration-300 border-2"
                :class="{ 
                  'border-yellow-400 bg-yellow-500/20': selectedAdventure?.name === adventure.name,
                  'border-transparent': selectedAdventure?.name !== adventure.name
                }"
              >
                <div class="text-3xl mb-2">{{ adventure.emoji }}</div>
                <h4 class="font-semibold mb-2">{{ adventure.name }}</h4>
                <p class="text-sm text-gray-200 mb-2">{{ adventure.description }}</p>
                <div class="text-xs">
                  <div class="flex justify-between">
                    <span>Risk Level:</span>
                    <span>{{ '🔥'.repeat(adventure.riskLevel) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Reward:</span>
                    <span>{{ adventure.reward }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedAdventure" class="mb-4">
              <p class="text-lg">Selected: {{ selectedAdventure.name }}</p>
              <p class="text-sm text-gray-200">Are you ready to face your fears?</p>
            </div>
          </div>

          <!-- Reaction Time Challenge -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 class="text-2xl font-semibold mb-4">⚡ Lightning Fast Challenge</h3>
            <p class="text-sm mb-4 text-gray-200">Click the button as fast as you can when it appears!</p>
            
            <div class="relative h-32 bg-white/10 rounded-lg mb-4">
              <button 
                v-if="showReactionButton"
                @click="handleReactionClick"
                class="absolute bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105"
                :style="{ 
                  left: buttonPosition.x + '%', 
                  top: buttonPosition.y + '%' 
                }"
              >
                CLICK ME! ⚡
              </button>
            </div>

            <div class="text-center">
              <p v-if="!gameStarted" class="text-lg mb-4">Ready to test your reflexes?</p>
              <button 
                v-if="!gameStarted"
                @click="startReactionGame"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
              >
                Start Challenge! ⚡
              </button>
              
              <div v-if="gameStarted && !showReactionButton" class="text-lg">
                <p>Get ready...</p>
                <div class="text-2xl font-bold">{{ countdown }}</div>
              </div>

              <div v-if="reactionTime > 0" class="text-lg">
                <p>Reaction Time: {{ reactionTime }}ms</p>
                <p class="text-sm text-gray-200">
                  {{ reactionTime < 200 ? 'Lightning fast! ⚡' : 
                     reactionTime < 400 ? 'Pretty good! 🎯' : 
                     'You can do better! 💪' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Dare Challenge -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6">
            <h3 class="text-2xl font-semibold mb-4">🎲 Truth or Dare Challenge</h3>
            <p class="text-sm mb-4 text-gray-200">Complete the dare to unlock your reward</p>
            
            <div class="space-y-4">
              <div v-if="!dareCompleted" class="p-4 bg-white/10 rounded-lg">
                <h4 class="text-lg font-semibold mb-2">Your Dare:</h4>
                <p class="text-lg mb-4">{{ currentDare.text }}</p>
                <button 
                  @click="completeDare"
                  class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
                >
                  I Accept the Dare! 🎯
                </button>
              </div>

              <div v-if="dareCompleted" class="p-4 bg-green-500/20 rounded-lg">
                <p class="text-lg">✅ Dare completed! You're braver than you think!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Success state -->
        <div v-else class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-3xl font-bold mb-4">Adrenaline Junkie Harley! ⚡</h3>
          <p class="text-xl mb-6">You've unlocked your thrill reward...</p>
          
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h4 class="text-2xl font-semibold mb-4">🔥 Your Thrill Reward 🔥</h4>
            <div class="text-lg space-y-2">
              <p>✨ A real adventure date (your choice of activity)</p>
              <p>✨ I'll be your adventure buddy and safety net</p>
              <p>✨ We'll conquer something that scares us both</p>
            </div>
            <div class="mt-4 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg">
              <p class="text-sm italic">"The best adventures are the ones that make your heart race... especially when we're together."</p>
            </div>
          </div>

          <button 
            @click="$emit('level-complete')"
            class="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Continue the Adventure →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  'level-complete': []
}>()

// Adventure selection
const adventures = ref([
  {
    name: "Skydiving",
    emoji: "🪂",
    description: "Jump from a plane at 10,000 feet",
    riskLevel: 5,
    reward: "Ultimate rush"
  },
  {
    name: "Rock Climbing",
    emoji: "🧗‍♀️",
    description: "Scale a challenging cliff face",
    riskLevel: 3,
    reward: "Mountain views"
  },
  {
    name: "Bungee Jumping",
    emoji: "🎢",
    description: "Leap off a bridge with just a cord",
    riskLevel: 4,
    reward: "Pure adrenaline"
  }
])

const selectedAdventure = ref<typeof adventures.value[0] | null>(null)

// Reaction time game
const gameStarted = ref(false)
const showReactionButton = ref(false)
const reactionTime = ref(0)
const countdown = ref(3)
const buttonPosition = ref({ x: 50, y: 50 })
let reactionStartTime = 0
let countdownInterval: number
let gameTimeout: number

// Dare challenge
const dares = ref([
  { text: "Send me a voice message saying 'I'm ready for any adventure with you'" },
  { text: "Share your biggest fear and why you want to conquer it" },
  { text: "Tell me about the most thrilling thing you've ever done" }
])

const currentDare = ref(dares.value[0])
const dareCompleted = ref(false)
const challengeCompleted = ref(false)

const selectAdventure = (adventure: typeof adventures.value[0]) => {
  selectedAdventure.value = adventure
}

const startReactionGame = () => {
  gameStarted.value = true
  showReactionButton.value = false
  reactionTime.value = 0
  countdown.value = 3
  
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
      showReactionButton.value = true
      reactionStartTime = Date.now()
      
      // Random button position
      buttonPosition.value = {
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      }
      
      // Auto-hide after 3 seconds
      gameTimeout = setTimeout(() => {
        showReactionButton.value = false
      }, 3000)
    }
  }, 1000)
}

const handleReactionClick = () => {
  reactionTime.value = Date.now() - reactionStartTime
  showReactionButton.value = false
  clearTimeout(gameTimeout)
  
  // Check if all challenges are completed
  setTimeout(() => {
    checkChallengeCompletion()
  }, 1000)
}

const completeDare = () => {
  dareCompleted.value = true
  checkChallengeCompletion()
}

const checkChallengeCompletion = () => {
  if (selectedAdventure.value && reactionTime.value > 0 && dareCompleted.value) {
    challengeCompleted.value = true
  }
}

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (gameTimeout) clearTimeout(gameTimeout)
})
</script>

<style scoped>
.thrill-level {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.thrill-icons {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}
</style>
