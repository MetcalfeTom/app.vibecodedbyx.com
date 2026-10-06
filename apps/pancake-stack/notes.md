# Pancake Stack

## log
- 2026-01-11: Created pancake stacking game with wobble physics
- 2026-01-11: Added angry butter that tries to slide off the stack
- 2026-10-06: **loads faster** (site stats had it among the slowest, median 3.4 s). Slow part: Fredoka came in through a CSS `@import` in <style>, so nothing painted until fonts.googleapis.com answered, and the woff2 from fonts.gstatic.com then held up the load event. Now: preconnect to both hosts, the font stylesheet is `<link media="print">` (fetched on the side, never blocks), and a `load` listener switches it to `all`; on a return visit (localStorage `pancakeFont`) the link's onload switches it at once, so the cached font is there before the first paint (no flash). <noscript> fallback kept; fallback stack `ui-rounded, 'Arial Rounded MT Bold', 'Trebuchet MS'` for the moment before Fredoka arrives. Measured headless (390x844 phone, 150 ms latency, 1.6 Mbps, 4x CPU, fresh profile, gzip, median of 5-7): first paint 476 → 307 ms, load event 789 → 410 ms, Fredoka on screen 805 → 776 ms (unchanged). If the site bar script isn't cached yet it becomes the slowest piece (load 826 → 825) and Fredoka swaps in later (~1.2 s). Return visit: font ready before first paint, as before. Looks and plays the same.

## features
- Click/tap to drop pancakes onto the stack
- Realistic wobble physics with gravity, bounce, friction
- Pancakes stack and transfer wobble to each other
- Angry butter spawns after first pancake
- Butter constantly tries to escape by sliding off
- Butter eyes track its escape direction
- Rage steam particles when butter is really angry
- Score tracking with local storage high score
- Game over when butter escapes off screen
- Warm breakfast-themed color palette
- Mobile and desktop friendly

## issues
- None yet

## todos
- Could add syrup drizzle effect
- Could add fork/knife obstacles
- Could add combo bonuses for fast stacking
