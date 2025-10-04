<template>
  <div class="audio-player">
    <!-- Audio Indicator -->
    <div v-if="showIndicator" class="audio-indicator">
      <div class="flex items-center justify-center gap-3">
        <div class="relative">
          <MusicalNoteIcon class="h-6 w-6 text-red-500" :class="{ 'animate-pulse': isPlaying }" />
          <div
            v-if="isPlaying"
            class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"
          ></div>
        </div>
        <p class="text-gray-300 dm-sans text-sm">
          {{ error && error.includes('Click anywhere') ? 'Click to enable audio' : indicatorText }}
        </p>
      </div>
      <!-- Click to enable audio button -->
      <button
        v-if="error && error.includes('Click anywhere')"
        @click="play"
        class="mt-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Enable Audio
      </button>
    </div>

    <!-- Controls (if visible) -->
    <div v-if="showControls" class="audio-controls">
      <button
        @click="togglePlay"
        class="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
        :disabled="loading"
      >
        <PlayIcon v-if="!isPlaying" class="h-5 w-5 text-white" />
        <PauseIcon v-else class="h-5 w-5 text-white" />
      </button>

      <div class="flex-1 mx-4">
        <div class="text-sm text-gray-300 dm-sans">{{ title }}</div>
        <div class="text-xs text-gray-400 dm-sans">{{ artist }}</div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400">{{ formatTime(currentTime) }}</span>
        <span class="text-xs text-gray-400">/ {{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioElement"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="onError"
      preload="metadata"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, readonly } from 'vue'
import { MusicalNoteIcon, PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { audioCache } from '@/lib/audioCache'

interface Props {
  src: string
  title?: string
  artist?: string
  autoplay?: boolean
  loop?: boolean
  volume?: number
  showControls?: boolean
  showIndicator?: boolean
  indicatorText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Unknown',
  artist: 'Unknown',
  autoplay: false,
  loop: false,
  volume: 0.5,
  showControls: false,
  showIndicator: true,
  indicatorText: "Something's playing in the background... 🎧",
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  error: [error: Event]
  timeUpdate: [currentTime: number, duration: number]
}>()

const audioElement = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const loading = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!audioElement.value) return

  try {
    loading.value = true

    let audioUrl = audioCache.getCachedAudio(props.src)

    if (!audioUrl) {
      audioUrl = await audioCache.cacheAudio(props.src)
    }

    if (audioElement.value) {
      audioElement.value.src = audioUrl
      audioElement.value.volume = props.volume
      audioElement.value.loop = props.loop

      // Handle autoplay with user interaction fallback
      if (props.autoplay) {
        try {
          await play()
        } catch (autoplayError) {
          console.log('Autoplay blocked, waiting for user interaction')
          // Autoplay was blocked, we'll wait for user interaction
          // The audio will be ready to play when user clicks anywhere
        }
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load audio'
    emit('error', new Event('error'))
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
})

async function play() {
  if (!audioElement.value) return

  try {
    await audioElement.value.play()
    isPlaying.value = true
    emit('play')
  } catch (err) {
    // Handle autoplay policy errors gracefully
    if (err instanceof Error && err.name === 'NotAllowedError') {
      console.log('Audio playback blocked by browser policy. User interaction required.')
      error.value = 'Click anywhere to enable audio playback'
    } else {
      error.value = err instanceof Error ? err.message : 'Failed to play audio'
      emit('error', new Event('error'))
    }
  }
}

function pause() {
  if (!audioElement.value) return

  audioElement.value.pause()
  isPlaying.value = false
  emit('pause')
}

function togglePlay() {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function onLoadedMetadata() {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
  }
}

function onTimeUpdate() {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
    emit('timeUpdate', currentTime.value, duration.value)
  }
}

function onEnded() {
  isPlaying.value = false
  emit('ended')
}

function onError(event: Event) {
  error.value = 'Audio playback error'
  emit('error', event)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

watch(
  () => props.volume,
  (newVolume) => {
    if (audioElement.value) {
      audioElement.value.volume = newVolume
    }
  },
)

watch(
  () => props.loop,
  (newLoop) => {
    if (audioElement.value) {
      audioElement.value.loop = newLoop
    }
  },
)

defineExpose({
  play,
  pause,
  togglePlay,
  isPlaying: readonly(isPlaying),
  currentTime: readonly(currentTime),
  duration: readonly(duration),
  error: readonly(error),
})
</script>

<style scoped>
.dm-sans {
  font-family: 'DM Sans', sans-serif;
}

.audio-indicator {
  @apply bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-red-600/20 text-center;
}

.audio-controls {
  @apply flex items-center bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-red-600/20;
}
</style>
