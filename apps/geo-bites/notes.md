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
