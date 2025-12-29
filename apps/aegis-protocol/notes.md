# Aegis Protocol

## log
- 2025-12-29: Initial creation - terminal-based mainframe defense game with CRT aesthetic

## features
- Commands: SCAN, PATCH, TRACE, SHIELD, STATUS, HELP, NUKE (wave 5+)
- 5 system nodes: FIREWALL, DATABASE, AUTH, NETWORK, CORE
- 4 bot types: PROBE, WORM, TROJAN, DDOS (progressively harder)
- 10 waves to victory
- Energy management system (regenerates over time)
- Shield mechanic with timer
- CRT effects: scanlines, glow, phosphor green, flicker

## issues
- None yet

## todos
- Could add sound effects (typing, alerts, attacks)
- Could add more command variations (FIREWALL, DECRYPT, etc.)
- Could add boss bots at wave 5 and 10
- Leaderboard for high scores
- Different difficulty modes

## notes
- VT323 font for authentic terminal look
- Energy regenerates 2/sec, max 100
- Shields last 10 seconds
- Each node down costs 20% integrity
- Wave scaling: 2 + wave*2 bots per wave
