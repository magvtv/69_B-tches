<template>
  <GameLayout>
    <div class="number-play-container">
      <div class="content">
      <div class="title-section">
        <h1 class="main-title">Number Play</h1>
        <div class="subtitle">Is your age is hidden in the candles?</div>
      </div>
      
      <div class="riddle-section">
        <!-- Math Problem Display -->
        <div class="math-problem" v-if="currentMathProblem">
          <div class="problem-text">{{ currentMathProblem.question }}</div>
        </div>
        <!-- Candles Progress -->
        <div class="candles-display">
          <div class="flex items-center justify-center gap-2 mb-4">
            <CandlesProgress :lit="candlesLit" :total="23" />
          </div>
          <div class="candles-text">You've lit {{ candlesLit }} candles so far...</div>
        </div>
        
        <!-- Input Section -->
        <div class="input-section">
          <input 
            v-model="userInput" 
            @keyup.enter.prevent="checkAnswer"
            @keydown.enter.prevent="checkAnswer"
            @input="saveToLocalStorage"
            type="number" 
            placeholder="One Correct Answer"
            class="age-input"
            :class="{ 'error': showError, 'success': showSuccess }"
            ref="dancingInput"
          />
          <button 
            @click="checkAnswer" 
            class="submit-btn"
            :disabled="!userInput.trim()"
          >
            Submit
          </button>
        </div>
        
        <div v-if="showError" class="error-message">
          <div class="error-text">Wrong! Try again... HAHAHA!</div>
          <ExclamationTriangleIcon class="error-icon" />
        </div>
        
        <div v-if="showSuccess" class="success-message">
          <div class="success-text">Excellent! You solved it! Now you can proceed to the finale.</div>
          <FireIcon class="success-icon" />
        </div>
      </div>
      
      <div v-if="showSuccess" class="proceed-section">
        <button @click="proceedToFinale" class="proceed-btn">
          <span class="btn-text">Proceed</span>
          <FireIcon class="btn-icon" />
        </button>
      </div>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemeMazeStore } from '@/stores/memeMaze'
import GameLayout from '@/layouts/GameLayout.vue'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import {
  FireIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/solid'

// Define component name for linting
defineOptions({
  name: 'MemeMazeNumberPlay'
})

const router = useRouter()
const memeMazeStore = useMemeMazeStore()
const { markNumberPlayCompleted } = memeMazeStore

const userInput = ref('')
const showError = ref(false)
const showSuccess = ref(false)
const dancingInput = ref<HTMLInputElement | null>(null)

// Math problems
const currentMathProblem = ref<{ question: string; answer: number } | null>(null)
const problemIndex = ref(0)

const candlesLit = computed(() => memeMazeStore.candlesLit)

// Generate random arithmetic problems
function generateRandomArithmeticProblem() {
  const operators = ['+', '-']
  const num1 = Math.floor(Math.random() * 90) + 10 // 2-digit numbers (10-99)
  const num2 = Math.floor(Math.random() * 90) + 10 // 2-digit numbers (10-99)
  const operator = operators[Math.floor(Math.random() * operators.length)]
  
  let question: string
  let answer: number
  
  switch (operator) {
    case '+':
      question = `What is ${num1} + ${num2}?`
      answer = num1 + num2
      break
    case '-':
      // Ensure positive result for subtraction
      const larger = Math.max(num1, num2)
      const smaller = Math.min(num1, num2)
      question = `What is ${larger} - ${smaller}?`
      answer = larger - smaller
      break
    default:
      question = `What is ${num1} + ${num2}?`
      answer = num1 + num2
  }
  
  return { question, answer }
}

// Rotate through math problems
function rotateMathProblem() {
  currentMathProblem.value = generateRandomArithmeticProblem()
  problemIndex.value++
}

// No timer functions needed - removed for static gameplay

// localStorage functions for offline play
function saveToLocalStorage() {
  const gameState = {
    userInput: userInput.value,
    currentProblem: currentMathProblem.value,
    timestamp: Date.now()
  }
  localStorage.setItem('numberPlayGameState', JSON.stringify(gameState))
}

function loadFromLocalStorage() {
  const savedState = localStorage.getItem('numberPlayGameState')
  if (savedState) {
    try {
      const gameState = JSON.parse(savedState)
      // Only restore if saved within last 24 hours
      if (Date.now() - gameState.timestamp < 24 * 60 * 60 * 1000) {
        userInput.value = gameState.userInput || ''
        currentMathProblem.value = gameState.currentProblem || null
      }
    } catch (error) {
      console.error('Error loading game state:', error)
    }
  }
}

function clearLocalStorage() {
  localStorage.removeItem('numberPlayGameState')
}

function generateNewProblem() {
  rotateMathProblem()
  userInput.value = ''
}

function checkAnswer() {
  const answer = parseInt(userInput.value)
  const correctAnswer = currentMathProblem.value?.answer
  
  if (answer === correctAnswer) {
    showError.value = false
    showSuccess.value = true
    
    // Add a candle to the store (like in Memes.vue)
    memeMazeStore.react('laugh') // This will add a candle
    
    // Check if game is complete (23 candles total)
    if (memeMazeStore.candlesLit >= 23) {
      setTimeout(() => {
        proceedToFinale()
      }, 2000)
    } else {
      // Generate new problem after success
      setTimeout(() => {
        showSuccess.value = false
        generateNewProblem()
      }, 1500)
    }
  } else {
    showError.value = true
    showSuccess.value = false
    
    // Hide error and generate new problem
    setTimeout(() => {
      showError.value = false
      generateNewProblem()
    }, 1500)
  }
}

function proceedToFinale() {
  markNumberPlayCompleted()
  clearLocalStorage() // Clear saved game state when completing
  router.push('/levels/meme-maze/finale')
}

// Lifecycle hooks
onMounted(() => {
  // Load saved game state
  loadFromLocalStorage()
  
  // Start with first math problem if none loaded
  if (!currentMathProblem.value) {
    rotateMathProblem()
  }
})

onUnmounted(() => {
  saveToLocalStorage()
})
</script>

<style scoped>
.number-play-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--secondary-purple) 50%, var(--primary-purple) 100%);
  color: var(--text-white);
  font-family: "DM Sans", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.title-section {
  margin-bottom: 3rem;
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #39FF14, #6A0DAD);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px #39FF14;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.3rem;
  color: #F5F5F5;
  opacity: 0.9;
}

