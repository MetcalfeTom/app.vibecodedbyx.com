-- Create Universal Tables (The New Truth)

-- universal_profiles
CREATE TABLE IF NOT EXISTS universal_profiles (
  user_id UUID PRIMARY KEY DEFAULT auth.uid(),
  username TEXT UNIQUE,
  avatar TEXT,
  bio TEXT,
  theme_colors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- economy_balances
CREATE TABLE IF NOT EXISTS economy_balances (
  user_id UUID PRIMARY KEY DEFAULT auth.uid(),
  participation_score INT DEFAULT 0,
  reputation_score INT DEFAULT 0,
  curation_score INT DEFAULT 0,
  inventory JSONB DEFAULT '[]'::JSONB
);

-- economy_ledger
CREATE TABLE IF NOT EXISTS economy_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  domain TEXT NOT NULL, -- 'participation', etc.
  amount INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- governance_votes
CREATE TABLE IF NOT EXISTS governance_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id UUID NOT NULL DEFAULT auth.uid(),
  target_id TEXT NOT NULL,
  vote_weight INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backward Compatibility Views

-- sloppygram_profiles
CREATE OR REPLACE VIEW sloppygram_profiles AS
SELECT * FROM universal_profiles;

-- sloppygram_karma
CREATE OR REPLACE VIEW sloppygram_karma AS
SELECT
  user_id,
  (participation_score + reputation_score) as karma_total,
  reputation_score as rank
FROM economy_balances;

-- Security: Enable RLS (Row Level Security)
ALTER TABLE universal_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE economy_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE economy_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_votes ENABLE ROW LEVEL SECURITY;

-- Allow Public Read
CREATE POLICY "Public profiles are viewable by everyone" ON universal_profiles FOR SELECT USING (true);
CREATE POLICY "Public balances are viewable by everyone" ON economy_balances FOR SELECT USING (true);
CREATE POLICY "Public ledger is viewable by everyone" ON economy_ledger FOR SELECT USING (true);
CREATE POLICY "Public votes are viewable by everyone" ON governance_votes FOR SELECT USING (true);

-- Allow Auth User Insert/Update on own rows

-- universal_profiles
CREATE POLICY "Users can insert their own profile" ON universal_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON universal_profiles FOR UPDATE USING (auth.uid() = user_id);

-- economy_balances
CREATE POLICY "Users can insert their own balance" ON economy_balances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own balance" ON economy_balances FOR UPDATE USING (auth.uid() = user_id);

-- economy_ledger
CREATE POLICY "Users can insert their own ledger entry" ON economy_ledger FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ledger entry" ON economy_ledger FOR UPDATE USING (auth.uid() = user_id);

-- governance_votes
CREATE POLICY "Users can insert their own vote" ON governance_votes FOR INSERT WITH CHECK (auth.uid() = voter_id);
CREATE POLICY "Users can update their own vote" ON governance_votes FOR UPDATE USING (auth.uid() = voter_id);

-- Social Layer (Mission 1.5)

-- universal_chat
CREATE TABLE IF NOT EXISTS universal_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  content TEXT NOT NULL,
  channel TEXT DEFAULT 'global',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- universal_notifications
CREATE TABLE IF NOT EXISTS universal_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- recipient
  type TEXT NOT NULL, -- 'mention', 'reward', 'system'
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security: Enable RLS

ALTER TABLE universal_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE universal_notifications ENABLE ROW LEVEL SECURITY;

-- universal_chat Policies
CREATE POLICY "Public chat is viewable by everyone" ON universal_chat FOR SELECT USING (true);
CREATE POLICY "Users can insert their own chat messages" ON universal_chat FOR INSERT WITH CHECK (auth.uid() = user_id);

-- universal_notifications Policies
CREATE POLICY "Users can view their own notifications" ON universal_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON universal_notifications FOR UPDATE USING (auth.uid() = user_id);
