# Packet Pilot

## log
- 2026-04-27: Created. **Ethical HTTP request builder + diagnostic console**. Cockpit/HUD aesthetic — Audiowide brand "PACKET PILOT" w/ amber `PILOT`, Big Shoulders Display 800 for tracked uppercase labels, JetBrains Mono for code/data, Newsreader italic for taglines. Palette: bg `#070b12`, panel `#131a26`, phosphor green `#5fff8c` primary, amber `#ffb84d`, cyan `#5fc8e0`, error pink `#ff5e8a`, violet `#b88dff`. Hex-grid SVG backdrop @ 4% opacity + scanline overlay (mix-blend screen) + 3 radial glows. **Layout**: header (brand + tagline + HUD strip showing STATUS/SESSION/RATE) → 280px sidebar (history/saved tabs + scrollable list + Clear/Export footer) → main pane (method dropdown + URL bar + Save + Send → Params/Headers/Body tabs → response viewer). **7 methods**: GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS, each color-coded. **Body modes**: none / JSON / text / form-urlencoded with Pretty button (JSON.parse + stringify w/ 2-space indent) and Clear. **KV editors** for params + headers: checkbox toggle, key, value, ✕ remove, dashed `+ Add` button. Live count badges on tabs. **Send flow**: parses URL (rejects non-http(s)), builds with active params via URLSearchParams, attaches headers, attaches body for POST/PUT/PATCH/DELETE if mode≠none, auto Content-Type if user didn't set it. Times the round-trip via performance.now(). **Response viewer**: status pill color-coded by 2xx/3xx/4xx/5xx/error, time + size + content-type meta, 4 sub-tabs (Body/Headers/Raw/cURL). Body tab pretty-prints JSON with syntax highlighting (cyan keys / green strings / amber numbers / violet bools / pink null / dim punctuation), falls back to raw text. Headers tab is a 2-col key/value grid sorted alphabetically. Raw tab shows the unparsed body. cURL tab generates a multi-line escaped curl command with Copy button → clipboard. **CORS-friendly errors**: detects "Failed to fetch" and renders an italic Newsreader hint explaining same-origin policy + suggesting browser-friendly alternatives (httpbin/jsonplaceholder/github API). **History**: every send pushed to localStorage (`packet-pilot-history-v1`), capped at 24, shows method+URL+status+time-elapsed+rel-time, click to re-load into cockpit. **Saved**: ★ Save opens modal asking for call sign, persisted to `packet-pilot-saved-v1`. Click Export → JSON download of current tab's list. Clear button confirms then wipes. **Examples** on empty state: 4 click-to-run chips for jsonplaceholder, httpbin GET/POST, github zen — auto-fires on click. **Hotkeys**: Enter in URL bar = Send, Ctrl/Cmd+Enter anywhere = Send, Esc closes modal. **Mobile** @880px: stacks sidebar above main (200px tall), URL bar wraps to 2 rows, Send + Save grow full-width. Pollinations OG (cockpit HUD prompt, no `referrer=`).
- 2026-04-27: **Strict client-side rate limits + diagnostic-only framing** (per public request). Pivoted Packet Pilot from "best-effort soft limits" to a hard rate-limit policy enforced before every send. New `RATE` policy block at top of script:
  - `perHostMinGap: 1500ms` — same host can't be hit faster than 1.5s apart.
  - `perHostPerMin: 12` — rolling-60s cap of 12 requests to any single host.
  - `globalPerMin: 30` — rolling-60s cap of 30 total requests across the cockpit.
  - `duplicateGap: 4000ms` — identical request signature (method+url+sorted params+sorted headers+body) is refused if fired within 4s of last identical send. **This is the single most important loop guard** — it makes "click send 50 times" or scripted resends pointless.
  - `cooldownAfterCap: 6000ms` — once a per-host or global cap fires, the cockpit enters a forced 6s cooldown blocking ALL sends, displayed as `STATUS · COOL` + countdown toast.
  - `state.hostBuckets` Map<host, timestamps[]> + `state.globalBucket` timestamps[] are filtered to >cutoff each call (rolling minute, no stale entries).
  - HUD `RATE` cell shows live state: `CLEAR` / `HOLD` (mid per-host gap) / `DUPE` (signature collision) / `CAP·HOST` / `CAP·ALL` / `COOL`.
  - Footer creed updated to spell out the limits explicitly + "no loops, no fuzzers, no automation."
- App is intentionally feature-scoped to **single, manual, human-driven diagnostic pings**. There is no batch-send, no loop, no scheduled-run, no "send N times", no concurrent-fire feature, and the duplicate-signature guard kills the easiest abuse vector (mash-button or paste-into-script).

