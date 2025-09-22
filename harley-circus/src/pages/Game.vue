<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <!-- IP Restriction Check -->
    <div v-if="!isAuthorized" class="flex items-center justify-center min-h-screen">
      <div class="text-center text-white p-8 bg-black/20 rounded-lg backdrop-blur-sm">
        <h1 class="text-4xl font-bold mb-4">Access Restricted</h1>
        <p class="text-lg mb-4">This adventure is only available to Harley</p>
        <div class="text-sm text-gray-300">
          <p>Current IP: {{ userIP }}</p>
          <p v-if="!isAuthorized">Unauthorized access detected</p>
        </div>
      </div>
    </div>

    <!-- Main Adventure Game -->
    <div v-else class="min-h-screen">
      <!-- Header with Time Tracking -->
      <header class="bg-black/20 backdrop-blur-sm p-4">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Harley's Adventure</h1>
          <div class="text-white text-sm">
            <p>Session Time: {{ formatTime(sessionTime) }}</p>
            <p>Level: {{ currentLevel }}/{{ totalLevels }}</p>
          </div>
        </div>
      </header>

      <!-- Game Content -->
      <main class="max-w-6xl mx-auto p-6">
        <!-- Welcome Screen -->
        <div v-if="currentLevel === 0" class="text-center text-white">
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-8 mb-6">
            <h2 class="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-pink-400">
                <path d="M12 2l2.317 5.696 6.183.474-4.73 3.999 1.46 5.831L12 15.938 6.77 17.999l1.46-5.83-4.73-4 6.183-.474L12 2z"/>
              </svg>
              Welcome to Your Adventure, Harley
            </h2>
            <p class="text-xl mb-6">I got bored, so I coded a game. You're the test subject.</p>
            <p class="text-lg mb-8">If you rage-quit, I'll mock you forever.</p>
            <button 
              @click="startAdventure" 
              class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Begin the Adventure
            </button>
          </div>
        </div>

        <!-- Level Components -->
        <SunsetLevel v-if="currentLevel === 1" @level-complete="nextLevel" />
        <CookingLevel v-if="currentLevel === 2" @level-complete="nextLevel" />
        <ThrillLevel v-if="currentLevel === 3" @level-complete="nextLevel" />
        <IntimateLevel v-if="currentLevel === 4" @level-complete="nextLevel" />
        <FinalReward v-if="currentLevel === 5" />

        <!-- Progress Bar -->
        <div v-if="currentLevel > 0 && currentLevel < 5" class="mt-8">
          <div class="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <div class="flex justify-between text-white text-sm mb-2">
              <span>Progress</span>
              <span>{{ currentLevel }}/{{ totalLevels }}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${(currentLevel / totalLevels) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Tracking Debug Component (only in development) -->
    <TrackingDebug />
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: 'Game' })
import { ref, onMounted, onUnmounted } from 'vue'
import SunsetLevel from '@/components/SunsetLevel.vue'
import CookingLevel from '@/components/CookingLevel.vue'
import ThrillLevel from '@/components/ThrillLevel.vue'
import IntimateLevel from '@/components/IntimateLevel.vue'
import FinalReward from '@/components/FinalReward.vue'
import TrackingDebug from '@/components/TrackingDebug.vue'
import { trackingService } from '@/services/trackingService'

const isAuthorized = ref(false)
const userIP = ref('')
const currentLevel = ref(0)
const totalLevels = 5
const sessionTime = ref(0)
const sessionStartTime = ref(Date.now())

const authorizedIPs = [
  '127.0.0.1',
  '197.232.81.136',
]

let timeInterval: number

onMounted(async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    userIP.value = data.ip
    isAuthorized.value = authorizedIPs.includes(data.ip) || data.ip === '127.0.0.1'
  } catch (error) {
    console.error('Error fetching IP:', error)
    isAuthorized.value = true
    userIP.value = '127.0.0.1'
  }

  sessionStartTime.value = Date.now()
  timeInterval = setInterval(() => {
    sessionTime.value = Date.now() - sessionStartTime.value
    trackingService.updateSessionTime(sessionTime.value)
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const startAdventure = () => {
  currentLevel.value = 1
  trackingService.trackEvent('adventure_started', {
    timestamp: new Date().toISOString()
  }, 'general')
}

const nextLevel = () => {
  const previousLevel = currentLevel.value
  currentLevel.value++
  
  trackingService.trackEvent('level_completed', {
    fromLevel: previousLevel,
    toLevel: currentLevel.value,
    timestamp: new Date().toISOString()
  }, 'general')
}

const formatTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "DM Sans", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dm-sans {
  font-family: "DM Sans", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

#app {
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>


