# Neon Blaster

Blast waves of neon enemies with screaming lasers and explosive chain reactions.

## log
- 2026-03-15: Initial build. Space shooter with neon aesthetics and loud audio. 5 enemy types: drone (triangle, 1HP), shooter (square, 2HP, fires aimed bullets), tank (trapezoid with turret, 4HP), fast (circle, 1HP, fast), boss (pentagon, 20HP, rapid fire, HP bar, every 5 waves). Wave system with increasing difficulty (more enemies, faster fire rates, +HP per 4 waves). 4 powerup types: Rapid fire (faster shots), Triple (3-way spread), Shield (absorbs one hit), Bomb (+1 bomb). Bomb ability: Z key, damages all enemies, clears enemy bullets, massive screen shake. Kill multiplier up to x16, decays after 120 frames of no kills. Massive particle explosions with multi-color layers, screen shake, and layered Web Audio (noise buffer + oscillator sweeps). Laser sound: sawtooth pitch sweep. Explosion: noise burst + square bass + sawtooth rumble. Lives system with invincibility frames. Starfield parallax. Touch controls: drag to move + fire button. Orbitron + Share Tech Mono typography, cyan/magenta/yellow neon palette.

## issues
- None yet

## todos
- Weapon upgrade tree (laser types)
- Enemy formations/patterns
- Leaderboard via Supabase
- Screen-clearing mega bomb animation
- Boss unique attack patterns

## notes
- No database — localStorage for best score
- Wave formula: 4 + wave*2 enemies per wave, boss every 5 waves
- Enemy HP scales: base + floor(wave/4)
- Fire cooldown: 12 frames normal, 5 with rapid powerup
- Multiplier: +1 per kill, max 16, decays after 120 frames
- Audio: all Web Audio API — noise buffers for explosions, oscillator sweeps for lasers
- Powerup drop rate: 20% on enemy kill
- Collision: AABB center-distance check
- Invincibility: 60 frames after hit, player blinks
- Bombs: start with 3, max 5, deals 5 damage to all enemies
