# Ship Hull Defense

## log
- 2026-01-07: Converted to pirate theme "Ship Hull Defense"
  - Purple body → Pirate ship with mast, sail, Jolly Roger
  - Metal armor plates → Wooden hull planks with iron bands
  - Paws → Iron cannonballs with smoke trails
  - CLANK! → SPLASH! DEFLECTED! ARRR!
  - Cyber grid → Animated ocean waves
  - Armor integrity → Hull integrity

## features
- Pirate ship in center with sail and flag
- Click to add wooden hull planks
- Cannonballs fly in from all directions with smoke trails
- Hull planks block cannonballs with satisfying effects
- SPLASH! DEFLECTED! ARRR! text popups
- Wood splinter particles on impact
- Screen shake feedback
- Hull integrity bar
- Cannonballs deflected counter

## interactions
- Click/tap: Add hull plank at that angle
- Planks form shield around ship
- More planks = better protection
- Getting hit reduces hull integrity

## design
- Ocean night background with animated waves
- Gold/brown pirate color palette
- Wooden plank textures with wood grain and nails
- Iron cannonballs with smoke trails
- Detailed pirate ship with sail, mast, crow's nest, Jolly Roger
- Pirata One / IM Fell English SC fonts

## mechanics
- Hull planks orbit around ship
- Cannonballs spawn faster as game progresses
- Direct hits to ship reduce hull level
- Blocked cannonballs add to counter

## technical
- Canvas 2D rendering
- Angle-based plank placement
- Collision detection for planks and ship body
- Particle system for wood splinters
- Smoke trail system for cannonballs
- Screen shake effect
- Animated ocean waves

## todos
- Add power-ups (anchor shield, kraken ally)
- Add different projectile types (flaming cannonballs)
- Add boss ships
- Add upgrade system for hull strength
