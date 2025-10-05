import { ref } from 'vue'

const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentSrc = ref('')

export function useBackgroundAudio() {
  const initAudio = (src: string, volume = 0.3, autoplay = true) => {
    console.log('[BackgroundAudio] Initializing audio:', { src, volume, autoplay })
    
    // If audio already initialized with same src and playing, don't reinitialize
    if (audioElement.value && currentSrc.value === src && isPlaying.value) {
      console.log('[BackgroundAudio] Already playing, skipping initialization')
      return audioElement.value
    }

    // If audio element doesn't exist or src changed, create/update it
    if (!audioElement.value || currentSrc.value !== src) {
      // Clean up existing audio
      if (audioElement.value) {
        console.log('[BackgroundAudio] Cleaning up existing audio instance')
        audioElement.value.pause()
        audioElement.value.removeEventListener('play', handlePlay)
        audioElement.value.removeEventListener('pause', handlePause)
        audioElement.value.removeEventListener('ended', handleEnded)
        audioElement.value.removeEventListener('error', handleError)
        audioElement.value.remove()
      }

      console.log('[BackgroundAudio] Creating new audio instance:', src)
      audioElement.value = new Audio(src)
      audioElement.value.loop = true
      audioElement.value.volume = volume
      currentSrc.value = src

      // Add event listeners with named functions for proper cleanup
      audioElement.value.addEventListener('play', handlePlay)
      audioElement.value.addEventListener('pause', handlePause)
      audioElement.value.addEventListener('ended', handleEnded)
      audioElement.value.addEventListener('error', handleError)

      if (autoplay) {
        console.log('[BackgroundAudio] Attempting autoplay')
        play()
      }
    } else {
      console.log('[BackgroundAudio] Audio already initialized, updating volume')
      audioElement.value.volume = volume
    }

    return audioElement.value
  }

  // Named event handlers for proper cleanup
  const handlePlay = () => {
    isPlaying.value = true
  }

  const handlePause = () => {
    isPlaying.value = false
  }

  const handleEnded = () => {
    isPlaying.value = false
    console.log('[BackgroundAudio] Audio ended')
  }

  const handleError = (event: Event) => {
    const error = event.target as HTMLAudioElement
    console.error('[BackgroundAudio] Audio error:', {
      error: error.error,
      src: currentSrc.value,
      networkState: error.networkState,
      readyState: error.readyState
    })
    isPlaying.value = false
  }

  const play = async () => {
    if (audioElement.value) {
      try {
        console.log('[BackgroundAudio] Attempting to play audio')
        await audioElement.value.play()
        console.log('[BackgroundAudio] Audio started successfully')
        isPlaying.value = true
      } catch (error) {
        console.warn('[BackgroundAudio] Play failed:', error)
        // Browser might require user interaction first
        if (error instanceof Error && error.name === 'NotAllowedError') {
          console.log('[BackgroundAudio] Autoplay blocked - user interaction required')
        }
      }
    }
  }

  const pause = () => {
    if (audioElement.value) {
      audioElement.value.pause()
      isPlaying.value = false
    }
  }

  const setVolume = (volume: number) => {
    if (audioElement.value) {
      audioElement.value.volume = Math.max(0, Math.min(1, volume))
    }
  }

  const resume = () => {
    if (audioElement.value && !isPlaying.value) {
      play()
    }
  }

  return {
    audioElement,
    isPlaying,
    currentSrc,
    initAudio,
    play,
    pause,
    resume,
    setVolume,
  }
}
