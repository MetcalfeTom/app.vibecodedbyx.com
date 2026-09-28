# App Directory

## log
- 2026-09-28: **speed + first-screen pass** (app_stats: fastest-left app, 50% of 4 left in 30 s, slowest median load 3.5 s, "failed to load twin-tracks.jpg / sand-sandbox.jpg / micro-city.jpg"). Those jpgs exist now: brand-new apps just don't have a screenshot for a while, and the in-page `<img onerror>` still fired an error event. Now screenshots load through a detached `new Image()` and are only put on the card once loaded; a missing one leaves the app's icon, lit, with "screenshot soon" (no broken box, no error event). Loading: a `<head>` script starts `/_bar/apps-index.json` first (smaller, freshest times) and builds the fresh row from it as soon as it lands; the local index.json follows (or after 2.5 s if /_bar hangs), then the list is merged in the same order as before (local wins titles/genres/creators, /_bar wins newer mtime/icon). The list waits for the load event and goes in slices (first ~40 cards, then 160 per task, `flushList()` before an A–Z jump). Screenshot requests also wait for the load event (max 1.5 s) so they don't hold it back. Google font no longer `@import` (it blocked the script): non-blocking `<link media=print onload>` + a `JBM Fallback` @font-face (local mono with ascent 102%/descent 30% = JetBrains Mono's 1.32 line height, so the swap doesn't shift anything). Skeleton cards, genre chips ('…' counts) and letters are on screen from the first paint; `html{overflow-y:scroll}` (the scrollbar appearing shifted the whole page). classify() compiles its word regexes once (it compiled ~700k when the local index was missing). Phones: stats line only while searching/filtering, fresh cards 44% wide (two whole apps + a peek), heading and dice on one line, A–Z bar is one swipeable row (it was 3 rows and hid the sticky letter headings). Fixed: `.empty` (the no-matches box style) also hit A–Z buttons with no apps, making them huge; now `div.empty`. Headless numbers (local server, no gzip, 1.6 Mbps/150 ms + 4x CPU on the phone): first real app link on screen 7.4 s → 3.3 s (phone) and 6.1 → 3.2 s (desktop); thumbnails 8.7 → 4.4 s and 7.2 → 4.9 s; CLS 0.16 → 0.01 (phone) and 1.0 → 0.01 (desktop); longest task 1.4 s → 0.13 s on the phone. At 10 Mbps/40 ms: links 1.3 → 0.6 s, thumbnails 1.8 → 1.0 s. The load event itself is about the same on slow links and ~100–300 ms later on fast ones (the /_bar download now shares bandwidth with sloppy-bar.js). Probe harness: session c15135b2 scratchpad `appdir/` (srv.py nginx-like mapper with MISSING/DELAY_JSON/FAIL_JSON, run.sh + measure.py CDP timings, runf.sh + func.js functional checks).
- 2026-09-27: **front door.** 67% of visitors left within 30 s without touching anything (an A–Z wall starting at "3AM Thoughts"). Now a "fresh off the stream" row sits under the masthead: the 6 most recently updated apps with their screenshot (`https://sloppy.live/screenshots/<slug>.jpg`, falls back to the app's icon or letter), short title (cut at ' — '/' - '), "updated 2h ago"; staggered rise-in, a swipe row on phones; hidden while searching or with a genre picked. A 🎲 SURPRISE ME button opens a random game or simulator (or any app of the picked genre) in the same tab. `load()` now also reads the `/_bar/apps-index.json` rows (`[slug, title, desc, mtime, icon]`, it was skipped before because they're arrays): it's refreshed on every change, so its newer mtime and icon win over the local index (local index.json isn't rebuilt by any cron). Stats line: source hidden, last sync hidden on phones; keyboard hints hidden on touch. Real og.png (1200x630 render of the new top) instead of a pollinations URL; new descriptions.
- 2026-09-27: search placeholder shows the real app count once the index loads (it said 1200+ while 1,641 were indexed).
- 2026-01-13: Created app directory listing all sloppy.live apps

## features
- Lists all 280+ apps on sloppy.live
- Search/filter functionality
- Click to open any app in new tab
- App count display
- Clean grid layout
- JetBrains Mono font
- Neon cyberpunk styling

## issues
- Static list needs manual updates when new apps are added
- Brand-new apps have no /screenshots/<slug>.jpg for a while (twin-tracks got its own ~hours later). Never put a possibly-missing image straight into the page as `<img onerror>`: the error still reaches the stats as "failed to load x.jpg". Load it off-document first (see loadShot).
- The two catalogues are 275 KB (/_bar) + 342 KB (local) uncompressed; unknown whether nginx gzips JSON (they'd be ~110 + 95 KB). Worth checking with an external curl `-H 'Accept-Encoding: gzip' -I`.

## todos
- Could auto-generate this list from a build script
- Could add categories/tags
- Could add app descriptions
- Could add thumbnails/previews
- Could add sorting options (A-Z, newest, etc.)
