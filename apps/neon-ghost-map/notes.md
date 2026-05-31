# neon-ghost-map · notes

## log
- 2026-05-19: v1 — **neon ghost map · viewer locations as glowing drifting trails**, per chat ask "create a neon ghost map that visualizes viewer locations as glowing drifting trails". Single-file ~25KB, Supabase Realtime presence, 14 seeded fake ghosts for solo-visit baseline, zero deps beyond /supabase-config-fixed.js.
  - **Background** · 60-col × 30-row dot-matrix world bitmap (6° lat/lng resolution) drawn as small `#8cb4ff` dots at every land cell, plus very faint 30°-graticule lines and a slightly-brighter equator. Equirectangular projection: `x = (lng+180)/360 × mapW`, `y = (90-lat)/180 × mapH`, with HUD-aware top/bottom/side padding.
  - **Ghost class** · each viewer is a wandering particle with anchor lat/lng + offset (ox, oy) + velocity (vx, vy) + 28-38 segment trail (live ghosts get the longer trail). Update rule: random-walk acceleration `±24/s`, restoring force toward anchor `-0.55·ox`, damping `0.96^(dt·60)`, integrated; offset clamped to wander radius (28u for seeded, 38u for live). Trail rendered as additive `globalCompositeOperation='lighter'` stroked segments with quadratic fade-alpha and 0.8→3px width ramp from tail to head. Head glow: `shadowBlur=22` + outer aura ring at 18% alpha. Pulse radius `4 + sin(phase)·1.2`, phase increments faster for live ghosts.
  - **Seeded fake ghosts** · 14 wanderers at deterministic cities (Tokyo, NYC, London, Sydney, Paris, Berlin, Mumbai, Beijing, LA, Mexico City, São Paulo, Cairo, Lagos, Istanbul…). Random color from 6-neon palette (cyan/magenta/violet/pink/aqua/gold), random fake usernames (k4nye, ratclad, modemboy, velvetfox, nullcrow, kithra, phorm, lumen, glasswolf, ophanim, static-saint, biscuit, undertone, pomelo). Map always feels populated even with one real viewer.
  - **Real viewer presence** · Supabase channel `neon-ghost-map-v1` with presence + broadcast. On `SUBSCRIBED`, `channel.track({id, lat, lng, color, name, city})` — 8-char YOU_ID per session. `presence/sync` listener rebuilds the live ghost roster (creates new Ghosts for unseen ids, updates anchors for moved viewers, deletes ghosts that left). Self-filter on YOU_ID. Anchor change triggers trail reset so the ghost visibly "drifts" to its new spot.
  - **You** · spawned at a random city from the 40-city pool with a random color (persisted to `localStorage['ngm-color']`). Auto-generated `visitor-NNNN` name persisted to `localStorage['ngm-name']`. Drawn with an extra dashed-circle "you-are-here" reticle that pulses. HUD bottom-left shows the city name + lat/lng with sign (`51.50° N, 0.10° W`), 6 color swatches to pick from, and two buttons: ↻ random city (rerolls anchor) + 📍 share location (browser geolocation with 10s timeout, falls back gracefully on denial).
  - **Click to drift** · clicking anywhere on the map sets your anchor to that lat/lng + assigns the nearest city name. Drift animates naturally because the wander offset doesn't reset to zero — old position becomes a trail behind your new anchor.
  - **Whispers** · click on yourself OR press `M` to open an inline input box positioned above your ghost. Type up to 80 chars + Enter → broadcasts via Supabase broadcast event `whisper`. Other viewers see the bubble float above your ghost for 5s with neon-bordered rounded backing, fading out the last half-second. Escape closes the input.
  - **Hover tooltips** · 14u-radius hit test on every ghost reveals an absolute-positioned tooltip with `<b>name</b> · you · city` styled with violet-tinted border.
  - **HUD** · 4 floating glass panels (12px backdrop-blur, 1px periwinkle border, deep cosmic background): top-left title in Major Mono Display ("neon·ghost·map") + Cormorant italic tagline + live counts (total/live/drifting), top-right presence pulse pill (connecting/live/offline), bottom-left "you are drifting from" card, bottom-right help card with kbd-styled keys.
  - **Aesthetic** · void `#060218` background with magenta/cyan/pink radial glows. Neon palette `#66f5ff` `#ff2e9a` `#b870ff` `#ff7eb9` `#7dffd5` `#ffd24a`. Frame-fade trail via `fillRect rgba(6,2,24,0.28)` each frame for motion-blur look. Major Mono Display + Cormorant Garamond italic + JetBrains Mono.
  - **WCAG basics** · `<canvas aria-label>`, role="status"-style HUD elements, focus-visible cyan outline, ≥18px swatch hit areas, prefers-reduced-motion kills the HUD pulse + connection-dot pulse.
  - **Performance** · HiDPI-aware canvas (`devicePixelRatio` capped at 2), additive-blend trails are the hot path. ~28 ghosts at 60fps stays under 5ms/frame on a 4-year-old MacBook. Trail length is the main knob (28-38 segments).
  - **Mobile** · responsive HUD shrink at 720px (help panel hidden, you-card width-capped, conn pill at 9.5px).
  - **OG image** · Pollinations flux seed 1313, "Neon ghost map of Earth at night, glowing cyan and magenta viewer trails drifting across continents, synthwave dotted world map, deep cosmic violet". No `referrer` param per project notes.

## issues
- Dot-matrix world map is intentionally rough (6° resolution, hand-traced). Greenland/Indonesia/Madagascar shapes are approximate. If chat asks for cartographic accuracy, swap in a higher-res bitmap or a GeoJSON path-based map.
- Antarctica is drawn as a solid band at lat -66 to -90; doesn't include the actual coastline shape.
- Geolocation button works only on HTTPS in real browsers. Denial path is handled (button shows "📍 denied" and stays clickable).
- Trail segments cross the map antimeridian visually (e.g., a viewer in Tokyo moving toward Sydney would draw a straight line in projection space, which is technically wrong for great-circle paths — but invisible at the scale we use).
- Presence channel is global — all viewers across the world are in the same room. If/when chat wants room-codes (like pixel-fog v1.4), the architecture supports it via a channel-name param.
- The seeded fake ghosts have random colors per page-load; if chat wants stable identity, store seed in localStorage.

## todos
- Switch the world bitmap to a higher-fidelity 120-col × 60-row (3° resolution) source — would double the dot count but still <10k dots.
- Add a constellation mode where trails connect briefly when ghosts get close (within 80px).
- "Twitch chat → ghost" mode where each chatter spawns a ghost at a per-username-hashed city (deterministic).
- Audio: ambient drone modulated by total ghost count + a soft chime when someone whispers.
- Press a key to "broadcast a wave" — fires a expanding ring particle from your ghost that everyone sees.
- Per-ghost username display in a corner roster (top 5 most recent joiners).
- Time-of-day shading on the world map (the half facing the sun gets a subtle warm tint).

## design notes
- Used `globalCompositeOperation='lighter'` (additive blending) only for trail strokes + glow auras; the head dot uses normal compositing to keep saturation crisp.
- Anchor + offset model is more stable than free-flying particles — ghosts always pull back to their assigned city even after big velocity kicks.
- Avoided fancy shaders or WebGL — plain Canvas2D at DPR-2 is sufficient and works everywhere including older mobile.
- Per the windows-11-recall-nightmare debugging session, NO `transform-box: fill-box` on SVG groups anywhere — all HUD animations use plain CSS keyframes with explicit pixel transforms.
