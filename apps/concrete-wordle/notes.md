# Concrete Wordle

Guess the 5-letter word. Brutalist. Unforgiving. Concrete.

## log
- 2026-03-15: Initial build. Brutalist Wordle clone with concrete texture throughout. 6 rows x 5 tiles grid, flip animation on reveal, color-coded feedback (green=correct, yellow=present, grey=absent). ~500 answer words + ~600 extra valid guesses. On-screen keyboard with color state tracking. Concrete textures via SVG feTurbulence on tiles, keys, and background. Metal text header with background-clip gradient. Corner rivets on header. Web Audio: square wave type clicks, bandpass noise clacks on reveal, triangle arpeggio on win, sawtooth buzz on invalid. Stats modal with games played/win%/streak/distribution bar chart. localStorage persistence. Row shake on invalid guess. Brutalist victory messages (MONOLITHIC, REINFORCED, etc). Inter Tight 900 + IBM Plex Mono typography, all-grey palette with muted green/yellow.

## issues
- None yet

## todos
- Hard mode (must use revealed hints)
- Share result as emoji grid
- Daily word mode (seeded by date)
- Word length variants (4/6 letter)

## notes
- No database — localStorage for stats only
- ~500 answer pool, ~600 extra valid words, Set-based lookup
- Evaluate: two-pass (exact match first, then present), prevents double-counting
- Tile flip: 0.5s rotateX animation, color applied at midpoint (250ms)
- Keyboard state: correct > present > absent priority (never downgrades)
- Stats: played, wins, streak, maxStreak, 6-element distribution array
- Audio: type=square 800-1000Hz 0.04s, clack=bandpass noise 0.06s, win=C-E-G triangle, wrong=sawtooth 150Hz
