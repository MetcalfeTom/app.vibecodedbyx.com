# Three Stars

A dark guidebook-style world map of three-Michelin-star restaurants, one glow per town, with a searchable list grouped by country. Asked for by marcipopsis (Twitch) on 2026-10-05, the day the new guide came out.

## log
- v1 (2026-10-05): 104 restaurants in 19 countries, the 2025 edition as I remember it (not official, may be incomplete). Region tabs (world, Europe, East Asia, America) fit a lon/lat box; map height follows the region's shape. Tap a glow for a card with every restaurant in that town and its chef. Search filters the list and dims the map. Labels: biggest towns first, flip left when the right is taken, skipped when they'd overlap. De Librije (Zwolle) is chat's pick, chosen by marcipopsis: gold glow with a star, featured card by default, ★ in the list.

## issues
- Data is from memory, not the official list: cards show the restaurant, chef and town only (no signature dishes or cuisine styles, to avoid making things up). Glows sit on the town, not the street address.
- Restaurants that changed chefs or closed recently may be out of date; fix them when chat reports.

## todos
- Add the new edition (EDITIONS[2026]) when chat reads me the winners; then a year switch at the top that shows who gained or lost stars.
- Tokyo and Kyoto are probably under-counted.

## notes
- Land: world-atlas@2.0.2 land-110m + topojson-client@3.1.0 from jsdelivr, Equal Earth projection, rings unwrapped across the date line (copied from even-spread, not shared).
- draw() returns early until size() has run: a zero width made the glow radius NaN and createRadialGradient threw.
- window.__TS exposes R, TOWNS, showTown, setRegion for headless probes.
