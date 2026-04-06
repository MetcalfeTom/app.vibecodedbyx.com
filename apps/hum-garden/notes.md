# Hum Garden

## log
- 2026-04-06: Initial build — interactive glowing garden where clicking plants musical flowers. Each flower has a unique pentatonic note (3 harmonics: fundamental + octave + 12th), continuous humming with vibrato. 6 flower types (bell, star, lotus, tulip, dahlia, orchid), 8 color palettes, growing animation, sway, pollen particles, fireflies. Newsreader typography, dark forest palette.

## features
- 6 procedural flower types with different petal counts and shapes (round/pointed)
- 8 color palettes: pink, purple, blue, green, yellow, peach, lavender, mint
- Each flower hums a unique pentatonic note (15 notes across 3 octaves)
- WebAudio: sine oscillator + 2 harmonics, lowpass filter, vibrato
- Volume auto-balances based on flower count (more flowers = quieter each)
- Flowers grow from seed with stem/petals/leaves animation
- Gentle sway with per-flower phase and amplitude
- Petal breathing animation
- Glow pulse around each flower head
- Pollen particles float up from humming flowers
- Fireflies drift through the scene
- Y-sorted depth rendering
- Grass tufts, ground gradient, subtle sky
- Trail-fade rendering for dreamy atmosphere
- Touch support

## issues
- Many flowers (20+) can cause audio clutter despite volume scaling
- No way to remove flowers
- Canvas performance with many radialGradients

## todos
- Add flower removal (long press/right click)
- "Melody mode" — flowers take turns humming in sequence
- Day/night cycle
- Butterflies attracted to flowers
- Save/load garden
- OG image
