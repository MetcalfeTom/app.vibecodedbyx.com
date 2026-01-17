# Bug Zap

## log
- 2026-01-17: Initial creation
  - Neon arcade shooter game
  - Player: coffee cup ship with steam animation
  - Weapon: semicolon projectiles (;)
  - Enemies: undefined, NaN, null, error, [object]
  - Wave-based progression
  - 3 lives system (☕☕☕)
  - Particle explosions when bugs destroyed
  - Enemy text fragments fly apart on death
  - Health bars for stronger enemies
  - Grid background for retro feel
  - CRT scanlines overlay
  - Mobile touch controls
  - Keyboard: WASD/Arrows + Space

## features
- Coffee cup player with:
  - White cup body with cyan rim
  - Coffee inside (brown)
  - Animated steam particles
  - Handle on right side
  - Semicolon cannon on top
- Enemy types (unlock by wave):
  - undefined (orange, 10pts)
  - NaN (magenta, 15pts)
  - null (cyan, 20pts, 2HP)
  - error (red, 25pts, 2HP)
  - [object] (yellow, 30pts, 3HP)
- Enemies drift and wobble
- Glitch effect on enemies
- Particle system for explosions
- Wave counter with scaling difficulty
- Score multiplied by wave number

## controls
- Desktop: WASD or Arrow keys to move, Space to fire
- Mobile: Left/Right buttons + Fire button

## design
- Press Start 2P + Share Tech Mono fonts
- Neon cyan, magenta, green, yellow palette
- Dark grid background
- Glow effects on all elements
- CRT scanlines overlay

## todos
- Add power-ups (rapid fire, spread shot)
- Add boss enemies every 5 waves
- Add high score leaderboard
- Add sound effects
- Add combo multiplier

## issues
- None yet
