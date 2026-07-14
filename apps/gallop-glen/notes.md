# gallop-glen · notes

## log
- 2026-07-14 v1.0: chat "fresh horse game — galloping physics, obstacles, no ghosts" (no ghosts = pointed at ghost-rodeo's lightning horses; answered w/ pure daylight storybook meadow). CORE HOOK: the gallop is a real rotary four-beat gait (LH .00 → RH .12 → LF .50 → RF .62 → suspension) and JUMP POWER DEPENDS ON STRIDE PHASE — pushPower(phase) = 1.0 during hindquarter push-off (0–.25), fading to .55 in suspension; vy = −(520+230·power)·speedfactor. Stride meter under the horse (green=jump now). Obstacles: fence (jump), hay bale (small), creek (gap — grounded contact = splash stumble), low branch (duck under, S/↓). Carrots = 2.2s speed boost. 3 stumbles → unseated; distance in furlongs (700px each), localStorage best. Procedural horse: two-segment gait-phased legs, duck compresses body, lean follows vy, invuln blink. WebAudio: per-hoof-fall thuds off the actual gait table, sweet-spot ping on power>0.95 jumps, sawtooth whinny, noise-burst splash. Parallax clouds/hills, dust puffs. Grandstander + Gochi Hand + Space Mono, warm pastoral palette. Touch: tap=jump, hold duck button; pointer:coarse touchbar.

## issues
- Creek + immediate fence sequences can be brutal at flat-out speed — spawn spacing scales with speed but tight rolls happen.
- Branch clearance uses duck-height 46 vs standing 78; on tiny screens the branch height cue reads small.

## todos
- Second horse skin (dapple grey) as a pick.
- Combo bonus for consecutive green-meter jumps.
- Distance leaderboard (supabase) if chat wants competition.
