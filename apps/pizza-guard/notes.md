# Pizza Guard

Defend a pizza from raining pineapple chunks using a laser crosshair.

## log
- 2026-04-10: Initial build. Canvas game, full viewport. Pizza at bottom with layered crust/sauce/cheese/pepperoni + integrity bar. Pineapple chunks rain with rotation, laser auto-fires at nearest pineapple within 80px of crosshair. Wave spawning: count = 3 + waveNum*2, interval tightens per wave. Pineapple hit = -8 + waveNum*0.5 integrity damage. Particle effects on laser hit (yellow sparks) and pizza hit (red sparks). Night sky with twinkling stars. WebAudio SFX (laser zap, splat, game over). Bungee Shade + Lexend Mega typography, purple/orange palette.

## features
- Mouse/touch crosshair aiming
- Auto-fire laser at nearest pineapple in range
- Wave-based difficulty escalation
- Pizza integrity health bar
- Particle effects on hits
- Star field background
- WebAudio sound effects
- Mobile touch support

## issues
- No leaderboard yet
- No power-ups or upgrades
- Single weapon type

## todos
- Supabase leaderboard (waves survived + pineapples destroyed)
- Power-ups: wider laser, freeze, shield, rapid fire
- Boss pineapple waves
- Different toppings as enemies (olives, anchovies)
- OG preview PNG
