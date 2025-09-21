<template>
  <GameLayout>
    <div class="puzzle-demo">
      <!-- Header -->
      <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-5xl font-extrabold text-white mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center gap-3">
            <!-- <PuzzlePieceIcon class="h-12 w-12 text-red-400" /> -->
            Puzzle Challenge Demo
          </h1>
          <p class="text-xl text-gray-200 dm-sans">Test the 3x3 sliding puzzle with move & time tracking</p>
          
          <!-- Currency Display -->
          <div class="mt-4 inline-flex items-center gap-2 bg-yellow-600/20 border border-yellow-600/30 px-4 py-2 rounded-full">
            <span class="text-yellow-200 dm-sans">Total Points: {{ totalCurrency }}</span>
          </div>
        </div>

        <!-- Puzzle Component -->
        <div class="max-w-4xl mx-auto">
          <PuzzleLevel 
            @level-complete="handleLevelComplete"
            ref="puzzleRef"
          />
        </div>

        <!-- Quiz Modal (Demo) - COMMENTED OUT FOR NOW -->
        <!-- 
        <div v-if="showQuizModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div class="bg-black/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 border border-red-600/20">
            <h3 class="text-2xl font-bold mb-4 dm-sans text-white flex items-center gap-2">
              <QuestionMarkCircleIcon class="h-6 w-6 text-red-400" />
              Quiz Time!
            </h3>
            <p class="text-gray-300 mb-6 dm-sans">Answer this question to continue (or face penalties!):</p>
            
            <div class="mb-6">
              <p class="font-semibold text-lg text-white dm-sans mb-4">What's Harley Quinn's signature weapon?</p>
              <div class="space-y-3">
                <button 
                  v-for="(option, index) in quizOptions" 
                  :key="index"
                  @click="selectAnswer(index)"
                  class="w-full p-4 text-left rounded-xl border-2 transition-all dm-sans"
                  :class="selectedAnswer === index 
                    ? 'border-red-500 bg-red-600/20 text-white' 
                    : 'border-gray-600 hover:border-red-400 bg-gray-800/30 text-gray-200 hover:bg-gray-700/30'"
                >
                  {{ option }}
                </button>
              </div>
            </div>

            <div class="flex gap-3">
              <button 
                @click="submitAnswer"
                :disabled="selectedAnswer === null"
                class="flex-1 bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all dm-sans"
              >
                Submit Answer
              </button>
              <button 
                @click="skipQuiz"
                class="px-4 py-3 border border-gray-600 rounded-lg hover:bg-gray-700/30 text-gray-200 transition-all dm-sans"
              >
                Skip (Penalty)
              </button>
            </div>
          </div>
        </div>
        -->

        <!-- Instructions -->
        <div class="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl p-8 text-white border border-red-600/20">
          <h3 class="text-2xl font-bold mb-6 dm-sans text-center flex items-center justify-center gap-2">
            <PlayIcon class="h-6 w-6 text-red-400" />
            How to Play
          </h3>
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h4 class="text-lg font-bold mb-4 dm-sans text-red-400">Puzzle Rules:</h4>
              <ul class="space-y-2 text-sm dm-sans text-gray-300">
                <li>• Click tiles adjacent to the empty space to move them</li>
                <li>• Arrange tiles 1-8 in order with empty space at bottom-right</li>
                <li>• Timer starts on your first move</li>
                <li>• Every move counts toward your score</li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-bold mb-4 dm-sans text-red-400">Currency System:</h4>
              <ul class="space-y-2 text-sm dm-sans text-gray-300">
                <li>• ⚡ Under 30s: 1000 currency (Lightning Fast!)</li>
                <li>• 🔥 30-60s: 800 currency (Incredible Speed!)</li>
                <li>• 💪 1-2min: 600 currency (Excellent Work!)</li>
                <li>• 👍 2-3min: 400 currency (Nice Job!)</li>
                <li>• 👌 3-4min: 200 currency (Well Done!)</li>
                <li>• 💪 Time's up: 50 currency (Keep Trying!)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Demo Controls -->
        <div class="mt-6 text-center">
          <button 
            @click="resetPuzzle"
            class="bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-900/30 dm-sans mr-4"
          >
            <ArrowPathIcon class="h-4 w-4 mr-2" />
            Reset Puzzle
          </button>
          <!-- Quiz trigger button commented out for now -->
          <!-- 
          <button 
            @click="triggerQuiz"
            class="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-900/30 dm-sans"
          >
            <QuestionMarkCircleIcon class="h-4 w-4 mr-2" />
            Trigger Quiz
          </button>
          -->
        </div>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PuzzleLevel from '../../components/PuzzleLevel.vue'
import GameLayout from '../../layouts/GameLayout.vue'
import { PlayIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'

const puzzleRef = ref<InstanceType<typeof PuzzleLevel> | null>(null)
const totalCurrency = ref(parseInt(localStorage.getItem('puzzleCurrency') || '0'))

// Quiz-related variables commented out for now
// const showQuizModal = ref(false)
// const selectedAnswer = ref<number | null>(null)
// const currentQuizData = ref<{ moves: number, time: number } | null>(null)

// const quizOptions = [
//   "Baseball Bat",
//   "Hammer",
//   "Mallet", 
//   "Crowbar"
// ]

const handleLevelComplete = (currencyEarned: number) => {
  console.log(`Puzzle completed! Currency earned: ${currencyEarned}`)
  
  // Update the currency display
  totalCurrency.value = parseInt(localStorage.getItem('puzzleCurrency') || '0')
  
  // Show currency earned notification
  alert(`🎉 Puzzle Complete!\n\nCurrency Earned: ${currencyEarned}\nTotal Currency: ${totalCurrency.value}\n\nUse this currency to unlock hints in difficult levels!`)
  
  // You can add navigation or other completion logic here
}

// Quiz functions commented out for now
// const handleQuizTrigger = (moves: number, time: number) => {
//   console.log(`Quiz triggered at ${moves} moves, ${time} seconds`)
//   currentQuizData.value = { moves, time }
//   showQuizModal.value = true
//   selectedAnswer.value = null
// }

// const selectAnswer = (index: number) => {
//   selectedAnswer.value = index
// }

// const submitAnswer = () => {
//   if (selectedAnswer.value === null) return
//   
//   const isCorrect = selectedAnswer.value === 0 // "Baseball Bat" is correct
//   
//   if (isCorrect) {
//     console.log('Correct answer!')
//     puzzleRef.value?.clearQuizTrigger()
//   } else {
//     console.log('Wrong answer! Applying penalty...')
//     puzzleRef.value?.applyQuizPenalty(5) // 5 move penalty
//   }
//   
//   showQuizModal.value = false
//   selectedAnswer.value = null
//   currentQuizData.value = null
// }

// const skipQuiz = () => {
//   console.log('Quiz skipped! Applying penalty...')
//   puzzleRef.value?.applyQuizPenalty(5) // 5 move penalty
//   showQuizModal.value = false
//   selectedAnswer.value = null
//   currentQuizData.value = null
// }

const resetPuzzle = () => {
  // Reset the puzzle by reloading the component
  window.location.reload()
}

// const triggerQuiz = () => {
//   // Manually trigger quiz for demo purposes
//   handleQuizTrigger(6, 30) // Demo values
// }
</script>

<style scoped>
/* GameLayout already provides the background styling */
</style>
