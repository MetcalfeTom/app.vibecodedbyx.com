# Voxel FPS

First-person neon voxel target practice in a blocky arena.

## log
- 2026-03-14: Initial build. Three.js FPS with pointer lock controls. Blocky arena (76x76) with procedural block textures (nearest-neighbor filtering for pixel look). 17 cover structures/pillars. 16 neon wall strip lights in 5 colors. Voxel targets with HP bars, AI movement (random direction changes, collision avoidance), hover bob. Wave system (4 + wave*2 targets, HP scales with wave). Combo scoring (100 * combo multiplier, 3s timer). Raycast hit detection. Gun model with recoil, muzzle flash, reload animation (R key, 1.5s). Head bob while walking. Sprint (Shift). Block particle explosions on hit. Hit markers. Minimap with player direction, structures, targets. Web Audio gun sounds (sawtooth + noise burst), hit/kill sounds. Silkscreen + Share Tech Mono typography, dark arena with neon glow aesthetic.

## issues
- None yet

## todos
- Different weapon types (shotgun spread, sniper)
- Moving targets that shoot back (health system)
- Leaderboard via Supabase
- Target variety (different shapes, flying targets)

## notes
- No database — pure frontend
- Three.js 0.163.0 via CDN importmap
- Arena: 76x76 units, walls at +/-38
- Player: 1.7 height, 7 walk / 12 sprint speed
- Ammo: 30/30, 0.12s cooldown, 1.5s reload
- Targets: 2 + floor(wave/3) HP, 1 + wave*0.15 speed
- Combo: resets after 3s without kill
- Collision: Box3 AABB for structures and bounds
