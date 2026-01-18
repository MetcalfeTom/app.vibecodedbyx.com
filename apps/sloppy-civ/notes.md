# Sloppy Civ

## log
- 2026-01-18: Initial creation
  - Hex grid map generation
  - 5 terrain types
  - 5 building types
  - Resource system
  - Turn-based gameplay
  - Tile claiming mechanic
- 2026-01-18: Neon cyber theme update
  - Resources changed to Bitcoin, Cooling Fans, Data Crystals, Energy
  - Terrain types updated to cyber theme
  - Buildings updated to Server Node, Power Reactor, etc.

## features
- Hex grid map (15x11)
- 5 terrain types (cyber theme):
  - Data Grid (dark green) - server nodes, reactors
  - Cooling Tundra (cyan) - cooling stations
  - Crystal Peak (purple) - crystal mines
  - Digital Void (black) - impassable
  - Bitcoin Wasteland (gold) - bitcoin bonus
- 4 resources:
  - Bitcoin - currency
  - Cooling Fans - building material
  - Data Crystals - building material
  - Energy - power
- 5 buildings:
  - Server Node: claims tiles, +2 BTC/turn
  - Power Reactor: +3 energy/turn (grid only)
  - Cooling Station: +3 fans/turn (tundra only)
  - Crystal Mine: +2 crystals/turn (mountain only)
  - Crypto Exchange: +5 BTC/turn (upgrades node)
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
