-- Harley Circus Database Schema
-- This file contains the SQL schema for tracking user progress in circus levels

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for future user management)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level_slug TEXT NOT NULL, -- e.g., '01-meme-maze'
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Level progress table (tracks overall progress within a level)
CREATE TABLE IF NOT EXISTS level_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  level_slug TEXT NOT NULL,
  current_step TEXT NOT NULL, -- 'vibe_check', 'memes', 'number_play', 'finale'
  step_completed BOOLEAN DEFAULT FALSE,
  step_data JSONB, -- Flexible data storage for step-specific information
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meme reactions table (specific to meme-maze level)
CREATE TABLE IF NOT EXISTS meme_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  meme_index INTEGER NOT NULL,
  reaction TEXT NOT NULL, -- 'laugh', 'meh'
  reaction_time_ms INTEGER, -- Time taken to react
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vibe check responses table
CREATE TABLE IF NOT EXISTS vibe_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  vibe_id TEXT NOT NULL, -- e.g., 'V00', 'V01', 'V02'
  question TEXT NOT NULL,
  selected_option_id INTEGER NOT NULL,
  selected_option_text TEXT NOT NULL,
  explanation TEXT,
  response_time_ms INTEGER, -- Time taken to respond
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Math problem responses table
CREATE TABLE IF NOT EXISTS math_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  problem_index INTEGER NOT NULL,
  question TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  user_answer INTEGER,
  is_correct BOOLEAN,
  response_time_ms INTEGER,
  attempts INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interactions table (general event tracking)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'meme_reaction', 'vibe_response', 'math_answer', 'level_complete', etc.
  event_data JSONB, -- Flexible data storage
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_level_slug ON game_sessions(level_slug);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_level_progress_session_id ON level_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_meme_reactions_session_id ON meme_reactions(session_id);
CREATE INDEX IF NOT EXISTS idx_vibe_responses_session_id ON vibe_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_math_responses_session_id ON math_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE meme_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for now, allow all operations - you can restrict later based on user authentication)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_sessions" ON game_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on level_progress" ON level_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on meme_reactions" ON meme_reactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on vibe_responses" ON vibe_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on math_responses" ON math_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_interactions" ON user_interactions FOR ALL USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_level_progress_updated_at BEFORE UPDATE ON level_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
