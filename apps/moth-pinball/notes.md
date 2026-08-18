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

## 2026-08-18 · three-stage mission ladder (chat request: teach → risk → recover, non-score rewards)
- **M state** (per-game, reset in newGame; lifetime clears in localStorage 'mothpin-ladder'):
  - Stage 1 FIRST LIGHT (teach): ring all four words on one ball (the existing jackpot). Reward: **Moth's Blessing** — one saved ball (drain returns the ball instead of costing one; strictly one-time).
  - Stage 2 HOT WINGS (risky combo): 3 *different* bumpers within a 6s window — forces upper-table play instead of safe cradling. Live chip shows n/3 + countdown (0.2s throttled UI refresh in step). Reward: **wings widen 80→94** (FLIP len drives both physics and drawWing).
  - Stage 3 THE RECOVERY: armed display when reached, pays only on the LAST ball (balls===1) — recall the memory again → **extra ball** + ladder-cleared count persisted.
- UI: #missions chip strip (locked/active/done states), visually-hidden aria-live announcer that speaks only on stage transitions (no combo spam). Banners for each reward.
- Hooks: missionBumperHit in the bumper collision, missionJackpot at end of jackpot(), saver check at top of the drain branch, resets in newGame.
- Suites: ladder-probe **16/16** (boot chips, S1 grant, blessing saves exactly once, S2 window fairness — 3 distinct over >6s does NOT pass, wing widening, S3 gating with balls remaining, last-ball payout, persistence, full reset). Gate suite 6/6. mp2 core 14/14 after two documented intentional-change updates: stage-1 banner may replace the jackpot banner (h-jack ×1 remains the jackpot proof), and drainCosts now asserts the blessing interplay (saved once, then next drain costs).

## 2026-08-18 · right-side trap traced and killed via real-gameplay tracer (chat request 3)
- Built a **stuck-ball tracer**: 45s live sessions × 3 seeds × 3 flipper policies (dead/flap/cradle), flags any 4s window where the ball's bounding box stays under 30×30px. Measure, don't theorize.
- **Trap #1 (the reported one): (417,200)** — the right deflector [370,150→420,220] ended 6px from the lane wall, a wedge narrower than the ball; every non-cradle trace and all 4 targeted slow drops wedged there at rest (speed 3). Fixed by shortening to [370,150→400,192], leaving a 26px chute that feeds the right flipper. 4/4 targeted drops now escape; (417,200) gone from traces.
- **Trap #2 (found by the tracer, mirrored both sides): the flipper-crotch notch** — the wing's constant 7px collision pad bulged above the funnel surface at the pivot; balls rolling down the funnel stopped against the bump where flip rotation has zero leverage (left (144,631) proven flip-UNrecoverable; right mirror (336,631) same geometry). Fixed by tapering the pad 2px at root → 7px at tip (`pad=2+5*c[2]`) — matches the drawn wing art; tip feel unchanged. Both crotch spots now "rolls-free".
- Final verdict probe: left/right crotch + center-tips all roll free; every remaining low-motion cluster in re-traced sessions is flip-recoverable (normal pinball resting spots). Regressions: mp2 14/14, gate 6/6, ladder 16/16.
- Tracer lesson: "trap" = unrecoverable BY PLAYER INPUT — the recoverability check is what separated real traps from cradling.
