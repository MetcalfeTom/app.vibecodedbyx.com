# Hillbomb

Tatum's idea (2026-09-26): "a game like subway surfers, except you are running down a hill and need to preserve momentum to parkour". Three.js r128 from cdnjs, single index.html.

## log
- 2026-09-26 v1: 3-lane San Francisco street, steep blocks alternating with flat crossings (crests launch you). Jump height scales with speed. Obstacles: sawhorse (jump), striped board (slide under), parked car (dodge, or vault at ~56+ km/h and land on the roof). Late jumps/slides give bigger boosts ("clean hop", "kong vault!"), streaks multiply them. Hits = stumble + big speed loss. Runaway cable car chases (speed 9 → 36 m/s over time, never more than 90 m back); camera rises and pulls back when it's close. Game over card with stats, best distance/top speed in localStorage (`hillbomb:`). Pause button, Esc/P, auto-pause on tab hide.
- Wall-run (Tatum's idea): while airborne in an outside lane, steer into the houses → run along the wall ~1 s; jump or steer away = wall kick boost; ends at crossings. One wall-run per landing (a bot chaining them hit 600 km/h). Extra drag above 44 m/s.

- v1.1: sound (wind that opens with speed, footsteps, cable car bell that rings faster as it closes in, whoosh on clean moves, thud on stumbles, crash) with a mute button (`hillbomb:mute`). Slide is now a baseball slide (it sank into the street — Tatum). Camera higher and looking further ahead (Pushed: too low to read the street); when the car closes in, the camera rises and pulls back over its roof.

- v1.2: game-over and pause cards sit on a dark panel (unreadable over bright houses), HUD hidden behind them; cable car starts gentler (7 m/s + 0.095/s) so one early car bonk isn't instantly fatal.

- v1.3: easter egg — now and then (after 120 m, ~1 in 30 s) a paper cup tumbles down the sidewalk ahead of you, bouncing higher off the crossings (from a story on stream about a cup that got away on a steep street). Visual only.

- v1.4 (Tatum: jumps should depend on momentum): jump impulse 4.6 + 0.2·v (was 5 + 0.16·v) so a fast jump is visibly higher and much longer; above 24 m/s (~86 km/h) the jump is a front flip over the expected air time; bonking a car mid-jump pops 'too slow to vault · 55+ km/h' (vault needs peak ≥ 1.15 m → v ≥ ~15.5 m/s).

- v1.5 (Tatum: jump size wasn't intuitive): a ring on the street in your lane shows where a jump right now would land (simulated over the real terrain each frame, so crests stretch it); it turns gold once you're fast enough to vault a parked car. Hidden in the air, on walls, sliding and stumbling.

## balance (fast-forward bots, `__hb.sim(dt)`)
- idle bot caught at ~83 s / 1 km; careful bot ~3.5 min / 4.7 km, top ~146 km/h; wall-spam bot 2–3 min.

## issues
- Camera vs cable car: the car is 3.1 m tall on uphill ground, so a close car put the camera inside its roof. The loom offsets (up 4.8, back 5.4 at full) keep the runner in sight over it.
- Headless swiftshader runs ~3 fps, so test with `__hb.sim()` fast-forward, not real time.

## todos
- curved streets where you bank onto the walls (Tatum)
