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
        <div class="math-problem" v-if="currentMathProblem" :class="getOperationClass(currentMathProblem.question)">
          <div class="problem-text">{{ currentMathProblem.question }}</div>
        </div>
        <!-- Candles Progress -->
        <div class="candles-display">
          <div class="flex items-center justify-center gap-2 mb-4">
            <CandlesProgress :lit="candlesLit" :total="23" />
          </div>
          <div class="candles-text">You've lit {{ candlesLit }} candles so far...</div>
          <div class="progress-text">{{ progressText }}</div>
        </div>
        
        <!-- Input Section -->
        <div class="input-section" @mouseenter="onInputSectionHover">
          <input 
            v-model="userInput" 
            @input="onInputChange"
            type="number" 
            placeholder="One Correct Answer"
            class="age-input"
            :class="{ 'error': showError, 'success': showSuccess }"
            ref="dancingInput"
          />
          <button 
            @click="checkAnswer" 
            @mousedown="handleButtonMouseDown"
            @touchstart="handleButtonTouchStart"
            class="submit-btn"
            :class="{ 
              'dancing': isDancing, 
              'evading': isMouseNear,
              'normal-dance': isDancing && !isMouseNear,
              'touch-device': isTouchDevice,
              'fullscreen-evasion': isFullScreenEvasion
            }"
            :style="buttonStyle"
            :disabled="!userInput || userInput.toString().trim() === ''"
            ref="submitButton"
          >
            {{ getButtonText() }}
          </button>
        </div>
        
        <div v-if="showError" class="error-message">
          <div class="error-text">Wrong! Try again... HAHAHA!</div>
          <!-- <ExclamationTriangleIcon class="error-icon" /> -->
        </div>
        
        <div v-if="showSuccess" class="success-message">
          <div class="success-text">Excellent! You solved it!</div>
          <!-- <FireIcon class="success-icon" /> -->
        </div>
      </div>
      
      <div v-if="showSuccess" class="proceed-section">
        <button @click="proceedToFinale" class="proceed-btn">
          <span class="btn-text">Proceed</span>
        </button>
      </div>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted} from 'vue'
// import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMemeMazeSupabaseStore } from '@/stores/memeMazeSupabase'
import GameLayout from '@/layouts/GameLayout.vue'
import CandlesProgress from '@/shared/CandlesProgress.vue'
import {
  // FireIcon,
  // ExclamationTriangleIcon
} from '@heroicons/vue/24/solid'

// Define component name for linting
defineOptions({
  name: 'MemeMazeNumberPlay'
})

const router = useRouter()
const memeMazeStore = useMemeMazeSupabaseStore()
const { markNumberPlayCompleted, addNumberPlayCandle, initializeSession } = memeMazeStore

const userInput = ref('')
const showError = ref(false)
const showSuccess = ref(false)
const dancingInput = ref<HTMLInputElement | null>(null)
const submitButton = ref<HTMLButtonElement | null>(null)

// Dancing button state
const isDancing = ref(false)
const buttonPosition = ref({ x: 0, y: 0 })
const danceInterval = ref<ReturnType<typeof setInterval> | null>(null)
const danceSpeed = ref(80) // milliseconds between moves (even faster for single-digit problems)
const mousePosition = ref({ x: 0, y: 0 })
const previousMousePosition = ref({ x: 0, y: 0 })
const mouseVelocity = ref({ x: 0, y: 0 })
const isMouseNear = ref(false)
const evasionThreshold = 120 // pixels - start evading when mouse is this close (increased for mobile)
const isTouchDevice = ref(false)
const isFullScreenEvasion = ref(false) // When button escapes to full screen
const clickAttempts = ref(0) // Track how many times user tried to click

// Progress tracking for candle lighting
const currentProblemSet = ref<{ question: string; answer: number }[]>([])
const correctAnswersInSet = ref(0)
const totalProblemsInSet = 3 // Need 2/3 correct to light a candle
const problemsSolved = ref(0)
const candlesEarned = ref(0)

// Math problems
const currentMathProblem = ref<{ question: string; answer: number } | null>(null)
const problemIndex = ref(0)

