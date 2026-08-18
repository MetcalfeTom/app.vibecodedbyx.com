# Watershed — notes

## log
- 2026-08-18 v1.0: deep watershed climate simulator. 24×12 paintable grid (forest/
  wetland/farm/city/bare, pointer-capture drag painting), water routed down each column
  to the river. Hydrology per day-tick: seasonal rain (120d sine) × MOISTURE-RECYCLING
  feedback (forest fraction ±, clamped 0.85–1.2) + deterministic seeded storm bursts +
  century-storm button (3d ×120mm); forest CANOPY INTERCEPTION (28% ≤13mm);
  PROPORTIONAL infiltration (runoff-coefficient style: forest .80 / wet .50 / farm .45 /
  bare .22 / city .06 × soil × saturation throttle) — THE big modeling lesson, see
  issues; wetland sponge (absorb 65% to 260mm store, 8%/d release) + 60% pollution
  filter; ET; percolation → groundwater (cap 60k) → baseflow 2.2%/d; EROSION feedback
  (hard runoff on farm/bare degrades soil→infiltration, forests slowly heal it);
  pollution by land type. Outputs: river strip breathing with Q + flood/drought tint,
  240-day hydrograph with flood/drought lines + grey BASELINE ghost overlay (mark
  button; experiments auto-mark), water-balance panel, flood/drought day counters.
  Narration: state-triggered explanation lines (flood-impervious, drought-baseflow,
  wetland-save, dirty-river, erosion-compounds; 60d dedupe). 4 experiments with printed
  hypotheses (pave/clearcut/rewet/reforest). Brush hydrology cards. Honesty card names
  SWAT/HEC-HMS (no links) — "trust the shapes, not the numbers". Faustina + Sometype
  Mono field-guide aesthetic. 19/19 deterministic probe (city peak >2× forest, forest
  baseflow-share >4× city, GW contrast, recycling, wetland cleans+buffers, erosion,
  century storm, painting/controls/experiments/narration) + screenshot review.

- 2026-08-18 v1.1: **visual clarity pass** (two chat requests merged: terrain/river/
  legend/cues + hierarchy/contrast/runoff-cues). Terrain: per-row brightness ramp
  (1.14−r·0.036, pixel-probed top-vs-bottom), dashed contours at 60/120/180m + ridge
  label, faint downhill chevrons. RUNOFF CUES: per-column S.colFlow recorded in stepDay;
  columns carrying >12mm draw translucent blue downhill streams, opacity ∝ flow.
  River: dark banks, animated flow dashes (offset from S.day — deterministic), banks
  flush tan→red-tint in flood, bold labeled. HTML legend (9 chips incl. eroded/
  waterlogged/runoff-streak explanations). Guided cues: first-run ①②③ steps overlay at
  day 0; experiments set a "👀 watch for" banner (#cue, expires after ~70 sim days,
  fade-day printed), running experiment button highlighted; century storm gets its own
  20-day cue. Hydrology untouched: 19/19 regression + 7/7 visuals probe (legend count,
  pixel terrain ramp, colFlow tracking, cue show/expire/storm, running highlight)
  + screenshot review + boot probe after atomic deploy.

- 2026-08-18 v1.2: **four teaching upgrades** (from my audit, chat ordered all four).
  A) HYETOGRAPH: rain bars hang from the hydrograph top (textbook convention), 38px
  band with divider, Q-line remapped below; pixel-probed blue-dominant bar over a storm
  day. B) WATER-BUDGET BAR: stacked soaked/→GW/evaporated/runoff scaled to their sum
  (honest caption: ET draws on stored moisture → budget of flows), title tooltips,
  inline % labels ≥14% width; required tracking S.lastPerc (percolation) — additive
  only, hydrology untouched. C) GROUNDWATER GAUGE: 0–60k fill + "feeding the river
  N/day as baseflow →" line. D) COLORBLIND LETTERS: toggle overlays F/W/A/C/B per tile
  (fillText-count probed: +288 calls when on). 10/10 probe + 19/19 hydrology + 7/7
  visuals regressions + screenshot + boot probe after atomic deploy.

