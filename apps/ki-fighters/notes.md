# Ki Fighters

## log
- 2026-04-09: Initial build. Pixel-style 1v1 fighter inspired by classic anime energy battles. Player vs AI rival on a sunset mountain stage. Core moves: fly (arrow keys / WASD, free 2D movement), punch (Z, short-range melee), ki blast (X, projectile that costs 25 ki), charge (C, regens ki + aura particles), dash (Shift, i-frame burst that costs 10 ki). Hit-stop flashing on damage, knockback physics, projectile trails with additive-glow radial gradients. Pixel-art hand-drawn fighters with spiky hair sprites that mirror by direction, state-based arm poses (idle/punch/blast). AI opponent approaches when far, backs off when close, randomly blasts at mid-range, charges when low ki. Round restart on Z after KO. Mobile on-screen controls (d-pad + action buttons). Press Start 2P + VT323 typography, purple/orange sunset palette with layered parallax mountains.

## features
- Full 2D flight physics (no ground requirement, light gravity pull)
- 3 offensive moves with cooldowns + ki economy
- Dash with i-frame window and cooldown
- AI with distance-aware behavior tree
- Health + ki bars for both fighters
- Pixel-art sprites with state-based frames
- Aura rendering during charge
- Projectile particle trails + impact explosions
- Mobile touch controls with 54px buttons
- Round restart flow

## issues
- No second AI difficulty; single mid-level opponent
- Collision boxes are fixed rectangles — punches can clip awkwardly at edges
- No sound yet (could add WebAudio blips for punch/blast/KO)

## todos
- Sound: punch whiff, blast charge/fire, KO bell
- Power-up transformation: above 90 ki, player hair glows gold and deals +50% damage
- Second enemy type with teleport
- Super move: hold X for charged beam that penetrates
- Two-player local versus mode
- Stage variants (space, desert, water)
