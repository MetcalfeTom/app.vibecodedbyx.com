# Bologna Blaster

Retro Galaga-style shooter where you pilot a bologna sausage against waves of angry beans.

## log
- 2026-03-13: Initial build. Canvas-based Galaga clone. Player is a hand-drawn bologna sausage (gradient oval with fat specks, casing, shine). 5 bean enemy types: green (1hp, 100pts), kidney/red (1hp, 150pts), brown (2hp, 200pts), black (3hp, 300pts), golden (1hp, 500pts). Beans have angry eyes, wobble animation, kidney-bean shape. Mustard-colored player bullets, green bean projectiles aimed at player. Wave system scales rows/cols/speed/shoot rate. Bean formation moves Galaga-style (horizontal + drop on edge). Particle explosions on kill. 3 lives with invincibility frames. Mobile D-pad + fire button. Star field background. Hi-score in localStorage. Press Start 2P + Silkscreen typography, dark purple/pink/mustard palette.

## issues
- None yet

## todos
- Power-ups (spread shot, shield, rapid fire)
- Boss beans every 5 waves
- Diving attack patterns like real Galaga
- Sound effects
- Leaderboard

## notes
- No database — pure frontend game
- Bean speed scales with wave number AND remaining count (speeds up as you kill more)
- Shoot interval decreases with wave: max(20, 60 - wave*5) frames
- Wave grid: rows = min(3 + wave/2, 6), cols = min(6 + wave/3, 10)
- Enter delay staggers bean appearance for wave start effect
- Golden beans: 5% random chance, 500 points
