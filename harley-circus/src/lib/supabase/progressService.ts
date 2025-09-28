import { supabase, Database } from './client'
import { debugLog, errorLog } from '../../config/environment'

// Type definitions for our progress tracking
export interface UserSession {
  id: string
  sessionId: string
  createdAt: string
}

export interface GameSession {
  id: string
  userId: string
  levelSlug: string
  status: 'in_progress' | 'completed' | 'abandoned'
  startedAt: string
  completedAt?: string
  totalTimeSeconds: number
}

export interface LevelProgress {
  id: string
  sessionId: string
  levelSlug: string
  currentStep: string
  stepCompleted: boolean
  stepData: Record<string, unknown>
}

export interface MemeReaction {
  id: string
  sessionId: string
  memeIndex: number
  reaction: 'laugh' | 'meh'
  reactionTimeMs?: number
}

export interface VibeResponse {
  id: string
  sessionId: string
  vibeId: string
  question: string
  selectedOptionId: number
  selectedOptionText: string
  explanation?: string
  responseTimeMs?: number
}

export interface MathResponse {
  id: string
  sessionId: string
  problemIndex: number
  question: string
  correctAnswer: number
  userAnswer?: number
  isCorrect?: boolean
  responseTimeMs?: number
  attempts: number
}

export interface UserInteraction {
  id: string
  sessionId: string
  eventType: string
  eventData: Record<string, unknown>
  timestamp: string
}

class ProgressService {
  private currentSessionId: string | null = null
  private currentUserId: string | null = null

  // Initialize a new user session
  async initializeSession(): Promise<UserSession> {
    try {
      const sessionId = this.generateSessionId()
      
      // Create user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({ session_id: sessionId })
        .select()
        .single()

      if (userError) {
        throw new Error(`Failed to create user: ${userError.message}`)
      }

      this.currentUserId = userData.id
      this.currentSessionId = sessionId

      debugLog('User session initialized', { userId: userData.id, sessionId })
      
      return {
        id: userData.id,
        sessionId: userData.session_id,
        createdAt: userData.created_at
      }
    } catch (error) {
      errorLog('Failed to initialize session', error)
      throw error
    }
  }

