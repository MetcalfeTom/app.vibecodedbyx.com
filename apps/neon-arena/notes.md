# Neon Arena

Top-down 5v5 battle arena with black circle players and neon team colors.

## log
- 2026-04-17: Initial build. Canvas top-down shooter. 5v5 teams (Cyan vs Magenta). Player controls one unit, AI controls 9 others. WASD movement, mouse aim+shoot. 9 obstacles for cover and tactics. AI has LOS checking, wander behavior, strafing, accuracy spread. 18-25 damage bullets with knockback. Respawn after 1.5s. 2-minute matches. Kill feed, HP bars, team scores. Camera follows player. Mobile dual-touch (left stick + right tap). Rajdhani + Azeret Mono typography, dark arena with neon accents.

## features
- 5v5 team battle (Cyan vs Magenta)
- Black circle players with neon team ring + glow
- Player: WASD move, mouse aim, click shoot
- Mobile: left-half virtual joystick, right-half tap to aim+shoot
- AI teammates and enemies with:
  - Line-of-sight checking through obstacles
  - Target acquisition (nearest visible enemy)
  - Strafing behavior at close range
  - Wander toward center when no target
  - Accuracy spread (AI_ACCURACY)
- 9 obstacles (walls/cover) for tactical play
- Bullets with trails, knockback on hit
- Respawn system (1.5s timer, spawn zones)
- 2-minute match timer
- Kill feed (top right)
- Team score display
- Per-player HP bars
- Camera follows player with arena bounds clamping
- Spawn zone tinting
- Particle effects on hit/kill
- Grid floor pattern

## issues
- AI pathfinding is simple (no obstacle avoidance, just wander+aim)
- Bullets can hit through thin obstacle corners occasionally

## todos
- Multiple weapon types (shotgun, sniper, rocket)
- Power-up pickups (speed, damage, heal)
- Larger maps with different layouts
- Kill streak bonuses
- Post-match stats screen
- Supabase leaderboard for total kills
