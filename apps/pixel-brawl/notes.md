# Pixel Brawl

Pixel-art fighting game — Leon vs Hunk with health bars and special moves.

## log
- 2026-03-13: Initial build. Canvas-based 2D fighter. Two characters: Leon (blue, swept hair) and Hunk (red, gas mask). Pixel-art rendering with body parts (boots, legs, torso, arms, head). 3 attack types: punch (6 dmg, fast), kick (8 dmg, range), special (18 dmg, needs full SP bar, energy aura VFX). Blocking via crouch (80% damage reduction). Combo counter with announcements at 3+ hits. Hitstun system, knockback, screen shake on hits. CPU AI with approach/retreat, block reactions, special timing. VS CPU and 2-player modes. Arena background with ropes and corner posts. HP and SP bars in HUD. Mobile controls for P1. Press Start 2P + Silkscreen typography, dark arena palette.

## issues
- None yet

## todos
- Crouch attacks / aerial attacks
- Round system (best of 3)
- Character select screen
- Sound effects
- More special move variety per character

## notes
- No database — pure frontend game
- P1 (Leon): WASD + F/G/H (punch/kick/special)
- P2 (Hunk): Arrows + J/K/L (punch/kick/special)
- SP fills from dealing damage (dmg * 1.5), special costs 100 SP
- AI: approaches when far, attacks in range (6% chance/frame), blocks opponent attacks (35% chance), retreats when low HP
- Hit detection on specific frames (punch frame 3, kick frame 3, special frame 5)
- Gravity 0.5, jump velocity -10, ground at GH-50
