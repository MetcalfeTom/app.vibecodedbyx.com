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
- v1.0 (2026-09-27): dial, live number with arc-seconds, readouts (sun time, azimuth, elevation, rise/set angles + local clock times, daylight, next solar noon, equation of time), day/night map with tap-to-move pin, presets, shareable hash.

## Issues
- Headless runs in UTC, so the tz guess returns null there (Greenwich default).
- 📍 renders as tofu only in headless.

## Todos
- Davis asked: any planet (Mars first: Mars24 algorithm, 1 sol = 24 h 39 m 35 s) and the analemma (figure-8 of the sun at the same clock time over a year).

## Testing
- `window.__sa = { sun(ms, lat, lon), halfArc(lat, dec, h), setLoc(lat, lon, name, quiet) }`
