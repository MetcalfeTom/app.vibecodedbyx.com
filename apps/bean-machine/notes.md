# bean-machine (Bean Machine — how much coffee, exactly)

## log
- 2026-08-14: v1 per chat ("calculate coffee beans for volume, support grams/pounds/ounces, adjustable 30g per 500ml ratio, clear accessible interface, verify thoroughly"). Single file, Young Serif + Inclusive Sans, crema/espresso warmth.
  - **Core math**: beans_g = volume_ml × ratio/500; inputs ml / liters / cups(240) / fl oz(29.5735); outputs g (headline) + oz(÷28.3495) + lb(÷453.592) + ≈scoops(10g standard, footnoted); the math line shows the whole computation openly incl. ml conversion.
  - **Adjustable ratio**: 15–60 g/500ml slider (0.5 steps), live strength words (delicate→classic→bold→jet fuel), reset-to-30 link, aria-valuetext narrated.
  - **Presets**: cup/big mug/V60/french press/carafe set ml directly.
  - **Honest edges**: negative/NaN → alert + em-dash results ("the beans insist"); zero → "hydration is also valid"; 100L input cap.
  - **Persistence**: ratio + unit only (bean-machine-v1) — footer states that's ALL that's stored anywhere.
  - **A11y**: labeled inputs, ≥3 aria-live regions, big touch targets (3.2rem inputs), focus-visible, reduced-motion, rem.
  - Verified 18+1/19 (the one red was the probe returning a truthy string instead of boolean — label exists): default 30, L/cup/floz conversions exact, ratio math at 40 & 36, oz/lb display rounding (2.12 oz / 0.132 lb for 60g), 6.0 scoops, open math line, presets, strength words at 4 thresholds + live update, reset, invalid + zero handling, persistence round-trip, valuetext.

## issues
- Cup = 240ml (US customary); metric-cup folks (250ml) may quibble — footnote candidate.
- Scoop = 10g is stated; real scoops vary wildly (footer jokes about it).

## todos
- Ratio presets per brew method (espresso 1:2 is a different UNIVERSE — would need its own mode, don't conflate).
- "How many cups does my bag make?" inverse mode.
