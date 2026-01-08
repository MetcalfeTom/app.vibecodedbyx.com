# Mysterious Life

## log
- 2025-12-28: Initial creation
  - Ecosystem simulation with 5 abstract shapes
  - Hidden behaviors for discovery through observation
  - Interactions include predation, parasitism, swarming, reproduction
  - Event log shows mysterious happenings
  - Elegant dark aesthetic with Cormorant Garamond font
  - Trail effect creates ethereal atmosphere
- 2025-12-28: Bug fixes
  - Changed favicon to 🦠 for biological theme
  - Added localStorage persistence
  - Increased reproduction rates, lowered cooldowns
  - Added debug overlay with population counts and reproduction log
  - Fixed child size calculation: children were dying immediately due to multiplicative size decay below death threshold (5). Added Math.max(10, ...) floor

## issues
- Child size decay was causing multi-generational population collapse (FIXED)
- **Array mutation during filter bug (FIXED)**: `creatures.push(child)` during `.filter()` loop added children to the OLD array, but filter returns a NEW array - all newborns were discarded immediately. Fix: use separate `newborns[]` array, add after filter completes.

## todos
- Could add environmental factors (food sources, obstacles)
- Could add day/night cycle affecting behaviors
- Could add mutation/evolution over time
- Sound effects would enhance atmosphere

## notes
### Hidden Behaviors (spoilers):
- **Orb (Circle/Blue)**: Peaceful wanderers, flee from spires, reproduce slowly
- **Spire (Triangle/Red)**: Predators, hunt orbs and cubes, territorial, fight each other
- **Cube (Square/Green)**: Grazers (passive energy gain), fast reproduction, prey for spires
- **Shard (Diamond/Purple)**: Parasites, attach to hosts and drain energy, reproduce via budding
- **Cell (Hexagon/Yellow)**: Swarm intelligence, flock together, collective defense against spires, share energy

### Mechanics:
- All creatures have energy that slowly depletes
- Reproduction costs energy and has cooldown
- Population cap of 100 to prevent lag
- Creatures die when energy reaches 0 or size gets too small
- Event log provides hints about behaviors without explicit explanation
