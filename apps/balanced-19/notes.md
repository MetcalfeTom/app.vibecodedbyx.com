# Balanced 19

Decompose decimal numbers into balanced base-19 representation using digits from -9 to +9.

## log
- 2026-04-11: Initial build. Balanced enneadecimal (base 19) decomposition puzzle. Given a target number, place digits (-9 to +9) into positional slots (19⁰, 19¹, 19², etc.) so the weighted sum equals the target. 4 difficulty levels: Easy (1-50, 2 slots), Medium (20-400, 3 slots), Hard (100-7000, 4 slots), Insane (1000-135k, 5 slots). Click digit to select, click slot to place. Real-time feedback showing current value and difference from target. Skip shows answer. Keyboard support (minus key + digit). Streak tracking, localStorage persistence. Playfair Display + IBM Plex Mono typography, deep navy/gold aesthetic with geometric conic-gradient background.

## features
- Balanced base-19 number system (digits -9 to +9)
- toBalanced19() conversion algorithm with positive modulo
- 4 difficulty levels with increasing range and slot count
- Click-to-place digit interface
- Real-time value computation and difference display
- Correct answer shown on skip
- Keyboard input (minus + digit)
- Streak and solve count tracking
- Includes negative target numbers (~30% chance)

## issues
- No timer pressure yet
- Could use more visual feedback on wrong placement order

## todos
- Timed mode
- Daily challenge (seeded from date)
- Supabase leaderboard (fastest solve, longest streak)
- Tutorial walkthrough for first-time players
- OG preview PNG
- Sound effects
