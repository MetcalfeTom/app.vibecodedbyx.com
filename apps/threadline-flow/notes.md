# threadline-flow

## log
- 2026-05-04: shipped — neon swarm-deployment-pipeline dashboard.
  - **Pipeline visualization (canvas)**: 7 horizontal stages — INGEST → BUILD → TEST → SCAN → PUSH → SWARM → HEALTH — each rendered as a glowing pillar with a neon-coloured glyph, in-flight count, and progress arc rings (one per concurrent job, up to 3). A thick base pipe + animated dashed neon overlay connects the stages with a left-to-right flow. SWARM stage gets a 4×3 replica grid below the pillar that fills as a job rolls across replicas, plus a `N / 12 REPLICAS` counter.
  - **Job lifecycle**: every 0.6-2.3s a fresh job spawns (random short SHA, author from a 12-name pool, branch from 9 options, message from 18 plausible commit messages). State machine: `queued → process[stage] → transit → process[stage+1] → … → done`. Each stage has a [lo, hi] processing time range and a small per-stage failure probability (build 5%, test 7%, scan 4%, swarm 5%, health 3%, etc). Failed swarm jobs render as `↺ ROLLED`, others as `✕ FAIL`.
  - **Live HUD**: ACTIVE jobs · TPS (last 10s avg) · OK · FAIL · REPLICAS · UPTIME, plus P50/P95 latency and SUCCESS rate computed from a rolling 100-job duration window.
  - **Recent deploys side panel**: 24-row scrollable list showing each running deploy with SHA + author + branch + message + state badge, color-coded by state (running cyan / success green / failed red / rolled orange).
  - **Throughput sparkline**: 60s rolling chart of completed deploys per second, drawn into a separate canvas with cyan stroke + filled area + glow shadow. Peak label updates live.
  - **Live log stream**: timestamped colored severity (INFO/OK/WARN/ERROR/SWARM), inline syntax-coloured fragments (sha cyan, branch gold, author magenta), filter pills (ALL/INFO/ERR/SWARM), PAUSE toggle. Cap 80 lines, oldest auto-removed.
  - **Aesthetic**: deep purple-black void with violet + magenta corner glows, faint cyan grid + drifting scan line. Audiowide 0.18em-spaced title `THREADLINE · FLOW` with cyan/magenta dual-color accents and gold separator. Cormorant italic tagline. IBM Plex Mono body, Major Mono Display numerals.
  - **Layout**: CSS Grid — `1fr 22rem` columns × `auto 1fr 9rem` rows (head full-width, stage canvas + side panels, log feed bottom). Below 980px collapses to single column with side panels stacked underneath.
  - **Responsiveness**: canvas uses `window.devicePixelRatio` (capped at 1.5) for crisp rendering; resize triggers `fit()` which re-buffers both canvases.
  - **Loop**: requestAnimationFrame-driven with `dt` clamped to 0.1s. Tick handles spawn cadence, throughput buckets (1s rolling), and per-job state transitions.
  - **Accessibility**: rem units, 44px+ button targets, semantic `<main>`/`<header>`/`<section>`/`<aside>`/, role="application" canvas with control summary, role="status" + aria-live HUD + log feed, aria-pressed on filter buttons + pause toggle, focus-visible outlines, skip link to canvas.

## issues
- Failure rates are static — no day/night curve or `chaos: true` toggle. Future-me could expose a slider.
- Throughput and percentiles are calculated from a rolling window; on the very first 10s the values trail behind reality slightly.
- The 12-replica grid is a fixed 4×3 layout. Different swarm sizes would need re-laying.
- Job orbit at the stage is a small Lissajous; with many concurrent jobs at one stage they overlap. A lane system per stage would tidy that up.
- No real Supabase / WebSocket backend — entirely client-side simulation. Could be wired to a real CI feed later.

## todos
- "FAILED ROLLBACK" lane that shows a rolling-back ghost orb traveling backward across the pipeline.
- Per-environment swimlanes (staging vs prod) with separate replica grids.
- Click a deploy in the side panel to "promote" or "abort" it.
- Audio: subtle ticks on stage advance + warning blip on failures.
- Persist recent deploys in localStorage so the panel survives a refresh.
