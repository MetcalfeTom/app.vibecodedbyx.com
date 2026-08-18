# Meteor Panic — notes

## log
- 2026-08-18 v1.0: the queued tiny reflex game, meteor-themed per chat's follow-up
  priority note. 45s rounds; meteors spawn top with tightening cadence + rising speed
  (diff = t/ROUND), wobble, spin, wall-bounce vx; golden meteors (12%, smaller, faster,
  ×5 base). Tap hit-test r+16 forgiveness → burst particles + pitched blip; combo ×1–9,
  decays 1.2s, whiff resets. Ground impact: −1 shield (of 3), screenshake, filtered-noise
  boom; 0 shields = "THE CITY IS FLAT", timer out = "DAWN BREAKS". Best in localStorage
  'meteor-best'. City skyline with deterministic lit windows, shield pips on canvas,
  HUD timer/combo/score. Internal G.clock from step(dt) only (wobble/stars keyed off it —
  unified-clock lesson from wobble-dash applied at birth). Bowlby One SC + Chakra Petch.
  13/13 probe (start/spawn/timer/hit/combo build+whiff+decay/impact/dawn/best/restart/
  flat endings) ×1 + mid-game screenshot with staged meteors.

## issues
- none observed at ship.

## todos
- Possible: meteor shower "frenzy" second at 10s left; per-round stats line.
