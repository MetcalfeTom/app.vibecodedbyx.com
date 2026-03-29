# Neon Asteroids

Blast neon asteroids with retro vector graphics and screen-shaking explosions.

## log
- 2026-03-29: V2 — IMPOSSIBLE MODE. Dramatically escalating difficulty: asteroid count grows faster (3+level+level*0.5), speed scales harder (0.3/level), homing asteroids from wave 4 (steer toward player), tri-split asteroids from wave 6 (split into 3 instead of 2). Screen flash on big kills and deaths, background hue shifts with chaos level, multi-colored neon asteroids, homing asteroids pulse with inner glow. Escalating screen shake, more particles per explosion at higher waves. Visual chaos ramps 0-100% over 8 waves.
- 2026-03-14: V1 — Classic asteroids with neon vector wireframe aesthetic. Jagged asteroids with random vertices, 3 sizes (large=50px, medium=28px, small=14px). Asteroids split into 2 smaller on destroy. Scoring: large=20, medium=50, small=100. Screen shake on hits (scales with asteroid size). Line+dot particle explosions with random neon colors. Wave system (3+level asteroids per wave, speed scales). 3 lives with invincibility flicker on respawn. Thrust flame with orange particles. Wrap-around edges. Web Audio sounds. Mobile touch buttons. Press Start 2P + Share Tech Mono typography, cyan/teal/pink neon palette with motion trails.

## issues
- None yet

## todos
- High score in localStorage
- UFO enemy that flies across screen
- Shield power-up
- Hyperspace teleport (random position)

## notes
- No database — pure frontend
- Ship speed capped at 8, friction 0.995
- Fire cooldown: 8 frames, bullet life: 55 frames
- Asteroid speed: (1.2 + level*0.15) * (4 - size) * 0.5
- Invincibility: 120 frames on respawn
- Canvas uses 0.25 alpha clear for motion trails
