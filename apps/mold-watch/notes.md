# Mold Watch — fridge mold timeline

## log
- 2026-08-18: v1.0 per chat ("safe fridge mold timeline with discard and clearly separated compost guidance, using educational, non-tasting safety language"). Single file, Grandstander + Atkinson Hyperlegible + Space Mono, fridge mint/white + earth-tone compost panel.
  - **Timeline**: 9 foods (berries/bread/soft cheese/hard cheese/leftovers/tomato/citrus/jam/deli meat), day slider 0–14, three stages (fresh/early/moldy) w/ per-food narration; canvas dish draws the food emoji + deterministic fuzzy mold spots (only ≥ visibleDay) + faint hyphae threads once anything's visible ("the roots you can't see").
  - **Discard guidance**: soft/moist foods = whole-item discard (8 of 9); hard cheese = the single trim exception per USDA FSIS "Molds on Food: Are They Dangerous?" (cited BY NAME, no links anywhere — probe asserts zero anchors). Jam myth-buster: scoop-the-top NOT endorsed, toxin diffusion explained. Early stage = "check by eye only". "When in doubt, throw it out."
  - **Non-tasting language**: absolute — "Eyes only. Never taste to check, and don't rely on sniffing." Probe runs a language audit banning sensory-checking verb phrases after stripping negated clauses (2 iterations: first audit flagged the noun "pests and smell"; second flagged my own prohibition sentence — negation-stripping fixed both).
  - **Clearly separated compost guidance**: distinct earth-toned <section> w/ its own heading + all-caps rule "DECIDED AFTER THE DISCARD DECISION · A WASTE QUESTION, NEVER A SAFETY QUESTION"; per-food home-bin verdicts (produce/bread/jam yes; dairy/meat/oily no — pests, not mold) + decomposers-are-the-job education.
  - Footer: educational prototype, not medical advice, typical ranges disclaimer.
  - Suite mw-probe 17/17.

## issues
- Timelines are deliberately "typical educational ranges" — footer says so; don't present as lab data.
- Language-audit lesson: prohibitions contain the banned phrases — strip negated clauses before scanning.

## todos
- "My fridge" mode: add your own items w/ purchase dates → live countdown badges
- Print-friendly one-page safety card
- 2026-08-18 (2): v1.1 — THE NEIGHBORS GAME per chat ("playful aging-nearby mini-game, safe educational verdicts, no tasting prompts").
  - 2×4 shelf, six foods, two empty slots (spacing IS the strategy — probed: spaced layout scores 23+ vs packed 18). Tap-a-chip-tap-a-slot placement (mobile-first, no drag needed); tapping a placed item picks it back up.
  - **Real science engine**: ethylene emitters (banana 2×, apple 2×, tomato 1×) boost sensitive neighbors' aging (+25%/emitter level); moldy items spore-drift +1.2/day to orthogonal neighbors (raised from 0.7 — integer-day math swallowed the weaker drift, caught by suite). Chips carry tags (emits⇈ / listens / spore-prone) + title tooltips with the why.
  - Run the week: 550ms/day animation (sync seam for probes), 🦠 badges on casualties, per-food verdicts reusing the SAFE language verbatim ("DISCARD the whole item, and never a taste check" / "eyes only") + neighbor-blame percentages. Score = fresh-days of 42, best persisted.
  - Whole-page language audit re-run WITH game text: still zero sensory-checking advice.
  - Suites: game-probe 16/16, core mw-probe 17/17 regression.
- 2026-08-18 (3): v1.2 — LEVEL 2: THE LEAKY PACKAGE (two chat requests merged: leak containment + removable shelves/guards/spores/sparkle).
  - **Prep**: raw chicken spawns on an upper shelf (3-spot cycle, never bottom — the USDA bottom-shelf-in-a-tray rule is the lesson, cited by name). Tools: move the meat (tap-tap), 2 absorbent pads (capacity 3, tap empty cells), 1 shelf guard (tap a food — deflects drips ONWARD, protection not absorption), and a dedicated 🧻 tray-under-meat toggle (capacity 5, costs a pad). TRAY UX LESSON: first design placed the tray by tapping the meat's own cell — impossible, that tap picks the meat up; the suite caught it, control extracted.
  - **Run**: 5 days, drips fall down the column: tray → pads (saturate) → guarded food (deflect) → food (☣ contaminate once, "bacteria are invisible — no look can clear it") → floor puddle.
  - **Cleanup**: ordered 5-step checklist (discard contaminated → bin pads → hot soapy wash → sanitize per label → 20-second hands), wrong taps shake + retry penalty. Then **removable shelf scrub**: lift the shelf out, 8 zones, corners need 2 passes, 2 hidden spores per round revealed only by washing ("you find them by washing, never by inspection") → ✨ SPOTLESS SHELF sparkle badge.
  - **Scoring**: bottom-shelf +20, absorbed ×10, contam −15, puddles −10, cleanup 30−3/retry, shelf +15, spores +5 each; grades A–D; best persisted.
  - **Calm bells**: sine-only through a 900Hz lowpass, peaks ≤0.05 — the suite's stub-AC audit asserts every voice sine and max gain ≤0.06, mute = zero nodes.
  - Suites: l2-probe 25/25, neighbors game 16/16, core 17/17 (58 checks).
