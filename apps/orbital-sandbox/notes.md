# Orbit Bench — a pocket n-body sandbox

## log
- 2026-08-20: v1.0 — built per chat: gravity controls, trails, collisions, labels, time scale, reset. HONEST N-BODY physics: semi-implicit Euler, softening EPS²=100, every body attracts every body; starter system built BY CONSTRUCTION with circular-orbit velocities v=√(GM/r) (star Hearth-77, planets Bramble-12 @r120 + Ondine-40 @r230, moon Pebble-31 around Ondine, comet Whistler-58 inbound) — probe holds the circular orbit to <6% radius drift over 600 steps. DRAG=VELOCITY launching (type picker star/planet/moon/comet, keys 1-4, 40-body cap), seeded whimsical names. GRAVITY DIAL 0.2-5× (probe: doubling G doubles single-step Δv within ±10%), TIME DIAL 0-4× (substep accumulator). TRAILS (toggle, 90-point cap, cleared on off), LABELS toggle, COLLISIONS toggle — merges conserve mass + momentum exactly (probed to 1e-6), radius by r³ addition, "X swallowed Y. it is not sorry."; off = ghosts. Escapes beyond r2200 culled kindly ("left the system. it did not look back."). RESET restores the starter family exactly (name-list + position probed; aria-label promises "Always works"), clear empties space. Probe trick: pause first so only probe-driven step(n) runs — deterministic physics assertions with zero rAF interference. 14/14 first run.

## issues
- physics assertions REQUIRE pausing the render loop first (paused-for-science check) or rAF steps pollute counts.

## todos
- barycenter camera follow, Lagrange-point ghost markers, orbit-path prediction preview, if chat asks.
