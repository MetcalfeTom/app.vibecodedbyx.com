# Neon Dodgeball

## log
- 2026-01-07: Added custom SVG seahorse power-up (grants extra life)
- 2026-01-07: Initial creation - neon arena with bouncing spheres and rhythmic obstacles

## features
- Player controlled by mouse/touch with smooth following
- Bouncing neon light spheres that ricochet off walls
- Custom SVG seahorse power-up (rare spawn, grants +1 life)
- Three rhythmic obstacle types:
  - Horizontal bars (slide side to side)
  - Vertical bars (slide up and down)
  - Spinning arms (rotate around center)
- All obstacles pulse to a 120 BPM beat
- 3 lives with invulnerability frames on hit
- Particle explosions on collision
- Survival time scoring
- Progressive difficulty (faster spawns over time)

## controls
- Mouse movement / Touch drag: Move player
- Player smoothly follows cursor

## design
- Dark synthwave aesthetic
- Cyan player with white core
- Multi-color neon balls and obstacles
- Pulsing grid background synced to beat
- Glow effects on all elements
- Vignette for atmosphere

## technical
- Canvas 2D rendering
- Beat-synced animations (120 BPM)
- Circle-circle collision for balls
- Rectangle-circle collision for bars
- Point-to-line distance for spinners
- Smooth player movement with lerping

## todos
- Add audio with beat sync
- Add power-ups (shield, slow-mo, shrink)
- Add combo scoring for near misses
- Add leaderboard
- Add different arena themes
