# Neon Pinball

A neon pinball machine where gravity warps every time you type.

## log
- 2026-03-15: Initial build. Canvas 2D pinball with gravity shift mechanic. 8 neon bumpers with glow pulses, 2 slingshots, 2 flippers (Z/Left, M/Right), 3 rollover score lanes, wall guides, launch lane with power meter (hold Space). Chat input at bottom — typing a message hashes text to shift gravity angle and strength. Short msgs = subtle shift, long msgs = wild angles. Gravity field visualized with directional arrows on grid + floating particles on shift. Bot chat fires every 4s for ambient gravity chaos. Ball trail, particle explosions on bumper hits. 3 balls, auto-restart on game over. Web Audio: flipper thwack, bumper ping, launch sweep, drain thud, gravity shift whoosh. Silkscreen + Chakra Petch typography, dark purple/magenta/cyan palette.

## issues
- None yet

## todos
- Multiball powerup
- Ramps and loops
- Score multiplier combos
- Supabase leaderboard
- More table features (spinners, kickbacks)

## notes
- No database — pure frontend
- Gravity: angle lerps toward target at 0.05/frame, strength 0.25-0.5
- Hash function: charCode shift-and-add, maps to angle via lower 16 bits
- Message length intensity: min(len/15, 1) blends between subtle and wild
- Bumpers: 8 circular, radius 20-32, bounce multiplier 2.2x + 3 unit kick
- Slingshots: 2 line segments, 6 unit kick on contact
- Flippers: 60px length, angular velocity transfers to ball
- Ball speed cap: 18 units, 3-step physics substeps per frame
- Bot messages: 22 phrases, 30% chance every 4s
- Particles: 8 per bumper hit, gravity-affected, 0.03 life decay
