# edge-forge · notes

## log
- 2026-07-22: v1 — marcipopsis's brief ("brainstorming business cases around AI automations on edge devices"), built as the proposed three spaces. **SPARK**: curated collision engine — 12 devices × 8 capabilities (each with a hand-written why-edge argument) × 12 industries × 8 value levers ≈ 9,216 collisions; FORGE spins all four wheels, send-to-canvas prefills. NO cloud AI (text API is 402-paywalled — and the curated why-edge lines are better than generic LLM output anyway). **CANVAS**: title/spark/problem/model fields + why-edge check pills (latency/privacy/bandwidth/offline — posting REQUIRES ≥1: "or admit it is a cloud case"), edge economics sliders (fleet/device-cost/cloud-avoided/price → live capex + revenue + hardware payback months, with shade thrown at >24mo and at zero-revenue hobbies), multiplicative rubric (feas×impact×moat /125, ≥60 = forge-hot), .md one-pager export. **WALL**: edge_cases (case_key text — NO PK from create_table tool, client-generated keys) + edge_case_votes tables (read-all/own-writes, e2e probed incl. jsonb roundtrip + tally); newest/top-voted sort, vote toggle (own-row delete), expandable full-case markdown, broadcast channel edge-forge-wall-v1 ('case'/'vote' events → live refresh + toast), 25s polling fallback, offline-graceful. Oxanium + IBM Plex Mono, signal-green on slate grid. SUITE 12/12 (one 'failure' = stub textContent number-vs-string artifact, third time this pattern — real DOM stringifies).

## issues
- Vote tally counts rows client-side (RLS read-all permits it here — unlike app_votes, these tables have open SELECT).
- Wall caps at 60 newest cases; fine until it isn't.

## todos
- Remix button (fork a case into your canvas)
- Per-industry filter on the wall
- TF.js on-device inference demo corner (SketchNet pattern) to FEEL edge latency
