# LAUGH.EXE — Try Not to Laugh Challenge

## log
- 2026-02-10: Initial build. "Try not to laugh" game with joke submission, challenge mode, robot face stress states, leaderboards. Two tables: laugh_jokes (submissions) and laugh_streaks (challenge results). Pixelify Sans + Martian Mono typography, green-on-black circuit board aesthetic. Default RLS (read all, write own) — crack counts computed from laugh_streaks.cracked_on_joke rather than counter increments on joke rows.

## issues
- RLS only allows users to update their own rows, so times_shown/times_cracked columns on laugh_jokes are unused. All stats computed from laugh_streaks table instead.
- Funniest jokes leaderboard matches by joke text — if a joke is edited or re-submitted, crack history won't link.
- No explicit primary key on tables (Supabase auto ctid); deletes use created_at + user_id composite.

## todos
- Add real-time updates via postgres_changes for leaderboards
- Could add joke categories/tags
- Animated robot face transitions between stress states
- Sound effects for crack/survive
- Share result cards
