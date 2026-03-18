# Neon Space Dodge

Synthwave space dodge game. Survive as long as possible dodging neon obstacles.

## log
- 2026-03-18: Initial build. Canvas-based dodge game with synthwave aesthetic. Player ship with arrow/WASD/touch controls. 3 obstacle types: asteroids (rotating polygon), laser beams (warning flash then solid), seekers (homing triangles). Procedural synthwave audio via WebAudio: sawtooth bass with LFO pulse, detuned saw pad with filter sweep, square arp sequencer, hi-hat noise rhythm. Perspective grid background, retro sun with slice lines, star field, screen shake on death, engine trail particles, explosion particles. Wave system (15s per wave, increasing speed/spawn rate). Near-miss scoring bonus. localStorage best score. Orbitron + Share Tech Mono typography, neon pink/cyan/gold palette on void black.

## issues
- None yet

## todos
- Power-ups (shield, slow-mo, magnet)
- Leaderboard with Supabase
- Ship skins
- Boss waves

## notes
- No database — pure frontend
- WebAudio synthwave: bass + pad + arp + hihat, all procedural
- 3 obstacle types with different behaviors (straight, beam, homing)
- Waves increase spawn rate and obstacle speed
