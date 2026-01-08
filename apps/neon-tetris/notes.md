# Neon Tetris

## log
- 2025-12-28: Initial creation
  - Classic Tetris gameplay
  - All 7 tetrominoes (I, O, T, S, Z, J, L)
  - Neon color scheme with glow effects
  - Ghost piece preview
  - Next piece display
  - Score, level, and lines tracking
  - Line clear animation (flash effect)
  - Wall kick rotation
  - Hard drop and soft drop
  - Pause functionality
  - Mobile touch controls
  - Increasing speed per level
  - Orbitron font for futuristic look

## issues
- None so far

## todos
- Could add hold piece feature
- Could add high score persistence
- Could add sound effects
- Could add T-spin detection

## notes
### Controls:
- ←→: Move
- ↑: Rotate
- ↓: Soft drop (+1 point)
- Space: Hard drop (+2 points per row)
- P: Pause

### Scoring:
- 1 line: 100 × level
- 2 lines: 300 × level
- 3 lines: 500 × level
- 4 lines (Tetris): 800 × level

### Speed:
- Level 1: 1000ms drop interval
- Each level: -100ms (min 100ms)
- Level up every 10 lines
