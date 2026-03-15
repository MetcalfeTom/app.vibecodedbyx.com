# Neon Jellyfish

A glowing 3D jellyfish that pulses and shifts color to the sound around you.

## log
- 2026-03-15: Initial build. Three.js 3D jellyfish with real-time microphone frequency analysis. Translucent bell dome with MeshPhysicalMaterial (transmission, emissive glow), 4 oral arms and 12 trailing tentacles rebuilt each frame with sine-wave animation. Web Audio API: getUserMedia mic input, 512-point FFT, 3-band analysis (bass/mid/high). Bass drives warm magenta/red, mids drive cyan/green, highs drive blue/violet. Bell pulses with bass, emissive intensity scales with overall volume, tentacle sway amplitude increases with audio level. 600 additive-blend particles drift upward. Mouse controls camera angle and jellyfish tilt. Megrim + Rajdhani typography, deep ocean palette with neon glow. Title fades after 6s.

## issues
- None yet

## todos
- Multiple jellyfish species
- Underwater caustic light patterns
- Audio fallback mode (oscillator-generated ambient)
- Touch tilt on mobile (deviceOrientation)

## notes
- No database — pure frontend
- Three.js via importmap CDN (0.163.0)
- FFT: 512 bins, 0.8 smoothing, 3 bands (bass 0-15%, mid 15-50%, high 50-100%)
- Tentacle rebuild every 2 frames for performance
- Color smoothing: lerp 0.08 per frame
- Bell: SphereGeometry half-dome, transmission 0.6, thickness 0.8
- Particles: 600 points, additive blending, drift upward
