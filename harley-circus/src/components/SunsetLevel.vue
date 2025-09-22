<template>
  <div class="sunset-level">
    <div class="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-lg p-8 text-white relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="sun absolute top-4 right-8 w-16 h-16 bg-yellow-300 rounded-full animate-pulse"></div>
        <div class="stars absolute inset-0">
          <div v-for="i in 20" :key="i" 
               class="star absolute w-1 h-1 bg-white rounded-full animate-twinkle"
               :style="{ 
                 left: Math.random() * 100 + '%', 
                 top: Math.random() * 100 + '%',
                 animationDelay: Math.random() * 3 + 's'
               }">
          </div>
        </div>
      </div>

      <div class="relative z-10">
        <h2 class="text-4xl font-bold mb-6 text-center">🌅 Sunset & Stargazing Challenge 🌟</h2>
        
        <div v-if="!puzzleSolved" class="text-center">
          <p class="text-xl mb-6">Harley, you love sunsets and stargazing... but can you solve this?</p>
          
          <!-- Puzzle: Arrange the sunset colors in the right order -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 class="text-2xl font-semibold mb-4">Arrange the sunset colors in the correct order:</h3>
            <p class="text-sm mb-4 text-gray-200">Drag and drop to reorder the colors</p>
            
            <div class="flex flex-wrap justify-center gap-3 mb-6">
              <div 
                v-for="(color, index) in shuffledColors" 
                :key="color.name"
                class="color-item cursor-move p-3 rounded-lg text-center min-w-[100px] transition-all duration-300 hover:scale-105"
                :style="{ backgroundColor: color.hex }"
                @click="selectColor(color)"
                :class="{ 'ring-4 ring-white': selectedColor?.name === color.name }"
              >
                <div class="text-white font-semibold text-sm">{{ color.name }}</div>
              </div>
            </div>

            <div v-if="selectedColor" class="mb-4">
              <p class="text-lg">Selected: {{ selectedColor.name }}</p>
              <p class="text-sm text-gray-200">Click another color to swap positions</p>
            </div>

            <button 
              @click="checkSolution"
              class="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
            >
              Check My Sunset 🌅
            </button>
          </div>

          <!-- Hint system -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <button 
              @click="showHint = !showHint"
              class="text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              {{ showHint ? 'Hide Hint' : 'Need a hint? 💡' }}
            </button>
            <div v-if="showHint" class="mt-3 text-sm text-gray-200">
              <p>Think about the natural progression of colors as the sun sets...</p>
              <p>What color appears first, and what comes last in the sky?</p>
            </div>
          </div>
        </div>

        <!-- Success state -->
        <div v-else class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-3xl font-bold mb-4">Perfect Sunset! 🌅</h3>
          <p class="text-xl mb-6">You've unlocked your first reward...</p>
          
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h4 class="text-2xl font-semibold mb-4">🌟 Your Reward 🌟</h4>
            <div class="text-lg space-y-2">
              <p>✨ A promise of a real sunset adventure</p>
              <p>✨ Stargazing under the actual night sky</p>
              <p>✨ A cozy blanket and hot chocolate</p>
            </div>
            <div class="mt-4 p-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-lg">
              <p class="text-sm italic">"The best sunsets are the ones we watch together..."</p>
            </div>
          </div>

          <button 
            @click="$emit('level-complete')"
            class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Continue the Adventure →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  'level-complete': []
}>()

// Sunset colors in correct order
const correctOrder = [
  { name: 'Golden', hex: '#FFD700' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Purple', hex: '#8A2BE2' },
  { name: 'Deep Blue', hex: '#191970' }
]

const shuffledColors = ref([...correctOrder])
const selectedColor = ref<typeof correctOrder[0] | null>(null)
const puzzleSolved = ref(false)
const showHint = ref(false)

// Shuffle colors on mount
onMounted(() => {
  shuffleColors()
})

const shuffleColors = () => {
  shuffledColors.value = [...correctOrder].sort(() => Math.random() - 0.5)
}

const selectColor = (color: typeof correctOrder[0]) => {
  if (!selectedColor.value) {
    selectedColor.value = color
  } else {
    // Swap positions
    const index1 = shuffledColors.value.findIndex(c => c.name === selectedColor.value!.name)
    const index2 = shuffledColors.value.findIndex(c => c.name === color.name)
    
    if (index1 !== -1 && index2 !== -1) {
      [shuffledColors.value[index1], shuffledColors.value[index2]] = 
      [shuffledColors.value[index2], shuffledColors.value[index1]]
    }
    
    selectedColor.value = null
  }
}

const checkSolution = () => {
  const isCorrect = shuffledColors.value.every((color, index) => 
    color.name === correctOrder[index].name
  )
  
  if (isCorrect) {
    puzzleSolved.value = true
    // Add some celebration animation
    setTimeout(() => {
      // Could add confetti or other effects here
    }, 500)
  } else {
    // Show error message
    alert('Not quite right! Try again. Remember the natural order of sunset colors.')
  }
}
</script>

<style scoped>
.sunset-level {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.animate-twinkle {
  animation: twinkle 2s infinite;
}

.color-item {
  transition: all 0.3s ease;
}

.color-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
