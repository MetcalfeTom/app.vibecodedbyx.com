# Neon Bonsai Garden

Grow a garden of glowing bonsai trees. Tap to plant, tap to grow, watch them sway.

## log
- 2026-03-24: Initial build. Procedural bonsai growth engine with recursive branching (max depth 8), 5 color palettes (Jade/Sakura/Frost/Ember/Violet), 4 seasons with visual effects (spring blooms, autumn falling leaves, winter snow caps, summer full foliage). Firefly ambience, growth particles, localStorage persistence with parent-child segment reconstruction. Plant up to 12 trees. Cormorant Garamond + Fira Code typography.

## issues
- None yet

## todos
- Sound: gentle chime on growth, ambient wind
- Day/night cycle
- Supabase integration for shared garden (all visitors see same trees)
- Mushrooms/flowers growing at tree bases
- Tree aging (trunk thickens over time)

## notes
- 5 palettes: Jade (green), Sakura (pink), Frost (cyan), Ember (orange), Violet (purple)
- 4 seasons: spring (blooms), summer (full), autumn (falling leaves), winter (snow caps, bare)
- Max 12 trees, max depth 8 per tree
- Click near tree base = grow 2 branches + add energy
- Click empty ground (bottom 100px) = plant new tree
- Energy: trees auto-grow slowly when energy > 0
- Branch generation: length reduces by 0.78x per depth, width by 0.65x
- Leaves appear at depth >= 4 with probability 0.6 + depth * 0.1
- Sway: per-tree phase + speed, depth-scaled offset
- localStorage key: neon_bonsai_garden, auto-save every 10s
- Fireflies: 12 ambient glowing dots with sine-wave movement
