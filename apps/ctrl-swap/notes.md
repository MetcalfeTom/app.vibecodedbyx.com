# CTRL SWAP

Retro arcade coin-chase where your movement controls randomly shuffle every time you score a point.

## log
- 2026-02-14: Initial build. Canvas game — 45s timed rounds, collect coins, controls shuffle on every catch. Player with directional eyes, coin with glow/pulse, obstacles with hatching, trail particles, swap flash + mapping indicator. Mobile D-pad. Supabase leaderboard (ctrl_swap_scores). Bungee Shade + Source Code Pro typography, neon green/pink/cyan palette.

## issues
- None yet

## todos
- Add sound effects (collect, swap, game over)
- Difficulty modes (longer rounds, more obstacles, faster swaps)
- Combo system for quick consecutive catches

## notes
- ctrl_swap_scores: username, score, swaps, user_id
- Control mapping: Fisher-Yates shuffle of [up,right,down,left] directions
- Guaranteed at least one control changes per swap
- Mapping indicator shows for 2.5s after each swap, highlights changed controls
- Player eyes rotate to show current "up" direction (visual cue for orientation)
- 8 random obstacles per round, avoid center for player start
- Coins placed avoiding obstacles and minimum distance from player
- 45 second rounds
