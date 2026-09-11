# Reefblade — notes

## log
- v1.0 (2026-09-11): The queued scuba diver game, built once Genetic Life shipped (chat's stated condition), then confirmed by two follow-up relays ("keep scope tight", "resume cleanly after the server error" — nothing was lost server-side, same build). Scope kept tight: one procedural dive, one objective.
- Spec honored literally: vanilla JS only; **zero external assets** — no font links (ui-monospace stack), data-URI SVG favicon, all art procedural canvas (og:image is a pollinations URL but that's only fetched by social scrapers, never by the page); "3D-style" = depth-graded water column, parallax background rock band (z 0.35–0.6), radial-shaded rocks, god rays that fade with depth, deep-water vignette that grows with camera depth.
- Game: 960×2200 world, surface strip refills AIR (90s tank, drains 1/s down, slash costs 0.6); 8 pearls placed progressively deeper; hazards = 11 drifting jellies (1 slash), 9 urchins (contact + knockback, unkillable), 4 crevice eels (lunge when aligned, 2 slashes), 5 O2 bubble vents (+5s per bubble). Slash = 86px arc sector ±60°, 0.42s cooldown. 3 hull hearts + 1.2s i-frames. Win = 8/8 pearls then touch the boat (best time in localStorage); lose = air 0 or hull 0. Keyboard WASD/arrows + space + R; touch joystick + slash button under (pointer:coarse). Tiny WebAudio synth (whoosh/blips/low-air pips), unlocked by the DIVE button, mutable.
- Freeze seam `__R` from day one (freeze/step/render/setNoRender/makeWorld/S setter) — probes own the clock.
- **PROBE LESSON (+)**: a game probe must own its WORLD, not just its clock — the first run used the live random world and a blind 240-step descent swam through different hazards at each width (random deaths made failures look width-dependent). Fix: probe swaps in `makeWorld(fixedSeed)` and parks every hazard off-field, then stages each encounter explicitly. Also: an "air refills" assert must set o2 low first or the 90 cap eats the delta.
- The mid-write foreign-glyph corruption struck AGAIN (6th: `#0d3床048` in CSS) — caught by the standing regex sweep before any probe ran.
- Verified: probe 27/27 at 1200/390/320 (world gen counts, pearls deepen, canvas ink, swim + camera, drain/refill rates, slash kill + cooldown, sting + i-frames, urchin knockback, eel lunge + 2-slash kill, vent bubbles restore air, pearl collect, win at boat, both lose paths, R restart, touch controls present, mute, no overflow); screenshots at both widths.

## issues
- Reproducibility: each dive is a fresh random seed by design (replayability); the probe uses a fixed seed via the seam.
- The diver sprite is deliberately small (~30px) for the wide-reef feel — if chat asks for "bigger character", scale the draw block + collision radii together.

## todos
- Sharks for a deeper second reef band; treasure-chest bonus objective; per-dive seed display for sharing runs.
