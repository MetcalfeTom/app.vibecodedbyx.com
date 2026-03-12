# Sloppy Mario

A wobbly platformer with gooey levels. Jump on platforms, collect coins, reach the flag.

## log
- 2026-03-12: Initial build. Procedural level generation with ground segments, gaps, goo zones, floating wobbly platforms, coins, and end flag. Blobby player with bezier-curve body, squish/stretch on land/jump, wobbly idle animation, expressive eyes with blink + directional pupils, open mouth when airborne, rosy cheeks. Purple goo kills on contact with bubbling surface. Floating platforms bob sinusoidally. Splatter particles on death. Coin collect burst. Camera smooth follow. Levels get longer with more platforms/coins per level. Bungee Shade + Outfit typography, pink/purple palette.

## issues
- None yet

## todos
- Enemies (goopy blobs that patrol platforms)
- Wall sliding / wall jump
- Power-ups (double jump, speed boost)
- Leaderboard for speedruns

## notes
- No database — pure frontend platformer
- Procedural levels: ground segments with random gaps/goo, floating platforms increase per level
- Player physics: gravity 0.55, jump -11, move 4.5, friction 0.85
- Squish/stretch: landing sets squish positive (wider+shorter), jumping sets negative (taller+thinner)
- Wobble: sinusoidal body distortion based on movement speed
- Goo zones: purple pools with animated surface bubbles, instant death
- Floating platforms: wobble vertically via sin(t + offset)
- Collision: separate X and Y resolution passes
