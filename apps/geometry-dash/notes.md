# Cannonball Dash

## log
- 2026-01-07: Converted to pirate theme "Cannonball Dash"
  - Cube → Rolling iron cannonball with metallic gradient and fuse hole
  - Spikes → Jagged reef rocks with sharp silhouette
  - Moving blocks → Floating barrels with bobbing animation
  - Cyber grid → Ocean waves with animated crests
  - Neon trail → Water splash effects
  - "GAME OVER" → "SHIPWRECKED!"
- 2026-01-06: Initial creation - Geometry Dash clone with neon aesthetics for Jackson

## features
- Rolling iron cannonball player
- Jagged reef obstacles (sharp rock formations)
- Floating barrel obstacles with bob animation
- Ocean night sky with moon and stars
- Animated wave background
- Water splash effect under cannonball
- Best score saved to localStorage
- Touch and keyboard controls

## interactions
- Click/tap/space: Jump
- Avoid reefs and barrels
- Score increases with distance

## design
- Ocean night background (#0d1a2a to #1a2d4a gradient)
- Sandy ocean floor (#c2a066)
- Dark reef rocks (#2a1810)
- Wooden barrels (#8b4513) with iron bands
- Iron cannonball with metallic sheen
- Pirata One / IM Fell English SC fonts

## technical
- Canvas 2D rendering
- RequestAnimationFrame game loop
- Physics-based jumping (gravity, velocity)
- Collision detection with hitbox reduction
- Increasing difficulty over time
- localStorage for persistent high score

## todos
- Add treasure coin pickups for bonus points
- Add kraken tentacle obstacles
- Add ship wreckage scenery
- Add combo multiplier for close calls
