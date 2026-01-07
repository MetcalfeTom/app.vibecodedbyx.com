# Simple Platformer

## log
- 2026-01-06: Initial creation - simple 2D platformer with random obstacles

## features
- Pre-generated flat world (4000px wide)
- Random circular obstacles (red)
- Random square obstacles (orange)
- Floating purple platforms
- Player with cute face and eyes that follow movement
- Smooth camera following
- Gravity and collision physics
- Touch controls for mobile

## controls
- **A / Left Arrow**: Move left
- **D / Right Arrow**: Move right
- **W / Up / Space**: Jump
- **Touch**: Swipe to move, tap to jump

## obstacles
- Red circles: Various sizes, bouncy collision
- Orange squares: Various sizes, solid collision
- Purple platforms: Floating, can jump on top

## design
- Dark purple gradient sky with stars
- Teal player character with googly eyes
- Colored obstacles with subtle glow
- Ground with grid pattern
- World boundary indicators

## technical
- Canvas 2D rendering
- AABB collision for squares
- Circle-rectangle collision for circles
- Smooth camera lerping
- Pre-generated world on load
- 60fps game loop

## todos
- Add collectibles
- Add enemies
- Add level progression
- Add death/respawn
- Add sound effects
