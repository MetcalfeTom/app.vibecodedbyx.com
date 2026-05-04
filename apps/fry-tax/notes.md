# fry-tax

## log
- 2026-05-04: shipped — three chat asks merged into one ship.
  - **Calculator core (chat ask 1)**: girlfriend-tax model with base fries + your hunger + their hunger. Math: `rate = baseLevy(0.25) × hungerMul + justSurcharge + nuggetSurcharge + modSum`, where `hungerMul = clamp(0.6 + 0.6 × theirH/yourH, 0.4..2.4)` and `justSurcharge = justOneCount × 3%`. Clamped to 0..95%. Live recompute on every input.
  - **Nugget surcharge field (chat ask 2)**: new "NUGGETS IN ORDER" number input (0-99) and "HONEY MUSTARD QUALITY" 0-5 slider. Surcharge = `clamp(nuggets × 0.4% × hmMul, 0..30%)`, where `hmMul = 0.40 + (hmLevel/5) × 1.60` (range 0.40..2.00). No mustard nullifies the nugget tax; S-tier mustard doubles it. Receipt prints both lines (nugget surcharge + mustard multiplier sub-line).
  - **Ranch-dressing liability clause (chat ask 3)**: new toggle `RANCH DRESSING ON THE TABLE` (+9% rate) plus a fine-print `RANCH LIABILITY CLAUSE §3.A` panel that appears under the verdict when active: *"all fries within reach of the ranch ramekin are presumed shared. taxpayer waives right to contest fries that have made any ranch contact, however incidental. honey-mustard substitutions void this clause."* Verdict line prefers the ranch joke when invoked.
  - **5 other modifier toggles**: shared portion (+10%), recent argument rebate (-12%), anniversary surcharge (+18%), ketchup credit (-6%), no-order penalty (+22%). Active modifiers print as labelled receipt lines with sign-coloured percentages; inactive ones are skipped.
  - **Receipt output**: thermal-paper styled card with zig-zag mask top/bottom (radial-gradient mask trick), repeating fiber grain, ketchup + mustard ink stains, dashed-line dividers, monospace lines with tabular numerals, "PAID/TAXED/SEIZED/BUST" rotating stamp based on rate band, big VT323 effective-rate + "YOU EAT" total, fries-strip visualization (up to 200 yellow/dark fry pixels showing yours-vs-hers ratio), generated barcode with seed = round(rate × 1000) + base × 7 + justOne so it looks "calculated".
  - **Verdict generator**: 6 rate-bands × 3 lines each, plus 6 priority overrides (no fries, ranch, no honey mustard with nuggets, S-tier honey mustard with nuggets, no-order, fight, anniversary). Re-rolls per receipt update.
  - **Aesthetic**: red-checker tablecloth bg via 48px diagonal gradients. Cream paper panel with mustard + ink shadow stack. Bowlby One SC chunky title "FRY TAX" with mustard + ink layered shadow, KET in ketchup-red. Cormorant italic tagline. IBM Plex Mono body. VT323 numerals. Receipt "FRY TAX BUREAU · FORM 1040-FRY · #yymmdd-NNNN" header.
  - **Actions**: ↺ RESET restores defaults + reseeds the receipt ID; 📋 COPY RECEIPT writes the full receipt text to clipboard with a momentary "✓ COPIED" feedback.
  - **Accessibility**: rem units, 44px+ targets, semantic `<header>`/`<main>`/`<form>`/`<article>`, role="group" on toggles row, aria-live="polite" on receipt, sr-only labels for inputs, focus-visible outlines, prefers-reduced-motion kills hover transforms, skip link.

## issues
- The visual fries-strip caps at 200 pixels — for orders >200 it scales the taken count proportionally so the ratio remains accurate, but you don't see "every fry."
- Tax model is satirical; do not use for actual tax filing. Or do — see what happens.
- The receipt zig-zag mask works in evergreen browsers; older Safari may render the receipt as a clean rectangle (still readable, just no zig).

## todos
- "Drink theft" line item (sips taken from your soda).
- Save last-used inputs to localStorage so opening the app remembers your last calc.
- Share button → generate a tiny PNG of the receipt for posting.
- "Joint return" mode: split-tax for couples sharing one combo.
