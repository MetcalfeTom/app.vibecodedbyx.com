# Deckbound

## log
- 2026-04-02: Initial build — 2D top-down cyberpunk driving roguelike prototype. Procedural road chunks (straight, curves, wide, narrow), 3-lane system, 6 card types (BOOST/SHIELD/EMP/REPAIR/SLOW-MO/MAGNET), pit stops every 500m, 3 biomes (Neon City/Industrial/Underground), obstacle spawning with barriers and oil slicks, data pickups for new cards, particle effects, HUD with distance/speed/health/cards. Canvas-based single file, keyboard + touch controls.

## features
- Procedural road generation with chunk types and width variation
- Card system: 6 types, hand of 3, cooldown, pit stop selection
- 3 biome color shifts every 30s (cyan/orange/purple)
- Obstacles: barriers (damage) and oil slicks, data pickups (cards)
- Boost with flame trail, shield with blue glow, EMP wave, repair, slow-mo, magnet
- Title screen with card fan animation
- Game over with stats (distance + cards used)
- Touch: left/right thirds steer, center taps boost, bottom card taps
- Keyboard: A/D or arrows steer, Space boost, 1/2/3 cards

## issues
- Oil slicks currently only visual obstacles (no slip mechanic yet)
- Magnet pull is simple Y-axis only, doesn't perfectly track lane position
- No persistent leaderboard (could add Supabase later)
- Road curve offsets can cause slight visual jitter at chunk boundaries

## todos
- Add Supabase leaderboard for high scores
- Oil slick slip mechanic (temporary uncontrolled drift)
- Boss encounters at milestone distances
- More obstacle types (moving drones, laser gates)
- Sound effects (WebAudio synth bleeps)
- OG image (generate or create placeholder PNG)
- Deck building between runs (persistent card unlocks)
