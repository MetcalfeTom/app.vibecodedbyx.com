# Xenoglyph

Procedural alien symbol generator. 30 unique glyphs per codex with custom names and hex IDs.

## log
- 2026-04-10: Initial build. Canvas-based procedural glyph generation with seeded PRNG (mulberry32). 8 structural forms: radial spokes, concentric polygons, bezier sigils, grid runes, orbital rings, spirals, totems, constellations. 10 neon color palettes. Name generator with prefix+mid+suffix system ensuring uniqueness. Hex ID per glyph. Regenerate button for new codex. Cormorant Garamond + Fira Code typography, deep violet/purple aesthetic.

## features
- 8 distinct procedural glyph forms
- 10 color palettes (violet, pink, cyan, lava, acid, sky, gold, neon, red, indigo)
- Unique alien names from 30 prefixes × 20 middles × 20 suffixes
- Seeded PRNG for reproducible codexes
- Hex ID per glyph
- Responsive grid layout
- Regenerate button

## issues
- No save/export functionality
- No sharing individual glyphs
- Canvas rendering — no SVG export

## todos
- Download codex as PNG grid
- Share individual glyphs
- Seed input for reproducible codexes
- Hover to see glyph "meaning" or lore
- OG preview PNG
