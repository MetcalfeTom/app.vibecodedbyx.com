# curse-of-winning

## log
- 2026-06-01: initial build. Single-page web game where every action the player picks (12 self-destructive choices like "Quit your job in a fiery email", "Eat the gas-station sushi", "Burn the family bakery for the insurance") triggers a CATASTROPHICALLY successful outcome. Newspaper-style headlines, distressed-paper aesthetic.
  - **Action deck**: 12 actions × 2-3 outcomes each = ~30 possible headlines. Each outcome ships a {paper, title, sub, rewards} payload that pushes a flash-animated newspaper card into the feed.
  - **4 stats**: Wealth (gold), Fame (★ blood-red), Power (♛ violet), Despair (☾ moss). Despair is the "only friend" but accrues slowly.
  - **Curse thresholds**: any of wealth≥$20M / fame≥35 / power≥20 / despair≥30 triggers the end overlay. Plus a 10-stage era system that escalates ANY game to cosmic extinction even if no individual stat caps.
  - **ESCALATION ERAS** (`currentEraIdx` derives from log-scaled wealth + fame + power×1.4 + despair×0.6): Mild Inconvenience → Local Embarrassment → Regional Tremor → National Spectacle → Global Phenomenon → Continental Cataclysm → **Planetary Domination (trophy breaks the floor)** → Solar Disturbance → Galactic Annexation → Cosmic Extinction. Era-shift events push a meta-headline + flash the era banner with the era's accent color.
  - **The trophy gag**: era 7 (Planetary Domination) headline reads "A trophy arrives. It is so heavy the floor of your apartment cracks open. You fall through three stories. You land on the trophy. It is comfortable. Earth officially declares you Owner."
  - **End overlay**: ends with epitaphs per trigger reason; cosmic-extinction reads "The trophy was so heavy it broke the floor, then the planet, then causality itself. The universe folds neatly into a small velvet box bearing your name."
  - **Aesthetic**: aged-newspaper masthead with `IM Fell English` italic title, `Special Elite` typewriter labels, `Cormorant Garamond` body. Paper-grain repeating-linear bg, coffee-stain radial decorations, distressed action cards with 2-layer offset block shadows. Era banner switches accent color per era (gold → amber → magenta → indigo → black).
  - **A11y**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<button type=button>`/`<ul>`), `role=status aria-live` on ledger + era + feed + overlay, `role=dialog aria-modal` on end overlay, focus-visible gold outline, 2.75rem touch targets, `prefers-reduced-motion` kills all animation. Single self-contained ~22KB HTML, zero deps.

## issues
- 12 actions × 2-3 outcomes = limited replay variety. Could grow the deck or randomize stats per outcome.
- No audio (yet). A short "victory fanfare → muffled sigh" SFX per headline would underline the joke.

## todos
- Add more actions (e.g., "Push a stranger off a cliff", "Sell your soul", "Steal a vehicle")
- Web Audio synth fanfare on each outcome (8-bit ascending arpeggio → sad descending sine)
- Per-era visual tint (sepia → red → violet → black) on the whole page
- Achievements: "First Catastrophe", "Cosmic Extinction", "All 12 Actions Taken"
- Optional leaderboard tracking who reached cosmic extinction fastest
