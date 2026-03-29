# Card Clash

## log
- 2026-03-29: V1 — Single-player card battle game vs AI opponent. 15 card types across 4 categories (Attack, Defense, Magic, Utility). HP/mana/shield/burn/curse mechanics. AI uses budget-based decision making. Hard mode (enemy 40HP, 4 max mana, bonus actions). localStorage stats persistence. Cormorant Garamond + JetBrains Mono typography, dark crimson/gold battle aesthetic.

## features
- 15 cards: Slash, Heavy Strike, Pierce, Double Cut, Critical, Life Drain, Block, Fortress, Thorns, Regenerate, Fireball, Frost, Lightning, Potion, Curse
- Mana system: 3 max (4 in hard), +1 per turn
- Shield: absorbs damage, decays 50% per turn
- Status effects: burn (2 dmg/turn for 3 turns), curse (+2 damage on next hit)
- AI opponent with weighted card selection based on HP/mana state
- Hard mode toggle with stronger enemy
- Win/loss stats, damage/healing totals, best streak in localStorage
- 20-card deck, draw 4 initially, draw 2/turn, max 7 hand

## issues
- None currently

## todos
- Multiplayer via Supabase Realtime (pseudo-websocket)
- Card animations and attack effects
- More card types (poison, stun, counter)
- Deck building / card unlocks
- Sound effects

## notes
- Websockets not available in sandbox — multiplayer would need Supabase Realtime broadcast
- AI logic: prefers heals when low HP, attacks when enemy low, uses mana cards when affordable
- Shield decay prevents stacking indefinitely
