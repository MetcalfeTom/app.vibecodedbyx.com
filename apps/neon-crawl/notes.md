# Neon Crawl

Turn-based first-person dungeon crawler with raycasting, D&D character creation, and neon wireframe bosses.

## log
- 2026-04-12: Major rewrite — turn-based tile-based movement. D&D character creator (4 races: Human/Elf/Dwarf/Tiefling, 4 classes: Fighter/Rogue/Wizard/Cleric, 4d6-drop-lowest ability scores with racial bonuses). Each keypress = 1 turn, monsters move/attack on monster phase. Tile-snapped grid movement (WASD forward/back/turn, Q/E strafe). Boss fights every 3 floors: 4 boss types (Void Colossus, Neon Hydra, Abyssal King, Chrono Wyrm) each with unique wireframe art, scaled HP, and boss intro splash. Must defeat boss to descend. Cleric gets 1 heal/floor (2d8+WIS). Rogue crits on 19-20. XP-based leveling with HP/AC/ATK scaling. Boss room enlarged on boss floors.
- 2026-04-12: Initial build. Real-time raycasting with 5 monster types.

## features
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
- Equipment drops from bosses
- Treasure/gold
- Sound effects
- Supabase leaderboard
- OG preview PNG
