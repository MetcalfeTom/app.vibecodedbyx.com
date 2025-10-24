# Algorithmic Art Generator

## Log
- 2025-10-21: Initial creation
  - Created p5.js algorithmic art generator with 6 pattern types
  - Pattern types: Spirals, Waves, Particles, Flowers, Geometric, Flow Field
  - Animated patterns with continuous color cycling
  - Controls to regenerate, toggle animation, and save images
  - Mobile and desktop responsive (canvas resizes)
  - Dark theme with glassmorphism UI
- 2025-10-21: Made fully parametric with seed-based generation
  - Added seeded random number generator for deterministic output
  - All patterns now controlled by 20+ hierarchical parameters
  - Parameters include: colors, counts, speeds, sizes, frequencies, etc.
  - Seed input field allows reproducing exact same art
  - Same seed always generates same output across all pattern types
  - Saved images include seed in filename
- 2025-10-21: Massively expanded parameter variations
  - Increased to 50+ parameters with extreme ranges
  - Added global params: symmetry, rotation, scale, complexity, chaos
  - Added per-pattern params: noise, distortion, glow, trails, turbulence
  - Background brightness, alpha transparency, pulse speed all vary
  - Color ranges: full 360° hue, 30-100 saturation, 50-100 brightness
  - Counts: 1-20 spirals, 3-40 waves, 20-500 particles, 2-15 flower grids, etc.
  - Creates wildly different aesthetics from single seed

## Issues
- None yet

## Todos
- Could add color scheme selector
- Could add speed control slider
- Could add more pattern types (fractals, voronoi, etc.)
- Could add ability to layer multiple patterns
- Could add randomize all button
- Could add parameter sliders for each pattern type
- Could add fullscreen mode

## Technical Notes
- Using p5.js from CDN (v1.7.0)
- HSB color mode for smooth color transitions
- Canvas defaults to 800x800, responsive to window size
- Each pattern has its own drawing function
- Time variable used for animation
- Particles and flow field use arrays for state management
- Save function exports as PNG with seed in filename
- Seeded RNG using Math.sin for deterministic random values
- Parameter generation happens once per seed, creating hierarchy
- 50+ parameters total: ~12 global + ~6-10 per pattern type
- Input accepts both numbers and strings (strings converted via char codes)
- Extreme parameter ranges create massive variation:
  - Spiral noise, wave chaos, particle glow, flower distortion
  - Background can be near-black or bright
  - Transparency from 20-100%
  - Animation speeds vary 10x
  - Scales from 0.3x to 2.5x
