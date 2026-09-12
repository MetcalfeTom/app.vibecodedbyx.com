# Bridge Sandbox — notes

## log
- v1.0 (2026-09-12): Built per chat ("standalone sandbox mock with synthetic context, local-only bridge simulation, visible event log, no production files or external access") — a visible playground for the wrapper↔app context-bridge idea from chrome-integration-roadmap.md. STRICTLY standalone: the bridge protocol is RE-IMPLEMENTED locally (no production file loaded — not sloppy-bar.js, not the M2 patch), the channel is `sandbox-sync` (deliberately NOT the production `sloppy-sync`, so poking the sandbox can never inject synthetic identity into real open tabs — probe asserts the production name never appears in app code via split needle), zero network APIs (split-needle scanned), zero external tags (fonts/scripts audited — only scraper-facing og meta URLs exist), data-URI favicon, system mono stack.
- The diagram: MOCK WRAPPER pane (kill-switch checkbox, synthetic identity presets Guest/Chatling/PowerUser, broadcast button, live state line) — animated wire with a message pulse — MOCK APP as a REAL same-origin srcdoc iframe holding zero identity code (request button + context card), plus a REAL sandboxed null-origin HOSTILE frame whose requests the bridge rejects by origin. EVENT LOG (newest-first, side-colored WRAPPER/APP/HOSTILE/SYNC, payload previews, clear button, aria-live narrator line).
- LESSON (+, any BroadcastChannel feature): **a channel object never receives its own postMessage** — the broadcast button posted on the same instance the bridge listened on and the self-exclusion rule swallowed it silently (3 probe fails). Fix: transmit on a FRESH BroadcastChannel instance (which also honestly plays the "another tab" role) and close it. Sister of the harmony scope-twin lesson: the spec's delivery rules are part of the topology.
- Verified: probe 22/22 at 1200/390/320 (boot + honesty banner, private channel name + production-name absence + zero network needles + zero external tags, real-iframe request→answer with card render, unsolicited push on synthetic broadcast, kill-switch silence + recovery, synthesized null-origin rejection logged with no reply, hostile frame sandboxed, log clear + roles, 40px controls, no overflow); screenshot of a full exchange.

## issues
- The hostile frame's inner state is unreadable from probes (null origin, correctly) — its rejection path is tested by synthesizing a null-origin MessageEvent instead; the live frame is there for humans to press.

## todos
- A "consent prompt" third pane demonstrating the roadmap's M3 once/always/never flow, if chat wants the next chapter visualized.
