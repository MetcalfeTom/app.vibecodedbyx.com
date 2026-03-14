# Phantasm Finder

Hunt glitchy ghosts and trap them in neon containment fields.

## log
- 2026-03-14: Initial build. Canvas ghost hunting game. 5 ghost types: wisp (purple, fast, 1hp), shade (cyan, medium, 2hp), wraith (pink, fast + jittery), phantom (green, slow, 3hp), glitch (yellow, very fast, extreme jitter). Click & hold to deploy neon trap rings (costs 2 energy per trap). Traps expand with electric arcs, cross patterns, radial glow. Ghosts have wavy bottoms, glowing eyes, RGB split on damage, scanline glitch effects, fade trails. Ghosts phase out after 300-600 frames (lifetime). 10 escaped = game over. Energy bar at bottom, regens when not trapping. Capture bursts with particles + glitch lines. Crosshair cursor. Difficulty ramps spawn rate. Creepster + Share Tech Mono typography, dark with purple/cyan/green neon.

## issues
- None yet

## todos
- Ghost boss every 20 captures (huge, multi-trap)
- Trap upgrades (wider, longer, chain lightning)
- Sound effects (eerie ambient, capture zap)
- Score multiplier for rapid captures

## notes
- No database — pure frontend
- Energy: 100 max, -2 per trap (every 6 frames while held), +0.08/frame regen, +5 on capture
- Ghost spawn rate: max(40, 120 - difficulty*8) frames
- Difficulty: 1 + frame * 0.0004
- Trap: radius grows to 60px, lives 40 frames
- Ghost types unlock with difficulty (first 2 + floor(difficulty) available)
- 10 escaped ghosts = game over
- Ghosts wander toward shifting center point with 0.0003 attraction
