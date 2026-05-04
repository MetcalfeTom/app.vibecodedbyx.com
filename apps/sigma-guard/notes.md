# sigma-guard

## log
- 2026-05-04: shipped — AI governance dashboard (chat pivoted away from sigma-shake-factory mid-build).
  - **Layout**: CSS Grid with three primary regions — agent fleet (center, takes most of the screen), policies sidebar (right, 22rem), audit log strip (bottom, 13rem). Header spans the top. Below 1100px collapses to a single column with sections stacked.
  - **Agent fleet**: 14-card grid with live status indicators (active / idle / throttled / blocked / quarantined), per-card sparkline of CPS history, current task line, model + tenant labels, three live stats (CPS, TPS, RISK), and three operator action buttons (PAUSE / RELEASE / QUARANTINE). Filter pills above the grid for status-based subsetting.
  - **Policies panel**: 10 governance rules with policy ID + description + enforcement mode pill (LOG / WARN / BLOCK). Click the pill to cycle modes — every cycle hits the audit log as an `INFO` event from "console". Live hit counters that go critical-red when above 100.
  - **Audit log**: real-time stream with timestamp · severity · agent · message · policy code columns. Filter pills (ALL / WARN / DENY / PAUSE). Cap 120 lines, oldest auto-removed. The log is also where every operator action (pause / release / quarantine) is recorded with `WARN` / `OK` / `CRIT` severities.
  - **Simulation tick**: per-frame mock data that varies CPS/TPS/RISK with random walk, occasionally flips `active` ↔ `idle` for liveliness, escalates to `throttled` when risk passes 0.85, and rolls policy-evaluation events at ~1.8/sec across the fleet (with a 6% chance per event of being a violation that pumps the agent's risk).
  - **Background events**: every 4-10s a non-agent event drops in (ledger seal, tenant utilisation warning, key rotation, health probe), so the log feels active even if no agent is busy.
  - **Aggressive UI palette (chat ask)**: dark charcoal (#0e0e10 bg, #1a1a1d panels) with neon red (#ff1a3c) as the dominant accent. Title `SIGMA · GUARD` with red glow on GUARD, red shield icon with bright top-edge gradient + red drop-shadow halo, header underlined with a 2px red bar + red shadow. Live pulse dot is now red (was green). Filter pills active state turns full red with 0.5rem red glow. Quarantined agent cards flush red-tinted with inset red glow. Sparklines red with red shadowBlur. Operator action buttons hover red; QUARANTINE button hovers full red with red glow. Cyan kept only for INFO event accents.
  - **Background**: dual red corner glows + 3px-stride horizontal scanlines for the grim sentry-console aesthetic.
  - **Accessibility**: rem units, 44px+ button targets, semantic `<main>`/`<header>`/`<section>`/`<aside>`, role="status" + aria-live HUD + log feed, aria-pressed on filter pills, focus-visible outlines, skip link to agents grid, prefers-reduced-motion kills the live-pulse animation.

## issues
- All data is locally simulated — there's no real backend feed. Hooking to a Supabase realtime channel + an inserter would make this a genuine SOC viewer.
- Per-agent sparklines redraw every tick; 14 small canvases × ~60Hz is fine on desktop but could be batched for mobile.
- Policy "mode" cycling is purely client-side; closing the tab loses your changes. Could persist to localStorage.
- The agent list is ~14 cards; for a true fleet you'd want pagination + virtualization.

## todos
- Persist policy mode + quarantine list to localStorage.
- Click an agent card → drawer with detailed history (last 50 events, cost, latency percentiles).
- "Replay mode" — load a JSON of historical events and step through them.
- Wire to a Supabase channel for live cross-user dashboards.
- Heat map view: tenant × policy with hit-count cells.
