<template>
  <GameLayout>
    <div class="vibe-check-container">
      <div class="content">
      
      <!-- Question Section -->
      <Transition name="question-fade" mode="out-in">
        <div class="question-section" v-if="currentQuestion" :key="currentQuestionIndex">
        <div class="question-card">
          <h1 class="question-title">{{ currentQuestion.question }}</h1>
          
          <div class="options-container">
            <button 
              v-for="option in currentQuestion.options" 
              :key="option.id"
              @click="selectOption(option)"
              :disabled="selectedAnswer !== null"
              :class="[
                'option-btn',
                selectedAnswer === null 
                  ? 'option-btn-default' 
                  : selectedAnswer === option.id
                    ? 'option-btn-selected'
                    : 'option-btn-disabled'
              ]"
            >
              <div class="option-content">
                <div class="option-letter">{{ String.fromCharCode(65 + option.id) }}</div>
                <span class="option-text">{{ option.text }}</span>
              </div>
            </button>
      </div>
      
          <!-- Answer Explanation -->
          <div v-if="selectedAnswer !== null" class="explanation-section">
            <div class="explanation-card">
              <div class="explanation-header">
                <CheckCircleIcon class="explanation-icon" />
                <h3 class="explanation-title">Your Choice</h3>
              </div>
              <p class="explanation-text">{{ selectedOption?.explanation }}</p>
              <div class="explanation-actions">
                <button 
                  @click="nextQuestion"
                  class="next-btn"
                >
                  <span class="btn-text">
                    {{ currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Go To Memes' }}
                  </span>
                  <ArrowRightIcon class="btn-icon" />
                </button>
        </div>
        </div>
        </div>
        </div>
        </div>
      </Transition>
      
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
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/solid'

// Define component name for linting
defineOptions({
  name: 'MemeMazeVibeCheck'
})

const router = useRouter()
const memeMazeStore = useMemeMazeSupabaseStore()
const { markVibeCheckCompleted, initializeSession } = memeMazeStore

// Vibe check data from meta.json
const vibeQuestions = [
  {
    id: "V00",
    type: "vibe_check",
    question: "Hey Puddin'. Joker has his jokes shortly aside. What is your vibe?",
    options: [
      {
        id: 0,
        text: "Excited about this new level",
        explanation: "Chaos begins best when you're eager... Your vibes charged!"
      },
      {
        id: 1,
        text: "That song you shared last night. Somewhere. Still got me sniffling",
        explanation: "Music scars cut deeper than jokes... you unlocked a softer Joker-side. That his fav song btw."
      }
    ],
    timeLimit: 10
  },
  {
    id: "V01",
    type: "are_you_ready",
    question: "The circus lights flicker... Joker taunts again. How do you reply?",
    options: [
      {
        id: 0,
        text: "Bring on the madness",
        explanation: "The chaos crown fits, and you wear it proudly — onward to the memes!"
      },
      {
        id: 1,
        text: "Hold on, let me breathe first",
        explanation: "Patience is power, Harley... Joker smirks but lets you take a pause."
      }
    ],
    timeLimit: 10
  },
  {
    id: "V02",
    type: "let_me_start",
    question: "Final vibe-check before you enter the Meme Maze... what's your move?",
    options: [
      {
        id: 0,
        text: "Light me my candles, I'm ready",
        explanation: "Perfect. Let's burn bright. Remember, you said he is a bright light since you met him..."
      },
      {
        id: 1,
        text: "Can't we just skip to the punchline?",
        explanation: "Skipping is for quitters... Joker has 'drugged' you into this Meme Maze anyway."
      }
    ],
    timeLimit: 10
  }
]

const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const selectedOptions = ref<Record<string, number>>({})
const isTransitioning = ref(false)

const currentQuestion = computed(() => vibeQuestions[currentQuestionIndex.value])
const totalQuestions = computed(() => vibeQuestions.length)

const selectedOption = computed(() => {
  if (selectedAnswer.value === null) return null
  return currentQuestion.value?.options.find(opt => opt.id === selectedAnswer.value)
})

function selectOption(option: { id: number; text: string; explanation: string }) {
  if (selectedAnswer.value !== null) return
  
  selectedAnswer.value = option.id
  selectedOptions.value[currentQuestion.value.id] = option.id
}

function nextQuestion() {
  if (isTransitioning.value) return
  
  isTransitioning.value = true
  
  // Start transition
  setTimeout(() => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
      selectedAnswer.value = null
    } else {
      // Go directly to memes after last question
      proceedToMemes()
    }
    isTransitioning.value = false
  }, 500) // Half of the transition duration
}

