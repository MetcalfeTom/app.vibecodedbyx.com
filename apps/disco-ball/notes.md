# Disco Ball

## log
- 2026-01-08: Initial creation
  - 3D disco ball with reflective mirror tiles
  - Simulated bass/beat at 128 BPM
  - Tiles pulse and glow to the beat
  - Colored rotating spotlights
  - Light beams pointing at ball
  - Reflection spots on floor
  - Beat visualizer bars

## features
- ~800 reflective mirror tiles on sphere
- Environment-mapped reflections
- Simulated kick drum, sub bass, hi-hat
- Tiles emit color on beat
- 5 rotating colored spotlights
- Light cone beams with transparency
- Moving reflection spots on floor
- 16-bar frequency visualizer
- Camera sway animation

## technical
- Three.js for 3D rendering
- CubeCamera for environment reflections
- Procedural beat simulation (128 BPM)
- ACES filmic tone mapping
- MeshStandardMaterial with metalness/roughness

## design
- Dark void background
- Magenta/cyan primary colors
- Multicolor spotlights
- Glossy reflective floor
- Neon glow effects

## audio simulation
- Kick drum: exponential decay on beat
- Sub bass: slow sine wave
- Hi-hat: fast exponential decay pattern
- Combined for "bass level" that drives visuals

## todos
- Add actual audio input (Web Audio API)
- Add more particle effects
- Add strobe mode
- Add multiple disco balls
- Add fog/haze effect