.riddle-section {
  background: rgba(106, 13, 173, 0.2);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(57, 255, 20, 0.3);
  margin-bottom: 2rem;
}

.riddle-text {
  margin-bottom: 2rem;
}

.riddle-text p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #F5F5F5;
}

/* Timer section removed - no longer needed */

.candles-display {
  text-align: center;
  margin-bottom: 2rem;
}

.candles-text {
  font-size: 1.2rem;
  color: var(--accent-green);
  font-weight: bold;
  font-family: "DM Sans", sans-serif;
  transition: all 0.3s ease;
}

.input-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.math-problem {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(57, 255, 20, 0.1);
  border-radius: 15px;
  border: 2px solid rgba(57, 255, 20, 0.3);
}

.problem-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #39FF14;
  text-shadow: 0 0 10px #39FF14;
}

.age-input {
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  border: 2px solid #6A0DAD;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  min-width: 200px;
  transition: all 0.3s ease;
  z-index: 10;
}

.age-input.urgent {
  border-color: #FF6B35;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
  animation: urgent-pulse 0.5s ease-in-out infinite;
}

@keyframes urgent-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.age-input:focus {
  outline: none;
  border-color: #39FF14;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

.age-input.error {
  border-color: #B22222;
  box-shadow: 0 0 20px rgba(178, 34, 34, 0.5);
  animation: shake 0.5s ease-in-out;
}

.age-input.success {
  border-color: #39FF14;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
}

.submit-btn {
  background: linear-gradient(45deg, #39FF14, #6A0DAD);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(57, 255, 20, 0.4);
}

.error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(178, 34, 34, 0.2);
  border-radius: 15px;
  border: 2px solid #B22222;
}

.error-text {
  font-size: 1.1rem;
  color: #FF6B6B;
  margin-bottom: 0.5rem;
}

.hint-text {
  font-size: 0.9rem;
  color: #FFD700;
  margin-bottom: 0.5rem;
  font-style: italic;
}

.error-icon {
  width: 32px;
  height: 32px;
  color: #B22222;
  animation: shake 0.5s ease-in-out infinite;
}

.success-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(57, 255, 20, 0.2);
  border-radius: 15px;
  border: 2px solid #39FF14;
}

.success-text {
  font-size: 1.1rem;
  color: #39FF14;
  margin-bottom: 0.5rem;
}

.success-icon {
  width: 32px;
  height: 32px;
  color: #39FF14;
  animation: glow 1s ease-in-out infinite alternate;
}

.proceed-section {
  margin-top: 2rem;
}

.proceed-btn {
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

.proceed-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(57, 255, 20, 0.6);
}

.btn-text {
  margin-right: 0.5rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes glow {
  from { filter: drop-shadow(0 0 10px #39FF14); }
  to { filter: drop-shadow(0 0 20px #39FF14); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Responsive design */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .input-section {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .age-input {
    min-width: 100%;
    font-size: 1.4rem;
    padding: 1.2rem 1.5rem;
  }
  
  .submit-btn {
    width: 100%;
    font-size: 1.3rem;
    padding: 1.2rem 2rem;
  }
  
  .candles-text {
    font-size: 1.3rem;
  }
}
</style>