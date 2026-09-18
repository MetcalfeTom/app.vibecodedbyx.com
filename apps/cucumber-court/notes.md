# Cucumber Court — notes

## log
- v1.0 (2026-09-18): built per chat ("tiny harmless chaotic cucumber courtroom game with maze, memory, and mayhem modes, clear controls, and playful visuals" + a repeat asking for clear mode selection, keyboard controls and playful evidence cards). Three modes behind one picker: MAZE (9×9 recursive-backtracker maze, exit = farthest cell by BFS, three exhibits ≥3 steps out and spread apart; collect all three then reach the gold witness stand before a 60 s gavel timer; arrows/WASD + on-screen pad; canvas-drawn cucumber/exhibits/stand, no emoji), MEMORY (Simon of six drawn evidence cards — gavel/pickle/wig/scales/briefcase/moustache; round r shows the first r+2 of one seeded master sequence; 8 rounds win, score 520; keys 1–6 or click; wrong card shows the expected one and keeps the "Objection" line beside the verdict), MAYHEM (12 jury seats, seeded LCG spawns, cucumbers pop for ~1.5 s shrinking with pace, the judge pops 20 % of the time; tap = 10 + 2×combo (cap ×10), judge = contempt −15 floored at 0, 30 s; keys QWER/ASDF/ZXCV mapped to the 3×4 grid with labels on the seats). Silly deterministic verdicts per mode. Pure `<script id="eng">` dual-exported; seam `window.__CC` (start/seed/freeze/step/move/press/yourTurn/tap/showMs). No network, no storage, no external anchors (asserted). Titan One + Mali, walnut/cream/pickle-green/gavel-gold. eng 34/34 node + probe 45/45 ×3 widths + screenshots.

## issues
- Maze fixtures: a seed's shortest corridor can pass all three exhibits (seed 3 does) — a "reach the stand without exhibits" test must move the exhibits off the path first.
- Simon tests: cache the sequence length before pressing — the last correct press swaps in the next round's longer sequence mid-loop.
- After "play again" the card buttons are rebuilt; stale references point at disabled buttons and `.click()` silently does nothing.

## todos
- Optional tiny click/gavel sounds behind a mute toggle (kept silent on purpose for v1.0).
- A local best-score per mode (would need storage; currently deliberately storage-free).
