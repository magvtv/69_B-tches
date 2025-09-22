<template>
  <div class="cooking-level">
    <div class="bg-gradient-to-br from-green-400 via-yellow-500 to-red-500 rounded-lg p-8 text-white relative overflow-hidden">
      <!-- Kitchen background elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="kitchen-icons absolute inset-0">
          <div class="absolute top-4 left-4 text-4xl">🍳</div>
          <div class="absolute top-4 right-4 text-4xl">🥘</div>
          <div class="absolute bottom-4 left-4 text-4xl">🧄</div>
          <div class="absolute bottom-4 right-4 text-4xl">🌶️</div>
          <div class="absolute top-1/2 left-1/4 text-4xl">🥕</div>
          <div class="absolute top-1/2 right-1/4 text-4xl">🍅</div>
        </div>
      </div>

      <div class="relative z-10">
        <h2 class="text-4xl font-bold mb-6 text-center">👩‍🍳 Culinary Adventure Challenge 🍽️</h2>
        
        <div v-if="!challengeCompleted" class="text-center">
          <p class="text-xl mb-6">Harley, you love cooking and trying new food spots... Let's test your taste buds!</p>
          
          <!-- Recipe Puzzle -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 class="text-2xl font-semibold mb-4">🍝 Mystery Recipe Challenge</h3>
            <p class="text-sm mb-4 text-gray-200">Complete the recipe by selecting the right ingredients</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Recipe Steps -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold">Recipe Steps:</h4>
                <div v-for="(step, index) in recipeSteps" :key="index" 
                     class="p-3 bg-white/10 rounded-lg"
                     :class="{ 'bg-green-500/30': step.completed }">
                  <p class="text-sm">{{ step.text }}</p>
                </div>
              </div>

              <!-- Ingredient Selection -->
              <div>
                <h4 class="text-lg font-semibold mb-4">Select Ingredients:</h4>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    v-for="ingredient in availableIngredients" 
                    :key="ingredient.name"
                    @click="selectIngredient(ingredient)"
                    class="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-sm"
                    :class="{ 
                      'bg-green-500/30 ring-2 ring-green-400': selectedIngredients.includes(ingredient.name),
                      'bg-red-500/30': wrongIngredients.includes(ingredient.name)
                    }"
                  >
                    {{ ingredient.emoji }} {{ ingredient.name }}
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <button 
                @click="checkRecipe"
                :disabled="selectedIngredients.length !== 4"
                class="bg-white/20 hover:bg-white/30 disabled:bg-gray-500/20 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
              >
                Cook This Recipe! 🍳
              </button>
            </div>

            <!-- Selected ingredients display -->
            <div v-if="selectedIngredients.length > 0" class="mt-4">
              <p class="text-sm text-gray-200">Selected: {{ selectedIngredients.join(', ') }}</p>
            </div>
          </div>

          <!-- Food Spot Challenge -->
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6">
            <h3 class="text-2xl font-semibold mb-4">🍕 Food Spot Memory Game</h3>
            <p class="text-sm mb-4 text-gray-200">Match the food with the perfect spot to eat it</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="(item, index) in foodSpots" 
                :key="index"
                @click="selectFoodSpot(item)"
                class="p-4 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-all duration-300 text-center"
                :class="{ 
                  'bg-blue-500/30 ring-2 ring-blue-400': selectedFoodSpot?.food === item.food,
                  'bg-green-500/30': item.matched
                }"
              >
                <div class="text-2xl mb-2">{{ item.emoji }}</div>
                <div class="text-sm">{{ item.food }}</div>
                <div class="text-xs text-gray-300">{{ item.spot }}</div>
              </div>
            </div>

            <div v-if="selectedFoodSpot" class="mt-4">
              <p class="text-sm">Selected: {{ selectedFoodSpot.food }} at {{ selectedFoodSpot.spot }}</p>
              <button 
                @click="checkFoodSpotMatch"
                class="mt-2 bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm py-1 px-3 rounded-full transition-all duration-300"
              >
                Match with Spot
              </button>
            </div>
          </div>
        </div>

        <!-- Success state -->
        <div v-else class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-3xl font-bold mb-4">Master Chef Harley! 👩‍🍳</h3>
          <p class="text-xl mb-6">You've unlocked your culinary reward...</p>
          
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h4 class="text-2xl font-semibold mb-4">🍽️ Your Culinary Reward 🍽️</h4>
            <div class="text-lg space-y-2">
              <p>✨ A cooking date where we make something together</p>
              <p>✨ I'll be your sous chef (and taste tester)</p>
              <p>✨ We'll try that new restaurant you've been eyeing</p>
            </div>
            <div class="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-lg">
              <p class="text-sm italic">"The best meals are the ones we cook together, especially when I get to feed you..."</p>
            </div>
          </div>

          <button 
            @click="$emit('level-complete')"
            class="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
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

