# Warp Serpent

Neon snake with gravity wells that pull you and portals that warp you.

## log
- 2026-03-16: Initial build. Classic snake on 26x26 grid with two unique mechanics. Gravity wells: appear periodically (max 3), have radius of influence (4-6 tiles), override snake direction when head enters field — pulls toward center. Touching the core = death. Visual: concentric field rings, orbiting swirl particles, glowing core with "G" label. Portals: spawn in linked pairs (max 2 pairs), entering one warps snake head to the other's exit. Visual: pulsing ring with inner swirl dots, dashed connection line between pairs, color-matched. Snake: cyan-to-blue gradient, head has directional eyes with pupils, glow trail, purple ring indicator when gravity is affecting direction. Food: colored pulsing orb with orbiting dot. Wall wrap. Speed increases every 5 food eaten (8→3 frames/move). Score: 10 * (1 + length/8) per food. High score tracked in session. Death explosion particles. 4 Web Audio SFX: eat arpeggio, warp sweep, gravity hum, death descending. D-pad for mobile. Audiowide + Share Tech Mono typography, deep space cyan palette.

## issues
- None yet

## todos
- Black hole gravity well (instant kill at range, must avoid entirely)
- Unstable portals (close after X uses)
- Power-up food that grants temporary gravity immunity
- Leaderboard with Supabase

## notes
- No database — pure frontend, session hi-score only
- Grid: 26x26 cells, 16px each, wrap on all edges
- Gravity wells: strength 0.8-1.4, radius 4-6 tiles, life 400-700 frames, spawn every 200 frames
- Gravity override: when head within radius, calculates pull vector, overrides nextDir if force > 0.6
- Portals: spawn in pairs with matching pairId and hue, enter one → exit other + 1 tile in current dir
- Snake rendering: circle per segment, hue 180→240 gradient, size decreases toward tail
- Speed: starts at 8 frames/move, decreases by 1 every 5 food, minimum 3
- Food score: 10 * (1 + floor(length/8)) for increasing reward
- Trail: ghost particles at head position, 15-frame life, 0.2 alpha
- Particles: 8 per eat, 10 per warp (both ends), 3 per death segment
