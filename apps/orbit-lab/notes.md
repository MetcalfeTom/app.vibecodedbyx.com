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

## issues
- step() is externally drivable (internal clock only) — probes never touch rAF.
- Escape detection needs r>2600 AND outbound AND ε>0; escaping sats take real minutes
  to leave — probes must loop step() hundreds of seconds.

## todos
- Drag-to-aim (non-tangential launches); Kepler's-third-law period readout per orbit.
