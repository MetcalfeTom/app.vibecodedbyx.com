# Lexical Leaf

A digital garden where every message grows a unique pixel-art flower. Type words, watch them bloom.

## log
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
