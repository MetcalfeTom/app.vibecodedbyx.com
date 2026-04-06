# Toast Master

## log
- 2026-04-06: Initial build — competitive toaster simulator with timed popping mechanic. Canvas-drawn chrome toaster with glowing coils, bread that changes color in real-time, steam/smoke particles, pop physics with rotation. 7 heat zones from Raw to Charcoal, letter grades (F to S), flavor text, toast history with color chips. Anybody + DM Mono typography, warm kitchen palette.

## features
- Canvas toaster with chrome gradient, slot, lever, brand plate, heat dial
- Bread changes color smoothly from pale (#f0e0c0) through golden to charcoal (#1a0a04)
- Coil glow intensifies as heat rises, visible through slot
- 7 heat zones: Raw (F), Light (C), Golden (B), Perfect (S), Dark (B-), Burnt (D), Charcoal (F)
- Pop physics: bread launches up with gravity + rotation
- Steam particles at 40%+ heat, smoke at 70%+
- Auto-pop at 100% (charcoal)
- Pop flash effect
- Random flavor text per grade ("The fire department has been notified")
- Toast history: color chips showing past toasts
- Stats: best grade, perfect count, burnt count, total
- Heat bar with colored zones and labels
- Space/Enter to push down and pop
- Slight randomized heat speed for variety

## issues
- No sound effects (toaster click, pop sound, sizzle)
- No multiplayer/leaderboard
- Heat acceleration is linear-ish, could be more dramatic

## todos
- Add Supabase leaderboard (most perfects in a row)
- Sound effects (lever click, heating hum, pop, ding)
- Different bread types (bagel, waffle, pop-tart) with different heat curves
- Achievement system (10 perfects, first charcoal, etc.)
- Multiplayer split-screen race to perfect toast
- OG image
