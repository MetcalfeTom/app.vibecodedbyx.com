# Neon Zen

## log
- 2025-12-29: Converted to reflex tapping game
  - Tap glowing orbs before they fade
  - Level-based progression (level up every 10 hits)
  - Difficulty increases: faster fade, more spawns
  - Steam clouds start at level 3 to obscure view
  - Combo system for consecutive hits
  - 3 lives - lose one when orb fades
  - Score based on remaining time + combo multiplier
  - Ring indicator shows time remaining
  - Particle burst on hit
  - Sound effects: hit, miss, level up
  - Game over screen with final score

- 2025-12-29: Initial creation (spa version - replaced)
  - Was a relaxation app with robotic hand

## issues
- None so far

## todos
- Could add high score persistence
- Could add different game modes
- Could add power-ups
- Could add leaderboard

## notes
### Difficulty scaling:
- Level 1: 3 second orb lifespan, 1.5-2s spawn rate
- Each level: -8 frames lifespan (min 60 frames = 1s)
- Each level: -100ms spawn delay (min 400ms)
- Steam clouds start level 3, increase density

### Scoring:
- Base: 10 points per hit
- Life bonus: up to 50 points for fast hits
- Combo multiplier: up to x10
- Formula: (10 + lifeBonus) * min(combo, 10)

### Lives system:
- Start with 3 lives
- Lose 1 life when orb fades (not tapped)
- Miss resets combo to 0
- Game over at 0 lives
