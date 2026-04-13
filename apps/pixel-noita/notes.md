# Pixel Noita

Cast spells in a world where every pixel is simulated. Dig, burn, flood, and explode your way down.

## log
- 2026-04-13: Initial build. 320x240 pixel simulation with 12 element types (sand, stone, water, fire, lava, wood, oil, acid, steam, smoke, ember, empty). Full element interactions: water+lava=stone, fire spreads to wood/oil, acid dissolves solids, lava ignites flammables. Procedural cave terrain with sand surface, stone caves, underground pools, deep lava. Player with WASD movement, gravity, collision. 5 wand spells (Fireball, Water Bolt, Acid Shot, Dig Ray, Bomb). 3 enemy types (Slime, Bat, Worm) with chase AI. Environmental damage from fire/lava/acid. Mana regen, HP, depth meter, kill counter.

## features
- 12 element types with full interaction matrix
- Falling sand physics (sand, liquids, gases, fire spread)
- Water + lava = stone, acid dissolves, fire spreads
- Procedural cave generation with noise
- 5 wand spells with different effects
- 3 enemy types (slime chases, bat flies, worm digs)
- Player movement with gravity and collision
- Auto-cast on mouse hold
- Crosshair aiming
- Environmental damage
- Mana regeneration
- Touch support

## issues
- Performance may dip on mobile (320x240 pixel sim)
- Enemy pathfinding is basic
- Physics sweep order can cause minor asymmetries

## todos
- OG preview PNG
- More spell types (lightning, teleport, freeze)
- Equipment/wand drops from enemies
- Multiple levels/biomes
- Boss enemies
- Leaderboard (depth reached)
- Sound effects
