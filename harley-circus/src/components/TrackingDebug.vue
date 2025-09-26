<template>
  <div v-if="isDevelopment" class="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto z-50">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-sm font-bold">🔍 Tracking Debug</h3>
      <button @click="toggleDebug" class="text-xs bg-gray-600 px-2 py-1 rounded">
        {{ showDebug ? 'Hide' : 'Show' }}
      </button>
    </div>
    
    <div v-if="showDebug" class="space-y-2 text-xs">
      <div>
        <strong>Session ID:</strong> {{ userProfile?.sessionId || 'n/a' }}
      </div>
      
      <div>
        <strong>Session Time:</strong> {{ formatTime(userProfile?.totalSessionTime || 0) }}
      </div>
      
      <div>
        <strong>Interactions:</strong> {{ interactions.length }}
      </div>
      
      <div v-if="userProfile?.preferences?.loveLanguage?.length">
        <strong>Love Language Responses:</strong>
        <div class="ml-2 space-y-1">
          <div v-for="(response, index) in userProfile!.preferences!.loveLanguage" :key="index">
            Q{{ response.questionIndex + 1 }}: {{ response.answer }}
          </div>
        </div>
      </div>
      
      <div v-if="userProfile?.preferences?.intimateMoments?.length">
        <strong>Intimate Moments:</strong>
        <div class="ml-2">
          {{ userProfile!.preferences!.intimateMoments!.join(', ') }}
        </div>
      </div>
      
      <div v-if="insights">
        <strong>Insights:</strong>
        <div class="ml-2 space-y-1">
          <div>Engagement: {{ getEngagementLevel() }}</div>
          <div>Completion: {{ insights?.completionPattern?.completionRate?.toFixed(1) || 0 }}%</div>
          <div>Progression: {{ insights?.completionPattern?.progressionSpeed || 'unknown' }}</div>
        </div>
      </div>
      
      <div class="pt-2 border-t border-gray-600">
        <button @click="exportData" class="text-xs bg-blue-600 px-2 py-1 rounded mr-2">
          Export Data
        </button>
        <button @click="sendToBackend" class="text-xs bg-green-600 px-2 py-1 rounded">
          Send to Backend
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { trackingService } from '../lib/tracking/trackingService'

import type { UserProfile, UserInteraction } from '../lib/tracking/trackingService'

const showDebug = ref(false)
const userProfile = ref<UserProfile>(trackingService.getUserProfile())
const interactions = ref<UserInteraction[]>(trackingService.getAllInteractions())
const insights = ref<{ totalEvents: number; engagementLevel?: { high?: boolean; medium?: boolean; low?: boolean }; completionPattern?: { completionRate?: number; progressionSpeed?: string } } | null>(null)

const isDevelopment = computed(() => import.meta.env.DEV)

let updateInterval: number

const toggleDebug = () => {
  showDebug.value = !showDebug.value
  if (showDebug.value) {
    updateData()
  }
}

const updateData = () => {
  userProfile.value = trackingService.getUserProfile()
  interactions.value = trackingService.getAllInteractions()
  insights.value = trackingService.generateInsights()
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

const getEngagementLevel = () => {
  if (!insights.value) return 'unknown'
  
  const engagement = insights.value.engagementLevel
  if (engagement?.high) return 'High'
  if (engagement?.medium) return 'Medium'
  return 'Low'
}

const exportData = () => {
  const data = trackingService.exportData()
  if (data) {
    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `harley-tracking-${data.sessionId || 'session'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

const sendToBackend = async () => {
  await trackingService.sendToBackend()
  console.log('📡 Data sent to backend (simulated)')
}

onMounted(() => {
  if (isDevelopment.value) {
    updateInterval = setInterval(updateData, 2000) // Update every 2 seconds
  }
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
/* Debug panel styles */
</style>
