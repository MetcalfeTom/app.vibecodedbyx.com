# Lexical Leaf

A digital garden where every message grows a unique pixel-art flower. Type words, watch them bloom.

## log
- 2026-04-12: Slowed insect movement ~4x (speed, velocity, flee, wander all reduced). Flowers now scale by message length — short messages grow small flowers, long messages grow towering blooms (1x-2.5x stem height and petal radius).
- 2026-04-12: Added 12 metallic insects — rolly pollies (curl into ball when mouse near), bees (striped gold/black, flapping wings), ants (3-segment body, animated legs, antennae), dragonflies (iridescent, 4 flapping wings), worms (undulating segments). All have metallic sheen with shimmer highlights. Insects flee from mouse cursor. Rolly pollies curl defensively. Ground crawlers stay on dirt, flyers bob in the air. Facing direction follows velocity.
- 2026-04-12: Added copper wire stem textures (warm orange-brown with specular highlights, oxidation patina, copper barb thorns) and mouse magnet physics — stems bend toward cursor with strength proportional to distance and height. Touch magnet support. Stems follow natural sway + magnet deflection, petals and leaves track bent stem position.
- 2026-04-12: Initial build. Message text hashed to generate flower genetics: petal hue/sat/light, center color, stem height, petal radius, shape type, leaf type. 8 petal shapes (cross, diagonal, star, round, tulip, spiky, ring, diamond), 5 leaf types. Deterministic seeded RNG from message hash. Pixel-art rendering at 4x scale. Ground with grass tufts, twinkling stars. Growth animation (stem → leaves → petals over 1.5s). Gentle sway animation. Hover to read flower messages. localStorage persistence, caps at 200 flowers. 3 welcome flowers on first visit. Species counter based on shape+leaf+hue combos. Bitter + DM Mono typography, earthy dark garden aesthetic.

## features
- Deterministic flower generation from message hash
- 8 petal shapes, 5 leaf types, thorns, dual-color petals
- Pixel-art rendering at 4x scale
- Growth animation (stem → leaves → petals)
- Gentle sway animation
- Hover/touch to read flower messages
- Ground texture with grass tufts
- Twinkling star sky
- Species counter
- localStorage persistence (200 flower cap)
- Mobile responsive with touch support

## issues
- None known

## todos
- OG preview PNG
- Seasons/weather effects
- Flower wilting over time unless "watered"
- Share garden as image
- Supabase persistence for shared community garden
