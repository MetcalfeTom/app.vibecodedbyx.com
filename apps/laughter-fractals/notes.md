# Laughter Fractals

## log
- 2026-01-08: Initial creation - psychedelic audio-reactive fractal visualizer
  - 4 fractal modes (Mandelbrot, Julia, Spiral, Kaleidoscope)
  - Synthesized giggle audio track
  - Audio-reactive visuals that pulse to the giggles
  - Rainbow color cycling
  - Intensity meter showing audio levels

## features
- **Mandelbrot Set**: Classic fractal with smooth coloring
- **Julia Set**: Animated parameters create morphing shapes
- **Spiral**: Hypnotic rotating spiral patterns
- **Kaleidoscope**: Mirrored psychedelic segments
- Synthesized giggle sounds using Web Audio API
- Rhythmic patterns: ha-ha-ha, rapid giggles, hee-haw, machine gun
- Audio analysis drives visual intensity
- Color hue shifts based on audio
- Zoom wobble synced to giggles
- Dynamic iteration count based on intensity

## controls
- Click mode buttons to switch fractal types
- Visuals automatically respond to audio

## audio synthesis
- Multiple oscillators per giggle (sine + triangle)
- Tremolo LFO for giggle quality
- Bandpass filter for warmth
- Frequency sweeps for natural sound
- 4 different rhythmic patterns that cycle

## design
- Monoton font for trippy title
- Rainbow gradient text animation
- Neon pink/purple aesthetic
- Radial glow overlays
- Intensity meter visualization

## technical
- Canvas 2D pixel manipulation
- Web Audio API for sound synthesis
- Frequency analysis for reactivity
- 2x2 pixel blocks for performance
- RequestAnimationFrame loop

## todos
- Add more fractal types (Burning Ship, Newton)
- Add user-controlled zoom/pan
- Add recording/export feature
- Add different laugh types (evil laugh, baby giggle)
- Add fullscreen mode
