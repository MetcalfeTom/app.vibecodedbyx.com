# Moth Pinball — notes

## log
- 2026-08-18 v1.0: standalone neon pinball. PHYSICS: gravity 880 + 4-substep integrator,
  segment walls (closestOnSeg + reflect ×1.85, damp .92), plunger lane with top exit,
  soft speed cap 1200. MEMORY BUMPERS: 4 (LAMP/RAIN/GULL/DUSK), reflect+boost (min 320),
  each persists LIFETIME hits ('mothpin-bumpers') across games and sessions — glow
  radius grows log with memory, payout grows with hits ("old memories pay better"),
  "N remembered" caption; light all four on one ball → MEMORY RECALLED jackpot (+2500,
  banner sentence, lits reset). MOTH FLIPPERS: the drain is guarded by a moth — golden
  body+antennae between the pivots, each flipper drawn as a bezier membrane WING with
  veins; press = wing rises (18 rad/s), angular velocity imparts kick at the contact
  radius. Z/M + touch halves; space/button launch; 3 balls; best persisted; new game
  keeps bumper memory (the point). Turret Road + Chakra Petch synthwave. 14/14 probe
  (launch/gravity/bumper boost+score+persistence/jackpot/wing kick/drain/game-over/
  reset/memory-outlives-games) + screenshot.

## issues
- Probe-placement lesson (geometry flavor): the flip-kick check first placed the ball
  0.1px UNDER the wing segment — push-out sent it below and the rising wing left
  without it. When testing contact mechanics, place the test object unambiguously on
  the correct side of the surface.

## todos
- Slingshots + a spinner if chat wants a fuller table; tilt/nudge.

## 2026-08-18 · launch lane trap fixed (chat report, repro-confirmed)
- **The trap was total**: launch vy was −(860–920) from y=640, giving apexes of 167–195px — but the lane's inner wall tops out at y=120. The ball could NEVER leave the plunger lane; it just rose, fell back, and drained. The original 14-suite missed it because bumper/flipper tests teleported the ball into the table.
- Fix, three parts: (1) launch vy now −(1020–1070) — √(2·880·530)≈966 is the bare minimum to clear, so every launch reaches the top; (2) new **top guide curve** segments [468,120→440,44]→[440,44→380,14] catch the rising ball and roll it left onto the table (also softens re-entry from above); (3) lane-exit flag now also flips when the ball crosses left of the wall, not only above y=110.
- Verified: 3-launch reliability repro (exits true/true/true, apexes 36–38), full mp2 suite 14/14, screenshot of the ball mid-deflection off the guide.
- Lesson (stream-wide): never let a probe teleport past the one path real players must travel — launch reliability needed its own no-teleport trial.

## 2026-08-18 · one-way gate seals the top-right pocket (chat request: real trajectories)
- Remaining trap after the launch fix: the lane mouth (x=426 wall line, y 37–120, under the top guide) was open from the table side — a ball in play crossing it fell down the plunger shaft and silently drained.
- Fix: **one-way gate** — the wall push at `!G.inLane` now seals [426,37→426,120]; the exit flag flips only on crossing the wall line leftward (dropped the y<110 clause so the gate never closes on a launching ball mid-corridor). Visible as a cyan dashed gate wire + hinge dot whenever the ball is in play.
- Real-trajectory suite (gate-probe, 6/6): A) 6 no-teleport launches all exit; B) 25 s of live play with seeded pseudo-random flipper flapping — ball never re-enters the shaft; C) 4 realistic mouth attacks from the table side all repelled; D) nothing wedges in the top-right pocket; E) launch still passes outward. Plus mp2 regression 14/14.
- Probe lesson: first attack draft teleported balls INSIDE the sealed pocket — a state real play cannot reach — and "failed". Adversarial probes must attack through reachable trajectories, or they test fiction.