const candlesLit = computed(() => memeMazeStore.candlesLit)
const totalCandlesNeeded = 23
const progressText = computed(() => {
  const setProgress = `${correctAnswersInSet.value}/${totalProblemsInSet}`
  const candleProgress = `${candlesEarned.value}/${totalCandlesNeeded}`
  return `Set: ${setProgress} | Candles: ${candleProgress}`
})

// Computed style for dancing button
const buttonStyle = computed(() => {
  if (!isDancing.value) return {}
  
  if (isFullScreenEvasion.value) {
    // Full screen evasion - position relative to viewport
    return {
      position: 'fixed' as const,
      left: `${buttonPosition.value.x}px`,
      top: `${buttonPosition.value.y}px`,
      zIndex: 9999,
      transition: 'all 0.2s ease-out'
    }
  } else {
    // Normal evasion within input section
    return {
      position: 'absolute' as const,
      left: `${buttonPosition.value.x}px`,
      top: `${buttonPosition.value.y}px`,
      zIndex: 1000,
      transition: 'all 0.3s ease-out'
    }
  }
})

// Generate random arithmetic problems with single digits
function generateRandomArithmeticProblem() {
  const operators = ['+', '-', '×', '÷']
  const operator = operators[Math.floor(Math.random() * operators.length)]
  
  let question: string
  let answer: number
  let num1: number
  let num2: number
  
  switch (operator) {
    case '+':
      num1 = Math.floor(Math.random() * 9) + 1 // 1-9
      num2 = Math.floor(Math.random() * 9) + 1 // 1-9
      question = `What is ${num1} + ${num2}?`
      answer = num1 + num2
      break
      
    case '-':
      num1 = Math.floor(Math.random() * 9) + 1 // 1-9
      num2 = Math.floor(Math.random() * 9) + 1 // 1-9
      // Ensure positive result for subtraction
      const larger = Math.max(num1, num2)
      const smaller = Math.min(num1, num2)
      question = `What is ${larger} - ${smaller}?`
      answer = larger - smaller
      break
      
    case '×':
      num1 = Math.floor(Math.random() * 9) + 1 // 1-9
      num2 = Math.floor(Math.random() * 9) + 1 // 1-9
      question = `What is ${num1} × ${num2}?`
      answer = num1 * num2
      break
      
    case '÷':
      // For division, ensure clean division (no remainders)
      num2 = Math.floor(Math.random() * 8) + 2 // 2-9 (divisor)
      answer = Math.floor(Math.random() * 8) + 1 // 1-8 (quotient)
      num1 = num2 * answer // dividend
      question = `What is ${num1} ÷ ${num2}?`
      break
      
    default:
      num1 = Math.floor(Math.random() * 9) + 1
      num2 = Math.floor(Math.random() * 9) + 1
      question = `What is ${num1} + ${num2}?`
      answer = num1 + num2
  }
  
  return { question, answer }
}

// Get operation hint for visual feedback (unused but kept for future use)
// function getOperationHint(question: string) {
//   if (question.includes('+')) return 'Addition'
//   if (question.includes('-')) return 'Subtraction'
//   if (question.includes('×')) return 'Multiplication'
//   if (question.includes('÷')) return 'Division'
//   return 'Math'
// }

// Get operation class for color coding
function getOperationClass(question: string) {
  if (question.includes('+')) return 'operation-addition'
  if (question.includes('-')) return 'operation-subtraction'
  if (question.includes('×')) return 'operation-multiplication'
  if (question.includes('÷')) return 'operation-division'
  return 'operation-default'
}

// Initialize a new problem set
function initializeProblemSet() {
  currentProblemSet.value = []
  correctAnswersInSet.value = 0
  
  // Generate 3 problems for the set
  for (let i = 0; i < totalProblemsInSet; i++) {
    currentProblemSet.value.push(generateRandomArithmeticProblem())
  }
  
  // Set the first problem as current
  currentMathProblem.value = currentProblemSet.value[0]
  problemIndex.value = 0
}

// Rotate through math problems in current set
async function rotateMathProblem() {
  if (currentProblemSet.value.length === 0) {
    initializeProblemSet()
    return
  }
  
  problemIndex.value++
  
  // If we've completed all problems in the set, check if we earned a candle
  if (problemIndex.value >= currentProblemSet.value.length) {
    await checkCandleEligibility()
    // Start a new set
    initializeProblemSet()
  } else {
    // Move to next problem in current set
    currentMathProblem.value = currentProblemSet.value[problemIndex.value]
  }
}

