import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export type MemeReaction = 'laugh' | 'meh'

interface MemeProgressState {
  currentIndex: number
  totalMemes: number
  laughsCount: number
  reactions: MemeReaction[]
}

const STORAGE_KEY = 'meme-maze-progress-v1'

function loadState(totalMemes: number): MemeProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MemeProgressState>
      return {
        currentIndex: parsed.currentIndex ?? 0,
        totalMemes,
        laughsCount: parsed.laughsCount ?? 0,
        reactions: Array.isArray(parsed.reactions) ? parsed.reactions.slice(0, totalMemes) as MemeReaction[] : Array(totalMemes).fill(undefined),
      }
    }
  } catch {
    // ignore for now
  }
  return { currentIndex: 0, totalMemes, laughsCount: 0, reactions: Array(totalMemes).fill(undefined) }
}

export const useMemeMazeStore = defineStore('memeMaze', () => {
  const TOTAL_MEMES = 23
  const state = ref<MemeProgressState>(loadState(TOTAL_MEMES))

  const candlesLit = computed(() => state.value.reactions.filter(r => r === 'laugh').length)
  const isComplete = computed(() => state.value.currentIndex >= state.value.totalMemes)

  function react(reaction: MemeReaction) {
    if (isComplete.value) return
    state.value.reactions[state.value.currentIndex] = reaction
    if (reaction === 'laugh') state.value.laughsCount += 1
    state.value.currentIndex += 1
  }

  function reset() {
    state.value = loadState(TOTAL_MEMES)
  }

  watch(state, (s) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentIndex: s.currentIndex,
        laughsCount: s.laughsCount,
        reactions: s.reactions,
      }))
    } catch {
      // ignore
    }
  }, { deep: true })

  return {
    state,
    candlesLit,
    isComplete,
    react,
    reset,
  }
})


