# neon-radar

## log
- 2026-05-07: shipped — live storm map. RainViewer's free tile API for 2 hours of past radar + 30-min nowcast, layered as glowing neon overlays on a dark synthwave basemap.
  - **Stack**: Leaflet 1.9.4 from jsdelivr (small, no token, CORS-friendly), CARTO Dark Matter as the base (`https://{s}.basemaps.cartocdn.com/dark_all/...`, free + CORS), RainViewer manifest at `https://api.rainviewer.com/public/weather-maps.json` for the radar frames. No backend, no auth, no API key.
  - **Neon glow effect** is the centerpiece. Each frame's tile URL is registered as **two stacked Leaflet TileLayers**:
    - `.radar-bloom` — the same tiles with `filter: blur(7px) saturate(2.0) brightness(1.6)` and `mix-blend-mode: screen` at 48% opacity. Sits underneath the sharp layer and produces a real diffused halo around storm cells.
    - `.radar-tiles` — the sharp version, `mix-blend-mode: screen` + `saturate(1.6) brightness(1.18) contrast(1.12)` plus two `drop-shadow` filters (pink + cyan) for the RGB chroma fringe that makes the storms feel synth-wave.
    - Screen-blend over the dark CARTO basemap brightens precip pixels without darkening land. Empty (no-rain) tiles stay transparent so the basemap shows through cleanly.
  - **Frame management**: every entry in the RainViewer manifest's `radar.past` (~12 frames at 10-min intervals) and `radar.nowcast` (~3 frames) gets a tile-pair on map. `showFrame(idx)` flips opacity 0/1 across all pairs for a near-instant scrub. Pre-loading every frame lets playback be smooth — no per-step network fetch.
  - **5 RainViewer color schemes** swappable via the **◑ palette** button (or `P` key): NEXRAD III (default — bright greens/yellows/oranges/reds), TWC, Rainbow @ SELEX-IS, Dark Sky (pinks/cyans — most neon-y), Universal Blue. Cycling rebuilds layers via `buildLayers()`.
  - **Timeline scrubber** at the bottom: one tappable tick per frame, color-coded (cyan-tinted for past, rose-tinted for nowcast), the active frame gets a lime-tinted bg + a pink top bar with shadow-blur. The timeline `<div role="slider">` updates `aria-valuenow` so screen readers can read it.
  - **Playback**: ▶ button toggles autoplay (auto-starts ~1.8s after manifest loads); cadence slider (160–900 ms per frame) on the right of the dock; **Space** toggles play/pause; **←/→** step frames manually.
  - **Auto-refresh**: refetches the manifest every 5 minutes so newly-published frames roll in without a page reload.
  - **Locate**: `⌖ locate` button asks for geolocation (`navigator.geolocation.getCurrentPosition`) and recenters the map on the user at zoom 7. Toasts on permission state.
  - **Center pill** in the top HUD reads the current frame's local time (`HH:MM`) in Audiowide gold (or rose for a nowcast frame) so the user always knows whether they're looking at observed or predicted radar.
  - **Legend** in the right rail: a 7-stop linear-gradient strip from low dBZ blue → mid green/yellow → high red/pink with shadow-blur halo, label scale (5 / 30 / 50 / 65+ dBZ), and a "via rainviewer" credit linking to their public API doc.
  - **Toast** at top-center for transient status: "connecting to rainviewer…", "connected · 15 frames", "rainviewer unreachable · http 503" (the latter in pink with a red border so it's obvious).
  - **Aesthetic**: deep purple-black `#07041a` bg, pink/cyan/lime/violet/gold/rose neon palette. Audiowide for the brand + frame stamp, IBM Plex Mono for HUD chrome (0.18em–0.22em tracked), Cormorant italic tagline. Glassmorphic backdrop-blur panels everywhere.
  - **Responsive**: under 720px the right control rail and legend hide and the dock collapses to a single column; basic touch operation (tap timeline tick, tap play, swipe map) still works.
  - **Accessibility**: rem units, semantic `<div role="application">` map with full mechanic aria-label, `role="status"` + `aria-live="polite"` on the frame stamp + toast, `role="slider"` on the timeline with proper `aria-valuemin/max/now`, `aria-pressed` on the play button + palette, focus-visible cyan outlines on every control, ≥2.6rem touch targets on mini buttons + 3rem on play, skip link to the map, `prefers-reduced-motion` no-ops the opacity transitions.

## issues
- The `screen` blend mode means very bright basemap pixels (urban-area highlights from CARTO Dark Matter) can additively wash out under heavy radar — minor. Could swap to `lighten` blend if it ever feels too hot.
- Two TileLayers per frame doubles tile bandwidth versus a single rendered layer. RainViewer's tiles are small (avg ~6KB), 30 frames × 9 tiles visible × 2 layers ≈ 3 MB per session — fine but worth noting.
- The blur-bloom uses `filter: blur` which composites the entire layer's bbox — on very large maps it can be GPU-expensive. The pane is constrained to overlayPane so it stays under control.
- Geolocation prompt is one-shot per session (not persisted). Could remember the last centered point in localStorage.
- Auto-refresh every 5 min always rebuilds all tile layers — slight visual flicker during the swap. Could diff frame lists and only add/remove changed entries.

## todos
- A nowcast/past toggle that hides one or the other to focus on a single time domain.
- Storm-cell labels: pull NWS active warnings polygons (CORS-friendly endpoint) and overlay them with their own neon stroke.
- Lightning strikes via Blitzortung's WS feed (no API key, JSON-over-WebSocket) — animated yellow flashes per strike.
- A "loop just the last hour" speed mode with shorter cadence for the freshest data.
- Save palette + cadence + last view in localStorage.
- A small inset world-radar minimap toggle for satellite-scale storms.
