# Gravity Flip

## log
- 2025-12-29: Initial creation
  - Platformer with gravity reversal on jump
  - Neon purple and green aesthetic
  - Procedurally generated levels
  - Collectible gems (100 points each)
  - Portal to next level (500 points)
  - Particle effects on jump and gem collect
  - Sound effects (jump, gem, portal)
  - Gravity indicator shows current direction
  - Mobile touch controls
  - Player character with cute face

## issues
- None so far

## todos
- Could add enemy obstacles
- Could add moving platforms
- Could add high score persistence
- Could add more level variety

## notes
### Controls:
- Arrow keys or WASD to move
- Space/W/Up to jump
- Mobile: touch buttons

### Mechanics:
- Gravity flips every jump
- Player sticks to ceiling when gravity up
- Can only jump when grounded
- Levels get more platforms as you progress

### Scoring:
- Gems: 100 points
- Portal (level complete): 500 points

### Level generation:
- 5 + min(level, 10) platforms
- Random positions with vertical distribution
- ~60% of platforms have gems
- Portal always at right side
