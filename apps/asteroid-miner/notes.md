# Asteroid Miner

## log
- 2026-04-08: Initial build — retro neon voxel asteroid miner. Top-down 3200×3200 wrapping world, ship with thrust/rotate/shoot, `Asteroid` class with NxN voxel grid (N=14-32) cached to an offscreen canvas that rebuilds only on dirty flag. 6 ore types (ROCK, IRON, COPPER, GOLD, PLASMA, URANIUM) with different HP/point/glow. Bullets punch voxels via `hitAt()` per-frame grid lookup. Additive-blend particles + damage floaters, 3-layer parallax starfield, 140×140 minimap, screen shake, invuln flicker, hull + score HUD + ore inventory chips, game over overlay. Mobile L/R/thrust/fire touch pad. Press Start 2P + VT323, neon cyan/magenta/yellow/green palette, scanline overlay.

## features
- Destructible voxel asteroids (offscreen cache, dirty rebuild)
- 6 ore types with progressive rarity and value
- Ship physics: thrust, drift, max-speed cap, bullet cooldown
- Ship-asteroid collision damages hull with invuln frames
- World wraparound
- 3-layer parallax starfield
- Particles, damage floaters, screen shake
- Minimap + score/hull/speed HUD
- Mobile touch controls
- Game over + restart

## issues
- None yet

## todos
- Enemy drones / turrets
- Refinery / upgrade shop between waves
- Supabase leaderboard
- Sound effects
