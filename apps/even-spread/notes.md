# Even Spread

Tatum's thought experiment (a sloppy.live viewer, asked 2026-10-04): what if every nuclear warhead were spread evenly over the land? How far away would the nearest one be? Keep it abstract: no real targets, rounded public figures only, and an educational tone.

## log
- v1 (2026-10-05, ~11:25 UTC):
  - An Equal Earth map (equal-area, so even dots look even).
  - Land mask: world-atlas land-110m (jsdelivr) drawn onto a hidden 1440x720 quarter-degree canvas.
  - Dots: a sunflower spiral over the sphere, with n / land share points, keeping the ones on land.
  - Count presets: deployed ≈3,900, all ≈12,200, and the 1986 peak ≈70,000, with a log slider from 100 to 70,000.
  - Size presets: Hiroshima 15 kt, typical modern 100 kt, 1 Mt, Tsar Bomba 50 Mt.
    - Blast (5 psi, houses flattened) = 1.69 km × (kt/15)^(1/3).
    - Burns = 1.9 km × (kt/15)^0.41.
  - Readout: the gap = √(land/n), plus the mean and 99.5th-percentile nearest distance measured from ~2,500 land sample spots, and your pin's distance.
  - Coverage per size, shown on each chip: exact (n·πr²/land) while rings can't overlap; measured from the sample spots once they can.
  - Antarctica toggle.
  - Close-up: about 3.2 gaps across, the land drawn from the mask, rings to scale, and a dashed line to your nearest dot.
- v1.1 (~11:30 UTC): the close-up is a slippy map (Tatum: hard to move around from the world map). Drag to pan (the pin is the centre), pinch, scroll wheel or +/- buttons to zoom (st.zoom multiplies the base view of 3.2 gaps), and arrow keys plus +/- when the canvas has focus. The world map redraws when the drag ends. Readout says '(at sea)' off land. Probe hm/pes2.js.
- v1.2 (~11:35 UTC): remembers your last choices (Tatum). localStorage 'even-spread-v1' holds {n, kt, ant, pin, zoom}. It's written 300 ms after each readout(), and recall() range-checks every field before start's rebuild. Probe hm/pes4.js sets the key and reloads; check the screenshot.
- v1.3 (2026-10-05 ~23:30 UTC): wind and fallout layer (Tatum). Toggle 'show where the fallout drifts' (st.wind), 'shuffle the weather' (st.wseed, 1-999, 0 = the usual winds) and 'back to the usual winds'.
  - belts(lat): trades blow toward 240° (NH) / 300° (SH), westerlies toward 60° / 120°, polar easterlies like the trades but weaker; smoothstep blends at 25-35° and 55-65° cancel out, so the horse latitudes and the polar front come out calm (short, wide plumes). Doldrums weaken the trades near the equator.
  - makeWeather(): 10 seeded waves over the unit sphere (5 turn the plume, ~55° std, 5 stretch it, ×e^±0.42) plus ±10° per-dot jitter, so neighbouring plumes turn together like weather systems.
  - Plume = teardrop, length plumeKm(kt) = 150 km × (kt/1000)^0.45 × wind factor (0.5-1.2), width a fifth of that ÷ √factor; starts 6% upwind. Very rough (ground burst, steady breeze), labelled so.
  - World map: plumeLayer() draws plumes opaque in batches of 120 onto an offscreen canvas and composites it at .62 alpha (union, no darkening). Thin plumes (<1.2 px wide) become true-length tails (LINE). Cached by key.
  - Coverage: plumeCover() paints the plumes onto a 1440×720 lon/lat canvas, area-weighted alpha over the land mask. Cached by key. underPlume(lon,lat) for 'under a plume' in the readout.
  - Close-up: gradient plumes (dark at the dot, fading downwind) under the rings, plus a wind arrow top-left.
  - Perf (headless, software): 12.2k ≈ 0.2 s per change; 70k at 1 Mt ≈ 0.6 s; 70k at 50 Mt ≈ 1.9 s. One big path for all plumes took 1-2 s at 12k — always batch.
  - Probe es2/pw.js (#shuffle, #big): 12.2k at 1 Mt ≈ 25% of the land under a plume, 100 kt ≈ 2.7%, 50 Mt with 3,900 ≈ 91%.
- Probe: hm/pes.js (#tsar). 12,200 → 43 km mean, 92 km farthest, 110 km gap. 70k → 17.5 km mean. Tsar Bomba → 17% flattened, 71% burnt.

## issues
- The world-atlas rings are spherical and cross the date line. unwrap() makes longitudes continuous, Antarctica closes through the pole, and every ring is drawn at -360/0/+360. Without this you get false land strips (an Arctic band and a Fiji line).
- Tiny islands can have no dot nearby, so the farthest figure uses the 99.5th percentile.

## todos
- Year slider 1945-2025 coupled to the yield (Tatum), table in the memory file.
- A compass pointing to your nearest dot (the voice's idea).
- A dark theme.
