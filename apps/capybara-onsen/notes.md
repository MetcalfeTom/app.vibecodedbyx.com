# capybara-onsen

## log
- 2026-05-07: shipped — zen capybara hot-spring simulator. Drag oranges from a wicker basket onto floating capybara heads, balance the spring's water temperature, accumulate calm.
  - **Stage**: peach-and-dusk gradient sky with a soft pink moon halo, layered mountain silhouette, 4 bamboo poles flanking the spring, falling snow (70 drops with horizontal sway) plus continuous wisps of steam rising from the water. Wooden deck rim drawn as nested ellipses (dark wood outer, lighter wood inner). The spring water itself is a coral radial gradient with concentric ripples emanating off-center.
  - **4 capybaras** floating in the spring with independent drift phases: each bobs vertically on a 1.4 Hz cycle, drifts ±22px horizontally on a slow sin wave (0.18–0.40 rad/s), faces ± alternating, and has its own happiness 0–100. Body + head drawn procedurally — round body half-submerged, **flat-topped rounded-rect head** (the platter for stacking), tiny ear blobs, eyes that flip between **open dot** (cold/hot) → **brief blink** → **closed-arc smile** (blissful), small dark nose. A green aura ring pulses around contented capybaras.
  - **Orange-stacking mechanic**: drag an orange from the wicker basket on the right edge of the screen onto a capy's head. The orange snaps to the next stack-slot with a small lateral wobble = your drop-precision offset. Cumulative offset across the stack > 85% of head half-width → **topple** triggers (300ms grace), all oranges become physical debris that tumble off and splash into the water. Drops within 6px of dead-center earn an 8-point calm bonus + a music note.
  - **Orange render**: 18px radial-gradient circle with peel-dimples, a tiny green leaf + stem, and a specular highlight. 6 palette variants per orange.
  - **Pickable stack tops**: pointer-down on the topmost orange of a stack lifts it back into the basket as the held orange — lets you re-balance an off-kilter stack without forcing a topple.
  - **Water temperature** drifts toward room temp (70°) at 4%/sec via lerp. Two pill buttons:
    - **🔥 Add log** raises by +8°, plays a triple-square wood-crack synth, spawns 14 steam wisps from the spring center.
    - **❄ Add ice** drops by −6°, plays a two-note triangle sparkle, spawns 10 fresh blue snowflakes.
  - **Sweet spot 95–105°**: visualised as a green band overlay on the temperature bar with the player's current-temp tick that slides in real time. Bar gradient itself runs cool-blue → green → yellow → red so the visual mapping is intuitive.
  - **Capybara happiness model**: in sweet spot → +4/sec; far outside (more than 5° from sweet spot) → −5/sec; near-sweet → eases toward 60. Above 75 = blissful (closed-arc eyes + green pulse aura + occasional ♪ note rising). Above 78 = music notes spawn every 3s. Temp above 123° (sweet+18) randomly shakes oranges off (heat distress).
  - **Calm score**: in sweet spot, calm += `4 + happy_count × 2.5` per second × `(1 + total_oranges × 0.12)`. Persists best in `localStorage['capybara-onsen-best']`.
  - **Basket**: 12-cap, refills +1 every 4.5s passively. Drawn as a wicker basket with horizontal/vertical weave lines + rim, with up to 3 oranges peeking out + a `× N` count badge.
  - **Audio (Web Audio synth)**: gentle 380 Hz lowpass noise loop as ambient bubble (starts on first interaction, 0.018 gain), 420–780 Hz sine-drop plop on each successful stack, triple-square wood crack on log, two-note triangle sparkle on ice, sine-thud tumble on debris splash. All-synth, no samples.
  - **HUD**: top-left calm counter (italic Cormorant Garamond, color flips to red over high temp delta), top-center bilingual brand "温 泉 · 蛙 鼠 · onsen · capybara · stack oranges" with Noto Serif JP for the kanji, top-right best-score. Bottom row: basket panel + temp panel (with bar + readout + sweet-spot label) + capybara status panel ("N blissful").
  - **Aesthetic**: peach `#f7d6c2` sky, coral `#f0a4b0` water, capy brown `#a07658` with light-tan highlight, orange palette of 6 hues, gold rule. Cormorant Garamond italic for body text + numerals + button labels, IBM Plex Mono for HUD chrome (0.16em–0.32em tracked), Noto Serif JP for the kanji line. Buttons are rounded pills with a 2px drop shadow that feels like wood.
  - **Accessibility**: rem units, semantic `<canvas role="application">` with full mechanic aria-label, role="status" + aria-live on the calm counter, focus-visible orange outlines, ≥2.4–2.6rem button heights, skip link, `prefers-reduced-motion` no-ops the button transitions.

## issues
- Stacks are tracked array-by-index rather than by full physics — toppling is a "drop everything when cumulative offset > threshold" rule rather than a per-orange center-of-mass simulation. Looks great but won't produce mid-stack failures.
- The wicker basket is a fixed right-edge region, not itself a draggable physics body. Could become a tiltable basket later.
- Capybaras don't physically jostle each other when they bob into the same x-range; they pass through. A soft repulsion would feel more onsen-y.
- Audio rain ambient is only the bubble loop; could add wood-deck creaks and birdsong for layered atmosphere.

## todos
- A "perfect tower" achievement when one capy holds 5+ oranges all within ±4px center.
- Seasons: spring (cherry blossoms), summer (fireflies), autumn (maple leaves), winter (current). Cycle on a slider.
- A second basket of yuzu (yellow) with a different scoring weight.
- Occasional 5th cameo guest (a duck, a crab) that toddles across the deck.
- Pollinations-backed haiku appearing once per minute of zen accrued, displayed in a small floating card.
