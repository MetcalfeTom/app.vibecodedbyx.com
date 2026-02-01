# Velocity Surge

High-speed neon racing game with procedural obstacles and near-miss mechanics.

## log
- 2026-02-01: Initial creation
  - Perspective road with animated lane markers and cross-lines
  - 5-lane steering with smooth interpolation
  - 5 obstacle types: barrier, cube, spike, wall (2-lane), pillar
  - Procedural spawning with increasing density
  - Near-miss multiplier system (up to x8)
  - Boost mechanic with fuel bar (Space/double-tap)
  - Speed increases over distance, HUD shows km/h
  - Web Audio engine sounds, crash/near-miss/boost SFX
  - Exhaust particles and speed lines at high speed
  - Screen shake and flash on death
  - Explosion sparks on crash
  - Best score saved in localStorage
  - Touch: swipe to steer, double-tap to boost, left/right zones
  - Keyboard: arrows/WASD to steer, Space to boost

## features
- Perspective 3D road rendering with vanishing point
- Procedural obstacle generation (5 types, increasing clusters)
- Near-miss multiplier rewards close dodges
- Boost system with regenerating fuel
- Particle effects: exhaust, sparks, speed lines
- Screen shake and red flash on crash
- Web Audio sound effects
- Best score persistence
- Touch + keyboard controls

## design
- Orbitron for titles/HUD, Share Tech Mono for body
- Deep dark background with cyan/magenta neon accents
- Minimal HUD: distance, speed (km/h), multiplier

## issues
- None yet

## todos
- None currently
