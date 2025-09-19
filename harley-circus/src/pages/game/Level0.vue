<template>
  <GameLayout>
    <div class="text-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-xl text-gray-300 dm-sans">Loading the circus...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="levelData" class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          {{ levelData.title }}
        </h1>
        <p class="text-lg text-gray-300 dm-sans mb-6">{{ levelData.description }}</p>
        <div class="flex justify-center gap-6 text-sm">
          <div class="flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-full border border-red-600/30">
            <ClockIcon class="h-4 w-4 text-red-400" />
            <span class="text-red-200">{{ levelData.estimatedTime }}</span>
          </div>
          <div class="flex items-center gap-2 bg-gray-600/20 px-4 py-2 rounded-full border border-gray-600/30">
            <ChartBarIcon class="h-4 w-4 text-gray-400" />
            <span class="text-gray-200">{{ levelData.difficulty }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between text-sm mb-3 dm-sans">
          <span class="text-gray-300">Progress: {{ currentQuestionIndex + 1 }} / {{ levelData.questions.length }}</span>
          <span class="text-gray-300">Question {{ currentQuestionIndex + 1 }}</span>
        </div>
        <div class="w-full bg-gray-700/30 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${((currentQuestionIndex + 1) / levelData.questions.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Timer -->
      <div v-if="timeLeft > 0" class="text-center mb-8">
        <div class="inline-flex items-center gap-3 bg-red-600/20 border border-red-600/30 px-6 py-3 rounded-full">
          <ClockIcon class="h-5 w-5 text-red-400" />
          <span class="text-xl font-bold text-red-200 dm-sans">{{ formatTime(timeLeft) }}</span>
        </div>
      </div>

      <!-- Question Display -->
      <div v-if="!quizCompleted && !bonusRound && currentQuestion" class="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-600/20">
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-6 dm-sans text-center">{{ currentQuestion.question }}</h2>
        </div>

        <!-- Options -->
        <div class="space-y-4">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(index)"
            :disabled="selectedAnswer !== null"
            :class="[
              'w-full p-6 text-left rounded-xl border-2 transition-all duration-200 dm-sans',
              selectedAnswer === null 
                ? 'border-gray-600 hover:border-red-400 hover:bg-red-600/10 bg-gray-800/30' 
                : selectedAnswer === index
                  ? (index === currentQuestion.correct_answer ? 'border-green-500 bg-green-600/20' : 'border-red-500 bg-red-600/20')
                  : index === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-600/20'
                    : 'border-gray-600 opacity-50'
            ]"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                   :class="selectedAnswer === null 
                     ? 'border-gray-500 text-gray-400' 
                     : selectedAnswer === index
                       ? (index === currentQuestion.correct_answer ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400')
                       : index === currentQuestion.correct_answer
                         ? 'border-green-500 text-green-400'
                         : 'border-gray-500 text-gray-400'">
                {{ String.fromCharCode(65 + index) }}
              </div>
              <span class="text-gray-200">{{ option }}</span>
            </div>
          </button>
        </div>

        <!-- Answer Explanation -->
        <div v-if="selectedAnswer !== null" class="mt-8 p-6 rounded-xl" :class="selectedAnswer === currentQuestion.correct_answer ? 'bg-green-600/20 border border-green-500/30' : 'bg-red-600/20 border border-red-500/30'">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <CheckCircleIcon v-if="selectedAnswer === currentQuestion.correct_answer" class="h-6 w-6 text-green-400" />
              <XCircleIcon v-else class="h-6 w-6 text-red-400" />
            </div>
            <div class="flex-1">
              <p class="font-semibold mb-3 dm-sans" :class="selectedAnswer === currentQuestion.correct_answer ? 'text-green-300' : 'text-red-300'">
                {{ selectedAnswer === currentQuestion.correct_answer ? 'Correct!' : 'Not quite right!' }}
              </p>
              <p class="text-gray-300 dm-sans leading-relaxed">{{ currentQuestion.explanation }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button 
              @click="nextQuestion"
              class="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
            >
              <span>{{ currentQuestionIndex < levelData.questions.length - 1 ? 'Next Question' : 'Start Bonus Round' }}</span>
              <ArrowRightIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Bonus Round -->
      <div v-if="bonusRound && !quizCompleted" class="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-600/20">
        <div class="text-center mb-8">
          <GiftIcon class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 class="text-3xl font-bold mb-4 dm-sans text-yellow-400">{{ levelData.bonus_round.title }}</h2>
          <p class="text-gray-300 dm-sans">{{ levelData.bonus_round.description }}</p>
        </div>
        
        <div class="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-600/30">
          <h3 class="text-xl font-bold mb-4 dm-sans flex items-center gap-2">
            <DocumentTextIcon class="h-5 w-5 text-gray-400" />
            Your Mission
          </h3>
          <p class="text-gray-300 dm-sans leading-relaxed">{{ levelData.bonus_round.task }}</p>
        </div>

        <div class="space-y-6">
          <div>
            <input
              v-model="bonusAnswer"
              type="text"
              placeholder="Enter your answer here..."
              class="w-full p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none dm-sans"
            />
          </div>
          <button
            @click="submitBonusAnswer"
            :disabled="!bonusAnswer.trim()"
            class="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-bold transition-colors dm-sans flex items-center justify-center gap-2"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
            Submit Bonus Answer
          </button>
        </div>
      </div>

      <!-- Completion Screen -->
      <div v-if="quizCompleted" class="text-center bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-600/20">
        <div class="mb-8">
          <TrophyIcon class="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 class="text-3xl font-bold mb-4 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            Quiz Complete!
          </h2>
          <p class="text-xl text-gray-300 mb-6 dm-sans">{{ levelData.completion_message }}</p>
        </div>
        
        <div class="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-600/30">
          <h3 class="text-2xl font-bold mb-4 dm-sans">Final Results</h3>
          <div class="grid grid-cols-2 gap-6 text-center">
            <div>
              <p class="text-3xl font-bold text-green-400 dm-sans">{{ correctAnswers }}</p>
              <p class="text-gray-400 dm-sans">Correct Answers</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-blue-400 dm-sans">{{ Math.round((correctAnswers / levelData.questions.length) * 100) }}%</p>
              <p class="text-gray-400 dm-sans">Accuracy</p>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button 
            @click="restartQuiz"
            class="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
          >
            <ArrowPathIcon class="h-4 w-4" />
            Play Again
          </button>
          <button 
            @click="goToNextLevel"
            class="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
          >
            <ArrowRightIcon class="h-4 w-4" />
            Next Level
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <ExclamationTriangleIcon class="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-4 text-red-400 dm-sans">Oops! Something went wrong</h2>
        <p class="text-gray-300 mb-6 dm-sans">Failed to load the quiz level. Please try again.</p>
        <button 
          @click="router.push('/game')"
          class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2 mx-auto"
        >
          <ArrowLeftIcon class="h-4 w-4" />
          Back to Game
        </button>
      </div>
    </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { quizService, type QuizLevel } from '@/services/quizService'
import GameLayout from '@/layouts/GameLayout.vue'
import {
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  GiftIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  TrophyIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/solid'

// Component name for Vue linting
defineOptions({
  name: 'QuizLevel0'
})

const router = useRouter()

// Reactive data
const levelData = ref<QuizLevel | null>(null)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const correctAnswers = ref(0)
const timeLeft = ref(0)
const quizCompleted = ref(false)
const bonusRound = ref(false)
const bonusAnswer = ref('')
const timer = ref<number | null>(null)
const loading = ref(true)

// Computed
const currentQuestion = computed(() => levelData.value?.questions[currentQuestionIndex.value])

// Methods
const startTimer = (seconds: number) => {
  timeLeft.value = seconds
  timer.value = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer.value!)
      timeUp()
    }
  }, 1000)
}