function redoVibeCheck() {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  selectedOptions.value = {}
  isTransitioning.value = false
}

async function proceedToMemes() {
  // Add special transition effect before proceeding
  isTransitioning.value = true
  
  // Mark vibe check as completed with Supabase tracking
  await markVibeCheckCompleted()
  
  // Add a brief delay for the transition effect
  setTimeout(() => {
    router.push('/levels/meme-maze/memes')
  }, 300)
}

onMounted(async () => {
  // Initialize Supabase session
  try {
    await initializeSession()
    console.log('Supabase session initialized for vibe check')
  } catch (error) {
    console.error('Failed to initialize Supabase session:', error)
  }
  
  // Reset vibe check when component mounts
  redoVibeCheck()
})
</script>

<style scoped>
.vibe-check-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--secondary-purple) 50%, var(--primary-purple) 100%);
  color: var(--text-white);
  font-family: "DM Sans", sans-serif;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  max-width: 600px;
  width: 100%;
  text-align: center;
}


.question-section {
  margin-bottom: 2rem;
}

.question-card {
  background: var(--border-purple);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.5s ease;
}

.question-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: var(--text-white);
  line-height: 1.3;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-btn {
  border-radius: 15px;
  padding: 1.5rem;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid;
  text-align: left;
}

.option-btn-default {
  background: var(--border-purple);
  border-color: var(--border-green);
}

.option-btn-default:hover {
  border-color: var(--accent-green);
  background: rgba(57, 255, 20, 0.1);
  transform: translateY(-2px);
}

.option-btn-selected {
  border-color: var(--accent-green);
  background: rgba(57, 255, 20, 0.2);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

.option-btn-disabled {
  border-color: var(--border-purple);
  background: rgba(106, 13, 173, 0.1);
  opacity: 0.6;
  cursor: not-allowed;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-letter {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  flex-shrink: 0;
}

.option-btn-default .option-letter {
  border-color: var(--primary-purple);
  color: var(--primary-purple);
}

.option-btn-selected .option-letter {
  border-color: var(--accent-green);
  color: var(--accent-green);
}

.option-btn-disabled .option-letter {
  border-color: var(--border-purple);
  color: var(--border-purple);
}

.option-text {
  line-height: 1.4;
}

.explanation-section {
  margin-top: 2rem;
  animation: fadeIn 0.5s ease-in-out;
}

.explanation-card {
  background: rgba(57, 255, 20, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.explanation-icon {
  width: 24px;
  height: 24px;
  color: var(--accent-green);
}

.explanation-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--accent-green);
}

.explanation-text {
  font-size: 1rem;
  color: var(--text-white);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.explanation-actions {
  display: flex;
  justify-content: flex-end;
}

.next-btn {
  background: linear-gradient(45deg, var(--accent-green), var(--primary-purple));
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.next-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(57, 255, 20, 0.4);
}


.btn-text {
  margin-right: 0.5rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Question transition effects */
.question-fade-enter-active,
.question-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.question-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.question-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.question-fade-enter-to,
.question-fade-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

/* Responsive design */
@media (max-width: 768px) {
  .vibe-check-container {
    padding: 1rem;
  }
  
  .question-title {
    font-size: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>