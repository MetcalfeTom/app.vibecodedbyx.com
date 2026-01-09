# Neon Dream Visualizer

## log
- 2026-01-09: Initial creation
  - 8-bit pixel art cloud patterns
  - Mouse movement spawns clouds
  - Multiple neon colors
  - Floating animation with rotation
  - Particle trails
  - Background stars

## features
- 7 different 8-bit cloud patterns
- 12 neon color variations
- Clouds spawn from mouse movement
- Faster movement = more clouds
- Click to spawn cloud burst
- Clouds float upward and fade
- Pulsing glow animation
- Slight rotation drift
- Particle trail follows cursor
- Twinkling star background
- Auto-spawn ambient clouds
- Cloud and pixel counter

## cloud patterns
- Small fluffy (4 rows)
- Medium puffy (6 rows)
- Large cumulus (7 rows)
- Wispy (3 rows)
- Chunky (4 rows)
- Tiny (3 rows)
- Long horizontal (4 rows)

## colors
- Magenta, Cyan, Hot Pink, Lime
- Spring Green, Purple, Orange, Azure
- Rose, Chartreuse, Mint, Vermillion

## physics
- Clouds inherit mouse velocity
- Upward float drift
- Velocity drag (0.995)
- Slow rotation
- Fade out over time

## design
- Dark purple-black background (#0a0a18)
- Press Start 2P font (8-bit style)
- Heavy neon glow (shadowBlur)
- Trail fade effect on canvas
- Crosshair cursor
- Stats display (cloud/pixel count)

## controls
- Move mouse to spawn clouds
- Click to spawn burst of 5 clouds
- Touch supported

## todos
- Add color theme selector
- Add cloud size slider
- Add gravity control
- Add screenshot button
- Add audio reactive mode