const timeUp = () => {
  selectedAnswer.value = -1 // Mark as time up
  // Auto-advance after showing the correct answer
  setTimeout(() => {
    nextQuestion()
  }, 3000)
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const selectAnswer = (answerIndex: number) => {
  if (selectedAnswer.value !== null || !currentQuestion.value) return
  
  selectedAnswer.value = answerIndex
  clearInterval(timer.value!)
  
  if (answerIndex === currentQuestion.value.correct_answer) {
    correctAnswers.value++
  }
}

const nextQuestion = () => {
  if (!levelData.value) return
  
  if (currentQuestionIndex.value < levelData.value.questions.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    if (currentQuestion.value) {
      startTimer(currentQuestion.value.timeLimit)
    }
  } else {
    // Start bonus round
    bonusRound.value = true
    startTimer(levelData.value.bonus_round.timeLimit)
  }
}

const submitBonusAnswer = () => {
  if (!levelData.value) return
  
  clearInterval(timer.value!)
  quizCompleted.value = true
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  correctAnswers.value = 0
  quizCompleted.value = false
  bonusRound.value = false
  bonusAnswer.value = ''
  if (currentQuestion.value) {
    startTimer(currentQuestion.value.timeLimit)
  }
}

const goToNextLevel = () => {
  router.push('/game/level1')
}

// Lifecycle
onMounted(async () => {
  try {
    levelData.value = await quizService.loadLevel(0)
    loading.value = false
    if (currentQuestion.value) {
      startTimer(currentQuestion.value.timeLimit)
    }
  } catch (error) {
    console.error('Failed to load level 0:', error)
    loading.value = false
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>