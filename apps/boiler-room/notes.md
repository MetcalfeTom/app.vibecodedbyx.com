# Boiler Room

Dark, gritty boiler room simulation. Maintain pressure by turning valves before the whole thing explodes.

## log
- 2026-04-12: Initial build. Canvas-based industrial boiler room with brick walls, grime, pipe network (horizontal/vertical/diagonal), 5 clickable valves, pressure gauge with animated needle. Pressure builds over time (accelerating rate), valves release pressure when opened. Steam particles from leak points, drip system, sparks at high pressure. Explosion at >118 PSI with 300 debris particles. Warning alarm at >100 PSI. 6 WebAudio SFX (steam, valve, clank, rumble, alarm, explode) + ambient drone. Restart on click after explosion. Special Elite + Courier Prime typography, dark rust/fire aesthetic.

## features
- Canvas-rendered industrial boiler room with brick wall background
- Pipe network with horizontal, vertical, and diagonal segments
- 5 interactive valves that release pressure when clicked
- Pressure simulation that builds over time (accelerating difficulty)
- Pressure gauge with animated needle and fill bar
- Steam particles from pipe leak points
- Drip system and high-pressure sparks
- Explosion at critical pressure (>118 PSI) with 300 debris particles
- Warning system with alarm sounds at >100 PSI
- Ambient industrial drone (sawtooth hum + square rattle + noise)
- 6 WebAudio synthesized SFX
- Mobile + desktop, responsive canvas

## issues
- None known

## todos
- OG preview PNG
- Supabase leaderboard for survival time
