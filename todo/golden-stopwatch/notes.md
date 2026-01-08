# Golden Stopwatch

## log
- 2026-01-06: Initial creation - record-breaking stopwatch with milestone markers

## features
- Golden glowing stopwatch ring
- Circular progress indicator (10 min = full circle)
- Milestone markers at 10s, 30s, 1m, 2m, 5m, 10m
- Trophy celebrations on milestones
- Lap timing with best lap tracking
- Personal records (best lap, longest run, total laps)
- Records saved to localStorage
- New record glow animation
- Keyboard shortcuts (Space, L, R)

## milestones
- 10s: ⭐
- 30s: 🌟
- 1m: 🏅
- 2m: 🥉
- 5m: 🥈
- 10m: 🥇

## design
- Dark background with golden accents
- Circular ring with conic gradient progress
- Bebas Neue for headers
- Roboto Mono for time display
- Glowing text shadows
- Trophy float animation on achievements

## records
- Best Lap: shortest lap time
- Longest Run: longest single session
- Total Laps: cumulative lap count
- Persisted in localStorage

## controls
- START/STOP: toggle timer
- LAP: record lap time
- RESET: clear timer and laps
- Space: start/stop
- L: lap
- R: reset

## technical
- requestAnimationFrame for smooth timing
- Date.now() for accuracy
- localStorage for persistence
- CSS conic-gradient for ring progress
