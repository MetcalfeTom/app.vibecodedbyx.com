# Sky Marble

A 3D globe of the live weather, for iamflax (Twitch, 2026-10-11 21:38 UTC: "Pitch: Global weather seen on a globe"; asked "Globally" when offered your side vs the wildest storm). One index.html, three r170 by full URL (no import map, no addons), topojson-client + world-atlas land-110m from jsDelivr, Open-Meteo for the weather (no key).

## Art direction
- Look: a dark marble in space. Deep navy/ink background with a faint nebula, cream Fraunces italic 800 title + IBM Plex Mono for data, amber accent #ffb347.
- Light: the real sun. The subsolar point comes from the UTC time (declination by day of year, no equation of time) and is refreshed every 30 s. The night side is multiplied down to 6% in linear light, so temperatures stay faintly readable.
- Layers: temperature colours (ramp −40 → 45 °C, the same stops as the legend), wind streaks (additive LineSegments, 8-point trails), clouds (a sphere at 1.012 with alpha from cloud_cover × 3D value noise), and rain (blue patches from the weather code + precipitation × noise). Coastlines are ink strokes over a light land tint, with a graticule every 30°.
- Camera: FOV 35. fitDist() keeps the globe filling the short side; zoom ×1-5.

## log
- v1 (2026-10-11 ~21:52 UTC):
  - The grid is 288 points at 15°, in one Open-Meteo request (current temperature, wind, cloud cover, precipitation, weather code). It is cached in localStorage 'skymarble-grid' for 20 min and refetched every 20 min while the tab is visible.
  - Drag to spin with inertia, pinch or wheel to zoom, and it auto-spins after 5 s idle (not with reduced motion or while the card is open). Keyboard: arrows, +/- and Enter (reads the centre).
  - Tap a spot: a pin goes there and the card shows the globe's bilinear estimate first, then the exact spot from Open-Meteo (feels like, gusts, humidity, local time, day/night).
  - "Find a town" uses the Open-Meteo geocoding API, flies there and opens the card.
  - Toggles: °C/°F (saved as 'skymarble-unit'), and the layer chips (saved as 'skymarble-layers').
  - The initial view faces the visitor's longitude, taken from their timezone offset.

- v1.1 (2026-10-11 ~21:58 UTC): iamflax asked to rename the app "Flax World". The name stays Sky Marble (for search), but typing "Flax World" or "flax" in the find box flies to the windiest grid point right now, and the card is named Flax World ("the windiest place on Earth right now, named after Flax"). The first test landed in Antarctica: −34°, 72 km/h, gusts 98.

- v1.2 (2026-10-11 ~22:08 UTC): 48-hour forecast slider + ▶ play under the dock. The grid request adds `hourly=...&forecast_hours=48` (same 288 points; hourly[0] is the current hour). Cached as 'skymarble-grid2' with g.h = {time, t,s,d,c,p,w} laid out hour-major (index k*288+i). Hour 0 = the current readings, hour k = hourly[k]. Scrubbing repaints map + clouds (≈47 ms desktop headless), throttled to 110 ms in the render loop via st.wantHour; play steps 1 h per 420 ms. The sun follows the chosen hour (sunNow uses st.when). A spot card at a forecast hour shows the globe's estimate for that hour (no exact fetch); "rain now" becomes "rain"; the header says "forecast · drag back to now". Flax World search uses the windiest point of the shown hour. Phones: find box moved to the top under the title so the time bar fits above the chips.
- v1.3 (2026-10-11 ~22:15 UTC): a spot's fetch also asks for its own 49 h hourly forecast (one call), so scrubbing with a card open shows that spot's exact forecast (feels like, humidity, gusts, sky) plus the local time there; rows are matched by absolute time (spot times are local: Date.parse(t+':00Z') - utc_offset). Phones (≤640 px): with the card open the globe slides up into the gap between the find box and the card (camera.setViewOffset, view.lift eased, recomputed every 0.25 s).
- v1.4 (2026-10-11 ~22:25 UTC, Sloppy's own idea): 🌀 the storm of the day. The hourly grid adds pressure_msl (cache 'skymarble-grid3'). lowsAt() finds 3x3 pressure minima ≤1004 hPa between 20° and 72°, refined with a parabola; findStorm() follows every start low (|lat| ≤ 64, ≤1000 hPa: skips the Antarctic-coast trough and desert heat lows) hour by hour to the nearest low within 9°, and keeps the best by lifetime + wind + depth (+8 for the northern hemisphere). Named from STORM_NAMES by day number. Spiral button (inline SVG, emoji fonts are missing headless) in the time bar toggles it: a pink spinning swirl + dotted path, an HTML label that follows it on screen (hidden on the far side), the camera follows it while scrubbing (not while a card is open), the label opens a card. Moods: brewing (deepening >1.5 hPa in 3 h), sulking (filling), grumbling over land, about to fizzle, fizzled out. First storm: Bramble, a 974→963 hPa Southern Ocean low south of Africa heading east. Phones hide the "· +k h" part of the time label.

- v1.5 (2026-10-11 ~23:15 UTC, Sloppy's own touch): a rose dusk band along the day/night line (dusk() in LIT: a Gaussian 0.075 wide, centred a little on the night side; the earth mixes 30% rose, clouds near the line turn pink-orange and stay a bit more opaque). Orange blended into the warm temperature colours, rose reads.

## issues
- Open-Meteo counts EVERY grid point as a call: 600 a minute, 5000 an hour and 10000 a day per IP. The first build asked for 648 points (10° grid), and the next spot lookup got a 429. Keep the grid under ~300 points. A 429 on a spot shows "the weather service is busy for a minute, this is the globe's estimate".
- Testing from the sandbox burns the same quota (each headless run = 288 calls). Space out the runs.
- Land rings crossing the date line are unwrapped and drawn at −360, 0 and +360. Without this, the coast stroke drew rings round the north pole.
- No test hook in the live file. For probes, append `window.__SM = { st, view, showSpot, lookAtLL, stepWind, sample, sunObj, ll2v, earth };` to the scratch copy.

## todos
- Storm: track several storms at once, or let visitors pick the next one; the 15° grid makes small lows invisible.
- City lights on the night side, and a terminator glow.
