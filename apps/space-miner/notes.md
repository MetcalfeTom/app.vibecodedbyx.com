# Space Miner

Pilot a mining ship to harvest glowing asteroids and sell ore.

## log
- 2026-03-19: Initial build. Top-down space mining game. WASD/arrows to fly, touch to steer. 6 ore types (Iron, Gold, Crystal, Plasma, Void, Nova) with increasing rarity and value. Fly near asteroids to auto-mine with laser beam, ore goes into 8-slot cargo hold. Return to deposit zone at origin to sell for credits. Asteroids have procedural polygon shapes with glowing ore veins, HP bars when damaged, destruction particle bursts. Ship has 3 HP, collision bounce, shield invulnerability frames. Waves spawn more and rarer asteroids. Minimap with asteroid/deposit tracking. Parallax starfield. Chakra Petch + Share Tech Mono typography, cyan-on-dark space aesthetic.

## issues
- None yet

## todos
- Ship upgrades (cargo size, mining speed, HP, speed)
- Different asteroid hazards (explosive, moving fast)
- Leaderboard
- Sound effects

## notes
- No database — pure frontend
- Camera follows ship with lerp
- Asteroids drift back toward player if too far (>600px)
- Mining is proximity-based (90px range), auto-targets nearest
- Ore rarity weighted: Iron 40%, Gold 25%, Crystal 18%, Plasma 10%, Void 5%, Nova 2%
- Higher waves bias toward rarer ores
