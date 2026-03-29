# Space Pizza

## log
- 2026-03-29: V1 — Space pizza delivery game. Fly a ship with WASD/arrows through open space, collect floating pizza emojis, deliver to planets with demand indicators. 6 named planets (Mozzarella Prime, Pepperoni VII, etc.) with colored glow, optional rings, and timed pizza demands. 25 jagged asteroids with physics. 3 alien saucers that chase/strafe. Boost system (shift/button, drains bar). Ship trail, engine glow. Minimap with planet/ship dots. Arrow indicator pointing to nearest demanding planet. Score popups, delivery particles. Collision drops pizzas, 3 lives, invulnerability frames. WebAudio SFX. Mobile dpad + boost button. Bungee Shade + Share Tech Mono typography, orange neon space aesthetic.

## features
- Open-world 2D space (4000x4000 area, wraps)
- WASD/arrow movement with momentum and friction
- Boost (shift key / touch button) — drains boost bar, recharges
- Collect floating pizza emojis (max carry 3)
- 6 unique planets with names, colors, optional rings
- Planets generate timed pizza demands (1-3 pizzas)
- Deliver pizzas to demanding planets for score (50pts each + urgency bonus)
- 25 jagged asteroids with drift and rotation
- 3 alien saucers that chase and strafe
- Collision = lose life + drop a pizza
- 3 lives with invulnerability frames (flashing)
- Ship trail, engine glow, cockpit detail
- Minimap showing planets (yellow if demanding) and ship
- Arrow indicator to nearest demand planet
- Boost bar at bottom-left
- Score popups on delivery
- WebAudio SFX (pickup, deliver, hit, boost)
- Mobile dpad + boost button
- Local best score in localStorage

## issues
- None currently

## todos
- Alien projectiles
- Pizza types with different values
- Ship upgrades (speed, carry capacity)
- Warp zones between distant areas
- Leaderboard
- Combo system for fast consecutive deliveries

## notes
- World radius: 2000px (wraps at edges)
- Ship accel: 0.18, friction: 0.985, max: 5 (8 boosted)
- Planet demand timer: 900 frames, decreases with deliveries (min 300)
- Aliens: chase if >150px away, strafe if closer, max speed 1.5
- Asteroid jagged shape: 6-10 random radii multipliers (0.6-1.0)
- Camera follows ship, stars at 0.3x parallax
