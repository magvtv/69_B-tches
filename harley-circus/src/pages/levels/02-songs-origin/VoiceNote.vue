<template>
  <GameLayout>
    <div class="max-w-4xl mx-auto p-6 text-white">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2
          class="text-3xl font-bold mb-2 dm-sans text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700"
        >
          Voice Note Challenge
        </h2>
        <p class="text-gray-300 dm-sans">Your turn to shine</p>
      </div>

      <!-- Challenge Description -->
      <div
        class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30 text-center mb-8"
      >
        <div class="mb-6">
          <MicrophoneIcon class="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-2xl font-bold mb-4 dm-sans text-green-400">Your Turn to Shine</h3>
          <p class="text-gray-300 dm-sans mb-6">
            Record yourself singing 10 seconds of ANY song from this level.<br />
            This is the truth or dare throwback!
          </p>
        </div>

        <!-- Recording Controls -->
        <div v-if="!isRecording && !hasRecorded" class="space-y-4">
          <button
            @click="startRecording"
            class="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-bold transition-colors dm-sans flex items-center gap-3 mx-auto"
          >
            <MicrophoneIcon class="h-6 w-6" />
            Start Recording
          </button>
          <p class="text-gray-400 text-sm dm-sans">
            Click to start recording your 10-second performance
          </p>
        </div>

        <!-- Recording in Progress -->
        <div v-if="isRecording" class="space-y-4">
          <div class="flex items-center justify-center gap-4">
            <div class="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-green-400 dm-sans font-bold">Recording...</span>
            <div class="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </div>

          <div class="text-4xl font-bold text-green-400 dm-sans">
            {{ formatTime(recordingTime) }}
          </div>

          <button
            @click="stopRecording"
            class="bg-gray-600 hover:bg-gray-700 px-8 py-4 rounded-lg font-bold transition-colors dm-sans flex items-center gap-3 mx-auto"
          >
            <StopIcon class="h-6 w-6" />
            Stop Recording
          </button>

          <p class="text-gray-400 text-sm dm-sans">
            Sing any song from the challenges for 10 seconds
          </p>
        </div>

        <!-- Recording Complete -->
        <div v-if="hasRecorded && !isRecording" class="space-y-4">
          <div class="flex items-center justify-center gap-3 mb-4">
            <CheckCircleIcon class="h-8 w-8 text-green-500" />
            <span class="text-green-400 dm-sans font-bold">Recording Complete!</span>
          </div>

          <div class="text-gray-300 dm-sans mb-6">
            Duration: {{ formatTime(recordingDuration) }}
          </div>

          <!-- Playback -->
          <div v-if="audioUrl" class="mb-6">
            <audio :src="audioUrl" controls class="w-full max-w-md mx-auto" />
          </div>

          <div class="flex justify-center gap-4">
            <button
              @click="retakeRecording"
              class="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
            >
              <ArrowPathIcon class="h-5 w-5" />
              Retake
            </button>
            <button
              @click="submitRecording"
              class="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
            >
              <CheckIcon class="h-5 w-5" />
              Submit Recording
            </button>
          </div>
        </div>

        <!-- Challenge Complete -->
        <div v-if="challengeComplete" class="space-y-4">
          <div class="flex items-center justify-center gap-3 mb-4">
            <CheckCircleIcon class="h-12 w-12 text-green-500" />
            <span class="text-green-400 dm-sans font-bold text-xl">Challenge Complete!</span>
          </div>

          <p class="text-gray-300 dm-sans mb-6">
            Amazing performance! You've earned the Voice Note Token
          </p>

          <div class="flex justify-center gap-4">
            <router-link
              to="/levels/02-songs-origin"
              class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2"
            >
              <ArrowLeftIcon class="h-4 w-4" />
              Back to Level
            </router-link>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-green-950/40 backdrop-blur-sm rounded-2xl p-6 border border-green-700/30">
        <h4 class="text-lg font-bold mb-4 dm-sans text-green-400">Instructions</h4>
        <ul class="text-gray-300 dm-sans space-y-2 text-sm">
          <li>• Choose any song from the lyric challenge</li>
          <li>• Exactly 10 seconds. Your best version!</li>
          <li>• A classic truth or dare throwback haha!</li>
        </ul>
      </div>
    </div>
  </GameLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '@/layouts/GameLayout.vue'
import {
  ArrowLeftIcon,
  MicrophoneIcon,
  StopIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/solid'
import { useSongsOriginStore } from '@/stores/songsOriginStore'

const store = useSongsOriginStore()

// Recording state
const isRecording = ref(false)
const hasRecorded = ref(false)
const recordingTime = ref(0)
const recordingDuration = ref(0)
const audioUrl = ref<string | null>(null)
const challengeComplete = ref(false)

// Media recording
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let recordingInterval: number | null = null

// Methods
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      audioUrl.value = URL.createObjectURL(audioBlob)
      recordingDuration.value = recordingTime.value

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop())
    }

    mediaRecorder.start()
    isRecording.value = true
    recordingTime.value = 0

    // Start timer
    recordingInterval = window.setInterval(() => {
      recordingTime.value++
      if (recordingTime.value >= 10) {
        stopRecording()
      }
    }, 1000)
  } catch (error) {
    console.error('Error starting recording:', error)
    alert('Unable to access microphone. Please check your permissions.')
  }
}

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
    hasRecorded.value = true

    if (recordingInterval) {
      clearInterval(recordingInterval)
      recordingInterval = null
    }
  }
}

const retakeRecording = () => {
  hasRecorded.value = false
  recordingTime.value = 0
  recordingDuration.value = 0
  audioUrl.value = null

  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
}

const submitRecording = async () => {
  try {
    await store.completeVoiceNote()
    challengeComplete.value = true

    // Clean up
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
    }
  } catch (error) {
    console.error('Error submitting recording:', error)
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Cleanup on unmount
onUnmounted(() => {
  if (recordingInterval) {
    clearInterval(recordingInterval)
  }
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
})

// Initialize
onMounted(async () => {
  await store.initializeSession()
})
</script>

<style scoped>
.dm-sans {
  font-family: 'DM Sans', sans-serif;
}
</style>
