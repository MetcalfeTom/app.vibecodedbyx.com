# Strata

## log
- 2026-04-08: Added ticking time bombs. Every ~18-32s (after 15+ tiles dug), a red pulsing bomb with 3s countdown spawns on a random dug tile currently in view. Click within 3s to defuse (reward: 15 + 0.5% of total value, green particles). If timer expires, mining is jammed for 5s — screen tints red pulse, "MINING JAMMED 5.0s" banner top-center, shockwave + red/amber explosion particles. Bomb click takes priority over tool/explosive arm (bomb clicks checked first in tryDig on fresh `_armClick`). Bomb renders as red pulsing circle with yellow countdown arc + inner black disc + countdown number (Rubik Mono One).
- 2026-04-08: Added global leaderboard on table `strata_dig_scores` (created via supabase MCP — columns display_name, total_value bigint, depth, gems_found, rare_gems jsonb; default RLS). Tracks lifetime `state.totalValue` (incremented on gem collect AND on explosive bonus, never decremented on upgrade spend). "🏆 Leaderboard" button in footer opens a modal with name input + submit button + top 20 by total_value. Submit uses select-then-update-or-insert for one row per user (since table has no id primary key, filter on user_id). Rank #1/2/3 tinted gold/silver/bronze. Own saved name kept in localStorage. Added embedded `type="module"` script to bridge supabase to `window._lbLoad`/`window._lbSubmit`.
- 2026-04-08: Added explosives + drill tier system (thyrepz request). Three buyable tools: Dynamite (220g, 3×3 blast, 1×), TNT Crate (900g, 5×5 blast, 2× gem yield), Mega Bomb (3800g, 9×9 blast, 3× gem yield). Click tool card to arm (orange pulse border + "ARMED" banner), click canvas to detonate, ESC to cancel. Drag never triggers explosive (fresh-click only via `_armClick` flag on mousedown/touchstart). Detonate ignores tile HP and awards bonus gold based on gem multiplier with "×N" floater. Shockwave ring + 40-particle fireball on boom. DRILL upgrade now shows tier names by level: Rock Pick (1) → Iron Drill (5) → Steel Drill (10) → Diamond Drill (16) → Plasma Drill (24). Swing cooldown scales down with pick level (40ms base → min 18ms). Save key bumped to v2 for explosives inventory.
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
