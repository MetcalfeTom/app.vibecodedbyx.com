# obs-cli · notes

## log
- 2026-05-15: v1 — minimalist web-based CLI dashboard for a fake OBS studio. Chat (combined): "create a minimalist web-based CLI dashboard for a fake OBS studio with commands for scene transitions and status logs" + "build a minimalist web-based CLI for a fake OBS studio with scene transition commands and green status logs." Both satisfied by the same build. **Layout**: single full-viewport terminal in a flex-column — top status strip, a tiny "now showing" preview card, a scrolling log, and a single command prompt at the bottom. Nothing else. No tabs, no panels, no graphical mixer. Everything happens through the keyboard. **Status strip** (top): scene name + stream state (idle / LIVE pulsing red) + record state (off / REC pulsing amber) + uptime (HH:MM:SS) + bitrate (kbps) + dropped frames + mic state. Each pair is `label<b>value</b>` with the label in `letter-spacing: .12em` uppercase and the value in a bright color matching its meaning (green-bright for everyday, rose for LIVE, amber for REC, rose for mic-off). Live/REC dots have a CSS step-2 blink so the page feels alive. **Preview card** (one row): "now showing" label on the left, the current scene name in a chunky monospace with a `▸` amber chevron, and an 8-bar VU meter on the right. The VU bars are CSS spans whose `height` is set every 110 ms — gentle 20-50% baseline with occasional spikes when mic is on, dropping to 4-8% when mic is off. Bars turn amber above 65% and rose-red above 88%. The whole card flickers via a `flicker` keyframe during transitions. **Scrolling log**: capped at 400 lines, each line has a `[HH:MM:SS]` timestamp prefix (dim green), and a class that drives color: `cmd` (green-bright, prefixed by an amber `>`), `info` (regular green), `warn` (amber), `err` (rose), `dim` (faint green). All values rendered with simple HTML-escape (`<`, `>`, `&`) so user input can't break the markup. **Command prompt**: `obs>` in amber on the left, the input field is a transparent borderless `<input>` styled to merge with the terminal (caret color matches text, no underline focus ring), with a faint right-aligned hint `help · tab · ↑↓`.

**Commands** (`help` prints them all):
- `help` — list of commands
- `scene list` — show the six scenes with markers
- `scene <name>` — fade to scene (default 450 ms)
- `cut <name>` — instant hard cut
- `fade <name> [ms]` — fade over N ms (50-5000, default 800)
- `sources [scene]` — list mock sources for current or named scene
- `start` / `stop` — streaming
- `record start` / `record stop` (also bare `record` toggles)
- `mic on` / `mic off` / `mic toggle` (bare `mic` toggles)
- `status` — print everything in one block
- `clear` (also Ctrl+L) — clear log
- `tip` — random streamer tip from a curated 8-entry list

**Scenes**: 6 fixed mock scenes — `intro`, `gameplay`, `webcam`, `brb`, `desktop`, `outro`. Each has a hand-written `sources` array (e.g. gameplay's sources are `game capture`, `webcam`, `chat overlay`, `mic`). Aliases: `switch` and `go` both route to `scene`.

**Input UX**: history saved in `state.hist` (cap 80); `↑` / `↓` recalls previous commands; `Tab` completes against a 13-word table that includes every command and every scene name. Multi-match Tab logs the candidates as dim suggestions. Clicking anywhere refocuses the input unless the user has a text selection (so log copy-paste still works). Ctrl+L clears the log without consuming a line. Errors are tolerant and shown in rose with a sly tone (`unknown command: tip. type help.`).

**Live elements**: uptime ticks every 1 s while streaming. Bitrate random-walks `±220 kbps` within `[2200, 8400]` and drops 1-3 frames at ~4% per second when LIVE. Mic VU updates 110 ms. None of it is real — the whole app is theatre.

**Aesthetic**: pure green-on-black phosphor terminal with a soft text-shadow halo. Faint radial glow from the bottom, full-page scanline overlay (1 px every 3 px, multiply blend), corner vignette. IBM Plex Mono everywhere — one font family, all weights via CSS, no display headers. Even the title is just monospace. Color accents kept to four: green/green-bright, amber, rose, faint-green. Boot banner is a row of `─` characters with `OBS · cli interface · build 0.1.0 · sloppy ops` between them.

**WCAG basics**: `role="application"` + summary aria-label on `<main>`, `role="status" aria-live="polite"` on the status strip and log, `aria-label="OBS command input"` on the textbox, `prefers-reduced-motion` disables the LIVE/REC dot blink and the transition flicker. Mobile: status strip wraps, font sizes shrink slightly under 560 px. Pollinations OG flux seed 66603.

## issues
- Pure mockup: no actual OBS connection (would need OBS WebSocket plugin + a token to mean anything). The commands are theatre and pretend numbers.
- Mobile soft keyboards sometimes push the prompt above the viewport. The flex layout handles it (the log shrinks) but in landscape on some Android browsers the status strip can wrap to 3 lines.

## todos
- Optional OBS WebSocket bridge: type `connect ws://localhost:4455 <password>` to actually drive a local OBS instance.
- `script <file>` mode: paste a multi-line script to batch-run commands with delays.
- `replay` — replay the last 60 s of commands as a demo (for sloppy livestreams).
- More tips, themed for different streaming styles (gaming / IRL / chatting).
- Scene sources editor: `source add gameplay "discord overlay"` etc., persisted to localStorage.
