# Duo Chroma Wordle

Solve two Wordle grids simultaneously — one guess applies to both.

## log
- 2026-04-11: Initial build. Two side-by-side grids with shared input, same 5-color feedback system as Chroma Wordle (green/yellow/purple/orange/gray). 3 word length modes (5/6/7). Extra guesses (wordLen+2) for duo difficulty. Solved grids glow green and dim subsequent rows. Keyboard shows best color from either grid. Outfit + Fira Code typography, dark void aesthetic.

## features
- Two grids solved simultaneously with one guess each turn
- 5 feedback colors per grid (exact/in-word/±1-spot/±3-abc/absent)
- Keyboard tracks best color across both grids
- Solved grid glows green, subsequent rows dimmed
- 3 word length modes (5/6/7 letters)
- Extra guesses for duo difficulty (word length + 2)
- Stats tracking (played/won/streak)
- Mobile responsive layout (grids stack on narrow screens)

## issues
- Word list is trimmed vs chroma-wordle (smaller set)
- No share/clipboard feature

## todos
- Share results as dual emoji grid
- Hard mode
- Supabase stats
- OG preview PNG
- Triple mode (3 grids)?
