# web-sdr-hub · notes

## log
- 2026-05-17: v1 — **internet-radio hub powered by radio-browser.info** per chat ask "create a web-SDR hub that fetches and lists available radio broadcasts". Self-contained ~25KB single-file.
  - **Data source**: api.radio-browser.info — a free, community-maintained directory of ~30,000 internet radio stations. CORS-enabled, no auth, JSON. We rotate across 3 mirrors (de1, fi1, at1) with random-start + sequential failover; if one is down, the next attempt automatically tries the next mirror.
  - **Endpoints used**: `/json/stations/topvote` (default popular list), `/json/stations/bytag/<tag>` (genre filter), `/json/stations/search?name=<q>` (text search). All accept `countrycode=XX` for region filter, `hidebroken=true` to skip dead streams, `limit/offset` for pagination, `order=clickcount&reverse=true` for popularity sort.
  - **Vintage shortwave-cabinet aesthetic**: warm wood-grain background (layered repeating-linear-gradients @ 96°/102° for the bands), cream bakelite controls panel, brass + amber accents. Bungee Shade for the WEB·SDR HUB wordmark with hot amber accent, Cormorant italic tagline, Special Elite typewriter for labels, VT323 for the phosphor LED + dial readouts, JetBrains Mono for everything else.
  - **Dial / now-playing**: dark recessed strip with a pulsing amber LED (CSS keyframe), VT323 station name in glowing amber, JetBrains Mono meta line (country flag + name · codec · bitrate · top-3 tags). Volume slider + ■ stop button. LED pulse animates only while playing.
  - **Filters**: two chip rows — GENRE (popular/jazz/classical/electronic/rock/news/talk/lofi/ambient/reggae/techno/metal) and REGION (Any / US / UK / DE / FR / JP / BR / NL / IT / ES / AU / ★ Favourites). Active chip is amber-on-amber-glow with `aria-pressed`. Genre chip clears the search field; switching to ★ Favourites bypasses the API entirely and renders from localStorage.
  - **Search**: 350ms debounced text search with the `/` keyboard shortcut to focus. Search field clears when a genre chip is clicked.
  - **Station cards**: flag emoji (built from ISO country code → regional-indicator codepoints), Bungee Shade station name (truncated), country + codec + bitrate sub-line in brass, top-3 tags in italic Cormorant, vote count in VT323 amber, ★ favourite toggle button. Click a card → play. ★ button click is `stopPropagation`'d so favourite-ing doesn't start playback.
  - **Audio**: standard `<audio crossorigin="anonymous" preload="none">`. URL is `url_resolved` (the API already followed .pls/.m3u redirects) with `http://` force-upgraded to `https://` to dodge mixed-content blocks on https hosts. Click count is bumped on the API best-effort via `/json/url/<uuid>` so popular stations get credit.
  - **Favourites**: localStorage `web-sdr-hub-favs` map keyed by stationuuid, persists name + url + country + codec + bitrate + tags so favourites work even when offline-from-the-API.
  - **Pagination**: `↓ load more stations` button under the grid; hides when fewer than PAGE_SIZE (60) returned in the last call. Each page appends to `state.stations` without re-rendering the whole grid.
  - **Stale-request guard**: every fetch bumps `state.lastReq`; if a result comes back from an earlier search after the user typed more, it's discarded.
  - **Keyboard**: `/` focus search · Space stop (when playing) · Esc stop / blur input.
  - **WCAG**: rem-everywhere, semantic main/section, `aria-live="polite"` on the dial + status line, `role="group"` on chip rows, `aria-pressed` on chips, label-for / aria-label on every interactive control, focus-visible amber outlines, ≥2.4rem tap targets, `prefers-reduced-motion` kills all animations + transitions, mobile breakpoint at 540px collapses dial to 2-col + stacks controls and drops grid to 1 col.
  - **OG image**: Pollinations flux.

## issues
- Some stations stream over plain http or use a codec the browser doesn't natively support (AAC+, OGG with rare profiles). The audio element fails silently in some cases — we surface a 'lost signal · stream dropped or browser blocked the codec' status when the element fires `error`.
- The User-Agent header in our fetches doesn't actually reach the server because browsers don't allow setting it from JS; the API still accepts our requests anonymously.
- Country filter via `countrycode=XX` works on most endpoints but the API's `/json/stations/topvote` endpoint sometimes returns results from outside the requested code if it's low on votes for that country.
- Favourites mode shows only what's saved locally — if a saved stream goes dead, we don't currently detect or strike-through it. Could fetch `/json/stations/byuuid/UUID1,UUID2,...` to validate.
- No history of recently-played stations.
- No "now playing" track metadata — Internet radio sends Icy/Shoutcast title strings in the stream headers but browsers don't expose those to the `<audio>` element. Would require a server-side proxy.

## todos
- Spectrum visualizer (use the existing `crossorigin="anonymous"` + `AnalyserNode` over the audio element)
- Recently-played history (localStorage ring of last 20)
- Sleep timer ("stop after N minutes")
- Validate favourites on load via `/json/stations/byuuid`
- Country drop-down for ALL ~200 ISO codes (current chip row only shows the top 11)
- Random / 'spin the dial' button that picks a totally random station from a popular tag
- Mini-mode that hides the cabinet + grid and just keeps the dial + a tiny chip strip (for background-tab listening)
- Web Audio waveform on the LED (replace the CSS pulse with a frequency-driven pulse)
