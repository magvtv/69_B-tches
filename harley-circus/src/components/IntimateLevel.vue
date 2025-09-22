<template>
  <div class="intimate-level">
    <div class="bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-lg p-8 text-white relative overflow-hidden">
      <!-- Romantic background elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="romantic-icons absolute inset-0">
          <div class="absolute top-4 left-4 text-4xl animate-pulse">💕</div>
          <div class="absolute top-4 right-4 text-4xl animate-bounce">🌹</div>
          <div class="absolute bottom-4 left-4 text-4xl animate-pulse" style="animation-delay: 1s;">🕯️</div>
          <div class="absolute bottom-4 right-4 text-4xl animate-bounce" style="animation-delay: 0.5s;">💋</div>
          <div class="absolute top-1/2 left-1/4 text-4xl animate-pulse" style="animation-delay: 1.5s;">✨</div>
          <div class="absolute top-1/2 right-1/4 text-4xl animate-bounce" style="animation-delay: 2s;">🦋</div>
        </div>
      </div>

      <div class="relative z-10">
        <h2 class="text-4xl font-bold mb-6 text-center">💕 Intimate Moments Challenge 💕</h2>
        
        <div v-if="!challengeCompleted" class="text-center">
          <p class="text-xl mb-6">Harley, you love the simple things that make you feel special...</p>
          
          <!-- Memory Lane Challenge -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 class="text-2xl font-semibold mb-4">💭 Memory Lane Challenge</h3>
            <p class="text-sm mb-4 text-gray-200">Complete the intimate moments that make you feel cherished</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div 
                v-for="(moment, index) in intimateMoments" 
                :key="index"
                @click="selectMoment(moment)"
                class="p-4 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-all duration-300 border-2"
                :class="{ 
                  'border-pink-400 bg-pink-500/20': selectedMoments.includes(moment.id),
                  'border-transparent': !selectedMoments.includes(moment.id)
                }"
              >
                <div class="text-3xl mb-2">{{ moment.emoji }}</div>
                <h4 class="font-semibold mb-2">{{ moment.title }}</h4>
                <p class="text-sm text-gray-200">{{ moment.description }}</p>
              </div>
            </div>

            <div v-if="selectedMoments.length > 0" class="mb-4">
              <p class="text-lg">Selected moments: {{ selectedMoments.length }}/3</p>
            </div>
          </div>

          <!-- Love Language Quiz -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 class="text-2xl font-semibold mb-4">💝 Love Language Discovery</h3>
            <p class="text-sm mb-4 text-gray-200">What makes you feel most loved?</p>
            
            <div v-if="loveAnswers.filter(answer => answer !== undefined).length > 0" class="mb-4">
              <p class="text-lg">Love language progress: {{ loveAnswers.filter(answer => answer !== undefined).length }}/3</p>
            </div>
            
            <div class="space-y-4">
              <div v-for="(question, index) in loveQuestions" :key="index" class="p-4 bg-white/10 rounded-lg">
                <h4 class="font-semibold mb-2">{{ question.question }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button 
                    v-for="(option, optIndex) in question.options" 
                    :key="optIndex"
                    @click="selectLoveAnswer(index, optIndex)"
                    class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all duration-300 border-2"
                    :class="{ 
                      'bg-pink-500/30 border-pink-400': loveAnswers[index] === optIndex,
                      'border-transparent': loveAnswers[index] !== optIndex
                    }"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Journal Entry -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6">
            <h3 class="text-2xl font-semibold mb-4">📖 Personal Journal Entry</h3>
            <p class="text-sm mb-4 text-gray-200">A glimpse into my thoughts about you...</p>
            
            <div class="text-left bg-white/5 rounded-lg p-6 mb-4">
              <div class="text-sm text-gray-300 mb-2">*Found in a private journal*</div>
              <div class="space-y-3 text-sm leading-relaxed">
                <p>"Harley... there's something about the way you crave the simple things that makes me want to give you everything. The way your eyes light up at a perfect sunset, how you get excited about trying a new restaurant, the way you seek out adventures that make your heart race..."</p>
                
                <p>"I think about those intimate moments we could share - the kind that make you feel truly special. Like massaging your entire body with warm olive oil, taking my time to make every inch of you feel cherished. Or those playful moments with whipped cream and Nutella, turning something sweet into something sensual..."</p>
                
                <p>"And those ice cream deep kisses... the kind where time stops and it's just us, lost in each other. You deserve to feel wanted, desired, and completely adored. Not just in the big moments, but in all the little ways that make you feel like the most important person in my world."</p>
                
                <p>"You're not just someone I'm attracted to - you're someone I want to explore with, adventure with, and create those perfect intimate moments with. The kind that make you feel like you're exactly where you belong."</p>
              </div>
              <div class="text-xs text-gray-400 mt-4 italic">- A private thought, now shared</div>
            </div>

            <button 
              @click="completeIntimateChallenge"
              class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
            >
              I Feel Special 💕
            </button>
          </div>
        </div>

        <!-- Success state -->
        <div v-else class="text-center">
          <div class="text-6xl mb-4">💕</div>
          <h3 class="text-3xl font-bold mb-4">You're Truly Special, Harley 💕</h3>
          <p class="text-xl mb-6">You've unlocked the most intimate reward...</p>
          
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h4 class="text-2xl font-semibold mb-4">💕 Your Intimate Reward 💕</h4>
            <div class="text-lg space-y-2">
              <p>✨ A full body massage with warm olive oil</p>
              <p>✨ Playful moments with whipped cream and Nutella</p>
              <p>✨ Those deep, lingering ice cream kisses</p>
              <p>✨ A night where you feel completely cherished</p>
            </div>
            <div class="mt-4 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
              <p class="text-sm italic">"You deserve to feel like the most important person in my world, in all the ways that matter most to you."</p>
            </div>
          </div>

          <button 
            @click="$emit('level-complete')"
            class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Continue to Final Reward →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trackingService } from '../services/trackingService'

