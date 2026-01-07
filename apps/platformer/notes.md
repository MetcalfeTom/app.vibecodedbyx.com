# Simple Platformer

## log
- 2026-01-07: Added poetic pirate-themed intro screen with twinkling stars
- 2026-01-07: Added treasure chests with gold particle effects and scoring
- 2026-01-06: Initial creation - simple 2D platformer with random obstacles

## features
- Pre-generated flat world (4000px wide)
- Random circular obstacles (red)
- Random square obstacles (orange)
- Floating purple platforms
- **Treasure chests** - shiny gold, jump on to collect (+100 points)
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

## multiplayer presence
- Live player counter using Supabase
- Anonymous auth for each visitor
- Heartbeat every 10 seconds
- Counts players active in last 30 seconds
- Polls count every 5 seconds
- Cleanup on page unload
- Table: platformer_presence

## technical
- Canvas 2D rendering
- AABB collision for squares
- Circle-rectangle collision for circles
- Smooth camera lerping
- Pre-generated world on load
- 60fps game loop
- Supabase for presence tracking

## todos
- Add collectibles
- Add enemies
- Add level progression
- Add death/respawn
- Add sound effects
