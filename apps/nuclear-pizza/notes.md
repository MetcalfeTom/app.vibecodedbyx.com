# Neon Nuclear Pizza

## log
- 2026-01-11: Created nuclear pizza delivery dodging game
- 2026-09-26: Engine rescue
  - Fixed world (800×500, portrait phones 520×620) scaled to fit, DPR-crisp; fixed 60 Hz timestep
  - Everything spawns on the road (squirrels/potholes/houses used to spawn in the sky); potholes + houses ride at road speed
  - Hitbox centred on the scooter sprite (was offset below-right); bite = 45 ticks blink invulnerability + shake
  - Pothole damage per frame cut (was ~0.5×dmg/frame = instant death), ≈38 rads/s sitting in the worst one
  - Start screen, pause (P/Esc/button, auto on tab hide), game over with best score (`nuclearPizzaBest`), focus on TRY AGAIN
  - Delivery combo x2..x5 (miss a house or get bitten = reset), floating score text
  - Hold/drag on the canvas to steer (touch aims 60 css px above the finger); old 4 buttons removed
  - WebAudio blips + geiger ticks, mute (M / button, `nuclearPizzaMuted`)
  - Only game keys preventDefault'd; rads meter bar in HUD; og.png from a staged frame

## features
- Drive a neon pizza scooter through radioactive wasteland
- Dodge mutant squirrels (3 mutation levels, more eyes = more dangerous)
- Avoid radioactive potholes with bubbling toxic waste
- Deliver pizzas to houses for points and radiation healing
- Radiation meter - hit 100% and you're irradiated
- Score increases over time + pizza delivery bonuses
- Difficulty rises with time (+1.2 per minute)
- Neon road with glowing lines
- Distant ruined city buildings
- Particle effects on collisions and deliveries
- WASD/Arrow keys, hold-and-drag on touch/mouse
- Game over screen with restart

## issues
- Headless tests: `window.__np` exposes state/update/spawn classes; keydown dispatched on document has no .closest (guarded)

## todos
- Could add power-ups (radiation suit, speed boost)
- Could add boss mutant squirrels
- Could add leaderboard
- Could add pizza types for bonus points
