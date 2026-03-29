# Neon Shooter

## log
- 2026-03-29: V1 — Neon space shooter with upgradeable lasers. Canvas-based, wave system with 4 enemy types (basic diamond, fast triangle, tank hexagon, shooter circle). Player ship with momentum-based movement, auto-fire + manual fire. 4 upgrades between waves: +Spread (1-5 barrels), +Power (damage multiplier), +FireRate, Repair. Energy pickups from destroyed enemies. Screen shake on hit. Starfield parallax background. Particle explosions. Mobile controls (touch dpad + fire button, touch-drag to move). Orbitron + Share Tech Mono typography, cyan/dark space aesthetic.

## features
- 4 enemy types: basic (diamond), fast (triangle), tank (hexagon with HP bar), shooter (circle, fires at player)
- Wave system with scaling difficulty (more enemies, tougher types)
- 5 spread levels (single → five-barrel fan)
- 5 power levels (damage multiplier)
- 5 fire rate levels
- Repair upgrade (heals 30 HP)
- Upgrade costs scale with each purchase
- Upgrade panel appears between waves
- Auto-fire (always shooting)
- Energy pickups from destroyed enemies
- Particle explosion system
- Screen shake on damage
- Scrolling starfield
- HP bar with gradient fill
- Laser level indicator (sum of all upgrades)
- Wave announcement banner
- Mobile: touch dpad + fire button, touch-drag on canvas to move
- Keyboard: Arrow/WASD to move, Space to fire

## issues
- None currently

## todos
- Boss enemies every 5 waves
- Shield powerup
- Bomb/special weapon
- Sound effects
- Supabase leaderboard

## notes
- Fire interval: 180ms base, -25ms per fire rate level (min 50ms)
- Spread costs scale 1.6x, power 1.6x, speed 1.5x, heal 1.3x
- Enemies per wave: 4 + wave*2, capped at 30
- Fast enemies appear wave 3+, tanks wave 5+, shooters wave 7+
- Tank HP scales with wave: 3 + floor(wave/3)
- Player collision does 15 damage, enemy bullets do 10
- Pickups spawn 40% chance per kill
