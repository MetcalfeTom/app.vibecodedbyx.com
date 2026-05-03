# shepherd-shark

## log
- 2026-05-03: full refactor — removed the player entirely, autonomous fish-on-fish AI, names pulled from sloppygram_profiles (chat ask).
  - **No player.** No name input, no start overlay, no controls beyond P/M (pause/mute). The simulation runs forever.
  - **Names sourced from Supabase `sloppygram_profiles`** ordered by `updated_at DESC LIMIT 60`, deduped, capped at 40, uppercased, length-filtered to 2..18 chars. Fallback to a 24-name static pool (SLOPPY/PIETER/XENOFISH/etc) if supabase unreachable or table empty.
  - **Fixed wide world** (1800×1100 world units) replacing the constant-zoom-loop player camera. `viewScale = min(W/WORLD_W, H/WORLD_H)` fits the world to viewport.
  - **Soft world wrap**: fish that hit the world boundary + 60u margin get bounced back with -0.6× velocity, so the ocean stays full but feels endless.
  - **Autonomous AI per fish**: per-tick scan of all other fish within `senseRadius = size*8 + 90`. Threats (size > self×1.18) → `flee` state, fleeing speed ×1.4 + ×1.55 max-speed. Prey (size < self×0.82) → `hunt` state, chase ×1.25 max-speed. Otherwise wander w/ random angle every 1.5..4s.
  - **Eat resolution**: O(N²) pairwise (N≈50, fine). When two fish overlap by 0.45×combined-size and one is > the other × (1/0.82), larger eats smaller (size += 0.30 × eaten.size, kills++, particle burst, throttled audio). Same-size = bump apart.
  - **Initial seed**: 48 fish with cube-biased size distribution (most small, few big). 18 mid-sized fish get names from the chat-name queue at boot.
  - **Population maintenance**: target ~28-50 fish based on current pop; spawns at world edges with inward velocity. 30% of new spawns get a chat-handle name (avoiding duplicates with currently-alive named fish), so chat handles cycle in continuously as the apex shifts.
  - **Hunt feed UI**: bottom-right panel shows last ~6 kills as italic Cormorant lines: "PIETER inhaled SLOPPY", "a colossal fish swallowed XENOFISH". Verbs cycle from a pool. Items fade after ~5s, drop at 8s.
  - **Leaderboard**: bottom-left, top 5 named fish by size. Apex name in coral, others gold. HUD pill "APEX" mirrors current leader.
  - **Render**: same fish drawer (tail wag, fins, gill arc, eye), gold halo for named fish. Apex name renders in coral on its label pill, others in foam. World z-sorted by size desc so big fish sit behind small fish.
  - **Audio throttle**: eat sounds are debounced to once per 60ms so cascade kills don't spam. Eat pitch scales inversely with eater size (bigger eats = lower thunk).
  - **Loop unchanged**: fixed-step 1/120s w/ accumulator + spiral-of-death guard.
- 2026-05-03: stripped controls + fixed-step physics (chat ask: "remove all controls, audit dt for smoother rendering").
  - Removed dash (mechanic + audio + CD ring + space binding + click-to-dash + mobile dash button).
  - Removed WASD/Arrow steering.
  - Removed `.touch` HTML/CSS.
  - Only input now: pointer move = aim. Pointer down still ensures audio (unlock gesture). P pause and M mute kept as meta affordances.
  - Cursor near dead-center (within 3px) keeps previous facing instead of jittering through the singularity at atan2(0,0).
  - Facing rotation now uses `dA * (1 - exp(-6*dt))` instead of `dA * min(1, dt*6)` — exact frame-rate-independent ease that doesn't clip to 1 on long frames.
  - Switched render loop to fixed-step physics: 1/120 s steps via accumulator, render at display rate. MAX_DT = 0.25s clamp on long pauses (tab switch); MAX_STEPS_PER_FRAME = 8 with backlog-drop guard against spiral-of-death when browser falls behind. Update + tickParticles always see consistent 1/120 s dt → motion is identical across 60Hz / 120Hz / variable refresh displays.
