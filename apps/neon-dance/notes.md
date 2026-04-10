# Neon Dance

Hit the arrows to the beat. Don't miss a step.

## log
- 2026-04-10: Initial build. Just Dance-style 4-lane rhythm game. 8 procedural songs (120-170 BPM, easy/med/hard). Seeded PRNG chart generator with density/doubleChance/holdChance per difficulty. Timing windows: PERFECT(45ms), GREAT(90ms), GOOD(140ms), MISS(200ms). Scoring: P=300, Gr=200, Go=100 × multiplier (×1-×4 based on combo). Procedural WebAudio beat track (kick/snare/hat/bass). SCROLL_SPEED=400 px/s. Mobile touch buttons + keyboard (arrows/WASD). Song select, grade system (S/A/B/C/D). Bungee + DM Mono typography, dark neon multi-color aesthetic.

## features
- 8 procedural songs across 3 difficulties
- 4-lane arrow system (left/down/up/right)
- Procedural chart generation with seeded PRNG
- Procedural WebAudio beat tracks
- Timing windows (PERFECT/GREAT/GOOD/MISS)
- Combo system with multiplier (up to 4x)
- Hold notes
- Song select screen with difficulty indicators
- Grade system (S/A/B/C/D)
- Mobile touch controls
- Keyboard support (arrows + WASD)

## issues
- No leaderboard
- Songs are procedural audio only (no real music)
- Hold notes may feel imprecise on mobile

## todos
- Supabase leaderboard
- More songs
- Custom song BPM editor
- Visual effects on perfect hits
- OG preview PNG
