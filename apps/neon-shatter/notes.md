# Neon Shatter

Chaotic physics playground with neon cubes that shatter into glowing shards on hard collisions.

## log
- 2026-03-16: Initial build. Canvas physics sandbox. Click/drag to spawn neon cubes with random sizes (20-50px). 7 neon color palette. Physics: gravity, wall bouncing, restitution, friction. Cube-cube collision with mass-based impulse resolution. Cubes flash on impact, shatter into triangular shards when relative collision velocity exceeds threshold. Bigger cubes take more hits (HP scales with size). Shards: randomized triangles with glow, gravity, floor bounce, fade over 3.5s. Spark particles on every collision (count scales with impact speed). Screen shake on shatter. Motion trails via semi-transparent clear. Subtle grid background. Controls: toggle gravity, spawn 5, bomb (center explosion pushes all cubes), clear all. Touch support for mobile. Oxanium + Share Tech Mono typography, dark void with neon glow aesthetic.

## issues
- None yet

## todos
- Add sound effects (Web Audio collision sounds)
- Attractors/repulsors (click to place gravity wells)
- Different shapes (triangles, circles)
- Size slider for spawned cubes
- Color mode selector (monochrome, rainbow, etc.)

## notes
- No database — pure frontend
- Canvas fullscreen, no scaling needed
- Max 120 cubes, 600 shards, 2000 sparks
- Shatter threshold: 320 relative velocity
- Double-shatter at 1.8x threshold (both cubes break)
- HP: 1 + floor(size/15), bigger cubes survive more hits
- Drag spawning: one cube per 120ms while holding
- Motion trail: fillRect with rgba alpha 0.35 each frame
