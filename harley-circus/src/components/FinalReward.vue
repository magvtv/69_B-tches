<template>
  <div class="final-reward">
    <div class="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-lg p-8 text-white relative overflow-hidden">
      <!-- Celebration background elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="celebration-icons absolute inset-0">
          <div class="absolute top-4 left-4 text-4xl animate-bounce">🎉</div>
          <div class="absolute top-4 right-4 text-4xl animate-pulse">✨</div>
          <div class="absolute bottom-4 left-4 text-4xl animate-bounce" style="animation-delay: 0.5s;">💎</div>
          <div class="absolute bottom-4 right-4 text-4xl animate-pulse" style="animation-delay: 1s;">👑</div>
          <div class="absolute top-1/2 left-1/4 text-4xl animate-bounce" style="animation-delay: 1.5s;">💕</div>
          <div class="absolute top-1/2 right-1/4 text-4xl animate-pulse" style="animation-delay: 2s;">🌟</div>
        </div>
      </div>

      <div class="relative z-10 text-center">
        <div class="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 class="text-5xl font-bold mb-6">Congratulations, Harley! 🎉</h1>
        <p class="text-2xl mb-8">You've completed the entire adventure!</p>
        
        <!-- Final Reward Display -->
        <div class="bg-black/20 backdrop-blur-sm rounded-lg p-8 mb-8">
          <h2 class="text-3xl font-bold mb-6">🎁 Your Ultimate Reward 🎁</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Adventure Package -->
            <div class="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <h3 class="text-2xl font-semibold mb-4">🌅 Adventure Package</h3>
              <ul class="text-left space-y-2">
                <li>✨ Sunset stargazing date</li>
                <li>✨ New restaurant exploration</li>
                <li>✨ Thrilling adventure of your choice</li>
                <li>✨ I'll be your adventure buddy</li>
              </ul>
            </div>

            <!-- Intimate Package -->
            <div class="p-6 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg">
              <h3 class="text-2xl font-semibold mb-4">💕 Intimate Package</h3>
              <ul class="text-left space-y-2">
                <li>✨ Full body olive oil massage</li>
                <li>✨ Whipped cream & Nutella playtime</li>
                <li>✨ Ice cream deep kisses</li>
                <li>✨ A night where you feel completely cherished</li>
              </ul>
            </div>
          </div>

          <!-- Special Message -->
          <div class="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 mb-6">
            <h3 class="text-2xl font-semibold mb-4">💌 A Special Message for You</h3>
            <div class="text-left space-y-3 text-lg leading-relaxed">
              <p>"Harley, you've proven you're not just adventurous and brave, but also someone who appreciates the simple, intimate moments that make life beautiful. You've shown me your love for sunsets, your passion for new experiences, your craving for adrenaline, and your desire for those special touches that make you feel cherished."</p>
              
              <p>"This game was my way of showing you that I see you - all of you. The adventurous spirit, the food lover, the thrill seeker, and the woman who deserves to feel completely special and adored."</p>
              
              <p>"Now it's time to make these rewards real. I want to be the one who takes you on that sunset adventure, who tries new restaurants with you, who faces thrilling challenges by your side, and who gives you those intimate moments that make you feel like the most important person in my world."</p>
            </div>
          </div>

          <!-- Claim Instructions -->
          <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6">
            <h3 class="text-2xl font-semibold mb-4">⏰ Claim Your Rewards</h3>
            <p class="text-lg mb-4">Your adventure package is ready to be claimed!</p>
            <div class="text-sm space-y-2">
              <p>🎯 <strong>Valid for:</strong> 48 hours from now</p>
              <p>🎯 <strong>How to claim:</strong> Send me a message saying "I want my adventure rewards"</p>
              <p>🎯 <strong>What happens next:</strong> We'll plan your perfect adventure together</p>
            </div>
            <div class="mt-4 p-3 bg-red-500/20 rounded-lg">
              <p class="text-sm font-semibold">⚠️ Warning: If you don't claim within 48 hours, the offer self-destructs! 💥</p>
            </div>
          </div>
        </div>

        <!-- Session Stats -->
        <div class="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h3 class="text-2xl font-semibold mb-4">📊 Your Adventure Stats</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-3xl font-bold text-yellow-400">{{ sessionTime }}</div>
              <div class="text-sm text-gray-300">Minutes Played</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-green-400">5/5</div>
              <div class="text-sm text-gray-300">Levels Completed</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-blue-400">100%</div>
              <div class="text-sm text-gray-300">Success Rate</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-pink-400">∞</div>
              <div class="text-sm text-gray-300">Adventure Points</div>
            </div>
          </div>
        </div>

        <!-- Final Actions -->
        <div class="space-y-4">
          <button 
            @click="claimRewards"
            class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-xl"
          >
            🎁 Claim My Rewards Now! 🎁
          </button>
          
          <div class="text-sm text-gray-300">
            <p>Or share this adventure with me and let's plan something real together</p>
          </div>
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

const sessionTime = ref('0')

onMounted(() => {
  // Calculate session time (this would be passed from parent component)
  // For now, we'll simulate it
  sessionTime.value = '15'
})

const claimRewards = () => {
  // This would typically open a modal or redirect to contact form
  alert('🎉 Rewards claimed! Check your messages for next steps. This adventure was just the beginning... 💕')
  
  // Could also trigger an email or notification to you
  console.log('Harley claimed her rewards! Time to plan the real adventure.')
}
</script>

<style scoped>
.final-reward {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.celebration-icons {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Confetti animation could be added here */
@keyframes confetti {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
</style>
