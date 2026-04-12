# Defusal Crisis

KTANE-inspired bomb defusal game — 4 modular puzzles, cryptic manual, 5-minute timer, 3 strikes.

## log
- 2026-04-12: Expanded to 7 modules. Added Morse Code (blinking light, decode word, tune frequency from 16-word table), Rotary Dial (drag-to-rotate canvas dial, lock in 3 target numbers with ±5° tolerance), Color Sequence (4-round logic puzzle, correct button depends on round number, position, colors present, and previous answer). Scrollable 2-column grid, full manual with all 7 module rules. Now requires all 7 modules to defuse.
- 2026-04-12: Initial build. 4 modules: Wires (3-6 colored wires with conditional cut rules), The Button (color+label logic, hold/tap with strip-color release timing), Keypads (4 symbols, column-ordered press sequence), Simon Signals (3-stage color sequence with vowel-based translation mapping). Randomized serial number (6 chars), 3-5 indicators (lit/unlit). Full in-game defusal manual with all rules. 5-minute countdown, 3 strikes = detonation. VT323 + IBM Plex Mono + Share Tech Mono typography, dark tactical aesthetic with red/green/amber/cyan accents.

## features
- 4 modular puzzles per bomb
- Wires: 3-6 wires, color-based cut rules depending on wire count, serial, colors
- Button: color + label determines hold vs tap, colored strip timing on hold
- Keypads: 4 symbols from randomized columns, press in column order
- Simon Signals: 3-stage color flash sequence with vowel-based translation
- Randomized serial number and indicator panel
- Full cryptic in-game manual with all rules
- 5-minute countdown timer
- 3 strikes = detonation
- Solved module overlay
- Screen shake and flash on strike
- Bomb counter across rounds

## issues
- None known

## todos
- More modules (maze, memory, morse code)
- Difficulty scaling (shorter timer, more modules)
- Sound effects (tick, buzz, explosion, defuse)
- Supabase leaderboard (fastest defuse time)
- Two-player mode (one reads manual, other defuses)
- OG preview PNG
