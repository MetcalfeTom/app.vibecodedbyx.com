# Pentominoes

Puzzle game — fit all 12 unique pentomino shapes into a 6×10 grid.

## log
- 2026-04-12: Added 5 levels with escalating difficulty (4→12 pieces, 4×5→6×10 grids), scoring system (base + time bonus - undo penalty), count-up timer, level select overlay, win summary with score breakdown, progress saved to localStorage. Random piece subsets per level.
- 2026-04-12: Initial build. 12 pentomino pieces (F, I, L, N, P, T, U, V, W, X, Y, Z) on 6×10 grid (60 cells). Rotate (R/right-click), flip (F), undo (Z), clear. Ghost preview on hover, piece border rendering, click placed pieces to remove. Win detection. Pastel earthy aesthetic, Outfit + JetBrains Mono typography.

## features
- 5 levels: Tiny (4pc/4×5), Small (6pc/5×6), Medium (8pc/5×8), Large (10pc/5×10), Classic (12pc/6×10)
- Random piece selection per level (different each play)
- Scoring: base points + time bonus (under par) - undo penalty (5% per undo)
- Count-up timer with par time (15s per piece)
- Level progression with unlock system
- Progress saved to localStorage
- 12 unique pentomino pieces with distinct colors
- Rotate 90° CW and horizontal flip transforms
- Ghost preview overlay while hovering
- Click placed pieces to pick them back up
- Keyboard shortcuts (R, F, Z)
- Mobile and desktop friendly

## issues
- None known

## todos
- Hint system
- Leaderboard (fastest solve times via Supabase)
- OG preview PNG
