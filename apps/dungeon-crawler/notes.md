# Dungeon Crawler

## log
- 2026-01-06: MAJOR REWRITE - Converted to isometric Diablo-style view with click-to-move
- 2026-01-06: Reviewed - full party RPG with inventory, spells, and recruitment
- 2026-01-03: Major expansion - 6-member recruitable party, inventory, 12 spells
- 2026-01-02: Initial creation - retro first-person dungeon crawler

## features
- **Isometric view** - Diablo 1 inspired perspective
- **Click-to-move** - A* pathfinding, click tiles to walk
- **Click enemies** - auto-path and attack
- Dark gothic aesthetic with Cinzel/Crimson Text fonts
- Procedurally generated dungeons per floor
- 6 monster types scaling with depth
- Loot system (potions, gold, weapons)
- Inventory with 8 slots
- Level up system with stat growth
- Combat log
- Camera follows player smoothly

## controls
- **Click tile**: Move to location (pathfinding)
- **Click enemy**: Walk to and attack
- **1-4 keys**: Use inventory items

## monsters
1. Rat - small, low damage
2. Skeleton - bone-white, medium threat
3. Ghoul - greenish undead
4. Demon - red, dangerous
5. Wraith - spectral, high damage
6. Dragon - boss-tier, massive HP

## items
- Health Potion (❤️) - restore 25 HP
- Mana Potion (💙) - restore 15 MP
- Gold (💰) - currency
- Rusty Sword (🗡️) - +2 ATK permanently

## design
- Gothic color palette (dark reds, blacks, browns)
- **Pixel art sprites** for player and all enemies
- Isometric diamond tiles with wall height
- Checker pattern floor
- Pre-rendered sprite canvases for performance
- Path preview line
- Enemy health bar overlay
- Combat log panel

## sprites
- Player: hooded wanderer in dark cloak
- Rat: small gray rodent
- Skeleton: bone-white humanoid
- Ghoul: hunched greenish undead
- Demon: horned red beast
- Wraith: ghostly purple specter
- Dragon: large dark winged creature

## technical
- Canvas 2D isometric rendering
- A* pathfinding algorithm
- Screen-to-iso coordinate conversion
- Back-to-front rendering order
- Smooth camera lerping

## todos
- Add blood splatter effects
- Add ambient dungeon sounds
- Add more item variety
- Add boss encounters
- Add save/load system
