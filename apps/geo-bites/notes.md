# geo-bites

## log
- 2026-05-08: shipped — geolocation-based restaurant picker. The user clicks **enable location** → browser permission prompt → on success, picks a radius (200m – 5km) and a set of kinds (restaurant / café / bar / pub / fast food), then **search the streets** queries Overpass for everything matching, and the **spin picker** randomly lands on a single recommendation tilted toward closer-distance results. Free OpenStreetMap data, no API key, no signup.
  - **Geolocation**: `navigator.geolocation.getCurrentPosition` with `enableHighAccuracy: false` + 9s timeout + 60s maxAge cache. Permission denial / unavailable / timeout all surface as inline status text in the search card.
  - **Data source — Overpass API** (`overpass-api.de/api/interpreter`): POST with `data=` form-encoded query, CORS-friendly, no rate-limit signup. Query template uses node + way + relation against `amenity~"^(<kinds>)$"` with `(around:radius,lat,lon)`, then `out center tags;` so ways/relations get a centroid alongside their tags. 25s timeout in the QL itself.
  - **Open-now check**: every place with a non-empty `opening_hours` tag is fed through `opening_hours.js` (loaded from jsdelivr, ~80KB minified — handles the full OSM opening_hours grammar including `PH`, sunset/sunrise calcs, year/month/week constraints). `oh.getState()` returns true/false/unknown. Nominatim object stub `{lat, lon}` provided so the library can do sunset math.
  - **3 buckets**: open / closed / unknown. Open + Unknown go in the main "open near you" card with green and dim-paper visual treatments; Closed in a separate card below with reduced opacity.
  - **Spin picker**: cycles through random pool names every 60ms for 14–22 ticks, then lands on a final pick selected from the 8 closest open spots (so the recommendation is always reachable). Wheel border switches from dashed terracotta to solid mustard with a pulsing shadow during spin. Shows kind / cuisine / distance / open-state + the raw `opening_hours` string in mono small-text + an "open in maps" link to OpenStreetMap centred on the venue at zoom 19.
  - **Distance** via Haversine, displayed as `m` under 950m else `km` to 2 decimals.
  - **Dedup pass** on `name + 4-decimal coord` so a venue tagged as both a node AND a way (common in OSM) only renders once.
  - **Aesthetic**: warm cream-paper bg with diagonal fiber grain (two repeating-linear gradients at 11° and 101° + multiply blend), terracotta `#c64a2e` + mustard `#c58a2f` + sage `#5a7a4a` + ink `#2a1a08` palette. Bricolage Grotesque (variable, opsz 96 weight 800) for the masthead "geo·bites" with the ink-italic separator dot, Crimson Pro italic for the tagline + meta lines, JetBrains Mono for all the small caps section headers + status. Section cards have a 1.6mm offset double-shadow for that newsprint feel. Pick wheel has a dashed-terra border that goes solid + pulsing during spin.
  - **Accessibility**: rem units, 100% root font-size, semantic `<main>` + `<header role=banner>` + `<section>` + lists, skip link, `aria-live="polite"` on status + lists + pick wheel, `aria-pressed` on the kind toggle pills, focus-visible terra outlines, ≥2.4rem touch targets on pills + 3rem on primary buttons, `aria-label` on every input + button. Pill kind buttons use `aria-pressed` for proper toggle semantics. List items are clickable + keyboard-actionable (Enter opens the OSM map).