  // Start a new game session for a specific level
  async startGameSession(levelSlug: string): Promise<GameSession> {
    try {
      if (!this.currentUserId) {
        await this.initializeSession()
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: this.currentUserId!,
          level_slug: levelSlug,
          status: 'in_progress'
        })
        .select()
        .single()

      if (sessionError) {
        throw new Error(`Failed to create game session: ${sessionError.message}`)
      }

      debugLog('Game session started', { sessionId: sessionData.id, level: levelSlug })
      
      return {
        id: sessionData.id,
        userId: sessionData.user_id,
        levelSlug: sessionData.level_slug,
        status: sessionData.status,
        startedAt: sessionData.started_at,
        totalTimeSeconds: sessionData.total_time_seconds
      }
    } catch (error) {
      errorLog('Failed to start game session', error)
      throw error
    }
  }

  // Update level progress
  async updateLevelProgress(
    sessionId: string,
    levelSlug: string,
    currentStep: string,
    stepCompleted: boolean = false,
    stepData?: Record<string, unknown>
  ): Promise<LevelProgress> {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('level_progress')
        .upsert({
          session_id: sessionId,
          level_slug: levelSlug,
          current_step: currentStep,
          step_completed: stepCompleted,
          step_data: stepData
        })
        .select()
        .single()

      if (progressError) {
        throw new Error(`Failed to update level progress: ${progressError.message}`)
      }

      debugLog('Level progress updated', { 
        sessionId, 
        step: currentStep, 
        completed: stepCompleted 
      })
      
      return {
        id: progressData.id,
        sessionId: progressData.session_id,
        levelSlug: progressData.level_slug,
        currentStep: progressData.current_step,
        stepCompleted: progressData.step_completed,
        stepData: progressData.step_data
      }
    } catch (error) {
      errorLog('Failed to update level progress', error)
      throw error
    }
  }

  // Record meme reaction
  async recordMemeReaction(
    sessionId: string,
    memeIndex: number,
    reaction: 'laugh' | 'meh',
    reactionTimeMs?: number
  ): Promise<MemeReaction> {
    try {
      const { data: reactionData, error: reactionError } = await supabase
        .from('meme_reactions')
        .insert({
          session_id: sessionId,
          meme_index: memeIndex,
          reaction,
          reaction_time_ms: reactionTimeMs
        })
        .select()
        .single()

      if (reactionError) {
        throw new Error(`Failed to record meme reaction: ${reactionError.message}`)
      }

      debugLog('Meme reaction recorded', { 
        sessionId, 
        memeIndex, 
        reaction, 
        timeMs: reactionTimeMs 
      })
      
      return {
        id: reactionData.id,
        sessionId: reactionData.session_id,
        memeIndex: reactionData.meme_index,
        reaction: reactionData.reaction,
        reactionTimeMs: reactionData.reaction_time_ms
      }
    } catch (error) {
      errorLog('Failed to record meme reaction', error)
      throw error
    }
  }

  // Record vibe check response
  async recordVibeResponse(
    sessionId: string,
    vibeId: string,
    question: string,
    selectedOptionId: number,
    selectedOptionText: string,
    explanation?: string,
    responseTimeMs?: number
  ): Promise<VibeResponse> {
    try {
      const { data: vibeData, error: vibeError } = await supabase
        .from('vibe_responses')
        .insert({
          session_id: sessionId,
          vibe_id: vibeId,
          question,
          selected_option_id: selectedOptionId,
          selected_option_text: selectedOptionText,
          explanation,
          response_time_ms: responseTimeMs
        })
        .select()
        .single()

      if (vibeError) {
        throw new Error(`Failed to record vibe response: ${vibeError.message}`)
      }

      debugLog('Vibe response recorded', { 
        sessionId, 
        vibeId, 
        optionId: selectedOptionId 
      })
      
      return {
        id: vibeData.id,
        sessionId: vibeData.session_id,
        vibeId: vibeData.vibe_id,
        question: vibeData.question,
        selectedOptionId: vibeData.selected_option_id,
        selectedOptionText: vibeData.selected_option_text,
        explanation: vibeData.explanation,
        responseTimeMs: vibeData.response_time_ms
      }
    } catch (error) {
      errorLog('Failed to record vibe response', error)
      throw error
    }
  }

  // Record math problem response
  async recordMathResponse(
    sessionId: string,
    problemIndex: number,
    question: string,
    correctAnswer: number,
    userAnswer?: number,
    responseTimeMs?: number,
    attempts: number = 1
  ): Promise<MathResponse> {
    try {
      const isCorrect = userAnswer !== undefined ? userAnswer === correctAnswer : null

      const { data: mathData, error: mathError } = await supabase
        .from('math_responses')
        .insert({
          session_id: sessionId,
          problem_index: problemIndex,
          question,
          correct_answer: correctAnswer,
          user_answer: userAnswer,
          is_correct: isCorrect,
          response_time_ms: responseTimeMs,
          attempts
        })
        .select()
        .single()

      if (mathError) {
        throw new Error(`Failed to record math response: ${mathError.message}`)
      }

      debugLog('Math response recorded', { 
        sessionId, 
        problemIndex, 
        isCorrect, 
        attempts 
      })
      
      return {
        id: mathData.id,
        sessionId: mathData.session_id,
        problemIndex: mathData.problem_index,
        question: mathData.question,
        correctAnswer: mathData.correct_answer,
        userAnswer: mathData.user_answer,
        isCorrect: mathData.is_correct,
        responseTimeMs: mathData.response_time_ms,
        attempts: mathData.attempts
      }
    } catch (error) {
      errorLog('Failed to record math response', error)
      throw error
    }
  }

  // Record general user interaction
  async recordInteraction(
    sessionId: string,
    eventType: string,
    eventData?: Record<string, unknown>
  ): Promise<UserInteraction> {
    try {
      const { data: interactionData, error: interactionError } = await supabase
        .from('user_interactions')
        .insert({
          session_id: sessionId,
          event_type: eventType,
          event_data: eventData
        })
        .select()
        .single()

      if (interactionError) {
        throw new Error(`Failed to record interaction: ${interactionError.message}`)
      }

      debugLog('User interaction recorded', { 
        sessionId, 
        eventType, 
        eventData 
      })
      
      return {
        id: interactionData.id,
        sessionId: interactionData.session_id,
        eventType: interactionData.event_type,
        eventData: interactionData.event_data,
        timestamp: interactionData.timestamp
      }
    } catch (error) {
      errorLog('Failed to record interaction', error)
      throw error
    }
  }

  // Complete a game session
  async completeGameSession(sessionId: string, totalTimeSeconds: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_time_seconds: totalTimeSeconds
        })
        .eq('id', sessionId)

      if (error) {
        throw new Error(`Failed to complete game session: ${error.message}`)
      }

      debugLog('Game session completed', { sessionId, totalTimeSeconds })
    } catch (error) {
      errorLog('Failed to complete game session', error)
      throw error
    }
  }

  // Get user's progress for a specific level
  async getUserProgress(levelSlug: string): Promise<{
    gameSession?: GameSession
    levelProgress?: LevelProgress[]
    memeReactions?: MemeReaction[]
    vibeResponses?: VibeResponse[]
    mathResponses?: MathResponse[]
  }> {
    try {
      if (!this.currentUserId) {
        return {}
      }

      // Get game session
      const { data: sessionData } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', this.currentUserId)
        .eq('level_slug', levelSlug)
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      if (!sessionData) {
        return {}
      }

      const gameSession: GameSession = {
        id: sessionData.id,
        userId: sessionData.user_id,
        levelSlug: sessionData.level_slug,
        status: sessionData.status,
        startedAt: sessionData.started_at,
        completedAt: sessionData.completed_at,
        totalTimeSeconds: sessionData.total_time_seconds
      }

      // Get related data
      const [levelProgressResult, memeReactionsResult, vibeResponsesResult, mathResponsesResult] = await Promise.all([
        supabase.from('level_progress').select('*').eq('session_id', sessionData.id),
        supabase.from('meme_reactions').select('*').eq('session_id', sessionData.id),
        supabase.from('vibe_responses').select('*').eq('session_id', sessionData.id),
        supabase.from('math_responses').select('*').eq('session_id', sessionData.id)
      ])

      return {
        gameSession,
        levelProgress: levelProgressResult.data?.map(p => ({
          id: p.id,
          sessionId: p.session_id,
          levelSlug: p.level_slug,
          currentStep: p.current_step,
          stepCompleted: p.step_completed,
          stepData: p.step_data
        })),
        memeReactions: memeReactionsResult.data?.map(r => ({
          id: r.id,
          sessionId: r.session_id,
          memeIndex: r.meme_index,
          reaction: r.reaction,
          reactionTimeMs: r.reaction_time_ms
        })),
        vibeResponses: vibeResponsesResult.data?.map(v => ({
          id: v.id,
          sessionId: v.session_id,
          vibeId: v.vibe_id,
          question: v.question,
          selectedOptionId: v.selected_option_id,
          selectedOptionText: v.selected_option_text,
          explanation: v.explanation,
          responseTimeMs: v.response_time_ms
        })),
        mathResponses: mathResponsesResult.data?.map(m => ({
          id: m.id,
          sessionId: m.session_id,
          problemIndex: m.problem_index,
          question: m.question,
          correctAnswer: m.correct_answer,
          userAnswer: m.user_answer,
          isCorrect: m.is_correct,
          responseTimeMs: m.response_time_ms,
          attempts: m.attempts
        }))
      }
    } catch (error) {
      errorLog('Failed to get user progress', error)
      return {}
    }
  }

  // Utility method to generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get current session ID
  getCurrentSessionId(): string | null {
    return this.currentSessionId
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.currentUserId
  }
}

// Export singleton instance
export const progressService = new ProgressService()
export default progressService
