# Bee Hive

Fly your bee, collect pollen from flowers, and grow the ultimate hive.

## log
- 2026-03-17: Initial build. Canvas-based bee game. Player bee controlled with arrow keys/WASD/touch. Fly to flowers to collect pollen, return to hive to deposit as honey. Hive auto-upgrades at honey thresholds (10/25/50/100/200/400/800), increasing max pollen capacity and spawning more flowers. Helper bees auto-purchased at 15 honey each, they autonomously collect pollen and return to hive. Flower regrowth every 4 seconds. Particle effects for pollen/honey collection. Sky gradient background with cloud animation. Fredoka + JetBrains Mono typography. Bee rendering: body with stripes, animated wings, eyes, stinger, pollen bags that fill as collected.

## issues
- None yet

## todos
- Predators (wasps/spiders) that chase the bee
- Weather effects (rain slows movement, sun boosts pollen)
- Flower types with different pollen values
- Hive customization/decoration
- Sound effects

## notes
- No database — pure frontend
- Helper bees have autonomous AI: find nearest flower, collect, return to hive
- Hive levels: 1-7, each level increases flower count and bee capacity
- Max pollen per trip: 5 + hiveLevel * 2
