# Bee Hive

Fly your bee, collect pollen from flowers, and grow the ultimate hive.

## log
- 2026-03-17: Initial build. Canvas-based bee game. Player bee controlled with arrow keys/WASD/touch. Fly to flowers to collect pollen, return to hive to deposit as honey. Hive auto-upgrades at honey thresholds (10/25/50/100/200/400/800), increasing max pollen capacity and spawning more flowers. Helper bees auto-purchased at 15 honey each, they autonomously collect pollen and return to hive. Flower regrowth every 4 seconds. Particle effects for pollen/honey collection. Sky gradient background with cloud animation. Fredoka + JetBrains Mono typography. Bee rendering: body with stripes, animated wings, eyes, stinger, pollen bags that fill as collected.

- 2026-03-17: Added 7 flower types (Daisy, Poppy, Lavender, Sunflower, Bluebell, Rose, Royal Orchid), rare golden orchids with glow that yield rare honey (crown icon). Weighted random spawning. Different petal counts/sizes/colors per type. localStorage persistence for honey, rare honey, hive level, bees. Slowed clouds. Compact HUD with emoji-only labels.

- 2026-03-17: Added 13 hive levels (up from 7) with increasing costs up to 12000 honey. Bee skins per level: Classic (1-8), Fire (9), Frost (10), Royal (11), Golden (12), Emerald (13). Honey multiplier based on unique flowers visited per trip (each unique flower +0.25x). Petals repositioned closer to stems. Flowers respawn as random new type when picked.

- 2026-03-17: Dynamic weather system. State machine cycles sunny/cloudy/rain with 15-35s durations. Cloud overlay with smooth alpha transitions. Rain: animated raindrop particles, 3x flower regrowth speed, darker ground. Cloudy: 1.5x regrowth. Weather icon in top-right corner. Gentle atmospheric effect without disrupting gameplay.

## issues
- None yet

## todos
- Predators (wasps/spiders) that chase the bee
- Hive customization/decoration
- Sound effects

## notes
- No database — pure frontend
- Helper bees have autonomous AI: find nearest flower, collect, return to hive
- Hive levels: 1-7, each level increases flower count and bee capacity
- Max pollen per trip: 5 + hiveLevel * 2
