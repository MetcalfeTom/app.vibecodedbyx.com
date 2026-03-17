# Neon Chase

High-speed arcade tunnel racer. Dodge neon obstacles at hyperspeed.

## log
- 2026-03-17: Initial build. Pseudo-3D tunnel with perspective projection, 80 segments with random curves. 5-lane system, lane-switching controls. Obstacle types: block (1 lane) and wide (2 lanes) with random hue. Shield and boost powerups. Combo system for near-misses (up to x10). Speed ramps from 80km/h to 280km/h. Screen shake on hits, explosion particles, red flash on death. Speed lines intensity scales with velocity. Tunnel hue shifts over time. Hi-score in localStorage. Touch: swipe to change lanes. Orbitron + Share Tech Mono typography, dark void with cycling neon tunnel.

## issues
- None yet

## todos
- Add sound effects (engine hum, collision, powerup collect)
- Boss obstacles (moving barriers)
- Multiple tunnel themes/environments
- Supabase leaderboard
- Power-up: time slow

## notes
- No database — localStorage hi-score only
- Canvas fullscreen, pseudo-3D via z-projection (scale=300/depth)
- 5 lanes, discrete lane switching (not continuous)
- Obstacle spawn rate increases with speed
- Near-miss scoring: +20*combo when adjacent lane has obstacle
- Shield absorbs one hit, lasts 8 seconds
- Boost adds +3 speed instantly
- Speed: BASE_SPEED=4 to MAX_SPEED=14, ACCEL=0.008/frame
- Collision: checks z-distance < 2 segments AND same lane
