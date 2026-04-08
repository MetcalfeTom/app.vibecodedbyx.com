# Total Meltdown

## log
- 2026-04-08: Initial build — 2D physics sandbox of chain explosions. Click anywhere to detonate a blast that hurls all nearby bodies outward with 1/r falloff, upward bias, and random angular impulse; bombs and fuel barrels ignite and chain after a 30-150ms delay for cascading pyrotechnics. 4 body kinds: crate (standard debris, 2hp), bomb (explodes on hard impact or shockwave, 1hp), fuel (bigger radius 1.6x, yellow-orange, 1hp), steel (heavy, inert, 5hp). Arena auto-builds towers based on viewport width, plus scattered loose barrels on ground. 3 blast sizes (Small/Medium/NUKE). Particles in additive blend: shockwave ring, radial fireball gradient, ember sparks with trails, smoke, dust puffs on hard landings. Destroyed bodies spawn colored shrapnel chunks with gravity. Screen shake on every blast, damped over time. Chain-combo tracker with popup banner at 3+ (COMBO → CHAIN → DEVASTATION → TOTAL MELTDOWN → ARMAGEDDON). Best-chain + total-destroyed counters. Bungee Inline + Share Tech Mono typography, blood-red/yellow destruction palette on deep navy-to-crimson gradient sky.

## features
- Click or touch to detonate at cursor with 3 selectable blast sizes
- Bombs/fuel chain-react when caught in any shockwave (delayed so cascades look natural)
- Bombs also detonate if they hit the ground at high velocity
- 4 body types with different hp, mass, and visuals
- Procedural tower arena that adapts to viewport
- Additive-blend explosion ring + radial fireball + 18-30 fireball particles per blast
- Ember sparks with 8-point trails
- Smoke puffs
- Shrapnel chunks spawned from every destroyed body
- Dust puffs on hard landings
- Screen shake scaled by blast power
- Chain combo banner (COMBO → ARMAGEDDON)
- Destroyed counter + best chain counter
- Reset arena button
- Mobile touch support

## issues
- No inter-body collision — bodies pass through each other (intentional simplification, keeps cascades fast)
- Towers start pre-stacked perfectly on ground (no build-up settle time)
- No audio
- Chunks fade rather than persist forever (perf)
- Very large cascades can briefly drop fps on low-end devices

## todos
- Add rigid-body contact resolution so towers actually topple
- Audio: boom, shockwave whoosh, chain crescendo
- Water/lava pits to destroy fallen debris
- Unlockable explosion types (plasma, cluster, black hole)
- Leaderboard for best chain via Supabase
- Real PNG OG image
