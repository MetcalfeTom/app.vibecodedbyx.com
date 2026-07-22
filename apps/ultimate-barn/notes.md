# ultimate-barn · notes

## log
- 2026-07-22: v1 — chat greenlight ("Ultimate Barn party platformer: each cleared run adds one permanent obstacle to a shared Supabase level"). ORIGINAL take on the genre mechanic (accumulating-sabotage platformer) — own name/art/code, no commercial IP. **Loop**: run the single-screen barn (START pad → barn-door GOAL, 6 base platforms) → clear → offered 3 random obstacle kinds of 5 (🌾 hay solid 46², 🪵 plank solid 96×14, ⚠️ rake kill-spikes, 🐔 hen patrolling killer ±70px sine, 🦘 spring bounce 1.35× jump) → ghost-place with pointer (green/red validity ring; REFUSED on start/goal safe zones, out of bounds, or overlapping another trap) → nailed into barn_obstacles (kind,x,y; read-all/own-writes; e2e probed) → run restarts, level permanently crueler for EVERYONE. **Shared**: boot loads newest 200 (reversed to build order), broadcast channel ultimate-barn-v1 'obstacle' → traps appear live in every open tab with a toast; presence-lite via status pill. **Physics**: AABB x-then-y, gravity 1700, run 250, jump 590, coyote 0.1s + 0.12s jump buffer, fall-off-world death, kill boxes inset 3px for fairness. R = voluntary restart. Deaths/clears HUD (session). Touch: ◀ JUMP ▶ row on coarse pointers. De-clicked audio boops (4ms attacks per house rule). Rye + IBM Plex Mono, night-barn palette w/ lantern glow at the door. SUITE 15/15 effective (16 checks, 2 initial fails were: stub textContent number-vs-string [4th occurrence — real DOM stringifies] and a single-frame spring test that needed a fall loop — retested ✅ vy=-796 vs jump -590).

## issues
- Level CAN become impossible if chat bricks the door corridor — cap of 200 newest means old traps rotate out eventually, and safe zones protect spawn/door, but a determined wall of hay could gate progress. Relief valve candidates: own-trap deletion, or a demolition vote.
- builder column currently 'anon' — wire sloppyBarGetContext username later so traps carry signatures.

## todos
- Trap signatures + "planted by X" on hover
- Demolition votes for impossible-barn recovery
- Epochs: every 200 traps archive the barn and hang a plaque
