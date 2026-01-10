# Neon Invaders

## log
- 2026-01-10: Initial creation
  - Classic space invaders gameplay
  - Rainbow gradient laser beams
  - Screen shake on explosions
  - Shield barriers that degrade
  - Wave progression system
  - Mobile touch controls
  - Particle explosions

## features
- 5 rows x 11 columns of invaders
- 3 invader types with different emojis (👾, 👽, 🛸)
- Rainbow laser beams using HSL gradient
- Screen shake effect via CSS transform
- 4 shield barriers that degrade pixel by pixel
- Enemy bullets that damage shields
- Wave progression with speed increase
- Particle explosions on death
- Lives system (3 lives)
- Local high score storage
- Mobile touch controls

## controls
- Left/Right Arrow or A/D: Move ship
- Space: Fire rainbow laser
- Mobile: Touch buttons for left/right/fire

## scoring
- Bottom row (👾): 10 points
- Middle rows (👽): 20 points
- Top rows (🛸): 30 points

## design
- Dark background (#0a0a0f)
- Cyan player ship with neon glow
- Rainbow gradient bullets (rotating hue)
- Multi-color invaders with glow
- Green shields with pixel damage
- Magenta enemy bullets
- Screen shake intensity based on explosion
- Orbitron font

## mechanics
- Invaders move left/right, drop down at edges
- Speed increases as invaders are destroyed
- Shields absorb bullets from both sides
- Player has brief invincibility after death
- Wave complete when all invaders destroyed

## todos
- Add UFO bonus enemy across top
- Add sound effects
- Add power-ups (spread shot, shield)
- Add Supabase leaderboard
- Add boss waves every 5 levels
