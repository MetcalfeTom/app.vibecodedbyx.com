# Vector Rift — notes

## log
- 2026-09-24 v1.0: 3D space racer per chat (xyzfela: "create some super cool 3d game" → poll → "A sounds cool" = space racer). three.js r128. Endless seeded rift (sinusoid centre path), orange ring gates (combo ×1–8, +boost), drifting asteroids (3 shields, 1.3 s invuln), soft rift walls that bleed speed, boost meter, speed ramps with distance. Attract-mode autopilot on the title screen. WASD/arrows, drag to steer, Space/Shift boost, touch BOOST button, P pause, M mute. Local best score. 70s space-poster palette (teal-black + sodium orange, banded gas giant with rings), Syncopate + Azeret Mono.
- Tests: pure `<script id="engine">` block, node suite 13/13 (determinism, gates inside rift, gate mouths clear of rocks, autopilot clears gates, idle flier dies, walls, boost, dt clamp, shields/death, invuln, bounded entities). Browser probe 28/28 at 1200/390/320.

## issues
- Headless: the rAF loop starves timers under dump-dom — freeze in the tail synchronously (`__VR.freeze(true)`) and run the suite inside the load handler, no setTimeout. Stepping 900 frames with a render each is too slow in swiftshader — step the engine directly, draw once.
- 320 px: boost bar + tool buttons overlapped; narrow media query shrinks both.

## todos
- Online leaderboard, ship skins, power-ups (magnet, shield recharge), rift biomes.
