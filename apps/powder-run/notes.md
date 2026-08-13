# powder-run (Powder Run — HD2D endless snowboarder)

## log
- 2026-08-13: v1 per chat ("HD2D endless snowboarder with arrow steering, space jumps, escalating speed, climate shifts, day-night cycles"). Single file, Pixelify Sans + Silkscreen.
  - **HD-2D look**: pre-rendered pixel sprites (boarder ×3 leans + air pose, pine, rock, ice patch, snowman) drawn nearest-neighbor onto a perspective slope (pow(u,1.9) projection), depth-fog alpha on distant obstacles, parallax ridge line, carve trails, powder spray, overlay-composite time-of-day color grade + vignette — the pixel-sprites-in-a-lit-scene recipe.
  - **Controls**: ←→ carve (lerped lean picks the sprite; agility drops ~55% mid-air), SPACE jumps ANYTHING if timed (vy 9.2 / g 22, shadow shrinks with height), R restart, M mute; coarse-pointer touch buttons (◀ ▶ JUMP).
  - **Escalating speed**: 14 → 46 m/s by distance (0.0042/m), obstacle spacing tightens in parallel; wind audio gain follows speed.
  - **Climates**: 4 zones × 650m looping (alpine meadow / pine forest / glacier field / blizzard ridge) — each with sky+snow palette, obstacle mix (ice patches skid you instead of crashing), flake density; blizzard adds sideways wind + heavy flakes.
  - **Day-night**: 90s cycle — sun arcs and sets, dusk warm grade, night brings moon, hash-placed stars, and a 3-band sine aurora; all palettes lerp toward night variants (hexMix).
  - **Crash & score**: grounded collision → tumble flash → overlay with distance + best (localStorage). Ice never crashes, it skids.
  - Verified 15/15: speed escalates across 60s, distance grows, zone progression (alpine→forest→blizzard at correct distances), day/night math (0.3→0, 0.8→1, dusk fractional), steer both ways via real key path, jump arc (airborne→rises→lands), jump CLEARS a tree dead ahead, grounded rock = crash, R-key restart resets, best persisted, day-alpine vs night-blizzard render pixels differ, touch buttons present. Dusk screenshot reviewed.
  - **PROBE LESSON (fun one)**: the first run failed 7 checks because the game crashed into a tree during a blind 60-second speed test — the game being a game. Mechanics probes need an obstacle-free window (suspend spawning), then re-arm spawns for collision checks. Also: overlay button handlers bound inside crash()'s 700ms setTimeout aren't there yet under manual stepping — test the R-key path, it's synchronous.

## issues
- Collision box is a single lateral band (|dx|<0.52, z 0.2–1.6) — generous to the player by design; pixel-perfect would feel unfair at 160 km/h.
- Blizzard at night is HARD to read (intended drama); if chat reports invisible rocks, bump night grade floor.

## todos
- Style points for near-misses + airtime, combo meter.
- Yeti cameo at 5000m (chat will ask, guaranteed).
- Ghost line of your best run.
