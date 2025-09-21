<template>
  <div class="puzzle-level">
    <div class="bg-gradient-to-br from-black via-red-900 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
      <!-- Minimalistic background elements -->
      <div class="absolute inset-0 opacity-5">
        <div class="puzzle-icons absolute inset-0">
          <div class="absolute top-4 left-4">
            <PuzzlePieceIcon class="h-8 w-8 text-red-400" />
          </div>
          <div class="absolute top-4 right-4">
            <ClockIcon class="h-8 w-8 text-red-400" />
          </div>
          <div class="absolute bottom-4 left-4">
            <TrophyIcon class="h-8 w-8 text-red-400" />
          </div>
          <div class="absolute bottom-4 right-4">
            <SparklesIcon class="h-8 w-8 text-red-400" />
          </div>
          <div class="absolute top-1/2 left-1/4">
            <StarIcon class="h-8 w-8 text-red-400" />
          </div>
          <div class="absolute top-1/2 right-1/4">
            <BoltIcon class="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      <div class="relative z-10">
        <h2 class="text-4xl font-extrabold mb-6 text-center dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center gap-3">
          <!-- <PuzzlePieceIcon class="h-10 w-10 text-red-400" /> -->
          A Puzzle Challenge
          <!-- <TagIcon class="h-10 w-10 text-red-400" /> -->
        </h2>
        
        <div v-if="!puzzleCompleted" class="text-center">
          
          <!-- Stats Display -->
          <div class="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-red-600/20">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-red-400 dm-sans">{{ moves }}</div>
                <div class="text-sm text-gray-300 dm-sans">Moves</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-red-400 dm-sans" :class="{ 'text-yellow-400': timeRemaining <= 60, 'text-red-500': timeRemaining <= 30 }">
                  {{ formattedTimeRemaining }}
                </div>
                <div class="text-sm text-gray-300 dm-sans">Time Left</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-red-400 dm-sans">{{ score }}</div>
                <div class="text-sm text-gray-300 dm-sans">Score</div>
              </div>
            </div>
          </div>

          <!-- Puzzle Grid -->
          <div class="bg-black/40 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-red-600/20">
            <h3 class="text-2xl font-bold mb-4 dm-sans text-center flex items-center justify-center gap-2">
              <TagIcon class="h-6 w-6 text-red-400" />
              Solve the Puzzle
            </h3>
            <p class="text-sm mb-6 text-gray-300 dm-sans text-center">Move the tiles to complete the picture. Click adjacent tiles to swap with the empty space!</p>
            
            <div class="puzzle-container mx-auto">
              <div class="puzzle-grid">
                <div 
                  v-for="(tile, index) in puzzleTiles" 
                  :key="index"
                  @click="moveTile(index)"
                  class="puzzle-tile"
                  :class="{ 
                    'empty': tile === 0,
                    'clickable': canMoveTile(index),
                    'correct': tile === index + 1
                  }"
                >
                  <div v-if="tile !== 0" class="tile-content">
                    <!-- TODO: Replace with her image when ready -->
                    <!-- <img :src="getTileImage(tile)" :alt="`Tile ${tile}`" class="tile-image" /> -->
                    <div class="tile-number">{{ tile }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Move Instructions -->
            <div class="mt-6 text-sm text-gray-300 dm-sans text-center flex items-center justify-center gap-2">
              <LightBulbIcon class="h-4 w-4 text-yellow-400" />
              <p>Click any tile next to the empty space to move it!</p>
            </div>
          </div>

          <!-- Quiz Trigger Area (Placeholder) - COMMENTED OUT FOR NOW -->
          <!-- 
          <div v-if="showQuizTrigger" class="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-red-600/20">
            <h4 class="text-lg font-bold mb-2 dm-sans text-center flex items-center justify-center gap-2">
              <QuestionMarkCircleIcon class="h-5 w-5 text-red-400" />
              Quiz Time!
            </h4>
            <p class="text-sm text-gray-300 dm-sans text-center mb-4">Answer this question to continue... or face the consequences!</p>
            <div class="mt-4 p-4 bg-red-600/20 rounded-xl border border-red-500/30">
              <p class="text-sm italic text-gray-300 dm-sans text-center">Quiz integration point - Component will be added here</p>
            </div>
          </div>
          -->

          <!-- Penalty Display -->
          <div v-if="penaltyMoves > 0" class="bg-red-600/20 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-red-500/30">
            <p class="text-red-200 dm-sans text-center flex items-center justify-center gap-2">
              <ExclamationTriangleIcon class="h-4 w-4 text-red-400" />
              Penalty: +{{ penaltyMoves }} moves for wrong answer!
            </p>
          </div>

          <!-- Progress Messages -->
          <div v-if="progressMessage" class="bg-red-600/20 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-red-500/30">
            <p class="text-red-200 dm-sans text-center flex items-center justify-center gap-2">
              <ChatBubbleLeftRightIcon class="h-4 w-4 text-red-400" />
              {{ progressMessage }}
            </p>
          </div>
        </div>

        <!-- Success state -->
        <div v-else class="text-center">
          <div class="mb-4">
            <TrophyIcon class="h-16 w-16 text-yellow-400 mx-auto" />
          </div>
          <h3 class="text-3xl font-bold mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center gap-3">
            <PuzzlePieceIcon class="h-8 w-8 text-red-400" />
            Puzzle Master Harley!
          </h3>
          <p class="text-xl mb-6 dm-sans text-gray-200">Impressive work, my Harley! You solved it in {{ moves }} moves and {{ formattedTime }}!</p>
          
          <!-- Final Score Display -->
          <div class="bg-black/40 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-red-600/20">
            <h4 class="text-2xl font-bold mb-6 dm-sans text-center flex items-center justify-center gap-2">
              <TrophyIcon class="h-6 w-6 text-yellow-400" />
              Your Performance
            </h4>
            <div class="grid grid-cols-2 gap-6 text-center mb-6">
              <div>
                <div class="text-3xl font-bold text-red-400 dm-sans">{{ moves }}</div>
                <div class="text-sm text-gray-300 dm-sans">Total Moves</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-red-400 dm-sans">{{ formattedTime }}</div>
                <div class="text-sm text-gray-300 dm-sans">Total Time</div>
              </div>
            </div>
            <div class="mb-6">
              <div class="text-4xl font-bold text-yellow-400 dm-sans">{{ score }}</div>
              <div class="text-sm text-gray-300 dm-sans">Points Earned</div>
              <div class="text-xs text-gray-400 dm-sans mt-1">Use this currency to unlock hints in difficult levels!</div>
            </div>
            <div class="p-6 bg-red-600/20 rounded-xl border border-red-500/30">
              <p class="text-sm italic text-gray-300 dm-sans">{{ getPerformanceMessage() }}</p>
            </div>
          </div>

          <button 
            @click="$emit('level-complete', score)"
            class="bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-900/30 dm-sans"
          >
            Continue the Adventure →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  PuzzlePieceIcon,
  TagIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
  StarIcon,
  BoltIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/solid'

const emit = defineEmits<{
  'level-complete': [currencyEarned: number]
  'quiz-trigger': [moves: number, time: number]
}>()

// Puzzle state
const puzzleTiles = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]) // 0 represents empty space
const moves = ref(0)
const startTime = ref<number | null>(null)
const currentTime = ref(0)
const puzzleCompleted = ref(false)
const penaltyMoves = ref(0)
const progressMessage = ref('')
const showQuizTrigger = ref(false)
const timeLimit = ref(240) // 4 minutes in seconds
const timeUp = ref(false)

