# Pizza Cutter Boss Fight

Pixel art boss fight game with a pizza cutter sword.

## log
- 2026-03-18: Initial build. Pixel-art boss fight with pizza cutter weapon. 5 bosses: Meatball Golem (charge), Pepper Dragon (strafe+fire), Anchovy Kraken (tentacle waves), Pineapple King (teleport), The Oven Lord (rage mode at 40% HP). Two attacks: slash (J/Space) and spin attack (K/Shift, 3s cooldown). Each boss has unique pixel art, movement pattern, and projectile behavior. Platformer physics (gravity, jump, ground collision). HP regen between bosses. Screen shake, damage flash, iframes with blink, particle effects. Mobile d-pad + attack buttons. Silkscreen + DotGothic16 typography, dark red/orange palette.

## issues
- None yet

## todos
- Add sound effects (WebAudio)
- Dash/roll dodge move
- Boss intro animations
- Score/time tracking
- Leaderboard

## notes
- No database — pure frontend
- PX=3 pixel scale for chunky pixel art
- Boss patterns: charge, strafe, tentacle, teleport, rage
- Spin attack has 3s cooldown, hits in a circle around player
- Player heals 30 HP between bosses
