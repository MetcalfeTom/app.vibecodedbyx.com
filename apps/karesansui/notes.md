# Karesansui — Digital Zen Garden

Minimalist sand raking and stone placement inspired by Japanese dry rock gardens.

## log
- 2026-02-01: Initial creation
  - Pixel-level sand simulation with groove/ridge depth mapping
  - Warm natural sand palette (beige, cream, stone gray)
  - Tools: rake (parallel tines), smooth, circle pattern, stone placement
  - Draggable stones with gradient lighting and shadow
  - Double-click to remove stones
  - Partial region rendering for performance
  - Custom SVG cursors per tool
  - Zen title screen with "Enter Garden" transition
  - Rotating breath/mindfulness text
  - Keyboard shortcuts (1-4, r/s/f/c, Esc to clear)
  - Touch support for mobile
  - No neon — natural warm tones only

## features
- Pixel-based sand depth simulation (Float32Array)
- Rake with alternating groove/ridge tines
- Smooth tool to flatten sand back
- Concentric circle pattern stamping
- Natural stone placement with radial gradient rendering
- Drag stones to reposition
- Double-click to remove stones
- Optimized partial-region rendering
- Mindfulness text rotation

## design
- Cormorant Garamond + Noto Serif JP typography
- Warm sand palette: #e8dcc8 base, cream highlights, earthy grooves
- Natural stone colors with light/shadow gradients
- No neon, no glow — pure minimalism
- Semi-transparent toolbar with backdrop blur

## issues
- Full canvas resize clears the garden (sandData is rebuilt)
- Performance on very large screens may dip during fast raking

## todos
- None currently
