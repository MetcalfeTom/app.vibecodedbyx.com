# eclipse-experience (Umbra — the eclipse experience)

## log
- 2026-08-12: v1 per chat — and the timing is real: TODAY is the Greenland→Iceland→Spain total solar eclipse. Single file, Gloock + Atkinson Hyperlegible, indigo/corona-gold.
  - **Verified astronomical data, embedded**: dates/types/visibility for 10 upcoming eclipses (2026–2030) from the canonical NASA/GSFC (Espenak) catalog values — astronomical facts, embedded as constants, sourced in-app. Today's central line as 14 (lon,lat,UTC-minutes) points approximated to ~1° (greatest eclipse ~17:46 UTC near Iceland, Spain ~18:25–18:30 near sunset), labeled approximate + "not navigation-grade" + verify-locally advice.
  - **Interactive map**: hand-drawn stylized world (13 embedded landmass polygons — honest about being impressionistic), equirect canvas with drag-pan, wheel/button zoom (1–7×, cursor-anchored), graticule, partial-visibility glow, totality band + glowing central line with UTC time ticks, click-to-pick marker.
  - **Location-aware guidance**: click the map OR consent-gated geolocation (asks only on button press; refusal handled). Verdicts: totality (≤160 km from central line, with local UTC time + duration note), partial (≤5200 km, distance-based % estimate LABELED as estimate ±10%), not-visible (with distance to nearest visibility). Spain/late-path picks get a low-sun-find-western-horizon warning. Safety reminder attached to every visible verdict.
  - **Eye safety panel**: ISO 12312-2, glasses-on-except-totality, pinhole projector, filters-in-front-of-optics.
  - **Calendar**: future events sorted with day countdowns, TODAY badge, includes 2027-08-02 Luxor (longest land totality this century).
  - **GEOMETRY LESSON (probe-caught, 2 real bugs)**: nearest-VERTEX distance under-covered the band between sparse path points — Reykjavík (truly inside totality) classified partial; fixed with point-to-SEGMENT projection in local-planar km space + time interpolation along the segment. And 3800 km partial radius was too tight for this polar-geometry eclipse (NYC really gets a shallow partial); widened to 5200 km. Both caught by city-truth asserts (Reykjavík=totality, Madrid=deep partial+low sun, NYC=shallow partial, Sydney=none).
  - Verified 17/17 + screenshot review (path, ticks, banner, verdict panel, calendar all correct).

## issues
- The world map is stylized (hand-embedded polygons) — coastline pedants will notice; the app says so itself. Don't chase cartographic fidelity, it's a feature.
- Guidance % is distance-based, not an ephemeris — labeled ±10%. If chat wants real magnitudes, that's a Besselian-elements computation (doable offline, ~150 lines) — a good v2.
- Only the 2026-08-12 event has an embedded path. After today passes, the featured banner falls back to "next eclipse + countdown" (2026-08-28 partial lunar) but the map keeps showing today's path — embed the 2027-02-06 / 2027-08-02 lines when chat asks.

## todos
- Besselian-elements local-circumstances calculator (real magnitude/contact times, still fully offline).
- 2027-08-02 Luxor path (the century's big one) as the next featured map.
- "Eclipse simulator" — animate the moon's shadow disc sliding along the path in real time / scrubbed.
