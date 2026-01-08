# DOOM 3D

## Log
- Initial creation: Full 3D first-person shooter using Three.js
- Proper FPS camera with mouse look and WASD movement
- Procedural textures: checker floor, brick walls
- 3D sphere enemies that chase player
- Sphere projectile bullets with collision detection
- Arena with 4 walls and textured floor
- Dynamic lighting with ambient and point lights
- Shadow mapping enabled
- Fog effect for atmosphere
- Enemy spawning from arena edges
- Health/ammo/kills HUD
- Game over screen with restart
- Pointer lock for proper FPS controls

## Issues
- None yet

## Todos
- Could add different weapon types (shotgun, rocket launcher)
- Could add weapon models visible to player
- Could add more enemy variety (different sizes, colors, behaviors)
- Could add sound effects (shooting, enemy death, damage)
- Could add powerups (health, ammo, armor)
- Could add multiple levels/arenas
- Could add obstacles/cover in arena
- Could add particle effects for bullet impacts
- Could add enemy attack animations
- Could add muzzle flash effect
- Could add better textures (load external images)
- Could add multiplayer support
- Could save high scores to database

## Notes
- Color scheme: Dark red (#1a0000, #2a0000, #3d0000), bright red (#ff0000), yellow bullets (#ffff00)
- Uses Three.js v0.160.0 from CDN via import maps
- Camera height: 1.6 units (human eye level)
- Player speed: 0.15 units per frame
- Bullet speed: 0.8 units per frame
- Enemy speed: 0.05-0.08 (randomized)
- Enemy health: 3 hits to kill
- Arena size: 50x50 units
- Wall height: 5 units
- Fog distance: 50 units
- Shadow mapping: PCFSoftShadowMap for soft shadows
- Textures created procedurally with Canvas API
- Checker floor: 8x8 grid repeated 10 times
- Brick walls: 8x16 brick pattern repeated 5 times
- Enemy spawn rate: 60 frames - min(kills, 40) for progressive difficulty
- Pointer lock for immersive FPS controls
- Camera rotation clamped to prevent upside-down view
- Player bounded within arena (-23 to 23 on X and Z axes)
- Enemies spawn at random positions on arena edges
- Killing enemies grants +5 ammo
- Responsive canvas that resizes with window