// Check if user earned a candle (2/3 correct answers)
async function checkCandleEligibility() {
  if (correctAnswersInSet.value >= 2 && candlesEarned.value < totalCandlesNeeded) {
    candlesEarned.value++
    // Add a candle to the store using the new method
    await addNumberPlayCandle()
    console.log(`Candle earned! Total: ${candlesEarned.value}/${totalCandlesNeeded}`)
  }
  
  // Reset for next set
  correctAnswersInSet.value = 0
}

// No timer functions needed - removed for static gameplay

// localStorage functions for offline play
function saveToLocalStorage() {
  const gameState = {
    userInput: userInput.value,
    correctAnswersInSet: correctAnswersInSet.value,
    problemsSolved: problemsSolved.value,
    candlesEarned: candlesEarned.value,
    problemIndex: problemIndex.value,
    // Don't save the current problem - always generate fresh ones
    timestamp: Date.now()
  }
  localStorage.setItem('numberPlayGameState', JSON.stringify(gameState))
}

function loadFromLocalStorage() {
  const savedState = localStorage.getItem('numberPlayGameState')
  if (savedState) {
    try {
      const gameState = JSON.parse(savedState)
      console.log('Loading game state:', gameState)
      
      // Only restore if saved within last 24 hours
      if (Date.now() - gameState.timestamp < 24 * 60 * 60 * 1000) {
        // Ensure userInput is always a string
        userInput.value = gameState.userInput ? gameState.userInput.toString() : ''
        
        // Restore progress data
        correctAnswersInSet.value = gameState.correctAnswersInSet || 0
        problemsSolved.value = gameState.problemsSolved || 0
        candlesEarned.value = gameState.candlesEarned || 0
        problemIndex.value = gameState.problemIndex || 0
        
        console.log('Restored progress:', {
          userInput: userInput.value,
          correctAnswersInSet: correctAnswersInSet.value,
          problemsSolved: problemsSolved.value,
          candlesEarned: candlesEarned.value
        })
      } else {
        console.log('Saved state too old, not restoring')
      }
    } catch (error) {
      console.error('Error loading game state:', error)
    }
  } else {
    console.log('No saved state found')
  }
}

function clearLocalStorage() {
  localStorage.removeItem('numberPlayGameState')
}

// Input change handler
function onInputChange() {
  saveToLocalStorage()
  
  // Start dancing immediately when user has input
  if (userInput.value.trim() !== '' && !isDancing.value) {
    startDancing()
  }
  
  // Stop dancing if input is empty
  if (userInput.value.trim() === '' && isDancing.value) {
    stopDancing()
  }
}

// Input section hover handler
function onInputSectionHover() {
  // Start dancing when user hovers over input area (if there's input)
  if (!isDancing.value && userInput.value.trim() !== '') {
    startDancing()
  }
}

// Button click detection handlers
function handleButtonMouseDown(event: MouseEvent) {
  if (isTouchDevice.value) return // Skip on touch devices
  
  event.preventDefault()
  clickAttempts.value++
  
  // If user is trying to click, escape to full screen
  if (clickAttempts.value >= 2) {
    escapeToFullScreen()
  }
}

function handleButtonTouchStart(event: TouchEvent) {
  if (!isTouchDevice.value) return
  
  event.preventDefault()
  clickAttempts.value++
  
  // On mobile, escape to full screen more aggressively
  if (clickAttempts.value >= 1) {
    escapeToFullScreen()
  }
}

// Escape to full screen evasion
function escapeToFullScreen() {
  if (isFullScreenEvasion.value) return // Already in full screen mode
  
  console.log('Button escaping to full screen!')
  isFullScreenEvasion.value = true
  
  // Move button to a random position on screen
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const headerHeight = 80 // Approximate header height
  
  // Position button in safe area (below header, above bottom)
  const safeTop = headerHeight + 20
  const safeBottom = viewportHeight - 100
  const safeHeight = safeBottom - safeTop
  
  buttonPosition.value = {
    x: Math.random() * (viewportWidth - 200), // Leave space for button width
    y: safeTop + Math.random() * safeHeight
  }
  
  // Increase dance speed for full screen evasion
  danceSpeed.value = 50
  
  // Return to normal mode after some time
  setTimeout(() => {
    if (isFullScreenEvasion.value) {
      returnToNormalMode()
    }
  }, 5000) // 5 seconds of full screen evasion
}

