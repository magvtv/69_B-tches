<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <h1 class="text-2xl font-bold mb-6">Environment Variables Debug</h1>
    
    <div class="space-y-4">
      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Spotify Credentials</h2>
        <div class="space-y-2">
          <div>
            <strong>Client ID:</strong> 
            <span :class="spotifyClientId ? 'text-green-400' : 'text-red-400'">
              {{ spotifyClientId ? `${spotifyClientId.substring(0, 8)}...` : 'NOT SET' }}
            </span>
          </div>
          <div>
            <strong>Client Secret:</strong> 
            <span :class="spotifyClientSecret ? 'text-green-400' : 'text-red-400'">
              {{ spotifyClientSecret ? `${spotifyClientSecret.substring(0, 8)}...` : 'NOT SET' }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Supabase Credentials</h2>
        <div class="space-y-2">
          <div>
            <strong>URL:</strong> 
            <span :class="supabaseUrl ? 'text-green-400' : 'text-red-400'">
              {{ supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET' }}
            </span>
          </div>
          <div>
            <strong>Anon Key:</strong> 
            <span :class="supabaseAnon ? 'text-green-400' : 'text-red-400'">
              {{ supabaseAnon ? `${supabaseAnon.substring(0, 8)}...` : 'NOT SET' }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Environment Info</h2>
        <div class="space-y-2">
          <div><strong>Mode:</strong> {{ import.meta.env.MODE }}</div>
          <div><strong>Dev:</strong> {{ import.meta.env.DEV }}</div>
          <div><strong>Prod:</strong> {{ import.meta.env.PROD }}</div>
        </div>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Spotify API Test</h2>
        <button 
          @click="testSpotifyAPI" 
          :disabled="testing"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
        >
          {{ testing ? 'Testing...' : 'Test Spotify API' }}
        </button>
        <div v-if="testResult" class="mt-2 p-2 bg-gray-700 rounded">
          <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
        </div>
      </div>

      <div class="bg-gray-800 p-4 rounded">
        <h2 class="text-lg font-semibold mb-2">Background Audio Test</h2>
        <button 
          @click="testBackgroundAudio" 
          :disabled="audioTesting"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
        >
          {{ audioTesting ? 'Testing...' : 'Test Background Audio' }}
        </button>
        <div v-if="audioResult" class="mt-2 p-2 bg-gray-700 rounded">
          <pre>{{ JSON.stringify(audioResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { spotifyService } from '@/lib/spotify'

const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const spotifyClientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON

interface TestResult {
  success: boolean
  message?: string
  error?: string
}

const testing = ref(false)
const testResult = ref<TestResult | null>(null)
const audioTesting = ref(false)
const audioResult = ref<TestResult | null>(null)

async function testSpotifyAPI() {
  testing.value = true
  testResult.value = null
  
  try {
    const result = await spotifyService.authenticate()
    testResult.value = {
      success: result,
      message: result ? 'Authentication successful' : 'Authentication failed'
    }
  } catch (error) {
    testResult.value = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    testing.value = false
  }
}

async function testBackgroundAudio() {
  audioTesting.value = true
  audioResult.value = null
  
  try {
    const audio = new Audio('/audio/if-this-isnt-love.mp3')
    audio.volume = 0.1
    
    const playPromise = audio.play()
    
    if (playPromise !== undefined) {
      await playPromise
      audioResult.value = {
        success: true,
        message: 'Audio loaded and played successfully'
      }
      audio.pause()
    } else {
      audioResult.value = {
        success: false,
        message: 'Play promise was undefined'
      }
    }
  } catch (error) {
    audioResult.value = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    audioTesting.value = false
  }
}
</script>
