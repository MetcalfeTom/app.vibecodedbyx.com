# Prism Echo

Procedural neon mandalas that pulse with chat energy.

## log
- 2026-01-25: Initial creation
  - Canvas-based procedural mandala generator
  - Real-time chat frequency monitoring
  - 5 color schemes
  - Rotation and regeneration controls

## features
- Procedural mandala generation with noise functions
- Multiple layers with varying complexity
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
