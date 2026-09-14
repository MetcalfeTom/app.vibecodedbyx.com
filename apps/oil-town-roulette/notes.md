# Oil Town Disaster Roulette — notes

## log
- v1.0 (2026-09-14): Built per chat ("playable standalone app with falling-cow avalanche rescue"). One catch-and-bounce engine, four disasters on a weighted roulette wheel (COW AVALANCHE 34 / GUSHER 27 / TWISTER 27 / GOLDEN STAMPEDE 12 — weights suite-verified): avalanche cows tumble in off the hill, gusher cows launch straight up from erupting ground (with screen quake), twister cows get flung in arcs from a wandering funnel, golden rounds rain all-golden cows worth 5. Catch a falling cow on the hay wagon → it BOUNCES to the safe pen on a solved ballistic arc; miss = muddy (alive, judgmental — no-harm promise on the page); oil pits swallow. 12 cows/round, 3 rounds/shift, best shift in localStorage. Wheel is a canvas spinner with cubic easing landing on the drawn slice.
- ENGINE LESSON (+, any bounce/throw-to-target mechanic): fixed launch velocities CANNOT serve variable distances — the first penBounce overshot from near catches (flew off-world → "muddy") and would fall short from far; SOLVE the arc instead (pick T from distance, vx = dx/T, vy = −g·T/2) and suite it from near AND far spawn points.
- PROBE LESSONS (again): pin RANDOM TERRAIN before outcome tests (a muddy-drop point randomly landed inside a seeded pit at some widths) and run canvas-ink checks WHILE the round is live (render with S=null draws only the sky).
- Verified: engine 20/20 node (wheel weights + angles, per-disaster spawn envelopes, gravity, catch window incl. rejects, bounce-lands-at-pen from 3 distances, ground outcomes, scoring, pits never under the pen ×20 seeds); browser 14/14 ×3 widths (spin→round, staged rescue→pen save, pit loss, muddy miss, golden save, wagon momentum + clamp, round→wheel loop + shift log, live ink, a11y/touch/overflow); mid-avalanche screenshot.

## issues
- Terrain is random per round by design; probes must pin S.pits (and spawnT/spawned) before staging outcomes.

## todos
- Sound toggle button (moo synth exists, always-on after first spin); town-mood meter; a 5th wheel slice if chat invents a disaster.
