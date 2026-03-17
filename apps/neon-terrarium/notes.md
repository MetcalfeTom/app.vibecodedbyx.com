# Neon Terrarium

Cozy neon terrarium with glowing moss, mushrooms, ferns, beetles, and growth mechanics.

## log
- 2026-03-17: Initial build. Canvas ecosystem sim inside a glass jar. 6 plantable things: moss (spreads organically, emits glow motes), mushrooms (grow stems+caps with spots, emit spores, sway), ferns (grow stems with branching fronds and leaflets, sway), water drops (fall with gravity, splash into motes, raise global moisture), beetles (walk on soil, 6 legs animate, antennae wave, nibble moss), lights (radial glow sources, raise light level). Growth rates affected by moisture and light. Soil with bumpy terrain profile. Glass jar outline with reflections. Particles: spores from mushrooms, glow motes from moss. Stats HUD shows entity counts + moisture/light %. Keyboard 1-6 for tools. Hold-drag to paint moss or water. Touch support. Vollkorn + DM Mono typography, dark earth with green neon accent.

## issues
- None yet

## todos
- Seasons/day-night cycle affecting growth
- Snails that leave glowing trails
- Flowers that bloom from mature moss
- Rain button (mass water)
- Sound: ambient cricket/rain sounds via Web Audio

## notes
- No database — pure frontend
- Max: 200 moss, 40 mushrooms, 30 ferns, 15 beetles, 500 particles
- Moisture decays at 0.0001/frame, replenished by water drops (+0.03 each)
- Light decays at 0.00005/frame, replenished by placing lights (+0.08 each)
- Moss spread chance: spread*moisture when growth>0.6
- Beetles nibble moss (0.1% chance per tick when overlapping)
- Floor Y at 72% of screen height
