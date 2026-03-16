# Sky Rush

Fly through rainbow rings and dodge storm clouds at breakneck speed.

## log
- 2026-03-16: Initial build. Top-down scrolling sky racer. Sleek jet with engine glow and trail. Rainbow rings: 6-layer HSL gradient ellipses with glow, perspective squash. Storm clouds: multi-ellipse puffy dark shapes with angry eyes and frown, occasional internal lightning flash. Lightning bolts: 6-segment zigzag with bright core and purple glow. Speed increases over time (4→12), +0.3 per ring hit. Combo system: consecutive rings multiply score (x2-x5), combo display with 90-frame timer. Ring burst particles on collection (12 per ring, rainbow colored). Crash penalty: -50 score, speed drop, 60-frame invincibility flash, smoke particles, screen shake. Score: 100*combo per ring + 1 per 6 frames distance. Speed bar at bottom (gradient green→yellow→red). Speed lines at high velocity. Scrolling starfield background. Cycling sky gradient hue. Mobile: touch L/R buttons + swipe. Desktop: arrows/WASD. 5 Web Audio SFX: ring chime arpeggio, combo higher arpeggio, crash noise burst, boost sawtooth sweep. Orbitron + Share Tech Mono typography.

## issues
- None yet

## todos
- Boss storm that fills screen with lightning patterns
- Collectible speed boosts (rocket pickups)
- Leaderboard with Supabase
- Barrel roll dodge (double-tap direction)

## notes
- No database — pure frontend
- Speed: baseSpeed 4, increases +0.002/frame, +0.3 per ring, max 12, -2 on crash
- Ring spawn: every max(15, 50-speed*2) frames
- Cloud spawn: every max(20, 70-speed*3) frames
- Lightning spawn: every 200 frames when speed>6
- Ring collision: hypot(player, ring center) < radius+15 and |dy|<30
- Cloud collision: AABB with player ±12px
- Combo: resets to 0 when comboTimer hits 0 (90 frames), multiplier capped at 5
- Invincibility: 60 frames after crash, player flashes every 4 frames
- Jet trail: two triangles behind player, alpha 0.15/0.08
- Sky gradient: slowly cycling HSL hue via sin waves
- No game over — arcade penalty system for accessibility
