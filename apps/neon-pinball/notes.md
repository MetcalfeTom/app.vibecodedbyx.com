# Neon Pinball

## log
- 2026-03-25: V1 — Neon pinball with magnetic beam paddles, gravity-distorting orb. 6 bumpers, 5 lane targets, 2 slingshots, combo scoring up to x5. Distortion grid warps around ball based on gravity well charge. Orb shifts from cyan to purple as gravity builds. Touch controls, keyboard (A/D, arrows, space). Orbitron + Fira Code typography.

## features
- Magnetic beam paddles with field line animations and pull physics
- Gravity well: ball distorts the playfield grid, bumper positions shift toward it
- Orb color shifts cyan -> purple as gravity charge builds
- 6 bumpers (100-150 pts), 5 lane targets (200 pts, bonus for clearing all), 2 slingshots (50 pts)
- Combo multiplier up to x5, decays after 2s
- 3 balls, high score in localStorage
- Screen shake on impacts, particle explosions

## issues
- Physics can occasionally allow ball to clip through paddle at high speed

## todos
- Multiball power-up
- Ramps / orbit lanes
- Sound effects (WebAudio)
- Leaderboard (Supabase)
