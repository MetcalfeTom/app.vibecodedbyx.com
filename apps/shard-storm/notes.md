# Shard Storm

## log
- 2026-03-29: V1 — Twin-stick asteroid shooter focused on shard collection. WASD move, mouse aim, click/space fire. Rocks split into smaller pieces (large→3 medium→2 small). Destroyed rocks explode into glowing diamond shards that drift and get magnetically attracted to player. Combo system (3+ kills in 90 frames = multiplier). Multi-colored rocks with hue variety, damage cracks. Pickups: heart (extra life), diamond shard (bonus). Motion trails (0.3 alpha clear). Screen shake scaled to rock size. 5 lives max. Wave system with escalating count/speed. Mobile: virtual joystick + fire button + touch aim. Audiowide + Share Tech Mono typography, dark with colorful neon rocks.

## features
- Twin-stick controls (WASD + mouse aim)
- Rocks split: large→3, medium→2, small destroyed
- Glowing diamond shards from destroyed rocks
- Shard magnetic attraction when near player
- Shard collection counter
- Combo system (3+ rapid kills = score multiplier)
- Multi-hue rocks (8 possible hues)
- Damage crack visuals on hit rocks
- Rock HP scales with size (large=3, medium=2, small=1)
- Heart and diamond pickups
- Motion trail effect (alpha clear)
- Screen shake on destruction
- Bullet recoil on ship
- Aim line (subtle dotted)
- Thrust flame animation
- Invincibility flicker on respawn
- Wave system with scaling difficulty
- Mobile: virtual stick + fire button + touch aim

## issues
- None currently

## todos
- Chain explosion mechanic (shards damage nearby rocks)
- Shield powerup
- Weapon upgrades (spread, laser, homing)
- Boss asteroids
- Supabase leaderboard

## notes
- Distinct from neon-asteroids: twin-stick vs classic rotation, shard collection mechanic, combo system, no wrapping ship rotation
- Fire cooldown: 8 frames
- Bullet speed: 9, life: 50 frames
- Player speed: 4.5, friction: 0.94
- Shard attraction radius: 50px, collection radius: 20px
- Shard decay: 0.008-0.014 per frame
- Rocks per wave: 3 + wave*2, max 20
- Rock speed: 0.6-1.4 + wave*0.08
