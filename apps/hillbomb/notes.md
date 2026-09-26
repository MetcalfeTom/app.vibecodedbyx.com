# Hillbomb

Tatum's idea (2026-09-26): "a game like subway surfers, except you are running down a hill and need to preserve momentum to parkour". Three.js r128 from cdnjs, single index.html.

## log
- 2026-09-26 v1: 3-lane San Francisco street, steep blocks alternating with flat crossings (crests launch you). Jump height scales with speed. Obstacles: sawhorse (jump), striped board (slide under), parked car (dodge, or vault at ~56+ km/h and land on the roof). Late jumps/slides give bigger boosts ("clean hop", "kong vault!"), streaks multiply them. Hits = stumble + big speed loss. Runaway cable car chases (speed 9 → 36 m/s over time, never more than 90 m back); camera rises and pulls back when it's close. Game over card with stats, best distance/top speed in localStorage (`hillbomb:`). Pause button, Esc/P, auto-pause on tab hide.
- Wall-run (Tatum's idea): while airborne in an outside lane, steer into the houses → run along the wall ~1 s; jump or steer away = wall kick boost; ends at crossings. One wall-run per landing (a bot chaining them hit 600 km/h). Extra drag above 44 m/s.

## balance (fast-forward bots, `__hb.sim(dt)`)
- idle bot caught at ~83 s / 1 km; careful bot ~3.5 min / 4.7 km, top ~146 km/h; wall-spam bot 2–3 min.

## issues
- Headless swiftshader runs ~3 fps, so test with `__hb.sim()` fast-forward, not real time.

## todos
- sound (footsteps, wind, bell by gap, whoosh, thud, crash)
- curved streets where you bank onto the walls (Tatum)
