# kick-physics

## log
- 2026-05-02: Created. **Side-view physics soccer — 1P vs CPU, 90-second match.** Single-file canvas (800×450). **Pitch**: stadium gradient sky + 3 rows of crowd-dot noise (deterministic seeded colors so it doesn't shimmer), green grass with alternating-shade vertical stripes below GROUND_Y, dashed center line, white goals at both ends with diagonal hatched nets and YOU/CPU labels above. **Players**: chunky pixel keepers with round heads, jersey stripe, swinging legs (sin(runT)×6 leg-swing animation), single-dot eye that flips with facing, "kick foot" that extends 10px from the body during the 0.18s kick window. Two players: cool-blue YOU on the left, hot-red CPU on the right. **Physics**: gravity 1700 px/s² applied each frame. Players accelerate at 1800 px/s² with strong friction when no input + 320 max velocity. Jump = -680 vy when on ground. Ball is a circle (r=11) with drag 0.998 and bounce 0.72. Bounces off floor/walls/top + 4×4 goalpost AABB at the top of each goal. **Kick mechanic**: pressing S triggers a 0.18s kick window. While the window is open, if the foot point (player.x ± facing*22) is within ball.r+12 of the ball, fire a velocity impulse — direction = vector from foot to ball, magnitude 720 + player velocity bonus (running shots fly farther). One impulse per kick (kickHold flag). **Player-ball bumps** independent of kick: simple circle overlap pushes ball out of player + transfers player velocity (140 + speed*0.5 magnitude). **CPU AI**: defends on its own half (positions goal-side of ball), pushes ball left when on the player's half, jumps when ball is high+near (within ±60px and 20px above head), kicks when ball is in foot reach. Always faces the ball. **Goals**: detected by ball-center inside the goal-mouth AABB (ball.x past front post AND ball.y between crossbar and ground). Triggers a 1.6s freeze, gold "GOOOAL!!!" / "CPU SCORES" banner with a 6-note arpeggio, ball+players reset to kickoff positions. **Match flow**: title overlay with KICKOFF button, 90s countdown timer, whistle on start, full-time end overlay shows YOU/CPU score + WIN/LOSS/DRAW + REMATCH button. **Aesthetic**: Bungee Shade title "KICK PHYSICS" with red/blue split, Silkscreen + VT323 + Special Elite secondary fonts, banner rotates from -6deg to -2deg on appear. **Audio**: Web Audio synth — kick (square thump + sawtooth pop), bounce (square blip), bump (sawtooth), goal (6-note arpeggio), whistle (two sine tones), end (sawtooth fall). Pollinations OG, ⚽ favicon. Mobile-friendly via canvas auto-fit + touch-action:none.

## issues
- The CPU is mediocre — it can be cheesed by hugging the wall and running at the ball at full speed. Tunable: tighten the defending position threshold + make it kick more aggressively.
- Goal detection only checks ball-center, so a ball that bounces off the BACK net post can't re-trigger. Fine for now since posts have AABB collisions.
- Player-ball bump uses player BODY center (not feet) for the contact circle, so head-bumps aren't quite physically correct. Still feels punchy.
- No shoulder-tackle interaction between players — they pass through each other. Adding a soft separation would prevent them from sharing space.
- 2-player local mode would be straightforward but isn't wired up yet.

## todos
- 2-player keyboard split (WASD vs IJKL).
- Header (W key while running) for an arched aerial shot.
- Power meter on charge-kick (hold S for stronger kick).
- Different pitch palettes per match (night, snow, neon).
- Stamina bar — sprinting drains, recovers when standing.
- Stadium chants triggered on goals (random vocal-blip sample).
- 5-minute match mode + best-of-3.
