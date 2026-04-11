# Chroma Wordle

Multi-color Wordle clone with 5 feedback colors for deeper deduction.

## log
- 2026-04-11: Removed purple rule entirely per chat request. Now 4 colors: green/yellow/orange/gray.
- 2026-04-11: Swapped yellow/purple logic per chat request. Now: Yellow=in word somewhere, Purple=±1 position. Updated getColors pass 2 order, key priority, legend, and comments.
- 2026-04-11: Initial build with 5-color system. Green=exact, Yellow=±1 position, Purple=in word elsewhere, Orange=letter within ±3 in alphabet of correct letter, Gray=absent. 3 word lengths (5/6/7 letters), ~700+ word dictionary per length. On-screen keyboard with color tracking, stats persistence in localStorage. Outfit + Fira Code typography, dark void aesthetic with gradient title.

## features
- 4 feedback colors (unique to this clone):
  - Green: exact letter, exact position
  - Yellow: letter exists in word but wrong position
  - Orange: wrong letter but within ±3 in alphabet of correct letter at that spot
  - Gray: not in word and not close alphabetically
- 3 word length modes (5/6/7 letters)
- On-screen keyboard with color state tracking
- Physical keyboard support
- Stats tracking (played/won/streak)
- localStorage persistence

## issues
- Dictionary is moderate size (~700 per length)
- No share/clipboard feature
- No daily word mode

## todos
- Daily word with seed
- Share results as emoji grid
- Hard mode (must use confirmed clues)
- Supabase stats
- OG preview PNG
