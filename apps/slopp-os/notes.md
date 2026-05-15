# slopp-os · notes

## log
- 2026-05-15: v1 — futuristic cybersecurity dashboard mockup. Chat (combined): "can you build a futuristic cybersecurity dashboard mockup called slopp-os with fake scrolling logs and terminal windows?" + follow-up "build a cybersecurity dashboard called slopp-os with matrix-style scrolling logs and terminal windows." Both satisfied by the same build. **Layout**: 4-row × 3-column CSS-grid with named areas — `top` (full-width status header), `map` + `t1` + `t2`, `ips` + `t3` + `conn`, `feed` (full-width). At ≤1000 px it collapses to a 2-column phone-friendly stack; at ≤640 px it goes single-column and hides the top-blocked-IPs chart. All panels are flex-column with `overflow:hidden` so per-panel scrolling stays inside each card. **Panels** (8 total):
  1. **Status header** — SLOPP/OS wordmark in Major Mono Display green, version pill, big `DEFCON N` threat-level readout that pulses red, a 5-step gradient threat-bar (green→amber→red), 4 health pills (CPU %, mem %, net mb/s, nodes ok/total). Threat level random-walks one step every 6 s within `DEFCON 5..1`; bar width updates accordingly and the level's color matches its severity. Health values drift on a 1.4 s timer.
  2. **Live attack map** — inline SVG with a faint grid + six abstract continent blobs (N America / S America / Europe / Africa / Asia / Australia). On a 600-700 ms interval (×2 timers staggered), a weighted-random hotspot picks one continent and spawns a `.map-blip` — a magenta rose dot with a CSS `pingPulse` keyframe that expands a hollow ring to 60 px over 1.3 s. 18% chance each blip spawns green ("cleared") instead of red. Total attack counter in the corner (`∮ N`). Blips auto-remove after 1.5 s.
  3. **Terminal: auth.log (T1)** — VT323 16 px green text with a soft text-shadow halo, capped at 22 lines, scrolls every ~1.1-1.8 s with a randomized line: `Failed password`, `Invalid user`, `Accepted publickey`, or a `sudo` audit line. IPs render in cyan via `<span class="ip">`, commands in amber. Each terminal has a blinking `_` caret via `::after` + CSS keyframe.
  4. **Terminal: kernel (T2)** — iptables DROPs, CPU temp readouts, `eth0 link up`, occasional `BUG: soft lockup` lines. Same VT323 style; lines tagged `.warn` (amber) and `.bad` (rose-red) by class so the eye picks them out.
  5. **Terminal: suricata (T3)** — IDS-style alerts using a hand-curated list of 10 rule templates (`ET TROJAN Generic`, `ET WEB_SERVER SQLi attempt`, `ET MALWARE CnC beacon`, `STREAM cleanup`, etc.) with rule IDs in the `2:000000` range and src/dst IPs + ports. ~900-1400 ms cadence.
  6. **Top blocked IPs** — a `Map` accumulates per-IP counts. Every 1.5 s a new IP is added or an existing one bumped; the top 6 render as `bar-row` items with a rose→amber horizontal bar whose width is proportional to the leader. `Σ N` total at the top of the panel. Soft cap of 40 tracked IPs.
  7. **Active connections** — rolling table with 4 columns (SRC IP, port, DST host, state). 9 visible rows; every 1.7 s 1-2 new rows are unshifted and a random row may be removed. States color-coded: `ESTAB` (green), `SYN-S`/`FIN-W`/`TIME-W` (amber), `RST` (red).
  8. **Incident stream** — a 12-template feed (`info`, `warn`, `bad`) with placeholders for IPs/users/hosts/ports/numbers. New lines push in every 700 ms; the panel reverses with `flex-direction: column-reverse` so freshest is at the bottom. Live `N evt/s` rate calculated over a rolling 2 s window in the panel corner. Lines fade in with a CSS animation. Capped at 18 visible lines.

**Aesthetic**: deep void backdrop with two faint radial glows (green top-left, rose-red bottom-right), full-page scanline overlay (1 px every 3 px, multiply blend), corner vignette. Phosphor green (`#7aff94`) primary, amber (`#ffb45a`) for headers + commands, cyan (`#7adcff`) for IPs, rose-red (`#ff5d7a`) for incidents. Major Mono Display for the logo and big numerals, VT323 for terminal output (matrix-classic), IBM Plex Mono for everything else.

**Generators**: deterministic-ish — IPs drawn from a curated set of legit-looking public ranges (23/45/64/78/91/103/121/134/158/172/185/203/212), usernames from a chat-flavored pool (`sloppy`, `jenn2`, `marci`, `icekrieg`, `zennlogic`, `ops` + a few system users), hosts from a 9-name pool (`edge-01`, `core-01`, `db-01`, etc.).

**WCAG basics**: every panel has `aria-label`, the threat readout is `role="status" aria-live="polite"`, all values updating via DOM updates, `prefers-reduced-motion` disables the DEFCON pulse + ping-pulse blip + terminal caret. Pollinations OG flux seed 13371.

## issues
- Pure theatre — nothing here reads real logs or makes any network calls. The dashboard is a believable mockup, not a tool. If chat looks at it for too long they may forget that, which is part of the fun.
- The map's continent blobs are abstract / not geographically accurate. Good enough for the genre but Antarctica is missing entirely.

## todos
- Click a blip to open a fake "drilldown" modal with WHOIS-shaped data.
- Add a fake bandwidth chart (sparkline) to the system-health pills.
- Hover a connection row to expand into a full session detail (also fake).
- A "RESPOND" big-red button that triggers a brief screen-flash + adds a "lockdown initiated" entry to the feed.
- Speech-synthesized voice that mutters "anomaly detected" on bad-level feed lines, toggleable.
