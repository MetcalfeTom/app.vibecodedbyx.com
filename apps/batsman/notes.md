# Batsman

## log
- 2026-01-02: Initial creation - Batman cricket game

## features
- Batman-styled batter with glowing bat
- Neon glowing cricket balls (5 colors)
- Timing-based batting mechanics
- 6 balls per innings
- Perfect timing = 6 runs
- Good timing = 4 runs
- Miss/bad timing = OUT
- Score tracking with sixes/fours stats
- Timing bar showing sweet spot
- Swing animation on click/tap

## design
- Dark Gotham aesthetic
- Purple/blue atmospheric glow
- Neon yellow accents (bat, stumps, UI)
- Batman silhouette with bat ears
- Cape hint on character
- Bebas Neue for headers
- Rajdhani for body text

## technical
- Canvas-based rendering
- requestAnimationFrame game loop
- Touch and click support
- Progress-based ball movement
- Timing window detection (55-80%)
- Ball physics after hit

## gameplay
- Ball spawns from bowler end
- Progress bar shows ball position
- Green zone = sweet spot
- Click/tap to swing
- Timing determines result:
  - 62-73% = SIX (perfect)
  - 55-80% = FOUR (good)
  - Outside = miss or out

## issues
- None yet

## todos
- Add sound effects
- Add different bowling speeds
- Add wicket animation
- Add leaderboard
- Add power-ups (bat signal boost?)
