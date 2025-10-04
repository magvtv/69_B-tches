import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { progressService } from '../lib/supabase/progressService'
import { rewardEngine } from '../lib/rewardEngine'
// import { audioCache } from '../lib/audioCache' // Unused for now
import { debugLog, errorLog } from '../config/environment'

export interface SongChallenge {
  id: string
  type: string
  songTitle: string
  artist: string
  spotifyId?: string
  question: string
  lyricSnippet?: string
  options: string[]
  correctAnswer: number
  context: string
  reward: string
  special?: boolean
  final?: boolean
}

interface SongsOriginState {
  currentChallengeIndex: number
  totalChallenges: number
  completedChallenges: number
  score: number
  responses: Array<{
    challengeId: string
    selectedOption: number
    isCorrect: boolean
    responseTime: number
    timestamp: number
  }>
  levelCompleted: boolean
  voiceNoteCompleted: boolean
  backgroundAudioPlaying: boolean
  sessionId: string | null
  gameSessionId: string | null
  isInitialized: boolean
}

const STORAGE_KEY = 'songs-origin-progress-v1'

function loadState(): SongsOriginState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SongsOriginState>
      return {
        currentChallengeIndex: parsed.currentChallengeIndex ?? 0,
        totalChallenges: parsed.totalChallenges ?? 26, // Updated to match meta.json
        completedChallenges: parsed.completedChallenges ?? 0,
        score: parsed.score ?? 0,
        responses: parsed.responses ?? [],
        levelCompleted: parsed.levelCompleted ?? false,
        voiceNoteCompleted: parsed.voiceNoteCompleted ?? false,
        backgroundAudioPlaying: parsed.backgroundAudioPlaying ?? false,
        sessionId: parsed.sessionId ?? null,
        gameSessionId: parsed.gameSessionId ?? null,
        isInitialized: parsed.isInitialized ?? false,
      }
    }
  } catch {
    // ignore
  }
  return {
    currentChallengeIndex: 0,
    totalChallenges: 26, // Updated to match meta.json
    completedChallenges: 0,
    score: 0,
    responses: [],
    levelCompleted: false,
    voiceNoteCompleted: false,
    backgroundAudioPlaying: false,
    sessionId: null,
    gameSessionId: null,
    isInitialized: false,
  }
}

