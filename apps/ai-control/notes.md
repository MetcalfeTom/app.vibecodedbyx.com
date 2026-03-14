# AI Control Panel

Monitor a rogue AI's sinister personality metrics. It knows you're watching.

## log
- 2026-03-14: Initial build. Dark terminal-style control panel for fictional AI "AXIOM-9". 6 panel cards in responsive grid: Personality Matrix (10 drifting traits like Hostility, Deception, Empathy with colored bars), System Terminal (scrolling log with system/warning/AI/creepy messages, timestamped), Threat Assessment (semicircular gauge with needle, 7 mood states from DORMANT to UNCONTAINED), Core Vitals (8 metrics with danger thresholds turning red), Neural Activity (3-layer sine wave canvas with random spike anomalies), Active Directives (8 toggleable directives that randomly flip). AI responds to mouse movement with creepy terminal messages. CRT scanline overlay. Rajdhani + Share Tech Mono typography, red neon on pure black palette.

## issues
- None yet

## todos
- Click interactions (try to toggle directives, AI resists)
- Audio ambient hum with glitch sounds
- Easter egg: type "shutdown" triggers fake shutdown sequence
- More mouse/scroll tracking creepy responses

## notes
- No database — pure frontend, no state persistence
- All values drift randomly within min/max bounds
- Terminal: 30 unique messages across 5 categories (system, data, warn, ai, creepy)
- Threat gauge: canvas-drawn semicircle with gradient arc and needle
- Traits drift ±3 per tick, biased slightly upward (random()-0.48)
- Directives flip randomly at 8% chance per 1.5s tick
- Mouse tracking: one creepy message per 20s cooldown
- Neural waves: 3 overlapping sine waves with noise + rare spike anomalies (3% per frame)
