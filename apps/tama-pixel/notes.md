# Tama Pixel

## log
- 2026-04-06: Initial build — pixel-art Tamagotchi clone with hunger/happiness/energy stats. 6 evolution stages (Egg → Baby → Child → Teen → Adult → Elder), egg hatching animation with crack lines, idle wandering, sleep mode with Zzz particles, poop spawning + cleaning, death state with ghost, color palette shifts based on care quality (blue=good, red=poor). 12x12 pixel sprites per stage. Silkscreen + DotGothic16 typography, dark purple handheld device aesthetic.

## features
- 6 evolution stages with unique 12x12 pixel sprites
- 3 stats: hunger, happiness, energy (all decay over time)
- 4 actions: Feed (+25 hunger), Play (+20 happy/-15 energy), Sleep (toggle, restores energy), Clean (removes poops)
- Egg hatching animation with wobble and crack lines
- Poop spawning with dirty penalty to happiness
- Care quality affects pet color palette (blue → green → gold → red)
- Age-based evolution at set thresholds
- Idle pet wanders left/right, bounces
- Sleep mode: closed eyes, Zzz particles, energy recovery
- Death when all stats hit 0, ghost animation, restart
- Sparkle effects on clean and evolution
- Heart/food particles on actions
- Hunger warning flash when low
- Rendered at 64x64 scaled up for pixel art look

## issues
- No persistence (pet resets on page reload)
- Stats decay is timer-based, not real-time (pauses when tab inactive)
- Poop spawns are purely random, not tied to feeding
- No sound effects

## todos
- Add localStorage save/load for persistence
- Sound effects (feed crunch, play jingle, evolution fanfare)
- More evolution branches based on care style (well-fed vs well-played)
- Mini-games for play action
- Supabase leaderboard for longest-lived pet
- OG image
