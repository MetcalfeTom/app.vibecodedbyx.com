# Pixel Bestiary

## log
- 2026-04-21: Created. 32×32 procedural pixel monster generator. Seeded mulberry32 PRNG (6-char alphanumeric seeds hashed via FNV-1a) → 8 archetypes (Blob/Imp/Gargoyle/Spider/Worm/Ooze/Ghoul/Abomination) × 10 palettes (Toxic/Blood/Void/Bone/Abyss/Rot/Flame/Goblin/Candy/Frost). Each palette = 8 hex colors indexed: [0 transparent, 1 outline, 2 shadow, 3 base, 4 light, 5 highlight, 6 eyeWhite, 7 eyePupil, 8 accent]. Symmetric horizontal pixel drawing (`putSym`, `fillEllipseSym`, `fillRectSym`, `lineSym` Bresenham). Eyes placed as marker color 9 by archetype drawer, then resolved to pupil+white via `resolveEyes`. Post-passes: `shade()` promotes body-base (3) to highlight/light/shadow based on neighbor transparency; `outline()` adds color 1 in empty cells orthogonally adjacent to body. Optional `addSpikes`/`addSpots` accents.
- **Name generator**: PREFIX × MIDDLE × SUFFIX = thousands of unique grimoire names.
- **UI**: 512px hero canvas + 16-tile gallery (4-col grid), seed input (Conjure button parses), Summon New rerolls hero, Reroll All regenerates gallery, 512× PNG download. Shift-click a thumbnail to reroll that single slot. Click a thumbnail to promote it to hero.
- **Keyboard**: R = reroll hero, Space = reroll all, D = download.
- Creepster (display) + Silkscreen (labels) + VT323 (body), dark red/bone/candlelit grimoire palette with radial blood-glow background.
- Pollinations OG image.

## features
- 8 archetypes × 10 palettes × seeded rng = huge variety
- 32×32 symmetric pixel drawing with auto outline + shading
- Gallery with promote/reroll/shift-click-reroll
- PNG download at 512× (nearest-neighbor upscale)
- Keyboard shortcuts + seed copy/paste

## issues
- Some archetype combinations (e.g. Worm with 3 eyes) can look awkward but remain readable.
- Spikes/spots are stochastic — rare seeds are very busy.

## todos
- Animated idle (2-frame wobble) for hero
- Bestiary save-to-localStorage with tags
- Rare-palette / rare-archetype easter eggs
- Export animated GIF
