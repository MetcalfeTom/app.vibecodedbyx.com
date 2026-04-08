# Strata

## log
- 2026-04-08: Initial build — side-view grid excavation sim. 28-col voxel world, 9 geological layers (Topsoil → Clay → Sandstone → Limestone → Granite → Basalt → Obsidian → Magma → Core) with layer-specific hardness and gem tables. 11 gems (Pebble, Gold, Quartz, Ruby, Emerald, Sapphire, Amethyst, Diamond, Meteorite, Starshard, Void Gem) scaling in price/rarity. Deterministic per-tile generation via xy hash → stable across saves. Click/drag to mine; AOE radius from Reach upgrade. 5 upgrades (Pick Power, Reach, Gem Luck, Appraisal, Auto-Drill). Particles, damage floaters, rare-gem toast, crack overlays, gem peek through damaged tiles. Camera auto-descends as player mines deeper; wheel to pan. localStorage save. Rubik Mono One + Space Mono, amber/earth palette.

## features
- Voxel strata with 9 depth layers
- 11 tiered gems with color-coded glow
- Deterministic per-tile generation (hash) — rebuilds across reloads
- AOE mining via Reach upgrade
- 5 upgrades with exponential scaling
- Auto-drill passively mines exposed tiles
- Damage overlay + gem-peek preview
- Camera auto-descend + wheel scroll
- Rare gem toast, damage floaters, particles

## issues
- None yet

## todos
- Prestige reset for permanent bonuses
- Supabase leaderboard for deepest depth / rarest gem
- Sound effects
- Cave pockets / hidden rooms