// Return to normal mode
function returnToNormalMode() {
  console.log('Button returning to normal mode')
  isFullScreenEvasion.value = false
  buttonPosition.value = { x: 0, y: 0 }
  danceSpeed.value = isTouchDevice.value ? 100 : 80
  
  // Reset click attempts after a delay
  setTimeout(() => {
    clickAttempts.value = 0
  }, 2000)
}

// Get button text based on state
function getButtonText() {
  if (isFullScreenEvasion.value) {
    return 'You can\'t catch me!'
  } else if (isMouseNear.value) {
    return 'Catch me!'
  } else {
    return 'Submit'
  }
}

// Mouse and touch tracking functions
function handleMouseMove(event: MouseEvent) {
  if (isTouchDevice.value) return // Skip mouse events on touch devices
  
  // Calculate mouse velocity for predictive evasion
  previousMousePosition.value = { ...mousePosition.value }
  mousePosition.value = { x: event.clientX, y: event.clientY }
  
  // Calculate velocity (pixels per frame)
  mouseVelocity.value = {
    x: mousePosition.value.x - previousMousePosition.value.x,
    y: mousePosition.value.y - previousMousePosition.value.y
  }
  
  checkMouseProximity()
}

function handleTouchMove(event: TouchEvent) {
  if (!isTouchDevice.value) return
  
  event.preventDefault() // Prevent scrolling
  
  const touch = event.touches[0]
  if (!touch) return
  
  // Calculate touch velocity for predictive evasion
  previousMousePosition.value = { ...mousePosition.value }
  mousePosition.value = { x: touch.clientX, y: touch.clientY }
  
  // Calculate velocity (pixels per frame)
  mouseVelocity.value = {
    x: mousePosition.value.x - previousMousePosition.value.x,
    y: mousePosition.value.y - previousMousePosition.value.y
  }
  
  checkMouseProximity()
}

function checkMouseProximity() {
  if (!submitButton.value || !isDancing.value) return
  
  const button = submitButton.value
  const buttonRect = button.getBoundingClientRect()
  const buttonCenter = {
    x: buttonRect.left + buttonRect.width / 2,
    y: buttonRect.top + buttonRect.height / 2
  }
  
  const distance = Math.sqrt(
    Math.pow(mousePosition.value.x - buttonCenter.x, 2) + 
    Math.pow(mousePosition.value.y - buttonCenter.y, 2)
  )
  
  isMouseNear.value = distance < evasionThreshold
  
  // If mouse is close, increase dance speed for faster evasion
  if (isMouseNear.value) {
    danceSpeed.value = Math.max(30, danceSpeed.value - 15) // More aggressive evasion
  } else {
    danceSpeed.value = Math.min(150, danceSpeed.value + 3) // Faster recovery
  }
}

// Dancing button functions
function startDancing() {
  if (isDancing.value) return
  
  isDancing.value = true
  
  // Add appropriate event listeners based on device type
  if (isTouchDevice.value) {
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
  } else {
    document.addEventListener('mousemove', handleMouseMove)
  }
  
  // Start the evasion loop with device-appropriate speed
  const initialSpeed = isTouchDevice.value ? 100 : danceSpeed.value
  danceInterval.value = setInterval(evadeMouse, initialSpeed)
}

function stopDancing() {
  isDancing.value = false
  
  // Remove event listeners
  if (isTouchDevice.value) {
    document.removeEventListener('touchmove', handleTouchMove)
  } else {
    document.removeEventListener('mousemove', handleMouseMove)
  }
  
  if (danceInterval.value) {
    clearInterval(danceInterval.value)
    danceInterval.value = null
  }
  
  // Reset button position and speed
  buttonPosition.value = { x: 0, y: 0 }
  danceSpeed.value = 100
  isMouseNear.value = false
}

