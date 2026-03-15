# Neon Terrarium

A living pixel terrarium with glowing plants and tiny autonomous creatures. Watch life unfold.

## log
- 2026-03-15: Initial build. Pixel art terrarium in glass jar. 6 plant types: fern (branching leaves), mushroom (cap with spots), crystal (angular facets), vine (wavy growth), bloom (rotating petals), moss (ground spreading). Plants grow segment-by-segment with sway animation, growth rate affected by water level. Neon glow auras on plant tips. Spore system: mature plants release spores that drift down, can seed new plants (0.1% per frame). 5 creature types: beetle (walking with leg animation), worm (trailing segments), snail (shell), firefly (floating with pulse glow), spider (walking). Creatures wander autonomously, eat spores for energy, die when energy depletes. Rain button adds water drops and raises water level. Glow burst button energizes all plants with particle shower. Click soil line to plant at position. Glass jar with rim, reflection highlights, soil with noise texture, starfield outside. Auto-spawns plants every 600 frames if water available. Silkscreen + DotGothic16 typography, green neon on deep dark palette.

## issues
- None yet

## todos
- Day/night cycle affecting growth and firefly behavior
- Creature breeding when energy is high
- Seasonal color changes
- Terrarium jar shape options (round, tall, wide)
- Sound: ambient rain, creature chirps

## notes
- No database — pure frontend, no persistence
- Canvas: 220x160 native, scaled up with pixelated rendering
- Jar bounds: 20px margins, soil at bottom 22px
- Plant growth: 0..1, rate modified by water level and glow burst
- Water: 0..1, slowly evaporates, consumed by plant growth, added by rain
- Spore seeding chance: 0.1% when spore lands on soil
- Creature energy: starts 80-100, drains 0.005/frame, +15 when eating spore
- Max: 25 plants, 15 creatures
- 6 plant types with distinct visual features (branches, caps, crystals, waves, flowers, spreading)
- Fireflies float with sine-based glow pulse, others walk on soil
