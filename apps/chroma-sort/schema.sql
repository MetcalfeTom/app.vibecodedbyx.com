-- Chroma Sort Global Leaderboard
CREATE TABLE IF NOT EXISTS chroma_sort_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  display_name TEXT NOT NULL DEFAULT 'AAA',
  score INTEGER NOT NULL DEFAULT 0,
  total_time REAL NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  palette TEXT NOT NULL DEFAULT 'classic',
  best_streak INTEGER NOT NULL DEFAULT 0,
  mistakes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_chroma_sort_scores_difficulty_score
  ON chroma_sort_scores (difficulty, score DESC);

-- RLS: everyone can read, only auth users can insert their own
ALTER TABLE chroma_sort_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scores" ON chroma_sort_scores
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own scores" ON chroma_sort_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);
