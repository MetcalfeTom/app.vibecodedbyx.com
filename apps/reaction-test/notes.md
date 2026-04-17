# Reaction Test

Simple reaction time test — tap when the screen turns green.

## log
- 2026-04-17: Initial build. 5-round reaction time test. Screen goes red (wait), then green (tap). Measures ms, rates performance (Inhuman to Sleepy). Shows all 5 attempts with best highlighted, average calculated. Supabase leaderboard (reaction_test_scores table) with top 15 sorted by best time. Name input saved to localStorage. Early tap detection. Neon color scheme with ring indicator. Chakra Petch + Azeret Mono typography, dark neon aesthetic with scanline overlay.

## features
- 5-round reaction time measurement
- Random delay (1.5-5s) before green signal
- Early tap detection with retry
- Per-round results with best highlighted
- Final best time and average
- Rating system: Inhuman (<150ms) to Sleepy (>500ms)
- Color-coded times (green=fast, red=slow)
- Neon ring indicator changes color per state
- Supabase leaderboard (top 15 by best time)
- Player name saved to localStorage
- Mobile touch support
- Scanline overlay

## issues
- None yet

## todos
- Multiple game modes (audio reaction, visual pattern)
- Personal history graph
- Share result image
- Streak counter for sub-200ms