function evadeMouse() {
  if (!submitButton.value) return
  
  const button = submitButton.value
  const buttonRect = button.getBoundingClientRect()
  
  let availableWidth: number
  let availableHeight: number
  let containerRect: DOMRect
  
  if (isFullScreenEvasion.value) {
    // Full screen evasion - use viewport bounds
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const headerHeight = 80
    
    availableWidth = viewportWidth - buttonRect.width
    availableHeight = viewportHeight - buttonRect.height - headerHeight - 100 // Leave space for header and bottom
    
    containerRect = {
      left: 0,
      top: headerHeight,
      width: viewportWidth,
      height: viewportHeight - headerHeight - 100
    } as DOMRect
  } else {
    // Normal evasion within input section
    const container = button.closest('.input-section') as HTMLElement
    if (!container) return
    
    containerRect = container.getBoundingClientRect()
    availableWidth = containerRect.width - buttonRect.width
    availableHeight = containerRect.height - buttonRect.height
  }
  
  let newX = buttonPosition.value.x
  let newY = buttonPosition.value.y
  
  if (isMouseNear.value) {
    // EVASION MODE: Move away from mouse with predictive movement
    const mouseRelativeToContainer = {
      x: mousePosition.value.x - containerRect.left,
      y: mousePosition.value.y - containerRect.top
    }
    
    const buttonCenter = {
      x: buttonPosition.value.x + buttonRect.width / 2,
      y: buttonPosition.value.y + buttonRect.height / 2
    }
    
    // Predict where mouse will be based on velocity
    const predictedMousePosition = {
      x: mouseRelativeToContainer.x + mouseVelocity.value.x * 3, // Predict 3 frames ahead
      y: mouseRelativeToContainer.y + mouseVelocity.value.y * 3
    }
    
    // Calculate escape direction (away from predicted mouse position)
    const escapeDirection = {
      x: buttonCenter.x - predictedMousePosition.x,
      y: buttonCenter.y - predictedMousePosition.y
    }
    
    // Normalize direction
    const distance = Math.sqrt(escapeDirection.x ** 2 + escapeDirection.y ** 2)
    if (distance > 0) {
      const normalizedDirection = {
        x: escapeDirection.x / distance,
        y: escapeDirection.y / distance
      }
      
      // Move in escape direction with some randomness and urgency
      const escapeDistance = 120 + Math.random() * 80 // 120-200 pixels (more aggressive escape)
      newX = Math.max(0, Math.min(availableWidth, 
        buttonPosition.value.x + normalizedDirection.x * escapeDistance))
      newY = Math.max(0, Math.min(availableHeight, 
        buttonPosition.value.y + normalizedDirection.y * escapeDistance))
    }
  } else {
    // NORMAL MODE: Gentle random movement
    if (isFullScreenEvasion.value) {
      // Full screen mode: more aggressive movement
      const maxMove = isTouchDevice.value ? 80 : 60
      newX = Math.max(0, Math.min(availableWidth, 
        buttonPosition.value.x + (Math.random() - 0.5) * maxMove))
      newY = Math.max(0, Math.min(availableHeight, 
        buttonPosition.value.y + (Math.random() - 0.5) * maxMove))
    } else if (isTouchDevice.value) {
      // On mobile, prefer side-to-side movement
      const maxMove = 30
      newX = Math.max(0, Math.min(availableWidth, 
        buttonPosition.value.x + (Math.random() - 0.5) * maxMove))
      // Less vertical movement on mobile
      newY = Math.max(0, Math.min(availableHeight, 
        buttonPosition.value.y + (Math.random() - 0.5) * (maxMove * 0.3)))
    } else {
      // Desktop: normal random movement
      const maxMove = 20
      newX = Math.max(0, Math.min(availableWidth, 
        buttonPosition.value.x + (Math.random() - 0.5) * maxMove))
      newY = Math.max(0, Math.min(availableHeight, 
        buttonPosition.value.y + (Math.random() - 0.5) * maxMove))
    }
  }
  
  buttonPosition.value = { x: newX, y: newY }
}

async function generateNewProblem() {
  console.log('Generating new problem...')
  await rotateMathProblem()
  userInput.value = ''
  console.log('New problem generated:', currentMathProblem.value)
}

