# Neon Bonsai Garden

Grow a garden of glowing bonsai trees. Tap to plant, tap to grow, watch them sway.

## log
- 2026-05-01: **Chat-driven growth + neon fluid selector.** Two coupled asks landed: (1) "tree grows when people chat" — added a glassy chat input strip pinned to bottom-center; each typed message grows 1–4 branches on the youngest tree, branch-count scales as `min(4, max(1, len/22))` so longer thoughts grow fuller foliage. Messages render in a right-side log (last 8) with a colored left-border matching the palette they grew. (2) "different neon fluids to water it with" — added a row of 5 CSS-only neon fluid bottles (Jade/Sakura/Frost/Ember/Violet) above the chat strip — vertical liquid fill in the palette's leaf color, glassy shine, palette-glow shadow that intensifies on hover and pulses with a 22+40px bloom when `.on`. Click selects, click again deselects. While a fluid is active, chat messages AND tree clicks both use THAT palette for new branches regardless of the tree's base color, so a jade tree can sprout sakura branches and an ember tree can grow frost tips. **Per-segment palette tagging** — each branch carries its own `palIdx` defaulting to the parent's, so old growth retains its color. Backward-compat migration: pre-existing saves without per-segment `palIdx` fall back to the tree's base palette via `ss.palIdx ?? st.palIdx`. Tree picking: if a fluid is active AND exactly one tree matches that palette, that tree gets the message; otherwise the youngest tree (fewest segments) is picked so growth distributes evenly. Empty garden auto-plants a tree in the active fluid's palette on first message. localStorage extended to save `chatLog` (last 8) + `fluidIdx` so chat history + active fluid survive reloads. Hint updated to "pick a fluid · type a message · the tree grows".
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
