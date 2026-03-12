# Door Access

Elo-ranked door access dashboard. Only the top 10% of players can enter.

## log
- 2026-03-12: Initial build. Supabase-backed Elo ranking system with door visual (open/locked state). Two ways to gain Elo: challenge random opponents (Elo-weighted coin flip, K=32) or answer etiquette riddles (+15 correct, -8 wrong). 14 digital manners riddles with tips. Top 10% threshold calculated dynamically. Leaderboard shows top 20 + your rank if outside. Access card shows Elo, rank, needed Elo for access. Name input with save. 5s challenge cooldown, 15s riddle cooldown. Geist Mono + Instrument Serif typography, minimal dark UI with green(granted)/red(denied) accent.

## issues
- None yet

## todos
- Real-time leaderboard updates via postgres_changes
- More riddle questions
- Daily riddle bonus
- Head-to-head live challenges

## notes
- DB: door_elo table (username, elo, wins, losses, challenges, last_challenge)
- Elo starts at 1000 for new players
- Challenge: picks random opponent, Elo expected score formula, weighted random outcome
- Can only update own row (RLS), so opponent Elo doesn't change on challenges
- Riddles: all about digital etiquette/manners, correct answer is always index 1
- Top 10% cutoff = ceil(totalPlayers * 0.1), minimum 1 player gets access
