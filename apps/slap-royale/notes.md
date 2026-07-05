# Slap Royale

## log
- 2026-07-05: v1 — 4-player same-keyboard slap fight on a shrinking circular arena. Fullscreen canvas, starfield bg, grid-lined circular platform that shrinks 10% every 8 seconds. 4 players orbit clockwise with their move key, slap nearby opponents outward with their slap key. P1 Z/X (pink), P2 N/M (cyan), P3 Q/W (yellow), P4 O/P (purple). Slap = directional knockback (420 force) with 0.45s cooldown. Players pushed past arena edge = eliminated with 28-particle explosion. 3 power-ups spawn periodically: ⚡ Speed (1.6× move for 5s), 💥 Mega (2.2× slap force, single use), 🛡️ Shield (absorbs 3 hits over 8s with reduced knockback). 45s timer, last one standing wins; if time expires, closest to center wins. Screen shake on slaps/eliminations, particle bursts, expanding slap ring visual. Arena turns red-ringed when below 60% size. Web Audio SFX (sawtooth+noise slap, square sweep elimination, triangle arpeggio pickup, win fanfare, sine sweep shrink). HUD: time/arena%/alive count. Player status bar with powerup indicators. Bungee + Fredoka + Azeret Mono. Pink/cyan/yellow/purple on dark indigo.

## issues
- None yet

## todos
- Touch controls for mobile (virtual buttons)
- AI opponents for solo play
- More powerup types (freeze, teleport, grow)
- Best-of-3 match mode
- Adjustable player count (2-4)
