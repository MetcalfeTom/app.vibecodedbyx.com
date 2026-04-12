# Neon Crawl

Turn-based first-person dungeon crawler with raycasting, D&D character creation, and neon wireframe bosses.

## log
- 2026-04-12: Gold & shop system — monsters drop gold on kill, gold piles on floors, merchant NPC spawns near start of each floor. Shop sells potions, tiered equipment, full heals. Sell items for 50% value. Gold shown in HUD and death screen. Merchant has hooded wireframe sprite with glowing eyes.
- 2026-04-12: Inventory & equipment system — 5 weapons, 5 armors, 5 rings across 5 tiers. Chests spawn on floors (20% mimic chance). Monsters drop loot (30% on kill, 100% boss). Auto-equip empty slots, I key inventory panel with click-to-equip. First-person weapon visual with attack swing animation. Mimic monster type with animated jaw/teeth wireframe. Equipment stat bonuses (ATK/DMG/AC/HP) integrated into combat math.
- 2026-04-12: Major rewrite — turn-based tile-based movement. D&D character creator (4 races: Human/Elf/Dwarf/Tiefling, 4 classes: Fighter/Rogue/Wizard/Cleric, 4d6-drop-lowest ability scores with racial bonuses). Each keypress = 1 turn, monsters move/attack on monster phase. Tile-snapped grid movement (WASD forward/back/turn, Q/E strafe). Boss fights every 3 floors: 4 boss types (Void Colossus, Neon Hydra, Abyssal King, Chrono Wyrm) each with unique wireframe art, scaled HP, and boss intro splash. Must defeat boss to descend. Cleric gets 1 heal/floor (2d8+WIS). Rogue crits on 19-20. XP-based leveling with HP/AC/ATK scaling. Boss room enlarged on boss floors.
- 2026-04-12: Initial build. Real-time raycasting with 5 monster types.

## features
- Inventory & Equipment: weapon/armor/ring slots, click-to-equip from backpack
- 15 items across 5 tiers: Rusty Dagger→Neon Reaper, Leather Vest→Neon Aegis, Ring of Vigor→Chrono Band
- Chests on each floor (20% mimic chance), loot drops from kills (30%) and bosses (100%)
- First-person weapon visual with swing animation on attack
- Mimic monster type — looks like chest, attacks with animated jaw/teeth
- Gold & Shop: monsters drop gold, gold piles on floors, merchant NPC per floor
- Shop: buy potions/equipment/full heals, sell items for 50% value
- D&D Character Creator (race, class, 6 ability scores via 4d6 drop lowest)
- 4 races: Human (+1 all), Elf (+2 DEX +1 WIS), Dwarf (+2 CON +1 STR), Tiefling (+2 CHA +1 INT)
- 4 classes: Fighter (d10 HD, AC 16, STR-based), Rogue (d8, AC 14, DEX, crit 19-20), Wizard (d6, AC 12, INT), Cleric (d8, AC 15, WIS, 1 heal/floor)
- Turn-based tile movement (each key = 1 turn)
- Raycasting 3D engine with neon wireframe walls
- 5 monster types + 4 boss types with unique wireframe art
- Boss fight every 3 floors with intro splash
- D20 combat: d20 + modifier vs AC, crits, damage dice
- XP leveling with HP/AC/ATK scaling per level
- Health potions, stairs (blocked by boss on boss floors)
- Minimap, combat log, death screen
- Mobile touch controls (d-pad + attack + wait)
- WASD + Q/E strafe, Space/Enter to attack, H to heal, Z to wait

## issues
- None known

## todos
- Sound effects
- Supabase leaderboard
- OG preview PNG