async function checkAnswer() {
  // If in full screen evasion mode, don't process the answer
  if (isFullScreenEvasion.value) {
    console.log('Button escaped! Answer not processed.')
    return
  }
  
  // Stop dancing when button is clicked
  stopDancing()
  
  const answer = parseInt(userInput.value)
  const correctAnswer = currentMathProblem.value?.answer
  
  if (answer === correctAnswer) {
    showError.value = false
    showSuccess.value = true
    correctAnswersInSet.value++
    problemsSolved.value++
    
    console.log(`Correct! Set progress: ${correctAnswersInSet.value}/${totalProblemsInSet}`)
    
    // Check if game is complete (23 candles total)
    if (candlesEarned.value >= totalCandlesNeeded) {
      setTimeout(() => {
        proceedToFinale()
      }, 2000)
    } else {
      // Move to next problem after success
      setTimeout(async () => {
        showSuccess.value = false
        await generateNewProblem()
      }, 1500)
    }
  } else {
    showError.value = true
    showSuccess.value = false
    
    console.log(`Wrong! Set progress: ${correctAnswersInSet.value}/${totalProblemsInSet}`)
    
    // Start dancing button on wrong answer (more aggressively)
    startDancing()
    
    // Hide error and move to next problem
    setTimeout(async () => {
      showError.value = false
      await generateNewProblem()
    }, 1500)
  }
}

async function proceedToFinale() {
  await markNumberPlayCompleted()
  clearLocalStorage() // Clear saved game state when completing
  router.push('/levels/meme-maze/finale')
}

// Lifecycle hooks
onMounted(async () => {
  console.log('Component mounted, loading state...')
  
  // Initialize Supabase session
  try {
    await initializeSession()
    console.log('Supabase session initialized for number play')
  } catch (error) {
    console.error('Failed to initialize Supabase session:', error)
  }
  
  // Detect if device supports touch
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  console.log('Touch device detected:', isTouchDevice.value)
  
  // Load saved game state
  loadFromLocalStorage()
  
  // Initialize the first problem set
  console.log('Initializing problem set...')
  initializeProblemSet()
  
  // Add window resize listener
  window.addEventListener('resize', handleWindowResize)
  
  // Start dancing after a delay to be annoying
  setTimeout(() => {
    if (!showSuccess.value && !showError.value) {
      startDancing()
      // Stop dancing after 3 seconds
      setTimeout(() => {
        stopDancing()
      }, 3000)
    }
  }, 2000)
})

onUnmounted(() => {
  saveToLocalStorage()
  stopDancing() // Clean up dancing interval
  
  // Clean up window resize listener
  window.removeEventListener('resize', handleWindowResize)
})

// Handle window resize for full screen evasion
function handleWindowResize() {
  if (isFullScreenEvasion.value) {
    // Recalculate position if in full screen mode
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const headerHeight = 80 // Keep space for header
    
    buttonPosition.value = {
      x: Math.min(buttonPosition.value.x, viewportWidth - 200),
      y: Math.min(buttonPosition.value.y, viewportHeight - headerHeight - 100)
    }
  }
}
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

.progress-text {
  font-size: 1rem;
  color: #FFD700;
  font-weight: bold;
  font-family: "DM Sans", sans-serif;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.input-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative; /* For absolute positioning of dancing button */
  min-height: 60px; /* Ensure space for dancing button */
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
  margin-bottom: 0.5rem;
}

.operation-hint {
  font-size: 0.9rem;
  color: #FFD700;
  font-weight: normal;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Operation-specific color coding */
.operation-addition {
  border-color: rgba(57, 255, 20, 0.3) !important;
  background: rgba(57, 255, 20, 0.1) !important;
}

.operation-subtraction {
  border-color: rgba(255, 107, 53, 0.3) !important;
  background: rgba(255, 107, 53, 0.1) !important;
}

.operation-multiplication {
  border-color: rgba(138, 43, 226, 0.3) !important;
  background: rgba(138, 43, 226, 0.1) !important;
}

.operation-division {
  border-color: rgba(255, 215, 0, 0.3) !important;
  background: rgba(255, 215, 0, 0.1) !important;
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
  user-select: none; /* Prevent text selection */
  -webkit-user-select: none;
  -webkit-touch-callout: none; /* Prevent callout on iOS */
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight */
}

.submit-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(57, 255, 20, 0.4);
}

