# CI Clicker

## log
- 2026-04-08: Initial build — CI/CD incremental clicker. Click RUN BUILD to compile (with ~6% chance of timeout). Hire crew (juniors/seniors/CI runners/k8s/macOS runners) for auto-bps. Upgrade server tier 1→5 to drive timeout rate from 12% down to 0.5%. Three click-power upgrades. Big scary DEPLOY TO PROD button with dashed dancing border, pulse-warning siren, screen-flash + body-jitter shake on click, then risk/reward modal: 25-45% chance of MELTDOWN (lose 50% builds, +3 errors) vs SHIPPED (3× bps for 30s). Risk drops 5% per server tier. localStorage save. VT323 + JetBrains Mono, green-on-black terminal aesthetic with scanline overlay.
- 2026-04-08: Added macOS Runner upgrade — very slow but huge reward. baseCost 750000, unlock at 200k builds, +500 bps each, costMul 2.4 (vs 1.18 default) so each one balloons in price fast. Added own field `state.macos`, stat-line in crew section, computeBps contribution, and per-upgrade cost multiplier support in costOf().
- 2026-04-08: Replaced crew upgrades (juniors/seniors/runners/k8s/macOS) with workflow-native progression suggested by vivax_dev. Two new upgrade categories: (1) **Add job** — each purchase appends a new node to build.yml. 9 unlockable jobs (install, lint, typecheck, build, e2e, security, docs, bench, release) with bps from 0.9 → 4500. The workflow graph literally grows as you buy jobs. (2) **Matrix runners** — each purchase adds an axis to the build matrix and multiplies the bps of *every* job. Four axes: Node 20, Node 22, Windows, macOS. macOS is the slow-but-huge one (costMul 14, baseCost 3M). computeBps = Σ(job.bps) × (osMult × nodeMult). Job row shows a purple "N×" matrix badge on every job when mult > 1. Save key bumped to v2 (old saves dropped). Sidebar stats now show Workflow (jobs/matrix mult), OS matrix (ubuntu/windows/macos), Node matrix (18/20/22). Job row now wraps to handle 12+ jobs. Also fixed a latent bug in renderUpgrades where a `return` inside the upgrade loop exited the function entirely instead of skipping the current upgrade — changed to `continue`.
- 2026-04-08: Full UI rework to match GitHub Actions. New palette (#0d1117/#161b22/#30363d/#3fb950/#58a6ff) and IBM Plex Sans + JetBrains Mono fonts. Replaced the giant click button with a workflow visualizer card: header with `.github/workflows/build.yml`, branch chip, "Run workflow" button. Body shows 5 job nodes (Set up job → Checkout → Install dependencies → Run tests → Build & cache) connected by curved SVG bezier edges drawn from live bounding rects. Click any job or the Run button to trigger a workflow animation: jobs cycle queued → running (spinning amber dot) → success (green ✓) sequentially over ~600ms. Edges light up green as they activate. Random failures stop the run mid-pipeline, mark a job red, fail the edge into it, and refund the click. wf-summary footer shows last run + total runs. Header reskinned to look like GH chrome (Actions logo + repo crumb). Stats sidebar restyled with GH-card aesthetic. Mobile layout switches job row to vertical and edges adapt direction.

## features
- Click-to-build with timeout chance and floating +N / TIMEOUT text
- 4 click-power upgrades, 5 auto-crew tiers, 4 server tiers
- macOS Runner: top-tier auto unit, very expensive, +500 bps
- DEPLOY TO PROD: scary animated red button with full-screen flash + screen shake + risk modal
- Server tier upgrades reduce both passive timeout rate and deploy meltdown risk
- Live build.log with rotating fake CI messages (success + error variants)
- Stats sidebar (builds, bps, click power, errors, server tier, crew counts)
- Uptime header
- localStorage autosave every 3s

## issues
- macOS Runner cost grows aggressively — by intent, but may feel punishing
- Deploy meltdown can wipe a big chunk of progress; consider a one-time "rollback" item later
- No audio yet
- Mobile layout collapses to stacked panels but click button stays usable

## todos
- Sound: keyboard click on build, alarm on deploy, fanfare on ship
- Prestige / "rewrite in Rust" reset loop
- Achievements (first deploy survived, 1k builds, etc.)
- Real PNG OG image
- More upgrade tiers past macOS (quantum runner?)
