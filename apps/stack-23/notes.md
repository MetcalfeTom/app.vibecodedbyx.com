# Stack 23

Reach a target number by stacking blocks of 2 and 3. Minimize block count for a perfect score.

## log
- 2026-04-11: Initial build. Number decomposition puzzle using only values 2 and 3. Push blocks onto a visual stack, running total shown on each block. Click blocks to pop them off. Optimal solution computed (greedy: max 3s, fill remainder with 2s based on n%3). 4 difficulties: Easy (4-15), Medium (12-40), Hard (30-100), Expert (80-300). Can't exceed target (blocks rejected with red flash). Auto-detects win on exact match, shows perfect star if fewest blocks used. Skip shows optimal decomposition. Keyboard support (2/3 to push, z/backspace undo, enter next). Streak + perfect tracking with localStorage. Space Grotesk + DM Mono typography, dark with red/blue block colors and gold accents.

## features
- Visual block stack with drop-in animation
- Running subtotal on each block label
- Optimal block count shown as target
- Perfect score detection
- Push/pop/undo/clear mechanics
- Overflow prevention (can't exceed target)
- Keyboard shortcuts
- 4 difficulty levels

## issues
- None yet

## todos
- Timed challenge mode
- Supabase leaderboard (fewest total blocks across puzzles)
- Sound effects
- OG preview PNG
- Combo multiplier for consecutive perfects
