# shepherd-shark

## log
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
