# Orbit Lab — notes

## log
- 2026-08-18 v1.0: Newton's-cannon orbital laboratory, shaped live by three chat
  messages (sandbox → mathematically precise lab → finish+deploy). Physics: true
  inverse-square, semi-implicit Euler substepped at h≤0.004s; nothing scripted —
  circles/ellipses/escape all emerge. Launch: tangential from mountaintop (r=90u,
  planet 64u), speed + GM sliders with v_circ/v_esc markers ON the slider track.
  Classification from real orbital elements: ε=v²/2−GM/r, h=x·vy−y·vx,
  e=√(1+2εh²/GM²) → SUBORBITAL (periapsis ≤ planet R) / ELLIPTICAL / NEAR-CIRCULAR
  (e<0.05) / ESCAPE (ε≥0). Gravity slider honestly RE-classifies satellites in flight.
  **Hypothesis logging**: arm crash/ellipse/near-circular/escape before firing → log
  hit/miss + running score; unarmed launches log as observation-only. **Equations
  panel**: a, v_circ, v_esc, ε, e evaluated live with units (u, s, u/s, u³/s²
  declared non-SI). **Honest uncertainty**: dt-vs-dt/2 predictor divergence shown as
  integration drift (∞ = "step size flips the outcome"); borderline() flags ε within
  2% of zero, e on the 0.05 threshold, periapsis within 3u of surface — surfaced in
  verdict + hypothesis log. Trails (700-pt), dashed prediction (crash-tinted), 8-sat
  cap, roster with e + fate, REAL vs SIMPLIFIED honest-physics card. Spectral +
  Azeret Mono chalkboard. 24/24 probe incl. simulation truths (v_circ launch holds
  r∈[86,94] over a full period; slow crashes; 44 u/s escapes past 2600u) + screenshot.

- 2026-08-18 v1.1: **Solar System Observatory** section (chat: "cited solar-system
  observatory with real planetary data, editable what-if parameters, clear source
  references"). 8 planets with NASA NSSDCA Planetary Fact Sheet values (a/e/T/v/M/R,
  rounded; cited BY NAME ONLY — no external links per house security rules, the
  citation says so). Orrery: log-compressed rings (ringR=42+95·log10(1+3a)), planets
  advancing at true Kepler rates (probe verified Mercury/Neptune angular ratio =
  T_nep/T_merc), oversized dots + on-canvas honesty labels. What-if editor: planet
  select (table rows click too), a′ input + Sun-mass slider → T′=√(a′³/M☉′),
  v′≈29.78·√(M/a) flagged as circular approximation; mint dashed ghost orbit + ghost
  planet at the what-if rate. Sources panel: DATA (NSSDCA/Williams) / MATH (Kepler III)
  / DRAWN-NOT-TRUE (scaling confession). Second IIFE, own seam __OB.
  22/22 probe (incl. table-vs-Kepler consistency within 2% and zero <a> tags in
  sources) + 24/24 lab regression + tall screenshot + boot probe after atomic deploy.

- 2026-08-18 v1.2: **deep-review pass** (chat: Moon, realistic rotation timing, richer
  options, cited controls). **Moon**: NSSDCA lunar elements (a=384,400 km, T=27.32 d
  sidereal, e=0.055, rot=655.7 h = tidally locked, probe asserts day≈month), indented
  table row after Earth, orrery ring around Earth's moving dot at dispR=16 (~40×
  exaggerated — confessed in sources AND on-canvas), real 27.32-d rhythm (probe:
  moonTheta/earthTheta = 365.25/27.32). What-if gains "Moon (of Earth)" with an ANCHOR
  SWITCH: same Kepler law, units become Moon-distances/Earth-masses/sidereal months
  ("same third law, different landlord"). **Rotation**: signed sidereal hours per planet,
  rotation tick drawn on each dot, retrograde (Venus, Uranus) spins backwards + red tick
  + ↺retro table flag; probe asserts Earth/Jupiter rot ratio = 23.9/9.9. **Richer
  options**: 5-step time-warp select (1 h/s → 1.2 yr/s, labeled by what each reveals),
  pause/resume, t=0 reset, labels toggle; canvas caption shows t (days under 0.2 yr),
  warp, PAUSED. **Cited controls**: warp row carries "ratios stay locked to NSSDCA
  sidereal values" tag; sources add ROTATION & MOON cite. 20/20 new probe + 24/24 lab
  + 22/22 observatory regressions (two stale probe indices updated for the Moon row —
  app logic verified correct by the new probe first) + tall screenshot + boot probe.

- 2026-08-18 v1.3: **playful experiments trio + chaos freedom + size what-ifs** (three
  chat messages in one pass). **Rewindable timeline**: refactored ALL observatory angles
  to exact analytic functions of O.years (syncAngles) → rewind button (dir ×−1) and a
  ±20yr timeline scrubber are DRIFT-FREE by construction; probe asserts path-independence
  to 1e-12. **Eclipse alignment**: eclipseState(t) detects 2D syzygies (Moon within
  0.06 rad of the Earth→Sun line = solar; anti = lunar), edge-triggered counters, beam
  on canvas, eclbar overlay, "jump to next alignment" via findNextAlignment scan;
  sources honestly note real eclipses need the 5.1° node crossings — pointed at Umbra
  for the real calendar. **Collision warnings**: laneConflicts (what-if a′ within 6% of
  a planet's lane) → rose ghost ring + COLLISION WATCH text citing orbit-clearing and
  name-dropping MOID. **Chaos Twins** (creative-freedom pick): rogue moon (0.22·GM,
  r=190, softened +220 — admitted) turns the lab into a restricted 3-body problem;
  FIRE launches twins 0.1% apart, live separation + doublings readout, divergence chord
  drawn, orbital-element labels honestly SUSPENDED in-mode, prediction admitted to lie;
  CHAOS MODE card added; off by default (existing tests preserved). **Planet-size
  what-ifs**: ×0.25–4 slider (radius ×s, mass ∝s³ at const density) → R′/M′/g×/v_esc×
  readouts, habitability warnings (<0.5 thin-air Mars problem; >1.6 mini-Neptune,
  cited Rogers 2015 by name; 0.8–1.25 comfy zone; giants branch), honest "orbit
  UNCHANGED — Kepler asks about the Sun" line, selected dot scales on orrery,
  ↩ back-to-real-data reset (reversibility). 25/25 new-feature probe + ALL regressions
  green (24 lab + 20 v1.2 + 22 observatory = 91 checks) + screenshot of twins at
  7.6 doublings + boot probe after atomic deploy.

## issues
- step() is externally drivable (internal clock only) — probes never touch rAF.
- Escape detection needs r>2600 AND outbound AND ε>0; escaping sats take real minutes
  to leave — probes must loop step() hundreds of seconds.

## todos
- Drag-to-aim (non-tangential launches); Kepler's-third-law period readout per orbit.
