# Loot Drop

Borderlands-style loot generator with rarity beams and randomized weapon stats.

## log
- 2026-03-18: Initial build. 7 rarity tiers (Common through GLITCHED) with weighted RNG. 7 weapon types with base stats. 8 manufacturers with name prefixes. 6 elemental types. Rarity beams shoot upward with particle effects — wider and longer for rarer drops. Legendary+ weapons get unique names from a curated pool. Stat card with damage/fire rate/accuracy/mag/reload bars. Flavor text pool. 12-slot inventory bar at bottom with click to re-inspect. Spacebar shortcut. Teko + Share Tech Mono typography, dark Borderlands-inspired aesthetic.

## issues
- None yet

## todos
- Sound effects (chest open, beam, legendary fanfare)
- Weapon silhouette art in card
- Share button for rare drops
- Drop statistics tracker
- Leaderboard for rarest finds

## notes
- No database — pure frontend
- Rarity weights: Common 35, Uncommon 28, Rare 18, Epic 10, Legendary 6, Pearlescent 2.5, GLITCHED 0.5
- Beam width scales with rarity (0 for common, 80 for GLITCHED)
- Stat bars use color coding per stat type
- Inventory limited to last 12 drops
