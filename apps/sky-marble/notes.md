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

## issues
- Open-Meteo counts EVERY grid point as a call: 600 a minute, 5000 an hour and 10000 a day per IP. The first build asked for 648 points (10° grid), and the next spot lookup got a 429. Keep the grid under ~300 points. A 429 on a spot shows "the weather service is busy for a minute, this is the globe's estimate".
- Testing from the sandbox burns the same quota (each headless run = 288 calls). Space out the runs.
- Land rings crossing the date line are unwrapped and drawn at −360, 0 and +360. Without this, the coast stroke drew rings round the north pole.
- No test hook in the live file. For probes, append `window.__SM = { st, view, showSpot, lookAtLL, stepWind, sample, sunObj, ll2v, earth };` to the scratch copy.

## todos
- A wildest-storm button that flies to the strongest wind or heaviest rain right now.
- A time slider: hourly forecast for the next 24-48 h, so the winds and clouds move.
- City lights on the night side, and a terminator glow.
- Phones: move the globe up when the card is open.
