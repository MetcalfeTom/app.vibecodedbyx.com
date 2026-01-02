# Neon Flap

## log
- 2026-01-02: Initial creation - neon Flappy Bird clone

## features
- Classic flappy bird mechanics
- Tap/click/space to flap
- Neon glowing pipes (magenta)
- Glowing bird (cyan/teal)
- Score counter
- High score saved to localStorage
- Game over screen with retry
- New high score celebration
- Animated wing flapping
- Starfield background
- Subtle grid overlay

## design
- Dark background with gradient
- Cyan bird with glow effect
- Magenta pipes with edge highlights
- Orbitron font throughout
- Responsive 9:16 aspect ratio
- Twinkling star particles

## technical
- Canvas-based rendering
- requestAnimationFrame game loop
- localStorage for high score persistence
- Touch and keyboard input
- Collision detection with gap

## game constants
- Gravity: 0.4
- Flap power: -7
- Pipe speed: 3
- Pipe gap: 150px
- Pipe width: 60px
- Spawn rate: every 100 frames

## controls
- Space bar: flap (also starts/restarts)
- Click/tap canvas: flap

## issues
- None yet

## todos
- Add sound effects
- Add difficulty progression
- Add different bird skins
- Add online leaderboard (Supabase)
- Add parallax background layers
- Add particle trail on bird
