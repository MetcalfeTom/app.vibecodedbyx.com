# sloppy-zombies

## log
- 2026-05-02: Created as a top-down wave-survival shooter (4 boarded windows, mystery box, 6 weapons, powerups).
- 2026-05-02: **Overhauled into isometric zombie RPG.** Gameplay logic now lives in WORLD-TILE coords (wx/wy on a 14×10 tile grid); all rendering goes through `worldToScreen()` for a 2:1 iso projection (TILE_W=64, TILE_H=32). Mouse cursor is unprojected back via `screenToWorld()` for aiming and click-targets. Z-sort all entities by `wx + wy` so closer ones paint on top — proper iso depth ordering for zombies / drops / windows / box / fx / bullets. Walls render as outer dark tile rings; boards still on the inner-room edges with the ID label. **Persistent meta-progression** added via localStorage (`sloppy-zombies-meta-v1` schema `{gold, bestWave, upgrades:{vit,fire,reload,luck}}`): GOLD persists across runs, 4 permanent upgrade tracks each with their own gold cost curve (`base × grow^lvl`):
  - VITALITY (max HP +20/lvl, max 5, base 80g, grow 1.7)
  - FIREPOWER (+10% bullet dmg/lvl, max 5, base 100g, grow 1.7)
  - STEADY HANDS (-10% reload/lvl, max 4, base 90g, grow 1.8)
  - SCAVENGER (+25% loot drop chance/lvl, max 4, base 110g, grow 1.8)

  Title screen + death card both render the upgrade store as 4 cards (cost / current level / max). Buying decrements gold + bumps the level + saves to localStorage. **Loot system**: 18% × luckMult drop chance per kill spawns a rarity-tinted CRATE (4 tiers: common 60%, rare 25%, epic 11%, legend 4%); 6% × luckMult drops a powerup (max ammo / instakill / double / nuke). Crates require E to open and yield gold (`20 × rarity.mult`), then 50% roll for either a fresh weapon (mystery-box pool) or an armor piece. Equipping a worse-tier armor refunds a few gold and skips the swap. **Equipment slots**: weapon (mystery-box / loot rolls) + armor (loot only). Armor: damage-reduction passive (`8 × rarity.mult`, capped to ≥1 dmg incoming). Armor badge rendered top-left of canvas with rarity-coloured border + name. **Weapons**: 6-piece arsenal (PISTOL / SMG / SHOTGUN-pellets-8 / RIFLE / SNIPER / RAY GUN-pierce-2). All damage now scales with FIREPOWER upgrade: `dmg × (1 + 0.10 × fireLvl)`. Reload time scales with STEADY HANDS: `reload × max(0.35, 1 - 0.10 × reloadLvl)`. **Mystery box** still at 950 pts; works the same. **Wave system** unchanged in shape: 4 + ⌊wave×1.6⌋ zombies, ramping cadence, banner on start/clear, +200 wave-clear bonus, pistol +24 reserve at wave start. Zombie HP `60 + wave×28`; zombie speed `1.6 + min(2.0, wave×0.10)` tiles/sec. **Aesthetic**: dirt-tile floor with checker stagger, dark wall tile ring, sickly hsl(90–120) zombies with red dot eyes, drop-shadow ellipses on every entity, rarity-coloured glow on crates, gold/blood neon UI accents. Bungee Shade title, Special Elite body, VT323 numerals, Silkscreen meta. CRT scanline overlay + custom red crosshair (cursor:none). 14 Web Audio synth sfx including a coin pickup. Pollinations OG, 🧟 favicon.

## issues
- Iso depth-sort uses simple `wx + wy` per entity; for very close pieces this can flicker as they swap z-order tick-to-tick. A stable secondary key (e.g., entity id) would lock it.
- Crates and powerups both go in `drops[]` — fine but the kind-switch in `applyDrop`/`openCrate` is split. Refactor into a uniform pickup interface later.
- WASD → world mapping uses iso-natural diagonals (`W = (-1,-1)` world). Players who expect strict cardinal world movement will need a beat to adapt — that's the standard iso-shooter compromise.
- Armor only has one stat (damage reduction). Could add a stamina/move-speed mod or a +ammo bonus in later iterations.
- Upgrade cost curve is exponential — at L5 vit the cost is 80×1.7⁴≈668g, which takes a few good runs. Tunable.
- No mute toggle, no localStorage clear button (testing required wiping it manually).

## todos
- More weapon tiers and gear types (helm / boots / trinket).
- Item rarity-affixed weapon stats (e.g., "Epic SMG: +25% mag size").
- Pack-a-Punch-style upgrade station that consumes points + gold.
- Boss zombie at every 5th wave.
- Mobile virtual joystick.
- High-score leaderboard via Supabase.
- Interactive armor slot UI (compare on hover, manually equip from drops).
- Save current loadout between runs (right now armor + weapon reset on death).
- Mute toggle + reset-vault button.
