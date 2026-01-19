# Fractal Dance

## log
- 2026-01-19: Initial creation - neon fractal generator with emote controls

## features
- Real-time Julia set fractal rendering
- 12 emote buttons that affect the fractal:
  - 🔥 FIRE: Warm chaos
  - 💜 LOVE: Gentle purple shift
  - 🌊 WAVE: Blue flow
  - ⚡ SHOCK: Electric yellow burst
  - 🎉 PARTY: Pink party mode
  - 😂 CHAOS: Green mayhem
  - 🌀 SPIRAL: Deep zoom
  - 💀 DOOM: Dark intensity
  - ✨ SPARKLE: White glow
  - 🚀 ZOOM: Fast zoom in
  - 👀 WARP: Distortion
  - 🌈 RAINBOW: Toggle rainbow mode
- Chaos meter showing intensity
- Emote feed showing recent inputs
- Effect name flash on trigger
- Continuous rotation and drift
- Smooth parameter interpolation

## design
- Full screen fractal canvas
- Orbitron font for cyberpunk feel
- Rainbow animated title
- Semi-transparent UI overlays
- Neon color palette
- Pulsing button animations

## fractal math
- Julia set: z = z² + c
- c parameters modified by emotes
- 80-130 max iterations based on chaos
- Rotation applied to complex plane
- HSL color mapping based on iterations

## emote effects
- cMod: Changes Julia set c parameter
- zoom: Multiplies zoom level
- chaos: Adds to chaos meter
- rainbow: Toggles rainbow color mode

## auto-animation
- Parameters drift with sine/cosine
- Speed increases with chaos level
- Continuous rotation
- Chaos decays over time
- Hue shifts continuously

## todos
- Add audio reactive mode
- Add save screenshot feature
- Add parameter presets
- Add Mandelbrot mode toggle
- Add zoom gesture support

## issues
- None yet
