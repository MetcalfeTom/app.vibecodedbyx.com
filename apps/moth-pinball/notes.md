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
