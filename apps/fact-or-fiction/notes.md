# Fact or Fiction

Bizarre claims. Real or fake? You decide.

## log
- 2026-04-10: Initial build. 50 trivia questions (true/false) across 8 categories (nature, science, history, space, food, culture, geography). 3 modes: Classic (15 Qs, 15s timer), Speed (15 Qs, 8s timer), Endless (wrong = game over). Magic link auth via Supabase signInWithOtp, anonymous fallback. Score = 100 base + time bonus + streak bonus. Grade system (S/A/B/C/D). Keyboard shortcuts (F=Fact, N=Fiction, 1/2). Local leaderboard. Instrument Serif + Azeret Mono typography, dark purple/green accent aesthetic.

## features
- 50 fact-or-fiction trivia questions
- 8 categories (nature, science, history, space, food, culture, geography)
- 3 game modes (Classic, Speed, Endless)
- Magic link email authentication via Supabase OTP
- Anonymous auth fallback
- Timed questions with visual timer bar
- Streak bonus scoring
- Keyboard shortcuts (F/N/1/2)
- Grade/rank system
- Explanations after each answer
- Local leaderboard per mode
- Mobile-friendly

## issues
- No Supabase leaderboard (local only)
- Magic link delivery depends on Supabase email config
- 50 questions may feel repetitive on repeated plays

## todos
- Supabase global leaderboard
- Custom quiz creation + sharing via unique links
- More questions (aim for 100+)
- Category filter mode
- Daily challenge with fixed seed
- OG preview PNG
