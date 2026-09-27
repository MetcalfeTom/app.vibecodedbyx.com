# Sun Angle ☀️

Davis's idea (davis9001, Twitch, 2026-09-27): a clock that turns the time at a geo coordinate into one 0–360 number from where the sun is.

## How it works
- The number is the sun's **hour angle** at the pin: 0° at solar noon, +15°/h, 180° solar midnight. 1° = 4 min of sun time. (The voice promised "zero at solar noon, midnight is 180" on air.)
- NOAA solar position algorithm (declination, equation of time, elevation with refraction, azimuth). Checked: Greenwich 21 Jun 12:00 UTC → eq −1.8 min, dec 23.44°, el 61.97°; London day 16 h 38 m; Svalbard midnight sun.
- Dial: noon at the top, clockwise. Ring bands: sun up (−0.833°), civil/nautical/astronomical twilight, from `halfArc(lat, dec, h)`.
- The page background is the real sky colour at the pin (elevation → gradient).
- Map: equirectangular day/night shading on a 240×120 grid, graticule, tropics, preset cities as landmarks, subsolar sun. **No coastlines**: no local map data exists and we don't fetch external files.
- Start location: link hash `#lat,lon,name` → else a time-zone city table guess (`TZ`) → then asks the browser for geolocation automatically (Davis: "the pin should be based on the user's location").

## Log
- v1.3 (2026-09-27): 'Copy link to this spot' button (clipboard, falls back to showing the URL); descriptions mention the planets.
- v1.2 (2026-09-27): any world (Davis): chips for Earth, Moon, Mercury … Neptune, Pluto. Generic engine = JPL approximate Keplerian elements (1800–2050) + IAU rotation models → subsolar point → hour angle at the pin (sign flips for Venus/Uranus so the dial still counts up). Validated in node: generic Earth vs NOAA within 0.1° lon / 0.003° lat; Mars vs Mars24 within 0.02° lon (lat differs ≤0.23° = planetocentric vs planetographic); Moon subsolar lon ≈ ±5° at full moon, ≈180° at new moon (libration). Solar days: Mercury 175.9 d, Venus 116.75 d, Mars 24 h 39.6 m, Jupiter 9.93 h, Pluto 6.39 d. Per-world sky palettes (Mars blue sunsets, black airless skies), map palettes, landmarks, rise/set times with dates, day length, sun size and light time. Analemma for any world with ≥20 days per year (Mars teardrop), centred on the mean sun; Moon/Mercury/Venus explain why there's none. Hash `#mars/lat,lon,name`.
- v1.1 (2026-09-27): the analemma (Davis): the sun at 12:00 local mean time at the pin, every day of the year, x = dial angle, y = elevation, months marked, today glowing; the build stamp gets a dark pill so it reads on a daytime sky.
- v1.0 (2026-09-27): dial, live number with arc-seconds, readouts (sun time, azimuth, elevation, rise/set angles + local clock times, daylight, next solar noon, equation of time), day/night map with tap-to-move pin, presets, shareable hash.

## Issues
- Headless runs in UTC, so the tz guess returns null there (Greenwich default).
- 📍 renders as tofu only in headless.

## Todos
- Uranus analemma is two near-parallel strands (98° tilt); unverified against a reference but it is what the model gives.
- Ideas: moons of Jupiter/Saturn (Titan, Europa), a 'meet at the same sun angle' link for friends.

## Testing
- `window.__sa = { sun(ms, lat, lon), halfArc(lat, dec, h), setLoc(lat, lon, name, quiet) }`
