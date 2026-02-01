# Neon Tetris

## log
- 2026-02-01: Hold Piece & Combo System
  - Hold piece: press C or Shift to store current piece, swap on next hold
  - Hold display panel with dimmed state when already used this turn
  - Resets each new piece spawn (one hold per piece)
  - Combo system: consecutive line clears build combo multiplier
  - Combo bonus: +50% per combo level (x2 = +50%, x3 = +100%, etc.)
  - Animated combo popup on game board
  - Combo counter in side panel (shows at x2+)
  - Mobile hold button added
- 2026-01-27: Multiplayer Duels & Global Leaderboards
  - Real-time 1v1 duel mode with room codes
  - Side-by-side opponent board view
  - Supabase broadcast channels for game state sync
  - Global leaderboard with top 15 scores
  - Score submission after game over
  - Mode selector (Solo/Duel buttons)
  - Duel panel with CREATE/JOIN room functionality
  - Live opponent stats (score, lines)
  - Win/loss detection
  - Database tables: tetris_leaderboard, tetris_duels
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

## Next Development Phase: TETRIS v2.1
**Theme: Advanced Competitive Features**

1. **Hold & Preview** (Partially Complete ✓)
   - ✓ Hold piece feature (swap current)
   - Extended preview (next 3-5 pieces)
   - Piece statistics tracker
   - Perfect clear detection

2. **Scoring & Persistence** (Partially Complete ✓)
   - ✓ Global leaderboard (Supabase)
   - ✓ Combo system with multipliers
   - Personal best tracking
   - T-spin detection and bonus

3. **Multiplayer Mode** (Partially Complete ✓)
   - ✓ 1v1 real-time battles
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
- C / Shift: Hold piece
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
