# Chat Canvas

Type words and watch them become abstract geometric art in real time.

## log
- 2026-04-10: Initial build. Canvas-based generative art from text input. 15 shape types (circles, triangles, hexagons, stars, spirograph, waves, diamonds, crosshatch, burst, rings, shards, grid, petals, zigzag, constellation). Seeded PRNG (mulberry32) maps words to deterministic shapes — same word always produces same art. 10 color palettes. Shapes animate with rotation, pulsing, fade-in/out, glow effects. Trail rendering via semi-transparent clear. Chat log shows word badges with shape type. Controls: clear canvas, cycle background, save PNG. Instrument Serif + Geist Mono typography, dark purple/sky accent aesthetic.

## features
- 15 distinct geometric shape types
- 10 color palettes mapped from word hash
- Deterministic: same word = same art always
- Seeded PRNG for reproducible generation
- Animated shapes with rotation, pulse, fade
- Glow/trail visual effects
- Chat log with colored word badges
- Staggered word processing for multi-word input
- Clear canvas, cycle BG color, save PNG
- Mobile-friendly

## issues
- No multiplayer/shared canvas
- Shapes expire after 8-20 seconds
- No undo

## todos
- Supabase integration for shared canvas
- Sound effects per shape type
- More shape types
- OG preview PNG
