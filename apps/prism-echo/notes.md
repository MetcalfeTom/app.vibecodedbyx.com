# Prism Echo

Procedural neon mandalas that pulse with chat energy, built on sacred geometry mathematics.

## log
- 2026-01-25: Tooltip System
  - Hover tooltips on all control buttons
  - Info panel (?) with sacred geometry explanations
  - PHI, Fibonacci, TAU constants display
  - Geometry mode descriptions with symbols
- 2026-01-25: Sacred Geometry Update
  - Added PHI (golden ratio) constants
  - Fibonacci sequence for spacing
  - 4 sacred geometry modes: Flower of Life, Metatron's Cube, Sri Yantra, Golden Spiral
  - Vesica Piscis, Seed of Life patterns
  - PHI-ratio petal overlays with golden angle spacing
  - Fibonacci-spaced orbital rings
- 2026-01-25: Initial creation
  - Canvas-based procedural mandala generator
  - Real-time chat frequency monitoring
  - 5 color schemes
  - Rotation and regeneration controls

## features
- Procedural mandala generation with noise functions
- Multiple layers with varying complexity
- Hover tooltips explaining each control
- Info panel with sacred geometry mathematics

## sacred geometry
- PHI (φ) = 1.6180339887 (Golden Ratio)
- PHI_INV = 0.6180339887 (1/φ)
- Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...
- TAU (τ) = 2π

### geometry modes
1. **Flower of Life** - overlapping circles in hexagonal pattern
2. **Metatron's Cube** - 13 circles with 78 connecting lines
3. **Sri Yantra** - interlocking triangles with PHI scaling
4. **Golden Spiral** - Fibonacci arcs and golden rectangles

### sacred elements
- Seed of Life (7 circles)
- Vesica Piscis (2 overlapping circles)
- Golden angle petal spacing (τ/φ²)
- Fibonacci-spaced orbital rings
- Symmetry adapts to chat activity (8-16 fold)
- Real-time pulse on new messages
- Smooth frequency interpolation
- 5 color schemes (Neon, Fire, Ice, Toxic, Void)
- Rotation toggle
- Regenerate button for new patterns
- Echo indicator pulses on activity
- Stats display (frequency, messages/min, symmetry, layers)

## chat integration
- Monitors sloppygram_messages table
- Real-time subscription for instant pulse
- 30-second polling for message count
- 5-minute sliding window for frequency calculation
- Visual intensity scales with messages per minute

## visual effects
- Neon glow shadows
- Fade trail effect (rgba clear)
- Breathing animation
- Petal curves with noise offset
- Connecting rings
- Center glow gradient
- Gradient text title

## controls
- COLORS: cycle through 5 schemes
- ROTATION: toggle spin
- REGENERATE: new random seed, layers, symmetry

## design
- Orbitron font
- Full-screen canvas
- Dark void background
- Neon magenta/cyan accents
- Minimal UI overlay

## todos
- Add audio reactivity option
- Add export as image
- Add more mandala shape variations
- Add particle effects on pulse

## issues
- None yet
