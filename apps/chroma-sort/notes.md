# Chroma Sort

Click color tiles in alphabetical order as fast as possible. 5 rounds per game, 4 difficulty levels.

## log
- 2026-04-10: Added arcade-style 3-letter name entry leaderboard. localStorage-based, top 10 per difficulty. Scrollable letter slots (A-Z, 0-9, space) with arrow controls. Remembers last entered name. Gold/silver/bronze rank styling. Shows on game over if score qualifies, always displays existing scores. Leaderboard updates when difficulty selector changes.
- 2026-04-10: Initial build. 28 color pool, 4 difficulties: Easy (6/3-col), Medium (9/3-col), Hard (12/4-col), Insane (16/4-col). Score = base + speed bonus + streak bonus - mistake penalty. Progress bar with color pips showing target order. Timer per round, total time tracked. Rising pitch SFX on correct sequence. Tile clear animation with pop + fade. Anybody + DM Mono typography, dark with accent pink aesthetic.

## features
- 28 named colors in pool
- 4 difficulty levels (6/9/12/16 tiles)
- Score with speed bonus, streak bonus, time bonus
- Visual progress bar with color pips
- Per-round timer
- Tile pop/fade animations
- WebAudio SFX
- Mobile-friendly tap targets

## issues
- No color-blind assist (names are on tiles though)
- Fixed 5 rounds per game
- Leaderboard is localStorage only (no Supabase table yet)

## todos
- Supabase leaderboard (needs chroma_sort_scores table created)
- Endless mode with escalating difficulty
- Color-blind mode with patterns
- OG preview PNG
