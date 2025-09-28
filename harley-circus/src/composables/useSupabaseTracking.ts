import { ref, onMounted } from 'vue'
import { progressService } from '../lib/supabase/progressService'
import { debugLog, errorLog } from '../config/environment'

export interface TrackingOptions {
  levelSlug: string
  autoInitialize?: boolean
  enableLocalStorage?: boolean
}

export function useSupabaseTracking(options: TrackingOptions) {
  const isInitialized = ref(false)
  const sessionId = ref<string | null>(null)
  const gameSessionId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize tracking
  const initialize = async () => {
    if (isInitialized.value) return

    isLoading.value = true
    error.value = null

    try {
      debugLog(`Initializing Supabase tracking for level: ${options.levelSlug}`)
      
      // Initialize user session
      const userSession = await progressService.initializeSession()
      sessionId.value = userSession.sessionId

      // Start game session
      const gameSession = await progressService.startGameSession(options.levelSlug)
      gameSessionId.value = gameSession.id

      isInitialized.value = true

      // Record level start
      await trackEvent('level_started', {
        level: options.levelSlug,
        timestamp: Date.now()
      })

      debugLog('Supabase tracking initialized successfully', { 
        sessionId: userSession.sessionId, 
        gameSessionId: gameSession.id 
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      errorLog('Failed to initialize Supabase tracking', err)
    } finally {
      isLoading.value = false
    }
  }

  // Track a general event
  const trackEvent = async (eventType: string, eventData?: Record<string, unknown>) => {
    if (!gameSessionId.value) {
      debugLog('Cannot track event: no active game session')
      return
    }

    try {
      await progressService.recordInteraction(gameSessionId.value, eventType, eventData)
      debugLog('Event tracked', { eventType, eventData })
    } catch (err) {
      errorLog('Failed to track event', err)
    }
  }

  // Track level progress
  const trackProgress = async (
    currentStep: string,
    stepCompleted: boolean = false,
    stepData?: Record<string, unknown>
  ) => {
    if (!gameSessionId.value) {
      debugLog('Cannot track progress: no active game session')
      return
    }

    try {
      await progressService.updateLevelProgress(
        gameSessionId.value,
        options.levelSlug,
        currentStep,
        stepCompleted,
        stepData
      )
      debugLog('Progress tracked', { currentStep, stepCompleted, stepData })
    } catch (err) {
      errorLog('Failed to track progress', err)
    }
  }

  // Track meme reaction (specific to meme-maze)
  const trackMemeReaction = async (
    memeIndex: number,
    reaction: 'laugh' | 'meh',
    reactionTimeMs?: number
  ) => {
    if (!gameSessionId.value) {
      debugLog('Cannot track meme reaction: no active game session')
      return
    }

    try {
      await progressService.recordMemeReaction(
        gameSessionId.value,
        memeIndex,
        reaction,
        reactionTimeMs
      )
      debugLog('Meme reaction tracked', { memeIndex, reaction, reactionTimeMs })
    } catch (err) {
      errorLog('Failed to track meme reaction', err)
    }
  }

  // Track vibe response
  const trackVibeResponse = async (
    vibeId: string,
    question: string,
    selectedOptionId: number,
    selectedOptionText: string,
    explanation?: string,
    responseTimeMs?: number
  ) => {
    if (!gameSessionId.value) {
      debugLog('Cannot track vibe response: no active game session')
      return
    }

    try {
      await progressService.recordVibeResponse(
        gameSessionId.value,
        vibeId,
        question,
        selectedOptionId,
        selectedOptionText,
        explanation,
        responseTimeMs
      )
      debugLog('Vibe response tracked', { vibeId, selectedOptionId })
    } catch (err) {
      errorLog('Failed to track vibe response', err)
    }
  }

  // Track math response
  const trackMathResponse = async (
    problemIndex: number,
    question: string,
    correctAnswer: number,
    userAnswer?: number,
    responseTimeMs?: number,
    attempts: number = 1
  ) => {
    if (!gameSessionId.value) {
      debugLog('Cannot track math response: no active game session')
      return
    }

    try {
      await progressService.recordMathResponse(
        gameSessionId.value,
        problemIndex,
        question,
        correctAnswer,
        userAnswer,
        responseTimeMs,
        attempts
      )
      debugLog('Math response tracked', { problemIndex, isCorrect: userAnswer === correctAnswer })
    } catch (err) {
      errorLog('Failed to track math response', err)
    }
  }

  // Complete the level
  const completeLevel = async (totalTimeSeconds?: number) => {
    if (!gameSessionId.value) {
      debugLog('Cannot complete level: no active game session')
      return
    }

    try {
      const timeSeconds = totalTimeSeconds || Math.floor(Date.now() / 1000)
      await progressService.completeGameSession(gameSessionId.value, timeSeconds)
      
      await trackEvent('level_completed', {
        level: options.levelSlug,
        totalTimeSeconds: timeSeconds,
        timestamp: Date.now()
      })

      debugLog('Level completed', { level: options.levelSlug, totalTimeSeconds: timeSeconds })
    } catch (err) {
      errorLog('Failed to complete level', err)
    }
  }

  // Get user progress
  const getUserProgress = async () => {
    try {
      return await progressService.getUserProgress(options.levelSlug)
    } catch (err) {
      errorLog('Failed to get user progress', err)
      return null
    }
  }

  // Auto-initialize if enabled
  onMounted(() => {
    if (options.autoInitialize !== false) {
      initialize()
    }
  })

  return {
    // State
    isInitialized,
    sessionId,
    gameSessionId,
    isLoading,
    error,
    
    // Methods
    initialize,
    trackEvent,
    trackProgress,
    trackMemeReaction,
    trackVibeResponse,
    trackMathResponse,
    completeLevel,
    getUserProgress,
  }
}
