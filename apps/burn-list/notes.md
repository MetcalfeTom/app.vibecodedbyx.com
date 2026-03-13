# Burn List

A task manager where neglected tasks catch fire and melt into charcoal.

## log
- 2026-03-13: Initial build. localStorage-based task manager with heat system. Tasks heat up over time: Cool (0m) -> Warm (1m) -> Hot (2m) -> Burning (3m) -> Blazing (4m) -> INFERNO (5m) -> Charcoal (6m). Visual escalation: border color shift, fire-bar overlay grows, CSS glow pulses at max heat. Canvas fire particle overlay with flame/ember/smoke types. Fire bursts spawn on hot tasks, smoke on charcoal conversion. Complete tasks to save them, or watch them burn. Charcoal graveyard toggle. Stats: active/done/burned counts. Anybody + Fira Code typography, dark ember/ash palette.

## issues
- None yet

## todos
- Priority levels that affect burn speed
- "Rescue from flames" — extinguish button that resets timer
- Sound effects (crackling, whoosh on charcoal)
- Share your burn rate as an image

## notes
- No database — pure localStorage
- Heat levels 0-5 based on age in minutes
- Charcoal at 6 minutes (360 seconds)
- Fire particles: flame (orange fade), ember (red bright), smoke (gray expanding)
- Re-renders every 5 seconds to update heat + check charcoal
- Fire particle spawning every 400ms for heat >= 3 tasks
