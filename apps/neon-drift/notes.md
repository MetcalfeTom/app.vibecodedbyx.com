# Galleon Drift

## log
- 2026-01-07: Converted to pirate theme "Galleon Drift"
  - Neon spaceship → Heavy wooden galleon with two masts
  - Floating rings → Jagged rocks as obstacles
  - Space particles → Wake splashes and water spray
  - Cyan/magenta → Gold/brown/ocean blue palette
  - Ship turns red when drifting, cannons poke out
  - Added rock collision detection with damage
  - Floating debris (barrels, crates, planks)
- 2026-01-07: Initial creation - high-speed zero gravity drift racing

## features
- Heavy wooden galleon with detailed design
- Two masts with crow's nest and sails
- Stern castle with Jolly Roger flag
- Hull turns red when drifting
- Cannons visible and firing during drift
- Jagged rocks as obstacles (procedural polygons)
- Rock collision with splash particles
- Floating debris (barrels, crates, planks)
- Wake trail behind ship
- Heavier physics for galleon feel
- Drift scoring with multipliers
- Ocean background with animated waves

## controls
- WASD / Arrow keys: Steer and accelerate
- SPACE / SHIFT: Hold to drift
- Mobile: Touch buttons for controls

## mechanics
- Galleon has heavier physics (slower accel, more momentum)
- Drift mode: ship slides sideways, cannons fire
- Rock collisions reduce score and flash screen
- Debris is just decoration, no collision
- Score multiplier builds during drift

## design
- Ocean night background with wave animation
- Gold/brown pirate color palette
- Dark teal ocean (#1a3a4a)
- Jagged grey rocks with polygon shapes
- Wake and spray particle effects
- Pirata One / IM Fell English SC fonts

## technical
- Canvas 2D rendering
- Heavy physics simulation (lower accel, high momentum)
- Procedural rock generation (irregular polygons)
- Circle-based collision detection
- Wake particle system
- Camera follows ship smoothly
- Touch controls for mobile

## todos
- Add treasure floating in water
- Add ship upgrades (speed, drift control)
- Add whirlpool hazards
- Add leaderboard for drift scores
- Add cannon sound effects
- Add kraken boss encounters
