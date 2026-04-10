# Serial Hunt

Top-down survivor game. Pilot a combat drone, auto-fire at waves of glitching robots, collect XP, level up with upgrades.

## log
- 2026-04-10: Initial build. Canvas game, full viewport. Player drone auto-fires at nearest enemy, WASD/arrows to move. 5 enemy tiers (Scout/triangle, Brute/square, Zapper/hex, Phantom/circle, Tank/big square) with escalating HP/speed/dmg. Glitch effect: random offset + scanlines on enemies. Wave spawns: count = 4 + wave*2 + wave²*0.1, staggered spawn intervals tighten per wave. XP orbs drop on kill, magnetized toward player. Level-up offers 3 random upgrades from 8: fire rate, damage, speed, piercing, multi-shot, armor, regen, magnet range. Oil splatters on enemy death (ellipses with rainbow sheen, fade over time). Player invulnerability frames on hit (400ms). HUD: hull/kills/wave/level/xp bar/time. Game over shows kills/survived/level/wave. Mobile virtual joystick. Rajdhani + Share Tech Mono typography, deep navy + cyan + purple palette with grid background.

## features
- 5 enemy tiers with distinct shapes and glitch intensity
- Auto-aim at nearest enemy
- 8 upgrades: fire rate, damage, speed, piercing, multi-shot, armor, regen, magnet
- XP orbs with magnetic pull
- Oil splatter death effects with oily sheen
- Escalating wave difficulty (HP/speed scaling)
- Mobile joystick support
- WebAudio SFX

## issues
- No leaderboard
- Enemies don't avoid each other (can stack)
- No boss enemies yet
- Camera is fixed (player moves within viewport, no world scrolling)

## todos
- Supabase leaderboard (kills + time survived + level)
- Boss every 5 waves
- More upgrade variety (orbital drones, area blast, chain lightning)
- Scrolling world with minimap
- OG preview PNG
