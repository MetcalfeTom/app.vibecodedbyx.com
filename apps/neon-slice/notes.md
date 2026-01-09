# Neon Slice - Shape Ninja

## log
- 2026-01-09: Initial creation
  - Fast-paced fruit ninja style game
  - 6 different neon shape types
  - Swipe/drag to slice shapes
  - Bomb obstacles to avoid
  - Combo system with multipliers
  - Lives system (3 hearts)
  - Score popups and particles
  - Increasing difficulty over time
  - Local high score storage

## features
- 6 shape types with different point values:
  - Circle (cyan): 10 pts
  - Square (magenta): 15 pts
  - Triangle (yellow): 20 pts
  - Diamond (green): 25 pts
  - Star (orange): 30 pts
  - Hexagon (pink): 35 pts
- Bomb obstacles (skull icon)
- Swipe trail effect
- Particle explosions on slice
- Combo multiplier (up to x5)
- Score popups
- 3 lives (hearts)
- Increasing spawn rate and speed
- Local best score storage
- Touch and mouse support

## controls
- Click and drag to slice (mouse)
- Touch and swipe to slice (mobile)
- Must swipe fast enough to cut

## scoring
- Base points per shape type
- Combo multiplier builds with consecutive slices
- Combo resets after 1 second of no slicing
- Combo resets when hitting a bomb
- Maximum multiplier: x5

## game rules
- Shapes fly up from bottom
- Slice shapes before they fall
- Letting shapes fall = lose 1 life
- Hitting bombs = lose 1 life + reset combo
- 0 lives = game over
- Difficulty increases every 30 seconds

## design
- Dark background with subtle grid
- Neon glowing shapes
- White slice trail
- Colorful particle bursts
- Orbitron font
- Heart/skull emoji for lives

## todos
- Add sound effects
- Add power-ups (slow-mo, double points)
- Add freeze bomb that slows time
- Add special golden shapes
- Add online leaderboard
- Add different game modes