defineEmits<{
  'level-complete': []
}>()

// Intimate moments selection
const intimateMoments = ref([
  {
    id: 1,
    title: "Massage with Olive Oil",
    emoji: "🫒",
    description: "Full body massage with warm olive oil"
  },
  {
    id: 2,
    title: "Whipped Cream & Nutella",
    emoji: "🍯",
    description: "Playful moments with sweet treats"
  },
  {
    id: 3,
    title: "Ice Cream Deep Kisses",
    emoji: "🍦",
    description: "Lingering kisses that make time stop"
  }
])

const selectedMoments = ref<number[]>([])

// Love language questions
const loveQuestions = ref([
  {
    question: "What makes you feel most loved?",
    options: ["Physical touch and closeness", "Quality time together"]
  },
  {
    question: "Your ideal intimate moment would be:",
    options: ["Something spontaneous and playful", "Something planned and special"]
  },
  {
    question: "You feel most special when:",
    options: ["I pay attention to small details", "I make you laugh and feel carefree"]
  }
])

const loveAnswers = ref<number[]>([])
const challengeCompleted = ref(false)

const selectMoment = (moment: typeof intimateMoments.value[0]) => {
  if (selectedMoments.value.includes(moment.id)) {
    selectedMoments.value = selectedMoments.value.filter(id => id !== moment.id)
  } else if (selectedMoments.value.length < 3) {
    selectedMoments.value.push(moment.id)
  }
  
  // Track intimate moment selection
  trackingService.trackIntimateMoments(selectedMoments.value, intimateMoments.value)
}

const selectLoveAnswer = (questionIndex: number, answerIndex: number) => {
  console.log('Love answer selected:', questionIndex, answerIndex)
  // Create a new array to ensure reactivity
  const newAnswers = [...loveAnswers.value]
  newAnswers[questionIndex] = answerIndex
  loveAnswers.value = newAnswers
  console.log('Updated love answers:', loveAnswers.value)
  
  // Track the love language response
  const question = loveQuestions.value[questionIndex]
  const answer = question.options[answerIndex]
  trackingService.trackLoveLanguage(questionIndex, answerIndex, question.question, answer)
}

const completeIntimateChallenge = () => {
  if (selectedMoments.value.length === 3 && loveAnswers.value.length === 3) {
    challengeCompleted.value = true
    
    // Track level completion
    trackingService.trackLevelProgress('intimateLevel', {
      completed: true,
      selectedMoments: selectedMoments.value,
      loveAnswers: loveAnswers.value,
      completionTime: new Date().toISOString()
    })
    
    // Generate insights
    const insights = trackingService.generateInsights()
    trackingService.trackPersonalityInsight('intimate_preferences', insights)
    
  } else {
    alert('Please complete all the challenges first!')
  }
}

// Track when component mounts
onMounted(() => {
  trackingService.trackEvent('intimate_level_entered', {
    timestamp: new Date().toISOString()
  }, 'intimateLevel')
})
</script>

<style scoped>
.intimate-level {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.romantic-icons {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
</style>
