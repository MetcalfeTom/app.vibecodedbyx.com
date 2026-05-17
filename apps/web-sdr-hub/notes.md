# web-sdr-hub · notes

## log
- 2026-05-17: v2 — **pivot from internet radio to actual SDR receivers** per chat clarification "pivot to finding an API or listing for WebSDR nodes instead of just music stations". v1 used the Radio Browser API for streaming music stations; chat actually wanted public WebSDR/KiwiSDR/OpenWebRX receivers that let you tune real RF (HF/VHF) through a browser.
  - **Hard truth surfaced honestly in-app**: there is NO CORS-friendly JSON API for the global WebSDR/KiwiSDR listing. The three authoritative directories are HTML-only and can't be fetched cross-origin from a browser without a server proxy:
    1. **websdr.org** — PA3FWM's canonical WebSDR list (the original directory, maintained by the WebSDR creator)
    2. **kiwisdr.com/public** — live KiwiSDR receivers worldwide (500+ at any moment), maintained by the manufacturer
    3. **rx.linkfanel.net** — community-maintained KiwiSDR + WebSDR + OpenWebRX with a sortable map
  - **Solution: hub-anchor + curated list hybrid**. The masthead now prominently surfaces the three canonical directories as big amber-bordered hub cards (primary discovery surface). Below them: a hand-curated list of ~20 well-known long-attested nodes the user can click directly. Each node is marked either VERIFIED (URL is well-known + has been stable for years — green left border) or LOOKUP (the receiver exists / is famous but verify the current URL on the linked directory first — dashed brass border). Honesty over a dead-link-filled list.
  - **Curated nodes** (20): University of Twente WebSDR (the canonical reference, verified), KiwiSDR Network public discovery (verified), Hack Green Secret Bunker (UK), ON5KQ Wuustwezel (BE), DK0TE Westerstede (DE), NorthernUtah WebSDR (US), KFS Half Moon Bay (US maritime), K3FEF Pennsylvania (US), G8JNJ Martlesham (UK · SAQ/VLF community), JA-Tokyo cluster, VK6 Perth, PY2-Brazil, ZS6-South Africa, TM4XX Brittany, IK2XYP Lombardy, ZL2NXX New Zealand, OpenWebRX+ demo, OpenWebRX@Patras, and a few more.
  - **Filters**: 4 chip rows — TYPE (all / WebSDR / KiwiSDR / OpenWebRX), BAND (any / LF longwave / MF medium / HF shortwave / VHF / UHF), REGION (worldwide / Europe / N. America / S. America / Asia / Oceania / Africa), plus a 350ms-debounced free-text search across name/country/notes/bands. `/` keyboard shortcut focuses search.
  - **Each card** shows: country-flag emoji from ISO code, Bungee Shade station name, type badge (amber for WebSDR / lime for KiwiSDR / cyan for OpenWebRX), where (country · region), italic Cormorant notes (1-2 sentences of context per station), per-band chip strip (LF amethyst / MF coral / HF amber / VHF lime / UHF cyan), and the URL (or a "→ look up on the linked directory" placeholder for LOOKUP nodes). Cards without a verified URL deep-link to the most relevant discovery directory based on the node's type.
  - **Aesthetic preserved from v1**: wood-grain cabinet, brass + amber palette, Bungee Shade / Cormorant italic / Special Elite / VT323 / JetBrains Mono. New "verified" green left border + "lookup" dashed-brass left border distinguish the two confidence tiers.
  - **WCAG**: rem-everywhere, semantic main/section, role=search + role=group on chip rows, aria-pressed reflecting active filter, focus-visible amber outlines, ≥2.4rem tap targets, prefers-reduced-motion kill-switch, mobile breakpoint at 540px stacks the grid.

- 2026-05-17: v1 — initial radio-browser.info build (replaced by v2). Kept the cabinet UI shell + chip pattern + flag-emoji helper, swapped the data layer entirely.

## issues
- **No live listing API**: chat asked us to "hunt for public WebSDR or KiwiSDR directories" — confirmed via research: there isn't one with CORS. Best we can do without a backend is feature the three known directories prominently + curate a list. If a backend proxy is ever added we could scrape rx.linkfanel.net's HTML and present live status.
- **Verified vs. lookup distinction**: only University of Twente and KiwiSDR's public list page are marked verified — the rest may have moved hosts since the curation pass. The dashed border + "look up the current URL" placeholder is honest about this.
- **No live status indicators**: can't check whether a node is online without a CORS request the node would have to allow. A small subset of WebSDR sites support `/status.xml` but neither universally nor with CORS.
- **No iframe embed**: the receivers run their own waterfall UIs that need their own JS contexts and (for KiwiSDR) WebSocket connections — opening in a new tab is the right UX.

## todos
- KiwiSDR-specific: parse the live discovery JSON if/when a CORS proxy is added (the data lives behind kiwisdr.com/public/index.html as a `chunk_data` JS variable)
- Map view: drop the curated list pins on a world map (Leaflet)
- "Suggest a node" form that opens a mailto: with a prefilled body, so chat can contribute additions without me touching the file
- Frequency-range chips at finer granularity (160m / 80m / 40m / 20m / 17m / 15m / 12m / 10m / 6m / 2m / 70cm)
- Mode preset chips: SSB / CW / AM / FM / NFM / DRM (informational only — the actual receiver page handles tuning)
- Recent / favourites in localStorage
- Brief explainer card for newcomers ("what is a WebSDR / KiwiSDR / OpenWebRX?")
