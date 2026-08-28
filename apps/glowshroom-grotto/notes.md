# Glowshroom Grotto — a neon mushroom-eating platformer

## log
- 2026-08-28: v1.0 — built per chat (build → continue-and-test directive; tested movement, scoring, hazards, neon visuals, accessibility BEFORE shipping). Browser-first, engine-free, Godot-inspired feel: 3200u side-scrolling cave, 19 platforms + 3 pit gaps, camera lerp, parallax spores. PLATFORMER PHYSICS: accel-toward-target movement, variable jump height (release early = short hop), 0.1s coyote time + 0.1s jump buffer, AABB x-then-y resolution. 20 GLOWSHROOMS (17 pink +10, 3 golden +50 in awkward spots), eat-on-touch with countdown narration. HAZARDS: 3 patrolling gloom slugs, 4 crystal spike beds, pits — all TUMBLES, never endings: respawn at last lit lantern, score intact, 1.5s mercy window, kind lines per cause ("a gloom slug, gloomily. it meant nothing personal."). 4 LANTERN checkpoints ("the grotto will remember you were here"). Win = all 20 eaten ("every tumble was part of the route, officially"). ACCESSIBLE INSTRUCTIONS: DOM-native <details> open by default (real text, not canvas), kbd chips, reopen button that focuses the summary; canvas role=application with a full narrated label; status + HUD aria-live; reduced-motion kills glow/pulse/bob/spore-drift. Touch row on coarse pointers. FREEZE SEAM FROM DAY ONE (banked neon-circuit lesson) — probes froze the loop before science. Probe 15/15 after one real fix: mkShrooms had a stray 18th pink entry making 21 shrooms against every "20" promise (count checks caught it immediately). Neon confirmed by screenshot.

## issues
- shroom positions are hand-authored — any level edit must re-run the count/reachability checks.

## todos
- spore-burst particles on eat, a speedrun clock rank, second cavern, if chat asks.
