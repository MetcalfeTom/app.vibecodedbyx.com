# Confetti Cannon

## log
- 2026-01-06: Initial creation - high-performance confetti with physics collisions

## features
- Up to 3000 particles with object pooling
- Physics-based particle collisions
- Spatial hashing for O(n) collision detection
- Gravity, bounce, air resistance simulation
- Floor, wall, ceiling collisions
- 3 particle shapes: rectangle, circle, triangle
- 12 neon colors with glow effects
- Adjustable gravity and bounce
- Mega burst mode
- FPS and collision counter
- Touch support

## physics
- Gravity: configurable 0-2
- Bounce factor: configurable 0-1
- Air resistance: 0.998 per frame
- Friction on floor: 0.99
- Mass-based collision response
- Elastic collisions with restitution 0.8
- Particle separation to prevent overlap

## collision detection
- Spatial hash grid (30px cells)
- Only checks neighboring cells
- Skipped when >1500 particles for performance
- Impulse-based collision response

## performance optimizations
- Object pooling (no allocation during runtime)
- Spatial hashing for collisions
- Canvas trail effect (no full clear)
- Collision skip at high particle counts
- Single pass update/draw loops

## design
- Dark background with motion trails
- Neon glow on all particles
- Crosshair cursor
- Orbitron font
- Cyan/magenta UI theme

## controls
- Click & drag: fire confetti
- Hold: continuous blast
- Mega Burst: 500 particles from bottom
- Clear All: reset particles
- Gravity slider: 0-2
- Bounce slider: 0-1

## technical
- Canvas 2D rendering
- requestAnimationFrame loop
- Object pool pattern
- Spatial hash collision broadphase
- Impulse-based collision narrowphase
