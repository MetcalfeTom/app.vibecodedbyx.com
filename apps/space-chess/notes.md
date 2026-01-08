# Space Chess

## log
- 2026-01-08: Initial creation - neon 3D chess in space
  - Full 3D chess board with Three.js
  - Floating neon pieces (cyan vs magenta)
  - Orbit controls for camera
  - Valid move highlighting
  - Piece capture system
  - Pawn promotion to queen
  - King capture = game over

## features
- Full chess game logic for all pieces
- 3D floating pieces with glow effects
- Cyan team vs Magenta team
- Pieces float and bob gently
- Valid moves highlighted on board
- Capture moves highlighted in red
- Captured pieces shown in side panels
- Pawn auto-promotes to queen
- King capture ends game
- Rotate view button
- Starfield background
- Pulsing neon lights

## controls
- Click piece to select
- Click tile/enemy to move/capture
- Orbit: drag to rotate view
- Scroll: zoom in/out
- Rotate View button: quick 90° rotation

## piece types
- Pawn: Forward move, diagonal capture, double first move
- Rook: Horizontal/vertical lines
- Knight: L-shape jumps
- Bishop: Diagonal lines
- Queen: All directions
- King: One square any direction

## design
- Cyan (#00ffff) vs Magenta (#ff00ff) teams
- Dark space theme
- Glowing piece materials
- Neon edge on board frame
- Orbitron font for sci-fi feel
- Starfield particle background

## technical
- Three.js for 3D rendering
- OrbitControls for camera
- Raycasting for click detection
- Move validation for all piece types
- Animation for piece movement

## todos
- Add check/checkmate detection
- Add move history
- Add undo move
- Add AI opponent
- Add online multiplayer
- Add sound effects
