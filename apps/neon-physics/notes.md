# Neon Physics - Glass Breaker

## log
- 2026-01-09: Added UNLEASH 100 button
  - Spawns 100 balls at once in staggered burst
  - Balls spawn from top, center explosion, and sides
  - Auto-enables giggle mode for maximum chaos
  - Extra velocity on spawned balls
  - Burst of chaos text: "UNLEASHED!!!", "100 BALLS!!!", etc
- 2026-01-09: Added giggle-shake mode
  - GIGGLE MODE button toggles wild gravity chaos
  - Gravity jitters randomly in all directions
  - Sometimes reverses gravity briefly
  - Random horizontal kicks on balls
  - Random bounce impulses
  - Screen shake effect
  - Floating "Gah!", "Ehehehe!!", "Yee Yow!" text popups
- 2026-01-09: Added lightning strikes
  - Random neon lightning bolts strike falling shards
  - Zapped shards explode into electric sparks
  - Jagged bolt paths with branch effects
  - Yellow/electric spark particles with tails
  - Zapped counter in stats
- 2026-01-09: Initial creation
  - Click anywhere to spawn glowing balls
  - Glass tiles grid that shatters on impact
  - Ball physics with gravity, friction, bounce
  - Ball-to-ball collision physics
  - Glass shard particles when tiles break
  - Stats tracking (balls, shattered, remaining)
  - Reset and clear buttons

## features
- Spawn glowing balls by clicking/tapping
- Grid of glass tiles with neon glow
- Realistic physics simulation
  - Gravity pulls balls down
  - Friction slows movement
  - Bouncy collisions with walls and other balls
- Glass shattering with particle effects
- Ball trails for motion visualization
- Stats: ball count, shattered tiles, remaining tiles
- Reset glass grid button
- Clear all balls button

## controls
- Click/tap: Spawn a new ball at that position
- Reset Glass button: Rebuild the glass grid
- Clear Balls button: Remove all balls

## physics
- Gravity: 0.4 per frame
- Friction: 0.99 multiplier
- Bounce coefficient: 0.7
- Ball radius: 15-25px (randomized)
- Ball-ball elastic collisions
- Ball-tile collision shatters tile

## design
- Dark blue-black background
- Cyan/magenta neon color scheme
- Glass tiles with blue-cyan tint and shine
- Balls have radial gradient and glow trail
- Shards rotate and fade as they fall
- Background grid pattern

## todos
- Add different tile types (stronger glass, explosive)
- Add gravity direction control
- Add ball size selector
- Add slow-motion mode
- Add sound effects for shattering
