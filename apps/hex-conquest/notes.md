# Hex Conquest

## log
- 2026-01-08: Initial creation
  - Turn-based hex-grid strategy game
  - Resource management (gold, wood, food)
  - Building construction (Mine, Farm, Lumber Mill, Tower)
  - Unit recruitment (Soldier, Archer)
  - Combat system with counter-attacks
  - Enemy AI that moves and attacks
  - Win/lose conditions

## features
- Hex grid map with varied terrain (plains, forest, mountain, water)
- 3 resources: Gold, Wood, Food
- 4 building types:
  - Base: Starting structure, produces gold
  - Mine: Produces gold
  - Farm: Produces food
  - Lumber Mill: Produces wood
  - Tower: Defensive structure with ranged attack
- 2 unit types:
  - Soldier: Melee attacker
  - Archer: Ranged attacker
- Turn-based gameplay
- Enemy AI spawns units and attacks

## controls
- Click hex to select unit/building
- Click destination to move selected unit
- Click enemy to attack
- Sidebar buttons to build/recruit
- End Turn button to finish your turn

## game rules
- Build structures on owned territory
- Recruit units adjacent to buildings
- Units can move then attack each turn
- Destroy enemy base to win
- Lose if your base is destroyed
- Enemy spawns new soldiers every 5 turns

## design
- Dark neon aesthetic
- Cyan for player, magenta for enemy
- Yellow highlights for valid moves
- HP bars on units and buildings

## todos
- Add more unit types
- Add fog of war
- Add tech tree
- Add multiplayer
- Add save/load
- Add sound effects
