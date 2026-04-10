# Grape Squish

Squish grapes with a cat paw. They dodge when you click.

## log
- 2026-04-10: Initial build. Canvas game — purple grapes fall, custom cat paw cursor tries to squish them. Click to slam paw down, but missed clicks cause nearby grapes to dodge away with burst speed. Combo system (2x-10x), wave progression (faster spawns, more grapes), 5 misses = game over. WebAudio SFX (splat, dodge whoosh, miss buzz). Grape rendering: purple spheres with highlights, stems, dodge flash. Paw rendering: pink pads, 4 toe beans, claws extend on slam. Juice particle explosions on squish. Splat rings. Background grid. Bungee Shade + Azeret Mono typography, deep purple/neon aesthetic.

## features
- Custom cat paw cursor with toe beans and retractable claws
- Purple grapes with wobble physics and stems
- Click-to-dodge: missed clicks send nearby grapes flying
- Combo system (up to 10x multiplier)
- Wave progression (more + faster grapes each wave)
- Juice particle explosions on squish
- Splat ring effects
- WebAudio SFX (splat, dodge, miss)
- Space bar support
- Miss counter (5 = game over)
- Neon glow effects throughout
- Mobile touch support

## issues
- No leaderboard
- Paw claws are CSS var which won't work in canvas fillStyle (uses literal color instead)
- Very high waves may flood screen

## todos
- Supabase leaderboard
- Power-ups (slow motion, bigger paw, magnet)
- Grape varieties (golden grape = bonus, rotten grape = penalty)
- Screen shake on slam
- OG preview PNG