// Recipe challenge
const recipeSteps = ref([
  { text: "1. Heat olive oil in a pan", completed: false },
  { text: "2. Add garlic and onions", completed: false },
  { text: "3. Add tomatoes and herbs", completed: false },
  { text: "4. Simmer for 20 minutes", completed: false }
])

const availableIngredients = ref([
  { name: "Olive Oil", emoji: "🫒", correct: true },
  { name: "Garlic", emoji: "🧄", correct: true },
  { name: "Onions", emoji: "🧅", correct: true },
  { name: "Tomatoes", emoji: "🍅", correct: true },
  { name: "Chocolate", emoji: "🍫", correct: false },
  { name: "Ice Cream", emoji: "🍦", correct: false },
  { name: "Pineapple", emoji: "🍍", correct: false },
  { name: "Marshmallows", emoji: "🍡", correct: false }
])

const selectedIngredients = ref<string[]>([])
const wrongIngredients = ref<string[]>([])

// Food spot matching
const foodSpots = ref([
  { food: "Pizza", spot: "Cozy Italian", emoji: "🍕", matched: false },
  { food: "Sushi", spot: "Japanese Garden", emoji: "🍣", matched: false },
  { food: "Tacos", spot: "Street Food", emoji: "🌮", matched: false },
  { food: "Pasta", spot: "Rooftop Bistro", emoji: "🍝", matched: false }
])

const selectedFoodSpot = ref<typeof foodSpots.value[0] | null>(null)
const challengeCompleted = ref(false)

const selectIngredient = (ingredient: typeof availableIngredients.value[0]) => {
  if (selectedIngredients.value.includes(ingredient.name)) {
    selectedIngredients.value = selectedIngredients.value.filter(name => name !== ingredient.name)
  } else if (selectedIngredients.value.length < 4) {
    selectedIngredients.value.push(ingredient.name)
  }
}

const checkRecipe = () => {
  const correctIngredients = availableIngredients.value.filter(ing => ing.correct).map(ing => ing.name)
  const isCorrect = selectedIngredients.value.every(ing => correctIngredients.includes(ing))
  
  if (isCorrect) {
    recipeSteps.value.forEach(step => step.completed = true)
    wrongIngredients.value = []
  } else {
    wrongIngredients.value = selectedIngredients.value.filter(ing => !correctIngredients.includes(ing))
    setTimeout(() => {
      wrongIngredients.value = []
    }, 2000)
  }
}

const selectFoodSpot = (item: typeof foodSpots.value[0]) => {
  if (!item.matched) {
    selectedFoodSpot.value = item
  }
}

const checkFoodSpotMatch = () => {
  if (selectedFoodSpot.value) {
    selectedFoodSpot.value.matched = true
    selectedFoodSpot.value = null
    
    // Check if all are matched
    if (foodSpots.value.every(spot => spot.matched)) {
      challengeCompleted.value = true
    }
  }
}
</script>

<style scoped>
.cooking-level {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.kitchen-icons {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>
