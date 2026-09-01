# MyRocks — black-and-yellow Fight Gone Bad bench

## log
- 2026-09-01: v1.0 per a public request ("MyRocks with warmup, technique, Fight Gone Bad timed rounds, rotating stations, editable targets, recovery tracking, black-yellow design, large workout controls"). Five views (nav aria-pressed): warmup checklist (6 items, progress + completion line), technique (5 stations × 3 cues), FIGHT GONE BAD (canonical 3×5×1:00 + 1:00 rest = 17:00; the engine block `mrPlan/mrAt` is pure + node-testable; **TM.now injectable clock** per the Snapz law — probes pin it BEFORE start), targets (per-station per-round, validated 1-999, persisted, board cells green on hit), recovery (soreness 1-5 / sleep / note; ≥4 soreness gets a rest-day nudge). Giant +1/+5 pads (≥88px), rotating stations + REST segments driven purely by `mrAt(plan, elapsed)`; pause banks elapsed; finish auto-saves result (last 20, ★ best) + triple beep (WebAudio behind a 🔔 toggle, default on, try/caught). Storage `myrocks-v1` {targets,results,recovery,mute}. Anton + Saira, #ffd23f on #0d0d0d. Suites: engine node 15/15 (plan shape, rotation order, rest placement, mrAt boundaries incl. t=1019/1020, totals, formats); browser 33/33 ×3 widths (nav, warmup count, cues, target edit + junk rejection, fake-clock fight: start/rotate/rest/round-2 attribution/pause-freeze/finish/save/reset, recovery both hint branches, black+yellow computed colors, control sizes, overflow, stamp).
- Phone fix during verify: the 7-column round board forced 341px at 320 — `#fgb-board{display:block; overflow-x:auto}` under 40rem so the TABLE scrolls, never the page.

## issues
- Beeps use segment-change detection in fgbUi (lastSegI); if the tab sleeps mid-round the next tick beeps once late — harmless, but don't "fix" it into a beep storm.
- Station list is the canonical FGB five on purpose. If chat wants custom station names, extend `MR_STATIONS` from storage — targets already key by station id.

## todos
- optional 10-second countdown before round 1, if chat asks.
- per-station round targets (currently one target per station across all rounds).
