# Neon Elevator

## log
- 2026-03-29: V1 — Elevator simulator with 100 floors and 50 unique occupant types. Animated door open/close, floor-by-floor counter, rider boarding/exiting system. Occupants have emoji, name, destination floor, and quirky quotes. Named floors (Lobby, Haunted F13, Answer to Everything F42, Secret Lab F99, Rooftop F100, etc). 10x10 floor button grid, quick nav (Lobby/25/50/75/Roof/Random). Riders arrive randomly while idle. Trip counter, floors visited tracker, rider count. Rajdhani + Share Tech Mono typography, cyan/dark elevator aesthetic.

## features
- 100 floors with floor-by-floor animation
- 50 unique occupant types with emoji, name, and quote
- 25+ named floors (Lobby, Café, Arcade, Haunted, Nice, Secret Lab, etc)
- Animated sliding doors (CSS scaleX transition)
- Riders board and exit with animations
- Occupants speak random quotes
- Hover tooltip shows rider name + destination
- 10x10 floor button grid with current/target highlighting
- Quick nav: Lobby, 25, 50, 75, Roof, Random
- Ambient rider spawning (every 5s while idle)
- Max 6 riders at a time
- Trip counter, floors visited (X/100), rider count
- Direction arrow indicator (up green, down orange)
- Riders leave at destination or randomly (30% chance per stop)

## issues
- None currently

## todos
- Elevator music (lofi WebAudio)
- Floor-specific events/encounters
- Elevator breakdown random event
- Express mode (skip floors visually)
- Achievement system for visiting all 100 floors

## notes
- Floor transition speed: 80ms per floor
- Door animation: 600ms CSS transition
- 400ms delay before doors open after arriving
- 700ms delay after doors close before moving
- Riders spawn ambient every 5s with 30% chance
- 50 occupant types with unique quotes
- Floor buttons: grid of 100, scrollable
