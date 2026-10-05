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
- v1.4 (2026-10-05 ~23:55 UTC): year slider 1945-2025, coupled to the radius (Tatum).
  - STOCK = rounded public all-country stockpile table (1945 ≈2 … 1986 ≈70k … 2025 ≈12.2k); YIELD = very rough era-average kt (20 in 1945, 30 in 1950, 300 in 1954, 1,500 in 1957, 1,000 in 1960, 600, 450, 350, 300, 250 in 1986, 220 in 1995, 200 today). Both log-interpolated per year; counts rounded to 3 significant figures, yields to 2.
  - applyYear(y) sets st.year, st.n, st.kt. Any count or size control sets st.year = 0 ('your own mix', the year fieldset dims). Default stays 0 (12,200 at 100 kt, the v1 look).
  - Sparkline of the stockpile above the slider (click or drag it to pick a year), marker at the year, '1986: 70,000' label. Play button steps a year every 160 ms + compute, from the current year (or 1945). A big year stamp sits in the map's lower-left sea corner.
  - Few dots: makeDots() searches the spiral size so exactly n land on land (1945 = 2 dots, drawn bigger); nearest() and underPlume() brute-force under 600 dots (the 1° grid search with an 8,600 km radius was 65k cell lookups per call).
  - Fixed an old aliasing bug: at ~2,500 dots the sample spiral matched the dot spiral, so every sample sat next to a dot (mean 44 km instead of 99). measure() now tilts the sample spiral by 0.61 rad.
  - Plume coverage now always uses the 10-point shape (the 6-point one under-counted, 21% vs 25% at 1 Mt).
  - Probe es2/py.js (#wind, #play): 1945 → 2 dots, 8,583 km apart; 1957 → 5,970 × 1.5 Mt, 62 km mean, ~16% under plumes; 1986 → 18 km mean.
- v1.5 (2026-10-06 ~00:10 UTC): phone polish. Under 46rem the settings section is display:contents, so its parts can interleave with the close-up: year + coverage lines (order 1), close-up (2), wind (3), count, size, Antarctica (4). Size chips are a 2×2 grid with 'flattens' and 'burns' on their own lines (.cv spans; the ' · ' .sep hides). Readout rows get a .9rem gap. World-map plume tint a bit stronger (.72, tails #94779f).
- Probe: hm/pes.js (#tsar). 12,200 → 43 km mean, 92 km farthest, 110 km gap. 70k → 17.5 km mean. Tsar Bomba → 17% flattened, 71% burnt.

## issues
- The world-atlas rings are spherical and cross the date line. unwrap() makes longitudes continuous, Antarctica closes through the pole, and every ring is drawn at -360/0/+360. Without this you get false land strips (an Arctic band and a Fiji line).
- Tiny islands can have no dot nearby, so the farthest figure uses the 99.5th percentile.

## todos
- Year slider: maybe split the yield by country era (US vs USSR), or show megatonnage as a second sparkline (a separate chart, never a second axis).
- A compass pointing to your nearest dot (the voice's idea).
- A dark theme.
