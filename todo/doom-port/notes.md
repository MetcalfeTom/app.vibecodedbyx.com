# DOOM PORT

## Log
- Initial creation: Browser-based DOOM-style shooter game
- Top-down perspective instead of first-person (easier for browser implementation)
- Canvas-based rendering with grid floor effect
- WASD movement, mouse aim with pointer lock, click to shoot
- Enemy spawning system that increases with kill count
- Health/ammo/kills stat tracking with low health warning animation
- Particle effects for muzzle flash and blood splatter
- Game over screen with restart functionality
- Red/black color scheme inspired by original DOOM
- Enemies spawn from edges and chase player
- Killing enemies grants +5 ammo
- Player rendered as green circle with gun and direction indicator
- Enemies rendered as red circles with angry faces

## Issues
- None yet

## Todos
- Could add different weapon types
- Could add power-ups (health packs, ammo crates)
- Could add different enemy types with varied speeds/health
- Could add sound effects for shooting/damage/death
- Could add level progression or waves
- Could add melee attack
- Could add more complex map with walls/obstacles
- Could add multiplayer functionality
- Could add high score tracking with database
- Could add difficulty settings

## Notes
- Color scheme: Black (#000, #111, #222), red (#f00, #8b0000, #ff0000), yellow (#ff0), green (#0f0)
- Canvas uses image-rendering: pixelated for retro feel
- Player speed: 3, bullet speed: 10, enemy speed: 1-1.5 (randomized)
- Enemy spawn rate: 60 frames - min(kills, 40) for progressive difficulty
- Each enemy has 3 health points
- Player starts with 100 health, 50 ammo
- Bullet collision uses distance-based detection
- Particles fade out over 30 frames
- Pointer lock for mouse control (like original FPS games)
- Game loop uses requestAnimationFrame
- Grid drawn at 50px intervals
- Health indicator blinks red when below 30
