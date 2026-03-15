# Soup Weather Forecast

Today's forecast: broth gales with a chance of meatball tornadoes and crouton hail.

## log
- 2026-03-15: Initial build. Full parody weather service for soup. "National Broth-eological Administration — Est. 1847". Current conditions with 10 soup weather types (Broth Fog, Meatball Tornado, Noodle Lightning, Spice Hurricane, etc.). 5-day forecast with hi/lo temps in °F, icons, and descriptions. Soup advisories with red/orange/yellow severity levels (9 alert types). Scrolling breaking news ticker with 12 soup disaster headlines. Animated broth pressure map with pressure contours, meatball positions, noodle front lines, tornado spiral, and wind arrows. 8 soup metrics (Broth Humidity, Noodle Density, Crouton Wind Speed, Meatball Barometric, Parmesan UV, etc.). Date-seeded RNG so forecast changes daily but stays consistent within a day. Anybody + Crimson Pro typography, warm amber/brown soup palette.

## issues
- None yet

## todos
- Hourly broth temperature graph
- Radar animation showing meatball storm movement
- "Your location" soup forecast (use browser geolocation for seed)
- Sound effects (thunder = pot lid clang, wind = slurping)
- Share forecast card as image

## notes
- No database — pure frontend
- Seeded RNG from date (year*10000 + month*100 + day) for daily consistency
- 10 current conditions, 13 forecast types, 9 alert types, 12 ticker headlines
- Map: animated canvas with pressure contours (H/L), spiral tornado, wavy noodle fronts, wind arrows
- Temperatures in °F for soup absurdity (150-350°F range)
- Units: ladles/hr (wind), mBowls (pressure), strands/cm³ (noodle density), ppm (seasoning)