.submit-btn.dancing {
  cursor: grab;
}

.submit-btn.dancing:hover {
  cursor: grabbing;
}

.submit-btn.normal-dance {
  animation: gentle-wiggle 1s ease-in-out infinite;
}

.submit-btn.evading {
  animation: panic-evade 0.2s ease-in-out infinite;
  background: linear-gradient(45deg, #ff4444, #ff6b35) !important;
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.8) !important;
}

.submit-btn.touch-device {
  /* Enhanced visual feedback for touch devices */
  box-shadow: 0 4px 15px rgba(57, 255, 20, 0.3);
}

.submit-btn.touch-device.dancing {
  /* More prominent shadow when dancing on touch devices */
  box-shadow: 0 6px 20px rgba(57, 255, 20, 0.5);
}

.submit-btn.fullscreen-evasion {
  /* Full screen evasion styling */
  background: linear-gradient(45deg, #ff6b35, #ff4444) !important;
  box-shadow: 0 0 30px rgba(255, 107, 53, 0.8) !important;
  animation: fullscreen-panic 0.1s ease-in-out infinite;
  transform: scale(1.1);
}

@keyframes fullscreen-panic {
  0%, 100% { 
    transform: scale(1.1) rotate(-2deg);
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: scale(1.15) rotate(2deg);
    filter: hue-rotate(15deg);
  }
  50% { 
    transform: scale(1.2) rotate(-1deg);
    filter: hue-rotate(-15deg);
  }
  75% { 
    transform: scale(1.15) rotate(1deg);
    filter: hue-rotate(10deg);
  }
}

@keyframes gentle-wiggle {
  0%, 100% { 
    transform: rotate(0deg) scale(1);
  }
  25% { 
    transform: rotate(-2deg) scale(1.02);
  }
  50% { 
    transform: rotate(0deg) scale(1.05);
  }
  75% { 
    transform: rotate(2deg) scale(1.02);
  }
}

@keyframes panic-evade {
  0%, 100% { 
    transform: rotate(-3deg) scale(1.1);
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: rotate(3deg) scale(1.15);
    filter: hue-rotate(10deg);
  }
  50% { 
    transform: rotate(-2deg) scale(1.2);
    filter: hue-rotate(-10deg);
  }
  75% { 
    transform: rotate(2deg) scale(1.15);
    filter: hue-rotate(5deg);
  }
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
  .number-play-container {
    padding: 1rem;
  }
  
  .content {
    max-width: 100%;
  }
  
  .main-title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  .riddle-section {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .math-problem {
    padding: 0.8rem;
    margin-bottom: 1.5rem;
  }
  
  .problem-text {
    font-size: 1.3rem;
  }
  
  .candles-display {
    margin-bottom: 1.5rem;
  }
  
  .candles-text {
    font-size: 1.1rem;
  }
  
  .progress-text {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  
  .input-section {
    flex-direction: column;
    gap: 1rem;
    min-height: 100px; /* Increased for better button movement space */
  }
  
  .age-input {
    min-width: 100%;
    font-size: 1.2rem;
    padding: 1rem 1.2rem;
  }
  
  .submit-btn {
    width: 80%;
    max-width: 200px;
    font-size: 1.1rem;
    padding: 0.8rem 1.2rem;
    margin: 0 auto;
  }
  
  .error-message,
  .success-message {
    margin-top: 1rem;
    padding: 0.8rem;
  }
  
  .error-text,
  .success-text {
    font-size: 1rem;
  }
  
  .proceed-btn {
    padding: 1.2rem 2rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .number-play-container {
    padding: 0.5rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .riddle-section {
    padding: 1rem;
  }
  
  .math-problem {
    padding: 0.6rem;
  }
  
  .problem-text {
    font-size: 1.1rem;
  }
  
  .candles-text {
    font-size: 1rem;
  }
  
  .progress-text {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
  
  .age-input {
    font-size: 1.1rem;
    padding: 0.8rem 1rem;
  }
  
  .submit-btn {
    width: 70%;
    max-width: 180px;
    font-size: 1rem;
    padding: 0.7rem 1rem;
    margin: 0 auto;
    transition: all 0.2s ease-out; /* Smoother movement on mobile */
  }
}
</style>