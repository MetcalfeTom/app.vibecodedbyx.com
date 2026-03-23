# Neon Bomber

Local 2-player Bomberman clone with neon aesthetics. Plant bombs, dodge blasts, collect power-ups.

## log
- 2026-03-22: Initial build. 15x13 grid arena with destructible bricks (70% fill). 2 local players (P1: WASD+Space, P2: Arrows+Enter). Bombs with 2.5s fuse, chain explosions. 3 power-up types: extra bomb (B), range (R), speed (S) — 35% drop rate from bricks. Win tracking across rounds, auto-restart after 2.5s. Neon glow effects on players/bombs/explosions. Particle bursts on death. Eye direction indicator on player avatars. Orbitron + Share Tech Mono typography, dark arena aesthetic.

- 2026-03-23: Added mobile touch d-pads. Two d-pad overlays (P1 cyan left, P2 pink right) with directional buttons + bomb button. Shown on touch devices via (pointer:coarse). Canvas resizes smaller on mobile to leave room for d-pads. Touch uses elementFromPoint for multi-touch support.

## issues
- None yet

## todos
- AI opponent for single player
- More power-up types (kick bomb, pass-through)
- Destructible brick patterns / preset maps
- Sound effects

## notes
- No database — pure frontend
- Grid-based movement with speed-controlled step timing
- Bomb timer 2.5s, explosion duration 0.4s
- Chain explosions: blast hitting another bomb triggers it immediately
- Power-ups: maxBombs caps at 5, range at 6, speed at 8
- Canvas scales to fit viewport while maintaining pixel ratio
- Round auto-resets after winner declared (2.5s pause)
