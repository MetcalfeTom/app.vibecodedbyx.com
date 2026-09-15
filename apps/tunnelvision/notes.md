# Tunnelvision — notes

## log
- v1.0 (2026-09-15): Built per chat ("safe fictional VPN dashboard with simulated nodes, latency charts, route changes, and connection toggle"). No prior VPN/tunnel app existed — fresh build. Everything is a client-side simulation: pure engine in `<script id="engine">` (node-testable, seeded mulberry32 PRNG, 0.5 s ticks) with 10 invented exit nodes, 3 relays, 3 made-up protocols; connect = 4-tick handshake → virtual address from the documentation-only 203.0.113.0/24 block; latency = node base + relay cost + protocol overhead + load + noise + 2.5 % spikes; loss markers; nodes random-walk load and occasionally degrade / enter maintenance and recover; smart routing re-routes between relays on a 6-sample rolling average vs threshold (10-tick cooldown), fails over from a maintenance node, or drops the tunnel when smart routing is off (kill-switch wording differs armed vs disarmed). UI: switch (role=switch), kv strip, protocol select, smart-routing + kill-switch toggles, manual re-route, node list (aria-pressed, disabled in maintenance), abstract SVG topology (node circles are keyboard buttons, animated amber route), canvas latency chart (dataviz-skill single series in blue, 2 px line, end label, hover/keyboard crosshair + tooltip, table view), route log (aria-live). Geologica + Sono on slate green-black.
- HONESTY: fiction banner in the header, footer paragraph, "not a map" label; zero network APIs in any script (probe scans split needles), zero external anchors.
- Verified: engine 46/46 node (determinism, lifecycle, ip range, protocol/node ordering with pinned worlds, manual + auto reroute reasons, maintenance failover / drop wording, caps, hygiene); browser 55/55 at 1200/390/320 (switch flow, ip, route text, chart ink + hover + arrow keys + table, list/SVG selection incl. elementFromPoint, reroute/protocol/toggle logging, failover rendering, overflow after population, ≥44 px targets, contrast ≥4.5 muted / ≥3 status colours); screenshots both widths.

## issues
- Probe lesson: the node list re-renders on every renderAll — re-query buttons after a click or the old detached node reports stale aria-pressed. SVG elementFromPoint needs scrollIntoView first at desktop height.
- Random seed per load: probes MUST pin `statusT=1e9` on every node before driving a flow, or a random maintenance event flips a selection test (hit once at 390).
- `appearance:none` checkboxes were 1.6 rem tall — the track is now painted on `::before` inside a 2.75 rem control.

## todos
- Per-node sparkline in the list; "compare nodes" small multiples (keep to 3 series per the palette cap).
- Split-tunnel toy (apps list, all fictional); export the route log as text.
- Chat may ask for real geolocation/IP — answer: never, it's fiction by design.
