# Unfair Cipher

Keep Talking-style decoding puzzle — decode cryptic glyphs using a complex manual with shifting rules, wire logic, and LED indicators.

## log
- 2026-04-12: Initial build. 3-stage cipher puzzle inspired by Keep Talking modded modules. Stage 1: symbol substitution — 26 glyphs map to shuffled alphabet, decoded via grid in manual, then shifted by a value derived from wire colors and LED states (5 conditional rules). Stage 2 (difficulty 2+): grid coordinates — number pairs index into the substitution grid. Stage 3 (difficulty 3+): wire-key cipher — each letter shifted by wire position value + lit LED count. Randomized per puzzle: glyph mapping, wire colors (3-5 wires), LED states (6 indicators), answer words. 5-minute timer, 3 strikes (wrong answer = strike + 30s penalty). Manual panel shows full ruleset with grid table, shift calculation, and stage-specific instructions. Keyboard and click input. Difficulty ramps every 2 puzzles solved. VT323 + IBM Plex Mono typography, dark terminal bomb-defusal aesthetic.

## features
- 3 cipher stages with increasing complexity
- Stage 1: glyph → letter substitution with conditional shift
- Stage 2: grid coordinate lookup (row, col pairs)
- Stage 3: wire-key cipher (wire position + LED count shift)
- 26-glyph randomized substitution grid per puzzle
- 3-5 randomized wire colors (red, blue, yellow, green, white, purple)
- 6 LED indicators (SIG, FRQ, TRK, CAR, IND, NSA) with on/off states
- 5 conditional shift rules (wire + LED combinations)
- In-game manual with full decoding reference
- 5-minute timer, 3 strikes max
- Wrong answer = 1 strike + 30s penalty
- Difficulty ramps: more stages, longer words
- Keyboard input support
- Answer words are always real English words

## issues
- None known

## todos
- Two-player mode (one sees module, other reads manual)
- More cipher types (Vigenère, transposition, Morse)
- Leaderboard (fastest solve times)
- Sound effects (tick, strike buzzer, success chime)
- Animated wire cutting mechanic
- OG preview PNG