## issues
- **CORS limits visible** — most public APIs require Access-Control-Allow-Origin headers for browser fetch. The error block tries to explain this gracefully but a non-trivial fraction of "interesting" endpoints will refuse the browser flat-out. We point users to httpbin, jsonplaceholder, and pollinations because they explicitly allow CORS.
- **Memory growth** — `globalBucket` and `hostBuckets` only purge entries at send-time, not continuously. If user pauses for hours and then sends, there's a one-time filter pass per host. Negligible (lists are bounded by perMin caps + filtered before reads).
- **Body modes don't validate** — JSON mode lets you type invalid JSON and send it as-is; only the Pretty button surfaces errors. Decision: don't auto-block invalid JSON because some APIs accept malformed payloads for testing. Pretty button is the explicit affordance.
- **No auth UI** — no Bearer / Basic / API-key dropdowns; users can add `Authorization` header manually. Intentional minimalism — this is a diagnostic tool, not Postman.
- **localStorage limits** — history capped at 24 + saved is unlimited. If user saves hundreds of large bodies they could hit 5MB ceiling. Not addressing until someone reports it.

## todos
- Add a "share" button that produces a permalink encoding the request as URL fragment (no body data leaves browser, but reproducible across tabs).
- Per-host whitelist option ("only let me hit these hosts") — extra paranoia for users who want a hard pin.
- Response time chart for repeated diagnostic pings to one endpoint (ping-style graph over the last 10 calls — would still respect duplicate-gap).
- Markdown/curl import (paste a curl command, parse → cockpit fields).
- Keyboard shortcut overlay (? key).
- Save button could pre-fill name from URL pathname.

## design
- Palette: bg `#070b12`, bg2 `#0d131e`, panel `#131a26`/`#1a2332`, ink `#e6ecf5`, dim `#7a8aa3`, phosphor green `#5fff8c`, amber `#ffb84d`, cyan `#5fc8e0`, pink `#ff5e8a`, violet `#b88dff`. Lines `rgba(95,255,140,0.14)`.
- Fonts: Audiowide (brand mark), Big Shoulders Display 800 (uppercase tracked labels, side-tabs, tab pills), JetBrains Mono (URL bar, code, KV inputs, status, all numbers), Newsreader italic (taglines, error hints, empty-state copy).
- Layout: 280px sidebar + flex main; header 64px, footer 30px. Hex-grid SVG backdrop @ 80×46 tile / 4% opacity + 1px@4px scanline screen-blend overlay.
- Method colors: GET green / POST amber / PUT cyan / PATCH violet / DELETE pink / HEAD+OPTIONS dim. Mirror everywhere (sidebar list, URL bar dropdown).
- Send button: bright phosphor-green gradient pill w/ 0 0 20px outer + inner white inset glow, "▶ Send". Disabled state desaturates.
- Status pills: colored border + 6% tinted bg, JetBrains Mono `200 · OK`.

## code-shape
- Single file, ~1100 lines, ~56KB.
- Top: `state` object (method/url/params/headers/bodyMode/body/history/saved/sideTab/respTab/lastResponse/inflight/rateMap/hostBuckets/globalBucket/count) + `RATE` policy constants + `cooldownUntil` + `lastSignature`/`lastSignatureAt`.
- Helpers: `el()` factory, `fmtBytes`, `fmtTime`, `relTime`, `escapeHtml`, `methodClass`, `getHost`, `setHudRate`, `finalSig` (request-signature hash for duplicate detection).
- `renderKVList(list, target, kind)` — re-renders param/header rows with checkbox + 2 inputs + ✕.
- `setBodyMode(mode)` — toggles textarea disabled + placeholder per mode + updates badge.
- `buildUrl()` — merges base URL + active params via URLSearchParams.
- `sendRequest()` — parses URL, runs 3-tier rate gate (cooldown → per-host gap → rolling caps + duplicate sig), builds fetch init, awaits response.text(), times it, pushes to history, calls `renderResponse()`.
- `renderResponse()` — switches on `state.respTab` (body/headers/raw/curl), dispatches to JSON pretty-print / header table / raw `<pre>` / curl builder.
- `jsonHighlight(obj, indent)` — recursive HTML stringifier with class-tagged spans.
- `buildCurl()` — multi-line escaped curl command, includes auto Content-Type if not set.
- `loadIntoCockpit(r)` — restores a history/saved entry into all input fields.
- `renderSideList()` — re-renders history or saved list with method-color badge + URL + status indicator + ✕ + click-to-load.
- Modal: `openModal(title, placeholder, callback)` + keyboard (Enter confirm, Esc cancel, click backdrop to close).
- Hotkeys: `Ctrl/Cmd+Enter` = send, `Esc` closes modal.
