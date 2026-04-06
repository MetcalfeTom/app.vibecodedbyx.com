# Bot Sweeper

## log
- 2026-04-06: Upgraded broom to giant red fly swatter — bigger pixel art head with mesh pattern, wider hit detection (34px radius, 48px reach), red impact flash on swing, updated title screen.
- 2026-04-05: Initial build — retro arcade game where you swat falling spam bot icons with a pixel broom. 6 bot types (spambot, phisher, crawler, trojan, ddos, worm) with unique pixel art and stats. 3 powerups, combo system, level progression, screen shake, particle effects. 240x320 game resolution scaled to fit screen. Press Start 2P font, green/dark terminal palette.

## features
- 6 bot types with unique 8x8 pixel art, colors, speeds, HP, and point values
- Pixel broom with swing animation and arc indicator
- Combo system (multiplier every 5 hits)
- 3 powerup types: Slow (time warp), Shield (bottom barrier), Multi (splash damage)
- Level progression: spawn rate increases, bot speed scales
- Multi-HP bots (trojans) with health bars
- Particle explosions on kill, score popups
- Screen shake on damage
- Danger zone indicator at bottom
- Title screen with background bots, game over with stats
- Mouse/touch broom control + click/tap to swing
- Keyboard: arrows/AD to move, space to swing
- Responsive scaling to any screen size

## issues
- On mobile, swinging requires tapping which also moves broom — could add dedicated swing button
- No sound effects
- Broom hitbox is simple circle check, not true arc

## todos
- Add Supabase leaderboard
- Dedicated mobile swing button
- Sound effects (whoosh, splat, powerup chime)
- Boss bots every N levels
- OG image
- More powerup types (freeze, magnet, double points)