- 2026-08-18 v1.3: **illustrated landscape view** (chat: replace grid map, preserve
  hydrology/controls/accessibility/tests). Cell model + paint hit-testing UNCHANGED —
  only rendering: seamless ground (full CW×CH fills, per-tile deterministic jitter via
  th(i) integer hash — no Math.random, stable frame to frame), drawTileDeco() per land:
  forest 2-3 conifers+trunks, wetland pool+3 curved reeds, farm 3 furrows+wheat dot,
  city 2 hash-height buildings w/ lit windows, bare cracks+pebble; eroded tiles (<0.7
  soil) drop decoration for a single crack over browned base. Letters toggle moved to
  tile corner (bold, clear of decorations). Terrain ramp/contours/chevrons/runoff
  streams/moisture glints all preserved. ALL suites green: 19/19 + 7/7 + 10/10 — with
  one honest probe update: terrain-ramp pixel check became a 100×14 area average
  (decorations make single-pixel sampling unfair; documented). Loop-harness lesson:
  reusing one composed-probe filename across a for-loop of chromium launches raced —
  isolate per-suite files.

- 2026-08-18 v1.4: **illustrated rain** (chat: match the landscape style, preserve
  hydrology+tests). All driven by S.lastRain, all deterministic (positions from k+S.day
  hashes, no Math.random): intensity 0–1 from (rain−4)/60 → even grey-blue wash over
  the valley (uniform, so the terrain-ramp probe stays fair), 14–84 slanted round-cap
  droplets, up to 16 splash ellipses on the ground, and 2–6 puffy storm clouds along
  the ridge sky once rain passes 18mm, darkening with intensity. Visual-only; engine
  untouched. All three suites green on SEPARATE composed files (19/19 + 7/7 + 10/10)
  + century-storm screenshot + boot probe after atomic deploy.

- 2026-08-18 v1.5: **heron milestone + anti-flicker + purple fix + STORY MODE** (three
  chat requests, one deploy). **Heron**: every 120d season scores healthy-wetland if
  wetFrac≥8% AND cycle max turbidity<140 AND wetlands actually stored >60mm; three
  consecutive → subtle 13s heron glide (S-neck, slow wingbeat, drawn in canvas) +
  narration; prefers-reduced-motion gets narration only (no flight); counter resets so
  it recurs; probes: wet valley 360d → 1 flight, city valley → 0. **Anti-flicker**
  (chat-reported "vertical flashing"): runoff columns ease via colFlowVis (+6%/frame),
  rain/splash/cloud positions drift on continuous S.visT (frozen under reduced motion)
  instead of re-hashing 4×/s. **Purple river** (chat-reported): first fix (red translucent
  wash over blue) LITERALLY RECREATED the purple — caught by my own screenshot. Real
  fix: water NEVER changes hue; flooding = red rim lines at banks + flushed banks +
  white foam dashes + label; qVis easing kills the threshold flip-flicker; pixel probe
  asserts flooded body stays blue-dominant (b>r+30). **Story mode** "The Valley
  Journal": 6 chapters (Inheritance listen-season / The Offer 3 choices / Harvest
  Question / Restoration / century-storm Reckoning / Epilogue with lifetime stats +
  heron acknowledgment + restart); ST machine (choose→running→report), per-chapter
  metrics (maxQ/maxPol/flood delta) vs previous chapter, auto-pause at chapter end;
  engine and free-play experiments untouched. 17/17 story+heron+flicker probe + 2/2
  purple pixel probe + 19/19 + 7/7 + 10/10 regressions (55 total) + screenshots.

- 2026-08-18 v1.6: **top-level mode switch + chapter preview** (chat request). Prominent
  segmented switch under the masthead (STORY MODE / FREE PLAY, aria-pressed, big
  targets); modes toggle #story vs #experiments via [data-mode-hidden] display:none —
  elements stay in DOM so every existing probe still binds (.click() works on hidden
  elements). Chapter preview: 6 chips in the story card (locked grey / current green /
  done pale-green), painted by paintPreview() on every stRender + mode change. Story
  state persists across mode flips. Default = free play (sandbox-first, story one tap
  away). 9/9 switch probe + ALL FIVE suites green (19+7+10+17+2 = 64 checks total)
  + screenshot + boot probe after atomic deploy.

## issues
- **THE modeling lesson**: daily hard-capped infiltration (mm/day) made all land types
  converge under big storms (forest peak 13.6k vs city 17.5k — only 1.3×) because any
  storm >> capacity swamps the cap. Debug-printed real stats instead of guessing, then
  switched to PROPORTIONAL infiltration (classic runoff coefficients) with a saturation
  throttle — contrast became 3×, saturation-excess flooding still emerges in long wet
  spells. Also: peak/mean "flashiness" is a misleading metric when baseflow dominates
  the forest mean; baseflow-share is the honest claim ("forests fund dry-season rivers").
- stepDay() is fully deterministic (seeded storm schedule, no Math.random in core) —
  probes drive it directly; 4 ticks/s via rAF accumulator when playing.

## todos
- Possible: climate-change dial (hotter → more ET + heavier storm bursts); save/share maps.
