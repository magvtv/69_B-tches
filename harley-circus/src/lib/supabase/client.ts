import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable auto-refresh for now since we're not using authentication
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types (matching our schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          session_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          level_slug: string
          status: 'in_progress' | 'completed' | 'abandoned'
          started_at: string
          completed_at: string | null
          total_time_seconds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level_slug: string
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          total_time_seconds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level_slug?: string
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          total_time_seconds?: number
          created_at?: string
          updated_at?: string
        }
      }
      level_progress: {
        Row: {
          id: string
          session_id: string
          level_slug: string
          current_step: string
          step_completed: boolean
          step_data: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          level_slug: string
          current_step: string
          step_completed?: boolean
          step_data?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          level_slug?: string
          current_step?: string
          step_completed?: boolean
          step_data?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      meme_reactions: {
        Row: {
          id: string
          session_id: string
          meme_index: number
          reaction: 'laugh' | 'meh'
          reaction_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          meme_index: number
          reaction: 'laugh' | 'meh'
          reaction_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          meme_index?: number
          reaction?: 'laugh' | 'meh'
          reaction_time_ms?: number | null
          created_at?: string
        }
      }
      vibe_responses: {
        Row: {
          id: string
          session_id: string
          vibe_id: string
          question: string
          selected_option_id: number
          selected_option_text: string
          explanation: string | null
          response_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          vibe_id: string
          question: string
          selected_option_id: number
          selected_option_text: string
          explanation?: string | null
          response_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          vibe_id?: string
          question?: string
          selected_option_id?: number
          selected_option_text?: string
          explanation?: string | null
          response_time_ms?: number | null
          created_at?: string
        }
      }
      math_responses: {
        Row: {
          id: string
          session_id: string
          problem_index: number
          question: string
          correct_answer: number
          user_answer: number | null
          is_correct: boolean | null
          response_time_ms: number | null
          attempts: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          problem_index: number
          question: string
          correct_answer: number
          user_answer?: number | null
          is_correct?: boolean | null
          response_time_ms?: number | null
          attempts?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          problem_index?: number
          question?: string
          correct_answer?: number
          user_answer?: number | null
          is_correct?: boolean | null
          response_time_ms?: number | null
          attempts?: number
          created_at?: string
        }
      }
      user_interactions: {
        Row: {
          id: string
          session_id: string
          event_type: string
          event_data: Record<string, unknown>
          timestamp: string
        }
        Insert: {
          id?: string
          session_id: string
          event_type: string
          event_data?: Record<string, unknown>
          timestamp?: string
        }
        Update: {
          id?: string
          session_id?: string
          event_type?: string
          event_data?: Record<string, unknown>
          timestamp?: string
        }
      }
    }
  }
}

export default supabase
