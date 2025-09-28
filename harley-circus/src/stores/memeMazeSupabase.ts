import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { progressService } from '../lib/supabase/progressService'
import { debugLog, errorLog } from '../config/environment'

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
  // Supabase integration
  sessionId: string | null
  gameSessionId: string | null
  isInitialized: boolean
}

const STORAGE_KEY = 'meme-maze-progress-v2'

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
        sessionId: parsed.sessionId ?? null,
        gameSessionId: parsed.gameSessionId ?? null,
        isInitialized: parsed.isInitialized ?? false,
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
    sessionId: null,
    gameSessionId: null,
    isInitialized: false,
  }
}

export const useMemeMazeSupabaseStore = defineStore('memeMazeSupabase', () => {
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

  // Initialize Supabase session
  async function initializeSession() {
    if (state.value.isInitialized) {
      return
    }

    try {
      debugLog('Initializing Supabase session for meme maze')
      
      // Initialize user session
      const userSession = await progressService.initializeSession()
      state.value.sessionId = userSession.sessionId

      // Start game session for meme maze
      const gameSession = await progressService.startGameSession('01-meme-maze')
      state.value.gameSessionId = gameSession.id

      state.value.isInitialized = true

      // Record initial interaction
      await progressService.recordInteraction(
        gameSession.id,
        'level_started',
        { level: '01-meme-maze', timestamp: Date.now() }
      )

      debugLog('Session initialized successfully', { 
        sessionId: userSession.sessionId, 
        gameSessionId: gameSession.id 
      })
    } catch (error) {
      errorLog('Failed to initialize session', error)
      // Continue without Supabase integration if it fails
    }
  }

  // React to a meme with Supabase tracking
  async function react(reaction: MemeReaction, reactionTimeMs?: number) {
    if (isComplete.value) return

    const startTime = Date.now()
    
    // Update local state
    state.value.reactions[state.value.currentIndex] = reaction
    if (reaction === 'laugh') state.value.laughsCount += 1
    state.value.currentIndex += 1

    // Track in Supabase
    if (state.value.gameSessionId) {
      try {
        await progressService.recordMemeReaction(
          state.value.gameSessionId,
          state.value.currentIndex - 1, // The meme index we just reacted to
          reaction,
          reactionTimeMs || (Date.now() - startTime)
        )

        // Update level progress
        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '01-meme-maze',
          'memes',
          false,
          {
            currentIndex: state.value.currentIndex,
            totalMemes: state.value.totalMemes,
            laughsCount: state.value.laughsCount,
            reactions: state.value.reactions
          }
        )

        debugLog('Meme reaction tracked', { 
          memeIndex: state.value.currentIndex - 1, 
          reaction 
        })
      } catch (error) {
        errorLog('Failed to track meme reaction', error)
      }
    }
  }

  // Mark vibe check as completed
  async function markVibeCheckCompleted() {
    state.value.vibeCheckCompleted = true

    if (state.value.gameSessionId) {
      try {
        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '01-meme-maze',
          'vibe_check',
          true,
          { completed: true, timestamp: Date.now() }
        )

        await progressService.recordInteraction(
          state.value.gameSessionId,
          'vibe_check_completed',
          { timestamp: Date.now() }
        )

        debugLog('Vibe check completion tracked')
      } catch (error) {
        errorLog('Failed to track vibe check completion', error)
      }
    }
  }

  // Record vibe response
  async function recordVibeResponse(
    vibeId: string,
    question: string,
    selectedOptionId: number,
    selectedOptionText: string,
    explanation?: string,
    responseTimeMs?: number
  ) {
    if (state.value.gameSessionId) {
      try {
        await progressService.recordVibeResponse(
          state.value.gameSessionId,
          vibeId,
          question,
          selectedOptionId,
          selectedOptionText,
          explanation,
          responseTimeMs
        )

        debugLog('Vibe response tracked', { vibeId, selectedOptionId })
      } catch (error) {
        errorLog('Failed to track vibe response', error)
      }
    }
  }

  // Mark memes as completed
  async function markMemesCompleted() {
    state.value.memesCompleted = true

    if (state.value.gameSessionId) {
      try {
        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '01-meme-maze',
          'memes',
          true,
          {
            completed: true,
            totalReactions: state.value.reactions.filter(r => r !== undefined).length,
            laughsCount: state.value.laughsCount,
            timestamp: Date.now()
          }
        )

        await progressService.recordInteraction(
          state.value.gameSessionId,
          'memes_completed',
          { 
            totalMemes: state.value.totalMemes,
            laughsCount: state.value.laughsCount,
            timestamp: Date.now()
          }
        )

        debugLog('Memes completion tracked')
      } catch (error) {
        errorLog('Failed to track memes completion', error)
      }
    }
  }

  // Add a candle from NumberPlay
  async function addNumberPlayCandle() {
    if (state.value.numberPlayCandles < 23) {
      state.value.numberPlayCandles += 1
      // Check if all candles are now lit to unlock finale
      if (allCandlesLit.value) {
        state.value.finaleUnlocked = true
      }

      if (state.value.gameSessionId) {
        try {
          await progressService.recordInteraction(
            state.value.gameSessionId,
            'number_play_candle_earned',
            { 
              candlesLit: candlesLit.value,
              numberPlayCandles: state.value.numberPlayCandles,
              finaleUnlocked: state.value.finaleUnlocked,
              timestamp: Date.now()
            }
          )

          debugLog('Number play candle earned tracked', { 
            candlesLit: candlesLit.value,
            numberPlayCandles: state.value.numberPlayCandles
          })
        } catch (error) {
          errorLog('Failed to track number play candle earned', error)
        }
      }
    }
  }

  // Mark number play as completed
  async function markNumberPlayCompleted() {
    state.value.numberPlayCompleted = true
    
    // Check if all candles are now lit to unlock finale
    if (allCandlesLit.value) {
      state.value.finaleUnlocked = true
    }

    if (state.value.gameSessionId) {
      try {
        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '01-meme-maze',
          'number_play',
          true,
          {
            completed: true,
            finaleUnlocked: state.value.finaleUnlocked,
            candlesLit: candlesLit.value,
            timestamp: Date.now()
          }
        )

        await progressService.recordInteraction(
          state.value.gameSessionId,
          'number_play_completed',
          { 
            finaleUnlocked: state.value.finaleUnlocked,
            candlesLit: candlesLit.value,
            timestamp: Date.now()
          }
        )

        debugLog('Number play completion tracked')
      } catch (error) {
        errorLog('Failed to track number play completion', error)
      }
    }
  }

  // Record math problem response
  async function recordMathResponse(
    problemIndex: number,
    question: string,
    correctAnswer: number,
    userAnswer?: number,
    responseTimeMs?: number,
    attempts: number = 1
  ) {
    if (state.value.gameSessionId) {
      try {
        await progressService.recordMathResponse(
          state.value.gameSessionId,
          problemIndex,
          question,
          correctAnswer,
          userAnswer,
          responseTimeMs,
          attempts
        )

        debugLog('Math response tracked', { problemIndex, isCorrect: userAnswer === correctAnswer })
      } catch (error) {
        errorLog('Failed to track math response', error)
      }
    }
  }

  // Mark finale as completed
  async function markFinaleCompleted() {
    state.value.finaleCompleted = true

    if (state.value.gameSessionId) {
      try {
        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '01-meme-maze',
          'finale',
          true,
          {
            completed: true,
            totalCandlesLit: candlesLit.value,
            timestamp: Date.now()
          }
        )

        await progressService.recordInteraction(
          state.value.gameSessionId,
          'finale_completed',
          { 
            totalCandlesLit: candlesLit.value,
            timestamp: Date.now()
          }
        )

        // Complete the game session
        const totalTimeSeconds = Math.floor((Date.now() - new Date().getTime()) / 1000)
        await progressService.completeGameSession(state.value.gameSessionId, totalTimeSeconds)

        debugLog('Finale completion tracked and session completed')
      } catch (error) {
        errorLog('Failed to track finale completion', error)
      }
    }
  }

  // Unlock finale
  async function unlockFinale() {
    state.value.finaleUnlocked = true

    if (state.value.gameSessionId) {
      try {
        await progressService.recordInteraction(
          state.value.gameSessionId,
          'finale_unlocked',
          { 
            candlesLit: candlesLit.value,
            timestamp: Date.now()
          }
        )

        debugLog('Finale unlock tracked')
      } catch (error) {
        errorLog('Failed to track finale unlock', error)
      }
    }
  }

  // Reset progress (clears both local and Supabase data)
  async function reset() {
    state.value = loadState(TOTAL_MEMES)
    
    // Initialize a new session
    await initializeSession()
  }

  // Load existing progress from Supabase
  async function loadProgressFromSupabase() {
    try {
      const progress = await progressService.getUserProgress('01-meme-maze')
      
      if (progress.gameSession) {
        state.value.gameSessionId = progress.gameSession.id
        state.value.isInitialized = true

        // Restore progress from Supabase data
        if (progress.memeReactions) {
          progress.memeReactions.forEach(reaction => {
            if (reaction.memeIndex < state.value.reactions.length) {
              state.value.reactions[reaction.memeIndex] = reaction.reaction
              if (reaction.reaction === 'laugh') {
                state.value.laughsCount++
              }
            }
          })
          state.value.currentIndex = progress.memeReactions.length
        }

        // Check level progress
        if (progress.levelProgress) {
          progress.levelProgress.forEach(step => {
            switch (step.currentStep) {
              case 'vibe_check':
                state.value.vibeCheckCompleted = step.stepCompleted
                break
              case 'memes':
                state.value.memesCompleted = step.stepCompleted
                break
              case 'number_play':
                state.value.numberPlayCompleted = step.stepCompleted
                break
              case 'finale':
                state.value.finaleCompleted = step.stepCompleted
                break
            }
          })
        }

        // Check if finale should be unlocked
        if (allCandlesLit.value) {
          state.value.finaleUnlocked = true
        }

        debugLog('Progress loaded from Supabase', { 
          currentIndex: state.value.currentIndex,
          laughsCount: state.value.laughsCount,
          completedSteps: {
            vibeCheck: state.value.vibeCheckCompleted,
            memes: state.value.memesCompleted,
            numberPlay: state.value.numberPlayCompleted,
            finale: state.value.finaleCompleted
          }
        })
      }
    } catch (error) {
      errorLog('Failed to load progress from Supabase', error)
    }
  }

  // Watch for state changes and persist to localStorage
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
        sessionId: s.sessionId,
        gameSessionId: s.gameSessionId,
        isInitialized: s.isInitialized,
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
    addNumberPlayCandle,
    markNumberPlayCompleted,
    markFinaleCompleted,
    unlockFinale,
    recordVibeResponse,
    recordMathResponse,
    initializeSession,
    loadProgressFromSupabase,
  }
})
