# Neon Drill

## log
- 2025-12-29: Initial creation
  - Laser drill mining game
  - Heat mechanic - must let drill cool
  - Fuel system limits play time
  - Purple quartz (10 pts), green emeralds (50 pts)
  - Pink diamonds (100 pts) - rare, deeper
  - Cyan coolant orbs reduce heat by 30
  - Bedrock at bottom prevents infinite depth
  - Camera follows drill downward
  - Laser beam visual with particles
  - Heat meter turns red when overheating
  - Mobile touch controls
  - Sound effects for collection

## issues
- None so far

## todos
- Could add upgrades shop
- Could add different drill types
- Could add achievements
- Could add high score persistence

## notes
### Controls:
- Arrow left/right or A/D to move
- Arrow down, Space, or S to drill
- Drilling builds heat, stopping cools down

### Heat mechanic:
- Drilling adds 0.8 heat per frame
- Cooling is 0.3 per frame when not drilling
- At 100% heat, drill shuts down
- Coolant orbs reduce heat by 30

### Fuel:
- Start with 100 fuel
- Drilling uses 0.05 fuel per frame
- Game over when fuel runs out

### Minerals:
- Quartz (purple): 10 points, common
- Emerald (green): 50 points, less common
- Diamond (pink): 100 points, rare, more common at depth
- Coolant (cyan): -30 heat, no points

### Generation:
- Deeper = more diamonds and emeralds
- Bedrock at bottom (GRID_HEIGHT - 2)
