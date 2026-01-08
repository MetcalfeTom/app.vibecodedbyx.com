# Alpha-Blast

## log
- 2026-01-03: Initial creation - neon typing game with falling letters

## features
- Letters fall from top of screen
- Type letters to destroy them
- Combo system for chain hits
- 3 lives system
- Increasing difficulty over time
- High score saved to localStorage
- Particle explosions on hit
- Screen shake on miss
- Combo display animation
- Danger zone indicator
- Grid background overlay

## design
- Dark cyberpunk theme
- Orbitron font
- Neon colored letters (cyan, magenta, yellow, etc.)
- Glowing text effects
- Gradient overlays
- Animated combo pop-up

## gameplay
- Type matching letter to destroy it
- Wrong key breaks combo
- Letters hitting bottom = lose life
- 3 lives total
- Spawn rate increases over time
- Fall speed increases over time
- Combo multiplier for scoring

## technical
- Canvas-based letter rendering
- DOM-based particle explosions
- RequestAnimationFrame loop
- Mobile virtual keyboard support
- Letter wobble animation

## controls
- A-Z keys: Type letters
- Mobile: Tap screen to open keyboard

## scoring
- Base: 10 points per letter
- Multiplied by combo (x1, x2, x3...)
- Higher combos = more points

## issues
- None yet

## todos
- Add power-ups (slow-mo, clear screen)
- Add special letters (bonus points)
- Add difficulty levels
- Add sound effects
- Add leaderboard
