# Hopwatch — notes

## log
- v1.0 (2026-09-11): Built from two chat requests referencing "the Rust CLI brief" (opt-in probes, hop-table tracking, ASCII summaries, JSON time series, explicit report flags; then TUI sparklines + colored text, append-only snapshots, incremental hop updates, full recalculation). **No recorded brief exists anywhere** — an exhaustive sweep of every session log, root scope docs and git history found no antecedent (the requests themselves are the spec, and the app + this note say so). No cargo/rustc in the sandbox and browsers cannot send ICMP, so the brief ships as a faithful in-browser terminal: same flags, same semantics, everything simulated and labeled as such (banner + report title line + JSON `simulated:true`). The `about` command names the crates a real Rust build would use (clap/ratatui/serde_json).
- Engine is a pure `<script id="eng">` block (CommonJS + window dual export, the Snapz law): fnv/mulberry32 seeded routes (6–12 hops, cumulative base RTT, lognormal-ish jitter, per-hop loss, an occasional mute "???" hop, deterministic per target+seed), Session with **append-only frozen snapshot log**, **Welford incremental stats**, `recalc()` rebuilding from the log alone, `verify()` proving incremental == recalculated (auto-printed after every run; `r` mid-run; `--recalc` flag), `--flap` mid-run route change (alt- host, report narrates it), sparkline (▁–█, × for loss, · padding), strict flag parser (unknown flag/missing value/non-numeric = explicit errors; probes ≤500, interval ≥0.05).
- CLI rules per the brief: **nothing probes without `--probe`** (engine throws, CLI refuses politely) and **nothing reports without an explicit flag** (`--report` ASCII table, `--json` time series, `--tui` live panel, `--recalc`), with a nudge when a run ends flagless.
- TUI: colored hop rows (green ok / yellow jittery / red lossy / dim mute / rust flapped), 24-round sparklines, live meta, q quits, r verifies mid-run; ⏹ stop button mirrors q for touch.
- Gruvbox-rust palette, Alfa Slab One + Spline Sans Mono. WCAG basics: role=log aria-live terminal, labelled input, 44px chips/inputs, focus-visible, reduced-motion kill, rem sizing.
- Verified: engine node suite 33/33 (parser, opt-in throw, determinism, Welford vs two-pass 1e-9, frozen snapshots, verify catches corruption + recalc repairs, mute hop, flap, JSON schema, report shape, sparkline maps, help completeness); browser probe 28/28 at 1200/390/320 (seam, a11y, help, unknown flag, opt-in refusal, fast run + verify line + ASCII report, explicit-flags nudge, parseable JSON, --recalc, live TUI rows/sparklines/colors, q abort, r mid-run check, chip click, no overflow); screenshots of report + live TUI at both widths.

## issues
- Terminal output uses `white-space:pre` + own overflow-x — the sparkline/table columns scroll inside the panel on phones by design; never let the PAGE scroll sideways.
- The probe types via the `__H.runLine` seam; keyboard q/r are ignored while the input has focus (by design — typing "q" in a command must not abort).

## todos
- `--width` flag for sparkline width; persist command history to localStorage.
- Maybe a second builtin target list (`targets` command) so chat can race routes.
