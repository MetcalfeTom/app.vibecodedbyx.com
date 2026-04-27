# AI Terminal

## log
- 2026-04-27: Created. **Dark neon news-wire** with scrolling ticker + story grid + side dispatch log + breaking banner + modal detail. Single source-of-truth `STORIES` array (~36 entries across 9 tags: LABS/POLICY/HARDWARE/RESEARCH/SECURITY/STARTUPS/MARKETS/ETHICS) feeds both the ticker (`buildTicker()` shuffles 28 + duplicates HTML for seamless 90s CSS marquee loop) and the grid (`renderGrid()`). Each story shape `{tag, src, h, b, full}`. **Layout**: 56px header (brand + SYNTHETIC badge + clock + ping pulse) → 36px ticker (translateX -50% over 90s, paused on hover or Space) → 1fr main grid (filter chips + search + story cards · side log) → 28px footer creed. **Glitch brand**: "ai//terminal" in Major Mono Display with `::before` magenta + `::after` cyan offset translates animating on a glitch keyframe. **Side log** dispatches a new line every 5–12s (timestamp + tag + brief), capped at 80 lines, auto-scrolls. **Breaking banner** rolls in every 35–85s from `BREAKING_POOL`, slides off after 8s. **Modal** opens on card click with full body text + wireId. **Hotkeys**: Esc closes modal, Space pauses ticker, `/` focuses search. Filter chips (ALL + 8 tags) + search filter the grid live. Color-per-tag: LABS green / POLICY amber / HARDWARE cyan / RESEARCH violet / SECURITY red / STARTUPS magenta / MARKETS gold / ETHICS rose. **SYNTHETIC label** prominent in header + footer creed: "synthetic dispatches · curated for vibe · do not trade on this." Pollinations OG (cyberpunk newsroom prompt, no `referrer=`).
- 2026-04-27: **Headlines added per public request**: 3 humorous SYNTHETIC entries — "Datacenter passes wind, blames new airflow protocol" (HARDWARE / WIRE//IDC), "GPU lights on fire after firmware update, vendor pulls patch" (SECURITY / WIRE//SC), "Claude stinks like poop, per real sources" (LABS / WIRE//ANT, leans into the joke + reminds reader the wire is fictional). Bodies stay in tone: techy framing + a wink at the synthetic label. New entries flow into ticker rotation automatically since `buildTicker()` reads from `STORIES`.
- 2026-04-27: **Polyglot hello-world themed entries** (lighter compromise vs spawning 5 separate hello-world apps): added "Polyglot benchmark adds Brainfuck, Zig, and Rust to hello world suite" (RESEARCH / WIRE//IETF) + "Rust-based hello-world startup raises seed at concerning valuation" (STARTUPS / WIRE//SF). Keeps the spice without adding 5 boilerplate-only apps to the repo.

## issues
- **Synthetic framing is load-bearing** — the entire premise is fictional dispatches. Every entry must be plausibly fake. Don't add anything that could be mistaken for real reporting (e.g., specific person quotes about real events, dollar figures attached to real companies that could move markets if scraped). The SYNTHETIC label in header + footer must stay visible.
- **Ticker over-density** — currently shuffles 28 stories per page-load and duplicates them for the marquee loop. With ~36 stories that's fine; if STORIES doubles, consider raising the slice or letting the loop go longer.
- **Local-only data** — this is a static client-side wire by design (sandbox). No fetch, no API, no scraper. zennlogic explicitly framed it that way. Keep it that way unless someone has a clean read-only RSS source they explicitly want piped in.
- **Single-file size** — index.html is ~50KB. Adding stories grows it quickly. If we cross 80KB or the STORIES array becomes painful to scroll through, consider extracting to a sibling `feed.json` and `fetch('./feed.json')` on boot.

## todos
- Add a "shuffle" button that re-runs `buildTicker()` without a full reload.
- Tag co-occurrence graph as a sidebar widget (which tags appear together in modal-clicked stories?).
- Optional read-mode that pauses the ticker + bumps font for accessibility.
- More humor entries — the 3 added today set a comedic-realism tone that the rest of the wire can lean into without breaking the SYNTHETIC pact.
- A "wire archive" view sorted chronologically by `wireId`.

## design
- Palette: bg `#050608`, panel `#0a0e15`/`#10161f`, ink `#d8e2ee`, dim `#5a6b85`, phosphor green `#5fff8c`, magenta `#ff3d8a`, cyan `#5ff0ff`, amber `#ffaf3d`, violet `#b88dff`, red `#ff2046`. Lines `rgba(95,255,140,0.10)`.
- Fonts: Major Mono Display (brand glitch), Orbitron 700/900 (filter chips, ticker tags, modal title), Share Tech Mono (story cards, side log, source codes), VT323 (clock, ping, wire IDs), Newsreader italic (taglines, footer creed).
- Layout grid: `56px / 36px / 1fr / 28px` rows × `1fr 320px` cols (main row only). 980px breakpoint stacks side log below main grid.
- Ticker: phosphor green left edge, translateX -50% over 90s linear, hover or Space pauses (`animation-play-state: paused`). Each item = colored tag pill + source code + headline.
- Story card: panel-2 bg w/ green left rule, tag pill top-left, source code top-right (dim), headline 18px Orbitron, brief 14px Share Tech Mono, timestamp footer dim. Hover: green rule brightens + 1px lift.
- SYNTHETIC badge: hot pink rounded pill, blinks 0.4s opacity 1→0.6 on a 3s cycle.

## code-shape
- Single file, ~900 lines, ~50KB.
- Top: `STORIES` const array (single source of truth, story shape `{tag, src, h, b, full}`) + `BREAKING_POOL` array of one-liners.
- `state` = `{filterTag, search, paused, log[], pingMs}`.
- `buildTicker()` — shuffle 28, build HTML, duplicate for seamless loop.
- `renderGrid()` — filter STORIES by tag + search, render story cards with click-to-modal.
- `pushLog(entry)` — append to side log, cap 80, auto-scroll.
- `dispatchLoop()` — random 5–12s setInterval picking a story for log line.
- `breakingLoop()` — 35–85s setInterval pulling from BREAKING_POOL into banner with slide-in/out keyframe.
- `openModal(story)` / `closeModal()` — modal w/ full body text + wireId derived from story hash.
- Hotkeys: Esc/Space/`/` registered on `keydown`.
- Clock: `tickClock()` updates UTC time + day every 1s.
