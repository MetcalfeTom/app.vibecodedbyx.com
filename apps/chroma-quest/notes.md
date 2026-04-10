# Chroma Quest

Wordle-style color guessing game. See a secret color swatch, adjust RGB sliders, and get per-channel feedback.

## log
- 2026-04-10: Initial build. 6 guesses max. RGB sliders 0-255, live preview swatch. Each guess shows 3 cells (R/G/B) with Wordle-style feedback: exact (≤8 off, green ✓), close (≤40 off, yellow ~ with distance + arrow), far (red, distance + arrow). Row includes a swatch of the guess color for visual comparison. Target avoids extreme darks/lights. Round/streak/guess counter HUD. Enter key submits or advances round. Anybody + Azeret Mono typography, purple-to-green gradient aesthetic with dark surface.

## features
- RGB sliders with live preview swatch
- Per-channel Wordle feedback (exact / close / far) with directional arrows
- Guess history with color swatches
- Round counter and streak tracking
- Keyboard support (Enter to guess/next)
- Responsive mobile layout

## issues
- No leaderboard
- No hex input mode (sliders only)
- Target generation avoids extremes but could still produce very similar channels that are hard to distinguish

## todos
- Supabase leaderboard (best streak, fewest average guesses)
- Hex code input as alternative to sliders
- Difficulty modes (fewer guesses, tighter thresholds, HSL mode)
- OG preview PNG
