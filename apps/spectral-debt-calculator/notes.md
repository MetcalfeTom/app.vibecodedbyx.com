# spectral-debt-calculator

## log
- 2026-05-10: shipped (chat ask: "build an app called spectral-debt-calculator with a gothic neon aesthetic"). Functional amortization calculator dressed in a haunted-cathedral palette.
  - **Math**: real amortization. `M = P · r · (1+r)^n / ((1+r)^n − 1)` where r = monthly rate, n = months. Two parallel computations:
    - **MORTAL** at the entered APR
    - **CURSED** at APR + Spectral Curse (slider-driven, 0–13%)
    The difference between cursed and mortal totals = the **SPECTRAL TITHE** (the extra interest extracted by the curse). Gives the player an immediate read on how much the curse layer is costing.
  - **Inputs**:
    - **Principal** (₣ florins) — number input, default 12,000
    - **Mortal APR** (% / yr) — default 6.5
    - **Term** (moons / months) — default 60
    - **Spectral Curse** (% added to APR) — gradient slider 0→13 with magenta/cyan thumb glow
  - **Outputs** (5 stained-glass cards):
    - Monthly Toll · the cursed monthly payment
    - Total Paid · over the full term
    - Mortal Interest · what the conventional usury would extract
    - Spectral Tithe · the extra siphoned by the curse
    - Effective Cursed APR (full-width banner) · APR + curse
  - **Chart** (canvas, 16:7): balance-over-time visualization with three layers — a dark blood-red gradient FILL between the mortal-balance and cursed-balance curves (the spectral tithe area), a glowing magenta cursed-balance line, a glowing cyan mortal-balance line. Sparse JetBrains Mono axis labels at the corners. Each line has a shadowBlur halo for stained-glass glow.
  - **Amortization Wraith Roster**: condensed schedule — first 6 + last 6 moons with a dashed `··· N moons unaccounted ···` divider in between. Columns: Moon · Toll · Mortal Interest · Curse Slice (in blood red) · Balance.
  - **Aesthetic**: deep purple/black background (`#0a0414` → `#04020a`) with three radial accents (magenta NW, cyan SE, violet center) and a candle-drift `body::before` overlay (gold glow at 30%/70%, animated 7s ease-in-out alternate translate). Title in **UnifrakturCook** with neon magenta + cyan + violet glow drop-shadow. Subhead in **Cinzel** small-caps. Body in **Cormorant Garamond** italic. Numbers in **JetBrains Mono**. Number readouts (Monthly Toll etc.) in big UnifrakturCook for the wax-seal feel.
  - **Real-time recompute**: every input fires `compute()` on `input` events — no submit button needed.
  - **Currency**: ₣ florin glyph throughout (gives the gothic-trade-medieval flavor without overcommitting to a real currency).
  - **Accessibility**: rem units throughout, semantic main/header/section, `aria-labelledby` on all panels, `aria-label` on the canvas chart, focus-visible ring on inputs (magenta glow), 2.75rem min interactive targets, prefers-reduced-motion zeroes the candle-drift animation.

## issues
- The spectral tithe is real arithmetic but the framing ("cannot be paid down", "extracted by the unseen") is pure flavor — the slider just adds % to the APR. Anyone reading the math will see through this immediately. Acceptable for the bit.
- No currency formatter beyond `Intl.NumberFormat` US locale — large amounts (>$100k) work fine but the ₣ unit is fixed.
- The chart's blood-red tithe fill assumes cursed-balance >= mortal-balance, which is always true when curse > 0. Slider at 0 collapses the fill to a thin line — visually uneventful.
- No save/share — values reset on reload.
- Mobile cards stack but the chart at 16:7 gets thin on tall narrow phones. Could go to 4:3 under a breakpoint.

## todos
- "Pay early" mode: extra principal payment per moon, recompute schedule.
- Multiple debts at once (a small "ledger of binds") summed into a household-level forecast.
- Currency selector: ₣ florin / $ dollar / € euro / ☩ shilling (gothic-themed).
- Export amortization to CSV.
- "Curse rituals" preset buttons: "MORTGAGE BANSHEE", "CREDIT CARD WRAITH", "STUDENT LOAN HAUNT" each with thematic defaults.
- Localstorage to persist the most recent inputs.
- A printable parchment-style summary view.

## design-notes
The trick was making real amortization math feel gothic without obscuring it. The fix was the dual-computation: cursed vs mortal. That gives a meaningful number (the spectral tithe) that's honest math (it really IS the extra interest you'd pay at the higher rate), but the framing makes it feel like a separate cost imposed by something else. Players can play with the curse slider and watch a literal red shadow grow on the chart.

UnifrakturCook for the title + cards' big numbers gives the immediate gothic register without making body copy unreadable (Cormorant Garamond italic does the heavy lifting for explanatory text). The neon palette (magenta + cyan + violet on near-black) keeps it from sliding into pure horror — it reads "cyber-gothic / cathedral" rather than "creepypasta."

Currency unit ₣ (florin) is a conscious choice — it lets the calculator feel timeless / non-USD without picking a real currency the player might dispute. "Moons" for months is the same trick.
