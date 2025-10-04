<template>
  <div class="album-cover-challenge">
    <!-- Challenge Header -->
    <div class="mb-6">
      <!-- Desktop: Question with special badge -->
      <div class="hidden sm:flex items-center justify-between mb-4">
        <p class="text-lg text-gray-300 dm-sans flex-1">{{ challenge.question }}</p>
        <div
          v-if="challenge.special"
          class="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold ml-4"
        >
          ✨ Special
        </div>
      </div>

      <!-- Mobile: Question -->
      <div class="sm:hidden mb-3">
        <div class="flex items-center justify-between mb-2">
          <p class="text-base text-gray-300 dm-sans flex-1">{{ challenge.question }}</p>
          <div
            v-if="challenge.special"
            class="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold ml-2"
          >
            ✨ Special
          </div>
        </div>
      </div>

      <!-- Mobile: Album cover above lyric snippet -->
      <div class="sm:hidden mb-4 flex justify-center">
        <div class="w-20 h-20">
          <img
            v-if="correctAlbumCover"
            :src="correctAlbumCover"
            :alt="`Album cover hint`"
            class="w-full h-full object-cover rounded-lg border-2 border-red-500/30"
            @error="handleCorrectCoverError"
          />
          <div v-else class="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 text-xs">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Desktop: Layout with album cover on the right -->
      <div class="hidden sm:flex items-center gap-4">
        <div class="flex-1">
          <!-- Lyric Snippet -->
          <div v-if="challenge.lyricSnippet" class="bg-red-900/20 border-l-4 border-red-500 p-4">
            <p class="text-base text-gray-200 dm-sans italic">"{{ challenge.lyricSnippet }}"</p>
          </div>
        </div>

        <!-- Album Cover (Desktop) -->
        <div class="w-16 h-16 flex-shrink-0">
          <img
            v-if="correctAlbumCover"
            :src="correctAlbumCover"
            :alt="`Album cover hint`"
            class="w-full h-full object-cover rounded-lg border-2 border-red-500/30"
            @error="handleCorrectCoverError"
          />
          <div v-else class="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 text-xs">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Mobile: Lyric snippet -->
      <div class="sm:hidden">
        <div v-if="challenge.lyricSnippet" class="bg-red-900/20 border-l-4 border-red-500 p-3">
          <p class="text-sm text-gray-200 dm-sans italic">"{{ challenge.lyricSnippet }}"</p>
        </div>
      </div>
    </div>

    <!-- Options Grid -->
    <div class="space-y-3 mb-6">
      <button
        v-for="(option, index) in challenge.options"
        :key="index"
        @click="selectOption(index)"
        :disabled="answered"
        :class="[
          'w-full text-left p-3 sm:p-4 rounded-lg transition-all dm-sans border-2',
          answered && index === selectedOption && selectedOption === challenge.correctAnswer
            ? 'bg-green-600/30 border-green-500'
            : answered && index === selectedOption
              ? 'bg-red-600/30 border-red-500'
              : answered && index === challenge.correctAnswer
                ? 'bg-green-600/20 border-green-500'
                : 'bg-gray-800/50 border-gray-600 hover:border-red-500',
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm sm:text-base text-gray-300">{{ option }}</span>
          <span
            v-if="answered && index === challenge.correctAnswer"
            class="text-green-400 text-base sm:text-lg"
            >✓</span
          >
          <span
            v-else-if="answered && index === selectedOption"
            class="text-red-400 text-base sm:text-lg"
            >✗</span
          >
        </div>
      </button>
    </div>

    <!-- Next Button -->
    <div v-if="answered" class="flex justify-end">
      <button
        @click="$emit('next')"
        class="bg-red-600 hover:bg-red-700 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold transition-colors dm-sans flex items-center gap-2 text-sm sm:text-base"
      >
        {{ isLastChallenge ? 'Complete' : 'Next Challenge' }}
        <ArrowRightIcon class="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/solid'
import { spotifyService } from '@/lib/spotify'

interface Props {
  challenge: {
    id: string
    songTitle: string
    artist: string
    question: string
    lyricSnippet?: string
    options: string[]
    correctAnswer: number
    context: string
    special?: boolean
  }
  isLastChallenge?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [index: number]
  next: []
}>()

const answered = ref(false)
const selectedOption = ref<number | null>(null)
const correctAlbumCover = ref<string | null>(null)

// Computed to check if answer is correct (for future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isCorrect = computed(
  () => selectedOption.value !== null && selectedOption.value === props.challenge.correctAnswer,
)

const selectOption = (index: number) => {
  if (answered.value) return

  answered.value = true
  selectedOption.value = index
  emit('select', index)
}

const fetchCorrectAlbumCover = async () => {
  try {
    // Search for the correct song to get its album cover
    const query = `${props.challenge.artist} ${props.challenge.songTitle}`
    const track = await spotifyService.searchTrack(query)
    if (track) {
      const cover = await spotifyService.getAlbumCover(track.id)
      if (cover) {
        correctAlbumCover.value = cover
      }
    }
  } catch (error) {
    console.error('Failed to fetch correct album cover:', error)
  }
}

const handleCorrectCoverError = () => {
  console.error('Failed to load correct album cover')
  correctAlbumCover.value = null
}

onMounted(() => {
  fetchCorrectAlbumCover()
})

// Watch for challenge changes
watch(
  () => props.challenge.id,
  () => {
    answered.value = false
    selectedOption.value = null
    correctAlbumCover.value = null
    fetchCorrectAlbumCover()
  },
)
</script>

<style scoped>
.dm-sans {
  font-family: 'DM Sans', sans-serif;
}
</style>
