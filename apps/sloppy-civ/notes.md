# Sloppy Civ

## log
- 2026-01-18: Initial creation
  - Hex grid map generation
  - 5 terrain types
  - 5 building types
  - Resource system
  - Turn-based gameplay
  - Tile claiming mechanic

## features
- Hex grid map (15x11)
- 5 terrain types:
  - Plains (green) - farms
  - Forest (dark green) - lumber camps
  - Mountain (gray) - quarries
  - Water (blue) - impassable
  - Desert (yellow) - gold bonus
- 4 resources:
  - Gold - currency
  - Wood - building material
  - Stone - building material
  - Food - population
- 5 buildings:
  - Settlement: claims tiles, +2 gold/turn
  - Farm: +3 food/turn (plains only)
  - Lumber Camp: +3 wood/turn (forest only)
  - Quarry: +2 stone/turn (mountain only)
  - Market: +5 gold/turn (upgrades settlement)
- Resource nodes on tiles give +1 bonus
- Turn-based production
- Tile claiming system (settlement radius)
- Tooltip on hover
- Build cost validation

## controls
- Click build button to select
- Click valid hex to place
- End Turn to collect resources

## design
- Space Mono font
- Dark blue/gold color scheme
- Minimalist panel UI
- Canvas hex rendering

## todos
- Add units
- Add combat
- Add tech tree
- Add win condition
- Add save/load
- Add fog of war
- Add AI opponent

## issues
- None yet