- 2026-05-08: **Pivot to neon casino slot machine + Mario-Kart mystery-box reveal + Overpass 504 retry/fallback** (3 chat asks bundled). The warm-cream newspaper aesthetic is gone; everything is now deep-purple casino with neon pink/cyan/gold/lime glow.
  - **Overpass retry + multi-endpoint fallback** (chat ask): `OVERPASS_ENDPOINTS = ['overpass-api.de', 'overpass.kumi.systems', 'overpass.openstreetmap.fr']`. New `overpassFetch(query)` walks the list with 2 attempts per endpoint, 800ms backoff between attempts, AbortController-driven 18s per-attempt timeout. Status pill announces the active host on each attempt (`overpass · kumi.systems · attempt 2`), so the user sees the fallback in real time. QL timeout knocked down 25 → 15 so failures bubble faster. If all three mirrors fail, surfaces "all overpass mirrors failed" with the underlying error message.
  - **Slot machine cabinet** (chat ask): replaced the dashed pick-wheel with a gold-bordered casino cabinet — `border:.32rem solid #ffd45e`, deep-purple gradient body, glowing yellow + pink + cyan corner bulbs blinking at staggered phases (38 procedurally-generated `<span class="bulb">` around the perimeter). Marquee strip in Press Start 2P gold reads "★ DROP A TOKEN · FIND DINNER ★". Inside the cabinet sits the **reel window** — black panel with cyan border + inset glow, vertical fade gradient for that CRT-screen-curvature feel.
  - **Mario-Kart mystery-box reveal** (chat ask): three-phase animation. **Phase 1 (idle)**: big bouncing `?` glyph in Press Start 2P gold (`@keyframes qBob` 1.4s vertical wobble). **Phase 2 (spinning)**: `?` swaps to a fast-spin (`@keyframes qSpin` 360° per 140ms) while the reel-name shake-jitters at 80ms intervals. JS `spinPick(pool)` schedules N=18-24 ticks with **ease-out cubic** interval (50ms → 290ms) so the cycle decelerates exactly like the MK item-roulette — fast at first, slowing into the reveal. Each tick swaps to a random pool member (with a tiny "don't show the final pick yet" guard so the reveal feels new). **Phase 3 (lock)**: final pick shown with a **white-flash overlay** (`reel-window.flash::after` radial-gradient burst that scales 0.6→1.6 over 0.55s with mix-blend-mode:screen) + 4-note C-major arpeggio chime (C5 E5 G5 C6, triangle, 70ms stagger) + state line goes lime "★ OPEN NOW ★" / rose "☒ CLOSED NOW" / gold "? HOURS UNKNOWN".
  - **Sound system**: per-tick blip during spin (square wave at `440 + i × 80` Hz so pitch RISES as the spin slows — adds tension), plus the lock arpeggio. Lazy-init via `ensureAudio()` on first user gesture. Mutes naturally if WebAudio fails.
  - **Press Start 2P** font added for marquee + state lines + question glyph; rest of the typography (Bricolage Grotesque, JetBrains Mono, Crimson Pro) carried over.
  - **PULL THE LEVER button**: 5.6mm bottom shadow that compresses to 0.8mm on press — same tactile-clack pattern as ship-or-sink's lever. Disabled until search returns results, then enabled.
  - **List view neon retint**: dark glassmorphic cards with magenta hover border, lime "open" / rose "closed" / dim "unknown" badges, gold cuisine accent, cyan italic kind label. Diagonal stripe pattern for unknown-state rows.
  - **Empty state in slot**: when 0 open + 0 unknown, the reel window stops spinning and shows "no open spots — try a wider radius" instead of leaving the spinner mid-cycle.

## issues
- Overpass occasionally rate-limits — the `[timeout:25]` in the QL keeps queries cheap but a hot key spam can still 429. Single user, low volume, fine for now.
- Many OSM places lack `opening_hours` entirely → they land in the "unknown" bucket. The strategist surfaces this honestly: "12 open + 4 unknown" instead of pretending unknowns are open.
- `opening_hours.js` doesn't perfectly handle every weird opening string in the wild; some return false-negatives. Library is the de-facto standard though.
- No map view — links go to OpenStreetMap.org. Could embed Leaflet later if chat wants a visible map.
- Geolocation accuracy depends on browser/device — desktop without GPS can be very rough (city-level). Acceptable for "find me dinner".
- No favourites/history persistence yet. Could localStorage the last N picks.

## todos
- Filter by minimum cuisine match (e.g., only italian).
- Distance-aware ordering toggle (currently always ascending).
- "Walking time" via a 4 km/h pace estimate.
- Include `amenity=ice_cream` and `amenity=biergarten` as additional kinds.
- Tiny inline Leaflet map showing all hits + the spin pick highlighted.
- Save last 5 spins to localStorage so you don't reroll the same place.
- Add a "wider" auto-expand button that doubles the radius when 0 results.
- Pollinations one-line "what's good there" generator on the spin pick (cached per name).
