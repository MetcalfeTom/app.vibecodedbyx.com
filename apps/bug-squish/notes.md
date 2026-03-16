# Bug Squish

A game where you squish increasingly glitchy bugs with a giant hammer.

## log
- 2026-03-16: Initial build. Canvas-based bug squishing game. Giant hammer cursor with metal head, wooden handle, impact ring animation. 5 bug types: ant (fast, 1HP), beetle (slow, 3HP), roach (medium, 2HP), spider (erratic, 2HP), centipede (fast, 4HP, wide). Progressive glitch system: bugs get glitchier each wave — chromatic aberration offset, random rect artifacts, red glowing eyes, teleport particles. Split mechanic: very glitchy bugs (wave 7+) spawn 2 smaller bugs on death. Wave system: 5+wave*2 bugs per wave, bugs spawn from edges. Combo system: consecutive hits within 60 frames build x1-x10 multiplier. 5 lives (lost when bugs escape past timer). HP bars for multi-hit bugs, escape warning indicators. Splat marks persist on floor with bug-colored blood. Score popup texts float upward. 5 Web Audio SFX: smash (noise burst + sine bass), miss (triangle blip), escape (square sweep down), wave complete (chime arpeggio), game over (descending). Crosshair overlay, dark floor with grid. Bungee Shade + Share Tech Mono typography, dark palette with orange/green accents.

## issues
- None yet

## todos
- Boss bugs every 5 waves (giant bug with patterns)
- Power-ups: freeze time, wider hammer, magnet pull
- Bug trails (slime paths on floor)
- Leaderboard with Supabase

## notes
- No database — pure frontend
- Bug spawn: from random edge, move toward center area with slight randomness
- HP by type: ant=1, roach=2, spider=2, beetle=3, centipede=4
- Glitch level: min(wave/3, 3), affects chromatic offset, artifact chance, teleport chance
- Split: glitchLevel >= 2 AND random 40% chance, spawns 2 bugs at half scale with 1HP
- Escape: bugs have 8-14 second lifetime, warning flash at 80%, escape at 100%
- Combo: 60-frame window between hits, multiplier = min(combo, 10)
- Hammer: 40px head, impact ring expands to 60px over 10 frames
- Wave gap: 120 frames between waves
