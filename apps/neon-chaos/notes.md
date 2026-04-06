# Neon Chaos

## log
- 2026-04-06: Initial build — chaotic physics sandbox with neon shapes. 7 shape types, 6 gravity modes (up/down/left/right/zero-g/orbit), shape-to-shape collision, wall bounce, drag-to-fling spawning, trail rendering, chaos mode with sine perturbation. Orbitron + Share Tech Mono typography, dark space with neon glow aesthetic.

## features
- 7 neon shape types: circle, triangle, square, pentagon, hexagon, diamond, star
- 12 vibrant neon colors with glow/shadow effects
- 6 gravity modes: up, down, left, right, zero-g, orbit (center pull)
- Click/tap to spawn, drag to fling with velocity preview
- Shape-to-shape elastic collision (optimized: sparse check above 120 shapes)
- Wall bounce with configurable restitution (30%/50%/80%/100%/150%)
- Trail rendering mode (alpha fade) for light painting effect
- Chaos mode: sine-wave gravity perturbation per shape
- Burst: spawn 20 shapes from center
- Keyboard: arrows=gravity, space=burst, t=trails, b=bounce, x=chaos, c=clear
- Subtle grid background
- Orbit mode shows center indicator
- Up to 300 shapes

## issues
- Collision gets expensive above ~120 shapes (sparse fallback helps)
- shadowBlur on every shape is GPU-heavy on mobile
- No sound

## todos
- Add explosion effect when shapes collide hard
- Sound effects (boing, whoosh, ambient hum)
- Shape size slider
- Attract/repel mouse mode
- OG image
