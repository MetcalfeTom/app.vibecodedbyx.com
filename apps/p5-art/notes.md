# Algorithmic Art Generator

## Log
- 2025-10-21: Initial creation
  - Created p5.js algorithmic art generator with 6 pattern types
  - Pattern types: Spirals, Waves, Particles, Flowers, Geometric, Flow Field
  - Animated patterns with continuous color cycling
  - Controls to regenerate, toggle animation, and save images
  - Mobile and desktop responsive (canvas resizes)
  - Dark theme with glassmorphism UI

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
- Save function exports as PNG
