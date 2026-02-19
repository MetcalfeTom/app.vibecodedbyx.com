# Lint Roller Defense

Defend your server from fluffy fox tails using a lint roller. Requested by meowmeowmeowdddd. It's official.

## log
- 2026-02-14: Initial build. Canvas game — move lint roller with mouse/touch, collect fox tails before they hit the server. 6 tail types (Fluffy, Bushy, Wispy, Mega Floof, Golden Tail, Shadow Tail). Roller accumulates fluff — press space/double-tap to peel. Waves increase spawn rate and tail speed. Server HP system. Supabase leaderboard. Chakra Petch + IBM Plex Mono typography, dark server room aesthetic with green/orange neon.

## issues
- None yet

## todos
- Power-ups (extra HP, auto-peel, magnet)
- Sound effects
- More tail types in later waves

## notes
- lint_defense_scores table: username, score, wave, user_id
- Roller grows as fluff accumulates, slowing tracking speed
- Must peel (space/double-tap) to reset fluff — brief immobility during peel
- Waves every 20s, spawn interval decreases, tail speed increases
- 6 tail types with different sizes, speeds, HP, points
- Golden tails are rare high-value targets
- Server has 5 drive bays with LED indicators, flashes red at low HP
