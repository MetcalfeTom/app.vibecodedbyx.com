# Dungeon Crawler

## log
- 2026-01-02: Initial creation - retro first-person dungeon crawler

## features
- First-person pseudo-3D view
- Grid-based movement (WASD/arrows)
- 4 cardinal directions with compass
- Procedurally generated dungeons
- Multiple floor levels (descending)
- Turn-based combat system
- 5 monster types with increasing difficulty
- Health potions scattered in dungeon
- XP and leveling system
- CRT scanline overlay

## monster types
1. Rat - HP 5, ATK 2, XP 5
2. Goblin - HP 10, ATK 4, XP 10
3. Skeleton - HP 15, ATK 6, XP 15
4. Orc - HP 20, ATK 8, XP 25
5. Demon - HP 30, ATK 12, XP 40

## controls
- W/↑: Move forward
- S/↓: Move backward
- A/←: Turn left
- D/→: Turn right
- Space/Enter: Attack (in combat)

## map generation
- 12x12 grid per floor
- Border walls
- Random interior walls (30% chance)
- 1 exit per floor
- 3 + floor number monsters
- 2 health potions

## leveling
- XP needed = level × 30
- Level up: +5 max HP, full heal
- Damage: 5 + level × 2 + random(0-2)

## design
- Dark dungeon colors
- Simple 3D wall rendering
- Emoji sprites for objects
- Retro monospace font
- Scanline CRT effect
- HUD with HP and XP bars

## issues
- None yet

## todos
- Add treasure/gold system
- Add different weapon types
- Add magic spells
- Add minimap
- Add sound effects
- Add boss monsters
- Add inventory system
