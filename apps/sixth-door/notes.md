# sixth-door · notes

## log
- 2026-07-11: v1 (chat ask: browser 3D FPS, six colour-changing doors, find the right one in 90s, procedural street with houses). **Three.js r128** (cdnjs). **Puzzle design**: HUD target-colour swatch (random hue/game); 6 doors each shift hue continuously, but ONLY the correct door sweeps the full wheel (so it passes through the target); the 5 decoys oscillate inside a hue band centred `target+0.35..0.65` width 0.14 → **provably never reach the 0.055 win threshold** (node: 0/2000 false wins, min separation ~0.21). Press E at a door → `circDist(door.hue,target)<0.055` = win; else warmer/cooler-ish feedback. 90s timer, tries counter. **Scene**: fog + gradient-shader sky dome, asphalt road corridor (player clamped to |x|<ROAD_HALF, z in street) + sidewalks + centre dashes, procedural houses both sides (random size/roof-cone/dim windows), 6 door-houses picked from the house grid (slots 1/3/5 left, 2/4/6 right = 3 per side, well spaced), each door = dark frame + emissive colour-cycling panel + PointLight glow + knob. **Controls**: pointer-lock mouse look (click to capture), WASD/arrows, E/click/Space to read; touch = left joystick + drag-to-look + E button. Web Audio beeps, M mute. Big Shoulders Display + Share Tech Mono, dusk teal/amber. Pollinations OG (flux seed 5090). **Can't headless-test WebGL** (no GL in sandbox) — verified: JS syntax, and the two things most likely to be wrong which I checked in node: (1) **door-count bug FOUND & FIXED pre-ship** — original `zs` z-positions didn't align with the house grid so only 1 door spawned; now picks door-houses by grid index → 6 confirmed; (2) decoy fairness. Hook `__sixth {state,doors,read,tp,circDist}`.

## issues
- Correct door's target-window is ~1–1.8s per pass (~6–10 passes in 90s) — playable but tight; widen threshold or slow the correct-door speed if chat finds it too hard.
- No house collision beyond the road-corridor clamp (houses are outside the walkable strip by construction) — fine unless the street layout changes.
- WebGL untested live — if it renders black/errors, check three.js r128 API (BackSide sky shader, ConeGeometry) in the browser console.

## todos
- Footstep audio + subtle head-bob.
- Difficulty: fewer passes / tighter threshold / more decoys.
- "Colour-blind" assist: show each door's current hue as a number on approach.
