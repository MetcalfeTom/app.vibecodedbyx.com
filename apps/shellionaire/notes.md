# shellionaire (Shellionaire — turtle egg clicker)

## log
- 2026-08-07: v1 per chat (elijahelija1's idea: "turtle egg clicker, hatching random turtles that earn money every second"). Single file, no deps.
  - **Loop**: click the DOM egg button → cracks accumulate (SVG crack paths reveal at 25/55/82%) → at N cracks a random-rarity turtle hatches into the lagoon canvas and earns $/s forever. Buy the next egg (cost 15·1.35^n), clicks needed grow 10+2.2·hatched.
  - **Rarities**: common 60% $1/s · uncommon 25% $3/s · rare 10% $8/s · epic 4% $25/s · legendary 1% $100/s (gold + canvas sparkle + bigger fanfare). `rollRarity` is pure and boundary-tested (0/59.9/60/84.9/85/95/99/99.99).
  - **Upgrades**: heat lamp (auto +1 crack/s per level, 50·1.8^lv) · sea grass (+25% earnings per level, 120·2.1^lv — also visibly adds grass tufts to the lagoon).
  - **Lagoon canvas**: gradient water, sandbar, light shafts, swaying grass, bubbles; turtles are procedural (shell + pattern + 4 flapping flippers + head/tail/eyes), rarity-colored, wander with wall bounces; epic/rare draw larger.
  - **Persistence**: localStorage `shellionaire-v1`, save on 10s tick + beforeunload; offline earnings credited on load, capped 8h, with a welcome-back line.
  - **A11y**: rem-only, semantic sections, aria-live polite announcer (hatches/buys/offline gains), canvas role=img with live count label, egg is a real button, ≥2.75rem targets, focus-visible, prefers-reduced-motion stills the water/turtles/burst.
  - **Audio**: WebAudio only, gesture-created ctx; crunch noise per crack, arpeggio fanfare scaled by rarity, toggle persisted.
  - Verified: syntax + id cross-check both apps, 18/18 pure checks, headless-Chromium gameplay probe (hatch → HUD → buy egg/lamp/grass via real clicks) 0 errors.

## issues
- (none yet)

## todos
- Prestige ("release to the ocean" → permanent multiplier).
- Named turtle tooltips on canvas click/tap.
- Golden egg random event worth a burst of cash.
- Leaderboard via supabase if chat wants competition.