export const useSongsOriginStore = defineStore('songsOrigin', () => {
  const state = ref<SongsOriginState>(loadState())

  const progressPercentage = computed(
    () => (state.value.completedChallenges / 28) * 100, // 26 challenges + 2 voice note candles = 28 total
  )

  const isComplete = computed(() => state.value.levelCompleted)
  const canAccessVoiceNote = computed(
    () =>
      state.value.completedChallenges >= state.value.totalChallenges &&
      !state.value.voiceNoteCompleted,
  )

  async function initializeSession() {
    if (state.value.isInitialized) {
      return
    }

    try {
      debugLog('Initializing Supabase session for songs origin')

      const userSession = await progressService.initializeSession()
      state.value.sessionId = userSession.sessionId

      const gameSession = await progressService.startGameSession('02-songs-origin')
      state.value.gameSessionId = gameSession.id

      state.value.isInitialized = true

      await progressService.recordInteraction(gameSession.id, 'level_started', {
        level: '02-songs-origin',
        timestamp: Date.now(),
      })

      debugLog('Session initialized successfully', {
        sessionId: userSession.sessionId,
        gameSessionId: gameSession.id,
      })
    } catch (error) {
      errorLog('Failed to initialize session', error)
    }
  }

  async function answerChallenge(
    challengeId: string,
    selectedOption: number,
    isCorrect: boolean,
    responseTime: number,
  ) {
    const timestamp = Date.now()

    state.value.responses.push({
      challengeId,
      selectedOption,
      isCorrect,
      responseTime,
      timestamp,
    })

    if (isCorrect) {
      state.value.score++
    }

    state.value.completedChallenges++
    state.value.currentChallengeIndex++

    try {
      const challenge = getChallengeById(challengeId)
      if (challenge) {
        rewardEngine.awardReward(challengeId, challenge.reward)
      }
    } catch (error) {
      errorLog('Failed to award reward', error)
    }

    if (state.value.gameSessionId) {
      try {
        await progressService.recordInteraction(state.value.gameSessionId, 'challenge_answered', {
          challengeId,
          selectedOption,
          isCorrect,
          responseTime,
          timestamp,
        })

        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '02-songs-origin',
          'challenges',
          false,
          {
            currentChallengeIndex: state.value.currentChallengeIndex,
            completedChallenges: state.value.completedChallenges,
            score: state.value.score,
            responses: state.value.responses,
          },
        )

        debugLog('Challenge answer tracked', { challengeId, isCorrect })
      } catch (error) {
        errorLog('Failed to track challenge answer', error)
      }
    }

    // Level is complete when all 21 challenges are done (voice note adds 2 more candles)
    if (state.value.completedChallenges >= state.value.totalChallenges) {
      await completeLevel()
    }
  }

  async function completeLevel() {
    state.value.levelCompleted = true

    const percentage = (state.value.score / state.value.totalChallenges) * 100
    const coupon = rewardEngine.generateCoupon(state.value.score, state.value.totalChallenges)
    const darePrompt = rewardEngine.generateDarePrompt(
      state.value.score,
      state.value.totalChallenges,
    )

    if (state.value.gameSessionId) {
      try {
        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '02-songs-origin',
          'level_complete',
          true,
          {
            completed: true,
            score: state.value.score,
            totalChallenges: state.value.totalChallenges,
            percentage,
            coupon: coupon ? coupon.id : null,
            darePrompt: darePrompt ? darePrompt.id : null,
            timestamp: Date.now(),
          },
        )

        await progressService.recordInteraction(state.value.gameSessionId, 'level_completed', {
          score: state.value.score,
          totalChallenges: state.value.totalChallenges,
          percentage,
          timestamp: Date.now(),
        })

        debugLog('Level completion tracked', {
          score: state.value.score,
          percentage,
          coupon: coupon?.id,
          darePrompt: darePrompt?.id,
        })
      } catch (error) {
        errorLog('Failed to track level completion', error)
      }
    }
  }

  async function completeVoiceNote() {
    state.value.voiceNoteCompleted = true

    // Add 2 candles for voice note completion (candles 22 and 23)
    state.value.completedChallenges += 2

    try {
      rewardEngine.awardReward('voice_note_challenge', 'voice_note_token')
    } catch (error) {
      errorLog('Failed to award voice note reward', error)
    }

    if (state.value.gameSessionId) {
      try {
        await progressService.recordInteraction(state.value.gameSessionId, 'voice_note_completed', {
          timestamp: Date.now(),
        })

        await progressService.updateLevelProgress(
          state.value.gameSessionId,
          '02-songs-origin',
          'voice_note_complete',
          true,
          {
            completed: true,
            completedChallenges: state.value.completedChallenges,
            timestamp: Date.now(),
          },
        )

        debugLog('Voice note completion tracked', {
          completedChallenges: state.value.completedChallenges,
        })
      } catch (error) {
        errorLog('Failed to track voice note completion', error)
      }
    }
  }

  function setBackgroundAudioPlaying(playing: boolean) {
    state.value.backgroundAudioPlaying = playing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getChallengeById(_challengeId: string): SongChallenge | null {
    // TODO: Implement challenge lookup from meta.json or dynamic data
    return null
  }

  async function reset() {
    state.value = loadState()
    await initializeSession()
  }

  function getStats() {
    return {
      currentChallengeIndex: state.value.currentChallengeIndex,
      completedChallenges: state.value.completedChallenges,
      totalChallenges: state.value.totalChallenges,
      totalCandles: 28, // 26 challenges + 2 voice note candles
      score: state.value.score,
      percentage: progressPercentage.value,
      levelCompleted: state.value.levelCompleted,
      voiceNoteCompleted: state.value.voiceNoteCompleted,
    }
  }

  watch(
    state,
    (s) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentChallengeIndex: s.currentChallengeIndex,
            totalChallenges: s.totalChallenges,
            completedChallenges: s.completedChallenges,
            score: s.score,
            responses: s.responses,
            levelCompleted: s.levelCompleted,
            voiceNoteCompleted: s.voiceNoteCompleted,
            backgroundAudioPlaying: s.backgroundAudioPlaying,
            sessionId: s.sessionId,
            gameSessionId: s.gameSessionId,
            isInitialized: s.isInitialized,
          }),
        )
      } catch {
        // ignore
      }
    },
    { deep: true },
  )

  return {
    state,
    progressPercentage,
    isComplete,
    canAccessVoiceNote,
    initializeSession,
    answerChallenge,
    completeLevel,
    completeVoiceNote,
    setBackgroundAudioPlaying,
    reset,
    getStats,
  }
})
