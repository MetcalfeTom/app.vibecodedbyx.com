# tab-splitter

## log
- 2026-05-09: shipped — receipt-aesthetic bill splitter with three split modes + EU/US tipping toggle. Chat asks bundled: "create a bill splitting calculator app that handles tax and tip for groups" + "add a toggle for European vs US tipping styles, it would be a lifesaver."
  - **Three split modes**:
    1. **Even** — `total / partySize`. Simplest path; the per-person field stays prominent.
    2. **Per item** — add items with a name + price; tap a person's chip to add them as a sharer of that item. Tax + tip are distributed PROPORTIONALLY to each person's pre-tax share (so the salad guy doesn't subsidize the steak guy's tip). Items with zero sharers are flagged + split evenly across the table.
    3. **Weighted** — per-person 0–3× slider for "I had way more than them" cases. Weights are normalized so they always sum to the full bill (a 2× + 1× + 1× table makes the heavy eater pay 50%).
  - **EU vs US tipping toggle** — preset pill row + cultural note swap based on region:
    - **🇺🇸 US**: pills at 0/15/18/20/22/25%, default 20%, note "18-22% on the pre-tax subtotal is standard for full service. Round-up rarely shows on the receipt."
    - **🇪🇺 European**: pills at 0/5/7/10/12/15%, default 5%, note "service charge is often already included. A small 5-10% on top is generous; tipping is appreciated, not expected."
    - Active toggle SNAPS tipPct to the regional default (so a user landing on EU after a US session doesn't accidentally tip 20% on a Roman lunch). Page reload preserves the persisted tipPct as-is.
  - **Round-up tip helpers** — "↑ round to nearest $5" / "$10" buttons (currency-symbol matches the active selection). Computes the tip% needed to make the total a clean multiple of 5 or 10, applies it. Useful for "make this a clean €40 bill" cases.
  - **8 currencies**: USD / EUR / GBP / JPY / ILS / KRW / CAD / AUD. Yen + Won render with no decimals (per their typical denomination).
  - **Per-person breakdown** below the totals: each diner gets a card with `#N` tag, editable name, and the food + tax + tip subtotals. Names persist to localStorage. In items mode, each card shows their actual food share, tax share, and tip share separately. In weighted mode, each card shows their `share %` and `weight ×`.
  - **Copy as text** button — produces a plain-text receipt suitable for pasting into a group chat: header line with date, dashed rule, subtotal/tax/tip/total, dashed rule, per-person line. Falls back to `window.prompt` on browsers without `navigator.clipboard`.
  - **localStorage persistence** under `tab-splitter-v1` — saves party size, subtotals, tax %, tip %, currency, mode, region, all people (names + weights), and all items (names + prices + sharers). Re-opening the app restores the entire state.
  - **Aesthetic**: vintage receipt paper. Cream `#f5e9d4` background with multiply-blended diagonal-fiber grain. Receipt-card with perforated top + bottom edges (CSS radial-gradient mask trick) + soft drop shadow. VT323 monospace for the title + values; Special Elite typewriter for labels; Cormorant Garamond italic for the brand tagline; JetBrains Mono for tiny meta lines. Big numbers in muted gold + rust ink so the per-person field reads instantly.
  - **Accessibility**: `dir=auto`, `lang=en`, semantic `<main>` / `<header>` / `<section>`, `<button type=button>`, real `<input type=number inputmode=decimal>` for numerics so mobile gets the right keypad, `aria-pressed` on every toggle (region, mode, tip-quick chips), `aria-live="polite"` on the breakdown so screen readers announce the per-person amount when totals change, `:focus-visible` outlines (gold), 2.75rem (44px) min interactive targets, skip link at top, `prefers-reduced-motion` removes the toast transition.
  - **Math**: every dollar amount runs through `Math.round(n * 100) / 100` to avoid float-drift artifacts (e.g., `0.1 + 0.2 = 0.30000000000000004` lined up in a per-person column).

## issues
- The Round-Up button label "↑ round to nearest $5" carries the active currency symbol but `$5` reads naturally for USD. For non-USD users the button reads "↑ round to nearest €5" — slightly redundant since the currency was just selected, but at least it's accurate.
- Items mode doesn't currently persist a "shared by HALF" option — it's always equal-split among the assigned chips. A real "I'll cover 30% of the steak" weighting would need a per-item-per-person slider matrix; for v1 the on/off chip is plenty.
- Currency symbol in the round-up button label uses `state.currency`. For multi-character codes like `C$` / `A$` the label reads "↑ round to nearest C$5" which works but is a touch ugly.
- No tax-included flag — some receipts already have tax in the line price (typical EU). Could add a "subtotal includes tax" toggle that backs the tax out before calculating tip.

## todos
- "Tax-included" toggle for EU receipts where line prices include VAT.
- Per-item-per-person weighting matrix (e.g., "Alice ate 60% of the pizza, Bob ate 40%").
- Save & name "groups" so a recurring set of friends keeps their names + default weights between visits.
- Cross-currency conversion via a tiny embedded rates JSON (snapshot, not live) for travelers.
- Print-friendly stylesheet so the receipt prints clean on actual receipt-printer paper if you have one.
- "Cash vs card" split — venmo this person, the rest pays cash.
