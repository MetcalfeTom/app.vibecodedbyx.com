# repair-lens (Repair Lens — AR live repair, safely simulated)

## log
- 2026-08-13: v1 per chat ("safe AR Live Repair prototype: mock camera preview, model identification uncertainty, hazard warnings, confidence-labeled diagnostic paths, non-hazardous guidance only") + follow-ups (parts checklist, repair-café placeholders, industrial visual system). Single file, Oxanium + Reddit Mono, AR-HUD cyan/amber on dark bay + hazard-stripe/riveted industrial layer.
  - **Mock camera, really mock**: canvas viewfinder (vector device sketches: kettle/laptop/bicycle, reticle, scan sweep, sensor grain) with a permanent "SIMULATED FEED — CAMERA OFF" tag; the page NEVER calls getUserMedia — the probe wraps it with a spy and asserts zero calls. Prototype banner states no CV models ship and confidence figures are design illustrations.
  - **Uncertain identification**: scan → 3 candidates with % (sum 100, sorted), top one carries an honesty note ("a real lens would show its true posterior"); user must confirm or correct.
  - **Hazard gate**: confirm → device hazards FIRST (unplug/cool, water+mains, lithium swelling, sealed-base boundaries, brake-test-before-riding) behind an explicit acknowledgment button; diagnostics + parts stay hidden until acked. Industrial hazard stripes on the panel.
  - **Diagnostics, confidence-labeled, non-hazardous only**: symptom → step cards (HIGH/MED/LOW + % + why), AR annotation ring+label on the mock feed pointing at the relevant part per step; positive outcomes end in "RESOLVED — SAFELY"; every tree's deep branch ends in "■ STOP — HAZARD BOUNDARY" with a specific professional referral (kettle: sealed mains; laptop: battery-adjacent; bike: brake cables/hydraulics). Anchor clears at STOP.
  - **Parts & tools checklist** per device (tick-to-green) + **repair-café placeholders**: 3 clearly-tagged PLACEHOLDER cards, explicit "static prototype can't search the real directory, no network calls", zero external links (asserted).
  - Verified **18/18**: feed pixels, camera-off tag, cameraNeverRequested (spy), candidates sum/sort, honesty note, gate order (diag+parts blocked pre-ack), ack opens, checklist renders+ticks, 3 placeholder cafés + no <a href> in body, confidence chips with %, AR anchor on 'base', STOP endpoint with referral, anchor cleared, safe endpoint, device-switch reset.

## issues
- Diagnostic outcome routing keys off button-label regexes (positive vs negative words) — fine for the fixed content set, brittle if trees are edited carelessly; v2 should use explicit outcome fields per next-option.
- Only 3 devices; adding one = drawing + candidates + hazards + trees (~60 lines each).

## todos
- Explicit outcome fields on next-options (replace label regex).
- More devices (washing machine — good hazard-boundary material).
- "Print the repair card" export in the product-vault documentation style.