- 2026-05-03: shipped — infinite-zoom fish-eat-fish.
  - **Player = random fish from the school**. On START, type a name (persisted to localStorage as `shepherd-shark-name`). The game seeds N fish across the visible area, randomly picks one (preferring small ones for growth headroom), and pins your name to it. The player inherits that fish's color palette, shape bias, fin count, seed, and starting size — so your fish is visually a real member of the school.
  - **Constant-zoom loop**: `zoom() = TARGET_PX / player.size` always. Player renders at TARGET_PX (70 px) regardless of size. As you grow, the world scales down — bigger predators that were huge at size 1.0 become normal-sized at size 5.0; new predators spawn proportionally. The visual scene "loops" forever — you can grow unboundedly and the screen always looks like a fish among fish.
  - **AI behavior tiers per fish**: predator if size > player×1.15 (chases on sense radius), prey if size < player×0.85 (flees within player×12), peer otherwise (wanders).
  - **Eat rules**: collision at (player.size + f.size) × 0.45 → if f < player×0.85 → eat (size += 0.30×f.size, score += round(18×f.size)). If f > player×1.15 → die. Mid-range = bump.
  - **Dash**: click / Space → 0.55s burst at 2.6× speed, 1.6s CD. Dash CD ring around player. Audio: sawtooth slide + bandpass-noise whoosh.
  - **Spawn ring**: every frame ensures targetPopulation = 18..60 fish based on visible area. New fish spawn just outside view at random angle with inward velocity. Far fish despawn beyond 1.3× visible radius. Player's tagged fishRef never despawns.
  - **Audio**: ambient ocean drone (55 + 82.4 Hz sine+triangle through 360Hz lowpass), eat blip (540→880Hz triangle + bandpass noise sparkle), dash, danger pulse on huntedNow, death descending sawtooth cascade. Mute toggle persists.
  - **Aesthetic**: deep ocean — radial gradient (#0a3954 → #062537 → #020e16) + 5 god-ray cones drifting + 22 rising bubbles. Bagel Fat One title with gold "Shark" accent, Cormorant italic tagline, Major Mono Display name labels in HUD pills, Space Mono body. Each fish drawn procedurally: tail w/ wag, top + bottom fins, gradient body, gill arc, eye + pupil. Player fish has gold halo.
  - **Name labels**: drawn unrotated above each labeled fish in a rounded dark pill with a small arrow pointing to the fish. Player gets gold text, others get foam.
  - **Hunted warning**: when any predator is within (player.size × 18) of player, pulsing red ring around player + danger pill in HUD + intermittent sawtooth blip.
  - **Best-size persistence**: peak player.size stored as `shepherd-shark-best-size`.
  - **Accessibility**: rem units, 44px+ targets, semantic dialogs with inert toggling, name input has explicit label, role="application" canvas with key summary, prefers-reduced-motion kills hover transforms, focus-visible outlines, skip-link to canvas.

## issues
- Other fish currently DON'T have name labels (only the player). Could add small auto-generated names over predators / large fish for color (e.g. "BARRACUDA") if chat asks.
- Predator fish all use the same wander/chase logic — at very high player size they may converge unrealistically. Could add per-predator speed + sense variation.
- No leaderboard for largest size — only personal best.
- WASD nudges use cardinal angles only (-1/+1 mix). Diagonals work but the fish may snap to 8-direction. Pure mouse aim is smoother.
- Eat-burst particles don't scale with zoom — they're in world space so they shrink correctly, but at very small fish sizes they may be invisible. Could mix in screen-space burst at the player.

## todos
- Auto-name predators (e.g. random name pool) for a "school of named fish" feel.
- Multiplayer via Supabase broadcast — your named fish appears in other players' oceans.
- Periodic "Shepherd Shark" boss event — a giant black silhouette that crosses the screen, chasing all fish toward each other.
- Eaten fish names get added to a "stomach" list shown in pause overlay.
- Achievements: "ate your name's letter count in fish", "outlived 60 seconds", "biggest meal" (size of largest single fish eaten).