// Timer
let timerInterval: number | null = null

// Computed properties
const formattedTime = computed(() => {
  const totalSeconds = currentTime.value
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const timeRemaining = computed(() => {
  return Math.max(0, timeLimit.value - currentTime.value)
})

const formattedTimeRemaining = computed(() => {
  const totalSeconds = timeRemaining.value
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const score = computed(() => {
  if (moves.value === 0 || !puzzleCompleted.value) return 0
  
  // Time-based scoring system (faster = more points)
  const completionTime = currentTime.value
  const maxTime = timeLimit.value // 4 minutes = 240 seconds
  
  // Base currency points (scaled for meaningful amounts)
  let currencyPoints = 0
  
  // Speed bonus tiers (the faster you solve, the more currency you earn)
  if (completionTime <= 30) {
    // Lightning fast (under 30 seconds) - Maximum currency
    currencyPoints = 1000
  } else if (completionTime <= 60) {
    // Very fast (30-60 seconds) - High currency
    currencyPoints = 800
  } else if (completionTime <= 120) {
    // Fast (1-2 minutes) - Good currency
    currencyPoints = 600
  } else if (completionTime <= 180) {
    // Average (2-3 minutes) - Decent currency
    currencyPoints = 400
  } else if (completionTime <= 240) {
    // Slow but completed (3-4 minutes) - Basic currency
    currencyPoints = 200
  } else {
    // Time's up - Minimal currency
    currencyPoints = 50
  }
  
  // Move efficiency bonus (fewer moves = more currency)
  const moveEfficiency = Math.max(0, 50 - moves.value) // Optimal is around 20-30 moves
  const moveBonus = Math.min(moveEfficiency * 5, 200) // Max 200 bonus points
  
  // Final currency calculation
  const finalCurrency = currencyPoints + moveBonus
  
  return finalCurrency
})

// TODO: Replace with image-based tiles when ready
// const getTileImage = (tileNumber: number) => {
//   if (tileNumber === 0) return null // Empty space
//   // Return the portion of her image that corresponds to this tile position
//   return `/images/her-image-tile-${tileNumber}.jpg`
// }

// TODO: Integrate with quizService.ts and demo-level.json
// The quiz trigger logic is commented out above - ready for integration
// with your existing quiz system when you're ready to implement it

// Check if a tile can be moved (adjacent to empty space)
const canMoveTile = (index: number): boolean => {
  if (puzzleTiles.value[index] === 0) return false // Can't move empty space
  
  const emptyIndex = puzzleTiles.value.indexOf(0)
  const row = Math.floor(index / 3)
  const col = index % 3
  const emptyRow = Math.floor(emptyIndex / 3)
  const emptyCol = emptyIndex % 3
  
  // Check if adjacent (horizontally or vertically)
  const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
                    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  
  return isAdjacent
}

// Move a tile
const moveTile = (index: number) => {
  if (!canMoveTile(index) || puzzleCompleted.value) return
  
  // Start timer on first move
  if (startTime.value === null) {
    startTime.value = Date.now()
    startTimer()
  }
  
  const emptyIndex = puzzleTiles.value.indexOf(0)
  
  // Swap tiles
  const temp = puzzleTiles.value[index]
  puzzleTiles.value[index] = puzzleTiles.value[emptyIndex]
  puzzleTiles.value[emptyIndex] = temp
  
  moves.value++
  
  // Check for quiz trigger (every 3 moves) - COMMENTED OUT FOR NOW
  // if (moves.value % 3 === 0 && !showQuizTrigger.value) {
  //   showQuizTrigger.value = true
  //   emit('quiz-trigger', moves.value, currentTime.value)
  // }
  
  // Check for progress messages
  checkProgressMessages()
  
  // Check if puzzle is solved
  checkPuzzleComplete()
}

// Check if puzzle is complete
const checkPuzzleComplete = () => {
  const isComplete = puzzleTiles.value.every((tile, index) => 
    tile === (index + 1) % 9 // 1-8, then 0 for empty space
  )
  
  if (isComplete) {
    puzzleCompleted.value = true
    stopTimer()
    
    // Store currency in localStorage for use in other levels
    const currencyEarned = score.value
    const currentCurrency = parseInt(localStorage.getItem('puzzleCurrency') || '0')
    const newTotal = currentCurrency + currencyEarned
    localStorage.setItem('puzzleCurrency', newTotal.toString())
    
    // Emit the currency earned for immediate feedback
    emit('level-complete', currencyEarned)
  }
}

// Progress messages based on moves and time
const checkProgressMessages = () => {
  if (moves.value === 10) {
    progressMessage.value = "Hmm, 10 moves already? You're not giving up, are you? 😏"
  } else if (moves.value === 20) {
    progressMessage.value = "20 moves... I'm starting to think you like working for my love! 💕"
  } else if (moves.value === 30) {
    progressMessage.value = "30 moves? Wow, you must really want that reward! 😈"
  } else if (currentTime.value >= 60 && moves.value < 10) {
    progressMessage.value = "Clock's ticking, Harley... but you're being careful! 👀"
  } else if (currentTime.value >= 180) {
    progressMessage.value = "Want me to help? Just kidding. You're on your own! 😂"
  }
  
  // Clear message after 3 seconds
  if (progressMessage.value) {
    setTimeout(() => {
      progressMessage.value = ''
    }, 3000)
  }
}

// Performance message based on currency earned
const getPerformanceMessage = () => {
  const currencyEarned = score.value
  if (currencyEarned >= 1000) {
    return "Mad Fast! Sawa basi puzzle master! Use this wisely in difficult levels!"
  } else if (currencyEarned >= 800) {
    return "Naona Uko Chonjo! High points earned - you're ready for the toughest challenges!"
  } else if (currencyEarned >= 600) {
    return "Eish! No Joking! Good points earned - you've got solid puzzle skills!"
  } else if (currencyEarned >= 400) {
    return "Si mbaya. Si mbaya! Decent points earned - keep practicing for better rewards!"
  } else if (currencyEarned >= 200) {
    return "Umetry! Basic points earned - speed up for bigger rewards next time!"
  } else {
    return "Itabidi Umetrain Jamani! Low points earned - wahenga husema practice makes perfect?"
  }
}

// Timer functions
const startTimer = () => {
  timerInterval = setInterval(() => {
    if (startTime.value) {
      currentTime.value = Math.floor((Date.now() - startTime.value) / 1000)
      
      // Check if time is up
      if (timeRemaining.value <= 0 && !timeUp.value) {
        timeUp.value = true
        stopTimer()
        // You can add time-up logic here
        console.log('Time\'s up!')
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Shuffle puzzle on mount
const shufflePuzzle = () => {
  // Fisher-Yates shuffle
  for (let i = puzzleTiles.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puzzleTiles.value[i], puzzleTiles.value[j]] = [puzzleTiles.value[j], puzzleTiles.value[i]]
  }
  
  // Ensure puzzle is solvable (even number of inversions)
  let inversions = 0
  for (let i = 0; i < puzzleTiles.value.length; i++) {
    for (let j = i + 1; j < puzzleTiles.value.length; j++) {
      if (puzzleTiles.value[i] > puzzleTiles.value[j] && puzzleTiles.value[i] !== 0 && puzzleTiles.value[j] !== 0) {
        inversions++
      }
    }
  }
  
  // If odd number of inversions, make it even by swapping first two non-zero elements
  if (inversions % 2 === 1) {
    const firstNonZero = puzzleTiles.value.findIndex(tile => tile !== 0)
    const secondNonZero = puzzleTiles.value.findIndex((tile, index) => tile !== 0 && index > firstNonZero)
    if (firstNonZero !== -1 && secondNonZero !== -1) {
      [puzzleTiles.value[firstNonZero], puzzleTiles.value[secondNonZero]] = 
      [puzzleTiles.value[secondNonZero], puzzleTiles.value[firstNonZero]]
    }
  }
}

// Quiz integration methods (to be called by parent)
const applyQuizPenalty = (penalty: number) => {
  penaltyMoves.value = penalty
  moves.value += penalty
  showQuizTrigger.value = false
  
  // Clear penalty display after 3 seconds
  setTimeout(() => {
    penaltyMoves.value = 0
  }, 3000)
}

const clearQuizTrigger = () => {
  showQuizTrigger.value = false
}

// Expose methods for parent component
defineExpose({
  applyQuizPenalty,
  clearQuizTrigger
})

onMounted(() => {
  shufflePuzzle()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.puzzle-level {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.puzzle-icons {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.puzzle-container {
  max-width: 300px;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 12px;
}

.puzzle-tile {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.puzzle-tile.empty {
  background: transparent;
  cursor: default;
}

.puzzle-tile.clickable {
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  border-color: rgba(220, 38, 38, 0.6);
}

.puzzle-tile.clickable:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
  border-color: rgba(220, 38, 38, 0.8);
}

.puzzle-tile.correct {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border-color: rgba(34, 197, 94, 0.6);
  animation: correctPulse 0.6s ease-in-out;
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.tile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.tile-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-family: "DM Sans", sans-serif;
}

/* Responsive design */
@media (max-width: 640px) {
  .puzzle-container {
    max-width: 250px;
  }
  
  .tile-number {
    font-size: 1.2rem;
  }
}
</style>
