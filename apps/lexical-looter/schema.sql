CREATE TABLE IF NOT EXISTS lexical_looter_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  display_name TEXT NOT NULL DEFAULT '???',
  score INTEGER NOT NULL DEFAULT 0,
  wave INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lexical_looter_scores_score
  ON lexical_looter_scores (score DESC);

ALTER TABLE lexical_looter_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scores" ON lexical_looter_scores
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own scores" ON lexical_looter_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);
