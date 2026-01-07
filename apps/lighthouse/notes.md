# Neon Lighthouse

## log
- 2026-01-07: Added fog-destroyed counter and global leaderboard with Supabase
- 2026-01-07: Initial creation - fight back encroaching fog with light beam

## features
- Neon lighthouse in center of dark ocean scene
- Move mouse/touch to aim lighthouse beam
- Fog particles creep in from all sides
- Beam dissolves fog it touches
- Fog drains light power when it reaches lighthouse
- Light power regenerates when fog is kept at bay
- Survival time counter
- Fog-destroyed counter
- Global leaderboard (Supabase)
- Twinkling star background
- Ocean wave animation

## controls
- Mouse movement / Touch drag: Aim beam
- Beam automatically follows cursor

## mechanics
- Fog spawns faster as time progresses
- Beam length tied to light power
- Fog in beam slowly dissolves with particle effects
- Multiple fog particles near lighthouse drain power faster
- Game over when power reaches zero

## design
- Dark oceanic atmosphere
- Cyan/yellow neon color scheme
- Glowing lighthouse with striped tower
- Ethereal fog particles
- Vignette effect for atmosphere
- Light particles when fog dissolves

## technical
- Canvas 2D rendering
- Angle-based beam collision detection
- Particle systems for fog and light effects
- Smooth beam rotation with lerping

## todos
- Add ship rescue bonuses
- Add different fog types
- Add power-ups (wider beam, pulse blast)
- Add weather effects (rain, lightning)
