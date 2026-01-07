# Stormy Seas Dash

## log
- 2026-01-07: Pirate theme applied - gold/teal colors, Pirata One font, sea-themed UI
- 2026-01-06: Initial creation - Geometry Dash clone with neon aesthetics for Jackson

## features
- Jumping square player with rotation
- Spike obstacles (single, double, triple)
- Block obstacles
- Auto-scrolling ground
- Pirate gold/teal color scheme
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
- Dark stormy sea gradient background
- Scrolling teal wave-like grid lines
- Golden glow on ground (shore effect)
- Wooden plank tiles for ground
- Pirata One font for titles, Orbitron for UI
- Pirate themed UI text (SET SAIL, YE SANK!, SAIL AGAIN)
- Particle burst on jump (teal)
- Particle explosion on death (red)

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
