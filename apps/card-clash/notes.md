# Card Clash

## log
- 2026-03-29: V1 — Single-player card battle game vs AI opponent. 15 card types across 4 categories (Attack, Defense, Magic, Utility). HP/mana/shield/burn/curse mechanics. AI uses budget-based decision making. Hard mode (enemy 40HP, 4 max mana, bonus actions). localStorage stats persistence. Cinzel + Fira Code typography, dark purple battle aesthetic.
- 2026-03-29: V2 — Fixed max ability costs (all capped at 3 MP), added auto-end turn to prevent soft-locks, added visual shield bars (cyan, animated show/hide), rewrote AI to use full 15-card pool with smart priorities. Added WebAudio SFX with noise+filter sweeps for organic crunch (card play, damage, shield, heal, spell, win, lose). Added burn/curse status tags, turn counter, deck count, HP flash on damage.
- 2026-03-29: V3 — Viewport-filling flexbox layout (no scrolling), vmin+vh root font-size with all-rem units for true 4K scaling. Log moved to bottom of screen.
- 2026-03-29: V4 — PVP multiplayer via Supabase Realtime Broadcast. Create/join rooms with 4-char codes (shareable via URL hash). State snapshot sync on card plays and end turns. Host goes first, cards disabled when waiting for opponent.

## features
- 15 cards: Slash, Heavy Strike, Pierce, Double Cut, Critical, Life Drain, Block, Fortress, Thorns, Regenerate, Fireball, Frost, Lightning, Potion, Curse
- Mana system: 3 max (4 in hard), +1 per turn
- Shield: absorbs damage, decays 50% on your end turn, visual cyan bar
- Status effects: burn (dmg/turn), curse (+2 damage on next hit), visual pulsing tags
- AI opponent with full card pool and smart priorities (heal when low, aggro when player weak)
- Hard mode toggle with stronger enemy
- PVP multiplayer: room codes, URL hash sharing, Supabase Realtime Broadcast
- Win/loss stats, damage/healing totals, best streak in localStorage
- WebAudio SFX with noise bursts and bandpass filter sweeps
- Full viewport layout, rem-based scaling for mobile through 4K

## issues
- PVP: if one player disconnects, the other is stuck waiting (no timeout yet)
- PVP: no reconnection support — refresh loses the game

## todos
- PVP disconnect detection and timeout
- Card animations and attack effects
- More card types (poison, stun, counter)
- Deck building / card unlocks
- PVP rematch button

## notes
- PVP uses Supabase Realtime Broadcast (no tables) — channel name: card-clash-{CODE}
- State sync: active player broadcasts state snapshot after each card play, receiver mirrors (self↔enemy)
- Root font-size: calc(0.55vmin + 0.55vh + 2px) — scales from ~10px mobile to ~28px 4K
- AI logic: shuffles full card pool, priority passes for heal/aggro, fills budget with random picks
- Shield decay: in PVP, only YOUR shield decays when YOU end turn (not opponent's)
