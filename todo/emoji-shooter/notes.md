# Emoji Space Shooter

## log
- 2026-01-06: Initial creation - glowing emoji space shooter with angry faces

## features
- Player rocket ship (🚀) with glowing effects
- Multiple enemy types: 😠 😡 🤬 👿 💀
- Increasing difficulty based on score
- 3 lives system
- Particle explosions on hit
- Glowing neon aesthetic
- Touch controls for mobile
- Scrolling starfield background

## controls
- Arrow keys or WASD to move
- Space to shoot
- Touch and drag on mobile

## enemy types
1. 😠 (10 pts) - Basic angry, slow
2. 😡 (15 pts) - Very angry, faster
3. 🤬 (25 pts) - Swearing mad, large
4. 👿 (30 pts) - Evil, purple glow
5. 💀 (50 pts) - Death, fastest

## design
- Dark space background with motion trails
- Radial gradient glows around all entities
- Cyan player glow, red/purple enemy glows
- Orbitron font for sci-fi feel
- Particle system for explosions

## technical
- Canvas 2D rendering
- requestAnimationFrame game loop
- Trail effect via semi-transparent clear
- Difficulty scales with score/100

## todos
- Add sound effects
- Add power-ups (shield, multi-shot)
- Add boss enemies
- Add high score leaderboard
