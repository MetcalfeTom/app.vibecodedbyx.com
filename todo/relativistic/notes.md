# Relativistic Starfield

## log
- 2026-01-06: Initial creation - relativistic space travel simulation at 0.99c

## features
- 5000 stars uniformly distributed on sphere
- Light aberration (stars cluster toward direction of travel)
- Doppler color shifting (blue ahead, red behind)
- Relativistic beaming (intensity scales forward)
- Velocity slider 0-99% speed of light
- Smooth acceleration animation
- HUD with velocity, Lorentz γ, time dilation, aberration angle
- Physics info panel explaining effects

## physics
- **Lorentz factor**: γ = 1/√(1-β²) where β = v/c
- **Aberration**: cos(φ') = (cos(φ) - β)/(1 - β·cos(φ))
- **Doppler shift**: f' = f·γ(1 - β·cos(θ))
- **Beaming**: I' = I/D³ where D is Doppler factor

## design
- Deep space black background
- Star colors from blackbody radiation (3000K-10000K)
- Cyan/green HUD with Orbitron + JetBrains Mono fonts
- Glow effects on UI elements
- Physics info panel top-right

## technical
- Three.js with ES modules
- Custom shader for star points with glow
- BufferGeometry with position, color, size attributes
- Stars stored with original spherical coords for aberration calc
- Temperature-to-RGB blackbody approximation

## controls
- Velocity slider: 0-99% c
- Accelerate button: smooth ramp to 0.99c
- Stop button: smooth deceleration to rest

## issues
- Very high beta (>0.999) can cause numerical instability
- All stars cluster to tiny forward cone at extreme velocities

## todos
- Add warp effect during acceleration
- Add motion blur streaks
- Add sound effects for velocity changes
- Add reverse travel option
