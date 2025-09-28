import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export type MemeReaction = 'laugh' | 'meh'

interface MemeProgressState {
  currentIndex: number
  totalMemes: number
  laughsCount: number
  reactions: MemeReaction[]
  vibeCheckCompleted: boolean
  memesCompleted: boolean
  numberPlayCompleted: boolean
  numberPlayCandles: number // Track candles earned from NumberPlay
  finaleUnlocked: boolean
  finaleCompleted: boolean
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
        vibeCheckCompleted: parsed.vibeCheckCompleted ?? false,
        memesCompleted: parsed.memesCompleted ?? false,
        numberPlayCompleted: parsed.numberPlayCompleted ?? false,
        numberPlayCandles: parsed.numberPlayCandles ?? 0,
        finaleUnlocked: parsed.finaleUnlocked ?? false,
        finaleCompleted: parsed.finaleCompleted ?? false,
      }
    }
  } catch {
    // ignore for now
  }
  return { 
    currentIndex: 0, 
    totalMemes, 
    laughsCount: 0, 
    reactions: Array(totalMemes).fill(undefined),
    vibeCheckCompleted: false,
    memesCompleted: false,
    numberPlayCompleted: false,
    numberPlayCandles: 0,
    finaleUnlocked: false,
    finaleCompleted: false,
  }
}

export const useMemeMazeStore = defineStore('memeMaze', () => {
  const TOTAL_MEMES = 23
  const state = ref<MemeProgressState>(loadState(TOTAL_MEMES))

  const candlesLit = computed(() => {
    const memeCandles = state.value.reactions.filter(r => r === 'laugh').length
    // Add candles earned from NumberPlay arithmetic problems
    const numberPlayCandles = state.value.numberPlayCandles
    return Math.min(memeCandles + numberPlayCandles, 23)
  })
  
  const isComplete = computed(() => state.value.currentIndex >= state.value.totalMemes)
  const allCandlesLit = computed(() => candlesLit.value >= 23)

  function react(reaction: MemeReaction) {
    if (isComplete.value) return
    state.value.reactions[state.value.currentIndex] = reaction
    if (reaction === 'laugh') state.value.laughsCount += 1
    state.value.currentIndex += 1
  }

  function reset() {
    state.value = loadState(TOTAL_MEMES)
  }

  function markVibeCheckCompleted() {
    state.value.vibeCheckCompleted = true
  }

  function markMemesCompleted() {
    state.value.memesCompleted = true
  }

  function markNumberPlayCompleted() {
    state.value.numberPlayCompleted = true
    // Check if all candles are now lit to unlock finale
    if (allCandlesLit.value) {
      state.value.finaleUnlocked = true
    }
  }

  function addNumberPlayCandle() {
    if (state.value.numberPlayCandles < 23) {
      state.value.numberPlayCandles += 1
      // Check if all candles are now lit to unlock finale
      if (allCandlesLit.value) {
        state.value.finaleUnlocked = true
      }
    }
  }

  function markFinaleCompleted() {
    state.value.finaleCompleted = true
  }

  function unlockFinale() {
    state.value.finaleUnlocked = true
  }

  watch(state, (s) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentIndex: s.currentIndex,
        laughsCount: s.laughsCount,
        reactions: s.reactions,
        vibeCheckCompleted: s.vibeCheckCompleted,
        memesCompleted: s.memesCompleted,
        numberPlayCompleted: s.numberPlayCompleted,
        numberPlayCandles: s.numberPlayCandles,
        finaleUnlocked: s.finaleUnlocked,
        finaleCompleted: s.finaleCompleted,
      }))
    } catch {
      // ignore
    }
  }, { deep: true })

  return {
    state,
    candlesLit,
    isComplete,
    allCandlesLit,
    react,
    reset,
    markVibeCheckCompleted,
    markMemesCompleted,
    markNumberPlayCompleted,
    addNumberPlayCandle,
    markFinaleCompleted,
    unlockFinale,
  }
})


