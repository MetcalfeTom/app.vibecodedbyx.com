# Glitch Runner

Hack the grid. Dodge sentinels. Steal data. Get out.

## log
- 2026-04-10: Initial build. Top-down dungeon crawler on canvas. Procedural BSP-style room generation (6-14 rooms + corridors per floor), tile-based collision. Player = cyan hacker circle with directional indicator. Two sentinel types: patrol (wanders, chases if close) and chaser (actively hunts within detection range). Sentinels have glitch animation, alert rings, eye tracking. Yellow diamond data fragments to collect. Cyan exit portal with rotating rings. Dash ability (Shift, 8 frames, i-frames, cooldown). Knockback on hit, i-frame flashing. Camera follows player with lerp. Minimap with player/enemies/data/exit. 5 HP, floor scaling (more enemies + data, faster sentinels). Mobile d-pad + dash button. WebAudio SFX. Orbitron + Share Tech Mono typography, deep black/cyan neon aesthetic.

## features
- Procedural dungeon generation (rooms + corridors)
- Two enemy types: patrol sentinels and chaser sentinels
- Dash ability with i-frames and cooldown
- Data fragment collection (yellow diamonds)
- Floor progression (exit portal descends deeper)
- Enemy alert system (detection radius, chase escalation)
- Minimap with all entities
- Camera follow with smooth lerp
- Screen shake on damage
- Knockback system
- Particle effects (dash trail, damage, collection)
- WASD + Arrow key controls
- Mobile d-pad + dash button
- WebAudio SFX
- Floor scaling difficulty

## issues
- No combat system (pure evasion)
- Map gen can occasionally create disconnected rooms (rare)
- No save/checkpoint system

## todos
- EMP ability to stun sentinels
- Power-ups (speed boost, extra HP, invisibility)
- Supabase leaderboard
- More sentinel types (turret, teleporter)
- Boss sentinel every 5 floors
- OG preview PNG
