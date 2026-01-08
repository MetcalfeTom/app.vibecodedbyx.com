# Diamond Drill Escape

## log
- 2026-01-08: Initial creation - escape game with crumbling wall physics
  - Diamond drill with rotating animation
  - Iron walls that crack and crumble in 3 stages
  - Debris physics with gravity and bouncing
  - Spark effects when drilling
  - Gold ore bonus tiles
  - Exit zone to escape
  - Power management system

## features
- Diamond drill with spinning animation
- Iron walls crumble progressively (solid → cracked → breaking → destroyed)
- Debris chunks with physics (gravity, rotation, bounce)
- Spark particles when drilling
- Gold ore tiles for bonus points
- Drill power management (overheats if used too much)
- Power regenerates when not drilling
- Exit zone at bottom to win
- Procedural level generation with guaranteed path
- Score based on depth + gold collected

## controls
- WASD / Arrow keys: Move drill
- Hold direction to drill through walls
- Mobile: Touch and drag

## enemy types (wall types)
- Iron: Standard wall, 3 hits to break
- Gold: 1 hit, gives 50 points
- Empty: Free movement
- Exit: Victory zone

## design
- Industrial/mining aesthetic
- Cyan diamond glow effects
- Orbitron font for tech feel
- Dark metallic color palette
- Rust spots on iron walls

## technical
- Canvas 2D rendering
- Physics for debris (gravity, velocity, rotation)
- Particle system for sparks
- Responsive canvas size for mobile
- Touch controls for mobile

## todos
- Add sound effects (drilling, crumbling)
- Add multiple levels with increasing difficulty
- Add power-ups (drill boost, shield)
- Add leaderboard
- Add more wall types (reinforced steel, lava)
