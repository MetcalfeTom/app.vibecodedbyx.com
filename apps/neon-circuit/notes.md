# NEON CIRCUIT — a kind retro racer

## log
- 2026-08-20: v1.0 — built per chat (request arrived twice; one build answers both): simple controls, lap timing, obstacles, kind restart feedback. SEEDED CIRCUIT: courseX = two seeded sines (pure, probed bounded 100-500), ~20+ cones per lap seeded ≥150 apart and always on-road (both probed); layout repeats per lap so it's learnable; "new circuit" reseeds. SIMPLE CONTROLS: auto-throttle, ←/→ steer, ↓ brake, R restart; coarse-pointer touch row. LAP TIMING: 3 laps of 6000u, live lap clock, last/best readouts, best persisted (neon-circuit-v1); crossing announces kindly ("a new personal best. the neon approves." / "best stays Xs — still yours to beat"), hud() called immediately on crossing (the AQUASAVER lesson: aria-live must not wait a frame). KIND EVERYTHING: cones spin you 1.1s at 30% speed with 2.2s invulnerability ("the road holds no grudge. momentum rebuilds."), off-road is gravel-slow but never a crash, finish says every spin-out is already forgiven, restart declares previous laps "practice, officially". Optional synth engine (sawtooth pitched by speed) + lap chime + spin thunk behind one toggle. Rendering: row-marched curving road with pink neon edges (shadowBlur killed under reduced-motion), gold cone triangles, cyan car with steer tilt + spin rotation, lap line, side grid. TESTABILITY: __NC.freeze() stops the rAF loop's physics so probes drive step() deterministically — added after the first probe run double-stepped; also the probe's original "drives-itself" test was WRONG (unsteered car honestly gravels out on a curving road — fixed to steer perfectly). Probe 12/12.

## issues
- games with rAF physics need a freeze seam for deterministic probing — added here after interference; consider from the start next time.

## todos
- ghost of best lap (replay line), 2-player split keys, weather variants, if chat asks.
