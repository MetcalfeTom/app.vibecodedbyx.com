# Ruinwood — notes

## log
- 2026-07-06: v1 — forest biome pixel world generator (chat ask). **Gen**: seed string → FNV → mulberry32 + hash2 value-noise fbm. 72×52 tiles: elevation fbm w/ radial island falloff → water/shore; forest-density fbm → trees; deco rolls (rock/flower/shroom/tall-grass). **The one ruin**: 400 candidate scans for an 8×6 landlocked footprint → stamped: corner pillars (25% already fallen), walls w/ gaps + rubble, slab floor, south-facing doorway w/ cleared approach, center ALTAR (pulsing gold spark until found). Spawn ≥22 tiles from ruin (fallback ≥12) so it must be found. **Player**: pixel wanderer (cloak/hood/satchel-hints-facing), continuous movement w/ 4-corner AABB vs SOLID tiles, diagonal normalized, camera clamped w/ sub-tile scroll (fx/fy offsets). Canvas 240×160 internal (30×20 view of 8px tiles), CSS pixelated upscale. **E examine**: facing tile → per-tile lore pools (deterministic pick via hash2 so a tile always says the same line); ALTAR first-touch = lore sequence incl. the seed itself + deep chime + altarFound. **Remappable keys**: up/down/left/right/use, capture UI (click→press, esc cancels, conflict steal), localStorage ruinwood-keys-v1, menu hint renders live binds. Seed pill + new-world button; last seed prefilled from localStorage. Touch: dpad + E button (coarse only). Water shimmer ticks, ruin fireflies, step blips + triad chimes. Pixelify Sans + VT323. Pollinations OG.

## issues
- Tiles say the same lore line forever (deterministic by position) — intentional, feels like a real place.
- No goal beyond finding the ruin — it's a generator/toy, not a quest game.

## todos
- Chat may want: day/night, more ruin variants, creatures, minimap, shareable seed via URL hash, biome sliders.
