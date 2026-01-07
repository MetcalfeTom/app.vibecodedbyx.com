# Neon Dash

## log
- 2026-01-06: Initial creation - Geometry Dash clone with neon aesthetics for Jackson

## features
- Jumping square player with rotation
- Spike obstacles (single, double, triple)
- Block obstacles
- Auto-scrolling ground
- Neon cyan/pink/yellow color scheme
- Glowing effects on everything
- Particle effects on jump and death
- Score tracking
- Best score saved to localStorage
- Pulsing background grid
- Touch and keyboard controls

## controls
- **Click/Tap**: Jump
- **Space/Up/W**: Jump
- One jump while on ground only

## obstacles
- Spike: Pink triangle, instant death
- Double spike: Two spikes in a row
- Triple spike: Three spikes
- Block: Yellow square obstacle

## design
- Dark purple/blue gradient background
- Scrolling cyan grid lines
- Neon glow on player, obstacles, ground
- Orbitron font for UI
- Particle burst on jump (cyan)
- Particle explosion on death (pink/red)

## technical
- Canvas 2D rendering
- Simple box collision with reduced hitbox
- Gravity-based physics
- Score increases with distance
- Gap between obstacles decreases with score
- 60fps game loop

## todos
- Add music sync/beat detection
- Add more obstacle types (platforms, portals)
- Add multiple game modes
- Add ship/UFO mode
- Add level editor
