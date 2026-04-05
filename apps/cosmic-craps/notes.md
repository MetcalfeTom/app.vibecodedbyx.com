# Cosmic Craps

## log
- 2026-04-05: Initial build — dice game where every roll triggers a visual space event. 11 unique events mapped to dice totals 2-12, each with custom canvas animations and particle systems. Anybody + DM Mono typography, deep space purple palette with trail rendering.

## features
- 11 space events mapped to dice totals:
  - 2: Black Hole (accretion disk, gravity particles)
  - 3: Meteor Shower (30 streaking fireballs)
  - 4: Nebula Birth (colored gas clouds)
  - 5: Solar Flare (directional eruption)
  - 6: Asteroid Belt (orbiting rocks)
  - 7: Supernova (expanding star death)
  - 8: Comet Pass (tail trail)
  - 9: Pulsar Beam (rotating beam)
  - 10: Wormhole (spinning portal rings)
  - 11: Gamma Burst (screen-wide flash)
  - 12: Big Bang (everything explodes)
- Animated dice roll with unicode dice faces
- 200 twinkling background stars
- Particle system with gravity, trails, blobs
- Background color shift on intense events
- Vignette overlay
- Event name + description display
- Roll/event/streak counters
- Space/Enter/tap to roll

## issues
- Events can overlap if rolled rapidly
- No sound
- Some events (nebula) are subtle compared to others

## todos
- Add Supabase roll history / leaderboard
- Sound effects (cosmic rumbles, dice roll)
- Combo system (same number twice = enhanced event)
- More dramatic camera shake on big events
- OG image
