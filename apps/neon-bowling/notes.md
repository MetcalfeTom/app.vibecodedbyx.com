# Neon Bowling

## log
- 2026-01-08: Initial creation
  - 3D bowling alley using Three.js
  - Glowing neon pins with emissive materials
  - Explosive particle effects when pins are hit
  - Pin-to-pin collision physics
  - Power charging mechanic
  - Aim oscillation for targeting
  - Score tracking with frames/rolls
  - Strike and spare detection

## features
- 10 glowing pins with cyan emissive glow
- Magenta glowing bowling ball
- Explosive neon particle bursts on pin hits
- Pin physics (fall, bounce, collide)
- Lane with neon edge stripes
- Power meter for throw strength
- Oscillating aim indicator
- Frame and roll tracking
- Strike/spare messages

## controls
- Click/Tap and hold: Charge power
- Release: Throw ball
- Aim moves automatically (time the release)

## design
- Dark background with fog
- Magenta lane stripes
- Cyan gutter markers
- Multiple colored explosion particles
- Spotlight from above
- Neon point lights along lane

## technical
- Three.js for 3D rendering
- Custom pin physics
- Particle system for explosions
- Shadow mapping enabled

## todos
- Add sound effects
- Add spin control
- Add multiple ball colors
- Add leaderboard
- Add curve ball physics
