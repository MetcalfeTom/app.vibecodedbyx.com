# Shroom Glen

## log
- 2026-08-01 v1: chat asked for "low-poly 3D forest game with a cat that follows the mouse, glowing shrooms to collect, crows to dodge — Three.js, no frameworks". Three.js r128 (cdnjs, same as lumen-vale), single file, no frameworks. **Architecture (deliberate, for testability)**: pure logic layer `L` + `tickLogic(dt)` (cat seek/arrive + heading slerp, world-radius clamp at 54, 8-shroom population invariant, crow spawn/steer with 0.4 lead toward the cat's target, hit detection with 2s invuln, 9 lives → gameover) emitting an event queue consumed by the render/audio layer — so the whole game logic is stub-testable without WebGL. **Scene**: fog-matched twilight (#1d1430), displaced flat-shaded ground disc, ~80 low-poly trees (5-sided trunks, stacked 6-sided cones, 3 leaf tints), 160 drifting fireflies (Points), directional moon + warm center light. **Cat**: orange box-cat with cream chest, green emissive eyes, cone ears, 4-segment nested-group tail that sways, trot leg-swing when moving, blink-flicker during invulnerability. **Shrooms**: emissive teal caps + pulsing transparent halo, chime + cyan particle burst on collect. **Crows**: black cone body, flapping box wings, red eye, caw telegraph on spawn (audio), bob in flight, despawn past world+30 or 14s. **Camera** soft-follows the cat; mouse→ground via manual ray-plane intersection (no Raycaster); touchmove = mouse. Difficulty: crow interval 5.5s→2.0s, speed 13→24. Wind-noise ambience (audio unlocks on start button), best score in localStorage, WebGL-missing fallback message with disabled start. Grandstander + Reddit Mono HUD. 14/14 checks green: fallback path, FULL buildScene live-fire via Proxy-THREE (R3.ok flag — per repo lesson), seek/clamp, collection invariant, caw/hit/invuln/gameover events, restart, entity render sync.

## issues
- WebGL can't run in the sandbox — buildScene is live-fired against a Proxy-THREE stub and asserted via R3.ok, but real visual confirmation must come from chat. If someone reports a black screen, suspect the r128 CDN or a mesh-sync error first (frame() is the only untested-in-browser hot path).
- Crow meshes are keyed by array index — fine because crows array is filter-rebuilt each tick and meshes fully resync each frame; don't "optimize" that into stable ids without also changing the filter.

## todos
- Pounce (click = dash) if chat wants more agency.
- Shroom varieties (rare gold = +5, wilting = timed).
- Night/day drift; owl ally that intercepts one crow.
