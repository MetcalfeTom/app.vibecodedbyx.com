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
- None currently

## Next Development Phase: TETRIS v2.0
**Theme: Competitive Multiplayer & Modern Features**

1. **Hold & Preview**
   - Hold piece feature (swap current)
   - Extended preview (next 3-5 pieces)
   - Piece statistics tracker
   - Perfect clear detection

2. **Scoring & Persistence**
   - Global leaderboard (Supabase)
   - Personal best tracking
   - T-spin detection and bonus
   - Combo system with multipliers

3. **Multiplayer Mode**
   - 1v1 real-time battles
   - Garbage line sending
   - Matchmaking system
   - Ranked ladder

4. **Audio & Effects**
   - Procedural sound effects
   - Background music tracks
   - Line clear celebrations
   - Perfect clear animations

5. **Customization**
   - Custom color themes
   - Block skins/textures
   - Ghost piece styles
   - Board size options (10x20, 10x40)

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
