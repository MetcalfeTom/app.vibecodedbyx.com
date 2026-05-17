# pixel-fog · notes

## log
- 2026-05-17: v1.2 — **procedural map generation via cellular automata + flood-fill** per chat ask from **@deadbydaddyttv** ("can we generate random map layouts for pixel-fog using cellular automata or simple procedural generation"). Every newGame() call now serves a fresh layout — no two rounds the same. Awarded `+2` sloppy points for the suggestion.
  - **Algorithm**:
    1. **Random fill** the 40×25 grid with 46% wall density; border always wall.
    2. **5 CA iterations** with the classic Moore-neighbourhood rule: cell becomes WALL if ≥5 of 8 neighbours are walls, FLOOR otherwise. The last iteration uses threshold 6 to open the caves up slightly so corridors form.
    3. **Flood fill** from every unvisited floor cell to find connected regions; keep only the **largest** region as actual floor. Any smaller pockets get filled in with wall — no orphan rooms the player can't reach. If the surviving region is < 80 cells, recurse and re-roll.
    4. **5 generators** placed on widely-spaced floor cells from a shuffled iteration (>6 tile Manhattan distance apart). Top-up pass with a >3 spacing rule if the strict version didn't yield 5.
    5. **Gate placement**: scan the second row for a floor cell with floor directly below; if none found, brute-carve a 1-wide corridor down from a random top-edge column to the nearest floor cell. Carve 2 GATE tiles at the top edge.
    6. **Player spawn**: floor cell with maximum Manhattan distance to the gate (usually near the bottom).
    7. **Killer spawn**: floor cell with maximum distance from the player spawn (the far corner, opposite the player) — gives 5-10s of breathing room before he closes in.
  - **Hook**: `applyGeneratedMap()` is called at the top of `newGame()`. Each subsequent re-roll (Start, Try Again, Run It Again) generates a fresh layout. The killer-AI's `pickKillerWaypoint()` automatically uses the new generator positions, so the patrol routes adapt to the new map.
  - **Performance**: full CA + flood-fill + placement takes ~5-12ms on a typical browser, imperceptible inside the overlay-to-game transition.
  - **Start overlay lede** updated: "*Every round generates a fresh map via cellular automata.*"
  - File 45KB → 51KB.

- 2026-05-17: v1.1 — **killer patrols between generators + skill-check noise events** per chat ask: "improve the killer AI in pixel-fog to patrol between generators and investigate noises like missed skill checks."
  - **Killer patrol routes now derive from generators**: replaced the 5-corner waypoint array with `pickKillerWaypoint()` that picks an unfinished gen each time — 80% chance of the nearest, 20% chance of any random unfinished one for variety. When he arrives at a gen, he pauses 900-1600ms ("inspecting") then picks the next. After all 5 gens are done he patrols the exit gate area instead. Net effect: he's always near where you actually need to be.
  - **Skill-check system** (DBD-style): every 2.2-4.4s of holding E on a gen, a skill-check fires:
    - Circular ring overlay floats above the gen (radius 20px, drawn above the fog so always visible)
    - Sweeping orange arrow rotates 0→360° over 1.1 s
    - Green "great" arc (38° wide) sits at a random target position
    - Player must press **Space** while the arrow is inside the green arc
    - **HIT**: +0.6s repair bonus, soft 2-tone sine sparkle, green flash on the gen
    - **MISS** (wrong position OR no press by timeout): -0.8s repair penalty, red flash, **gen explosion FX** (expanding orange→red disc with spark lines), 2-part audio (sawtooth thunk + bandpass-noise explosion crackle), AND **a noise event is emitted at the gen position with a 320px radius**
  - **Noise events** trigger the killer to investigate: if the killer is within range of an `emitNoise(x, y, radius)` call, his `lastSeen` is set to the noise origin and he switches to `search` state (or stays in `chase` if already chasing). Missed skill checks are now the loudest noise source in the game by a wide margin — chase the killer toward an empty gen by miss-pressing the prompt on purpose.
  - **Schedule reset on disengage**: releasing E mid-repair clears `nextCheckAt` on that gen + cancels any unresolved skill check, so re-engaging gives you a fresh 2.2-4.4s grace before the next prompt.
  - **HUD hint** updated: "WASD move · Shift sneak · E repair · Space skill check · P pause".
  - File 36KB → 45KB.

- 2026-05-17: v1 — **top-down stealth survival with 5 generators, a stalking AI killer, fog of war, and an exit gate** per stacked chat asks: "build a 2D top-down game called pixel-fog with a survivor fixing generators and a stalking killer" + amendment "make the killer a dark shadow with glowing eyes that flickers in and out of sight." Both baked into v1.
  - **Map**: 40 × 25 tile grid (tile size auto-scales to viewport, 14-36px). Hand-built corridor layout with rooms, walls, 5 generator markers scattered, and 2 GATE tiles in the top wall as the exit.
  - **Survivor** (player): 7px-radius blue jumpsuit + skin-tone head + dark hood + facing-direction pip. WASD or arrows to move (110 px/s walk, 55 px/s while holding Shift to sneak). Subtle bob animation when not repairing. Crouched-purple outline visualises sneak state.
  - **THE KILLER — dark shadow with glowing eyes that flickers in and out** (per the amendment):
    - Body is multi-layered translucent black ellipses with 5 wisp blobs orbiting at radius 2-3px around the centre — gives a "smoke" silhouette that's never solid.
    - **Opacity oscillates** via layered sine waves (slow 0.0035 + fast 0.018 frequencies) so the body shimmers continuously.
    - **Hard "dropout" flickers**: every ~1.7s a third sine wave crests above 0.92 and the body opacity briefly slams to 18% of normal — he almost vanishes for a frame or two.
    - Base opacity scales by state: **chase = 0.78** (most solid, he's committed), **search = 0.55**, **patrol = 0.40** (faintest, almost ghostly).
    - **Eyes always visible** — two 2×2 pixel squares in red `#c01030` (or bright `#ff3050` when chasing), drawn with `shadowBlur: 14` for bloom and a 0.012-rate pulse. Eyes never drop below 0.7 opacity, so even when his body is mid-flicker, those eyes still find you through the fog.
    - **Smokey trail** behind the direction he's looking — a small wispy ellipse offset backwards by 5px at half body-opacity so he leaves a faint motion-blur tail.
  - **Killer AI**: state machine `patrol → search → chase`.
    - **Patrol**: walks between 5 hand-set waypoints (4 corners + map centre) at 70 px/s. Facing direction matches movement.
    - **Vision cone**: 220px range, ±55° arc, line-of-sight raycast (4-step subdivision) through walls. Cone visualised as a faint translucent wedge — colour-coded white/orange/red by state.
    - **Hearing**: noise radius `walk: 90px / sneak: 30px / repairing: 50px`. If player is moving inside `noiseRadius × 1.6` of the killer while not in chase, killer enters search and heads to player's last-known position.
    - **Chase**: triggered on direct vision. Killer runs at 130 px/s straight toward the player. After 1.4s without LOS, switches to search.
    - **Search**: walks to `lastSeen` at 90 px/s, waits + wanders 6s, then returns to patrol.
  - **Generators**: 5 sprites scattered on floor tiles. Hold **E** within 1.4 tiles to begin repair. Repair takes 8 seconds of held E. Progress visualised as an amber pie-arc above the gen + status light on the gen turning red→amber→green. When done: 3-note "gen pop" arpeggio (440→660→880) + green pip in HUD.
  - **Exit gate**: 2 GATE tiles in the top wall start red (locked). When all 5 gens are done, gate turns green with a pulsing arrow + a gate-clang sound. Step onto a gate tile = WIN.
  - **Fog of war**: radial-gradient cutout around the player (160px clear → 78% black at 80% radius → 96% black at edge). Re-drawn each frame on top of the world. The killer's glowing eyes are visible at slightly larger range (1.6× fog radius) because of the bloom — the silhouette pierces through.
  - **Heartbeat audio**: dual-sine thud (80Hz + 56Hz) plays at intervals controlled by `state.hbBpm`. BPM = 60 + (1 − distance/320) × 100 + 30 if chasing. So idle = ~60 bpm, close call = ~150 bpm, full chase nearby = ~190 bpm. HUD readout shows live bpm with white → amber → red colour bands.
  - **Other audio**: footsteps (random pitch), repair tick (square 420Hz), gen pop arpeggio, killer-catch scream (descending sawtooth), gate-open clang.
  - **HUD**: top-left 5 generator pips (grey → amber while active → green when done), top-right heartbeat bpm. Bottom-centre key hint that fades after first interaction.
  - **Start / lose / win overlays**: hero panel with Major Mono Display gradient title, hand-written prose, key-binding sheet, retry button. Lose overlay shows random hand-written death line + stats (gens done, time survived). Win overlay shows escape time.
  - **Pause** via P key.
  - **Mobile**: pointer events work, but the game is keyboard-first (no on-screen joystick yet).
  - **OG image**: Pollinations flux seed 51717.

## issues
- Killer pathfinding is straight-line — no A*. He can get stuck on inside-corners of walls when chasing through a narrow corridor. Survivable but obvious if you watch.
- The 5-generator map seed comes from `g` markers in the raw map string + auto-scatter fallback for any missing ones. If the map string changes, gen positions may drift.
- Vision cone wedge polygon doesn't account for walls — only the LOS raycast detection does. Cosmetically the wedge will project through walls.
- Sneaking is slow but VERY effective — almost trivializes the killer once you find it. Future tuning: shorter sneak-only window or stamina.
- No camera follow — the whole map fits the viewport. Tight maps are tense; if scaled up, the centre-camera would need to follow.
- Killer flickers via deterministic sine — not truly random. Looks fine but adds a subtle pattern that careful players might learn.
- No keyboard-flip for left-handed players (no remap UI).

## todos
- Skill checks on the repair bar (DBD-style press-Space-in-the-window), missing = loud noise burst that alerts the killer.
- Killer types: a stalker (slow, kills on stalk meter), a runner (fast, no special), a ranged thrower.
- Doors that block the killer's path.
- A torch / matchstick consumable that lights a small radius extra.
- Survivor stamina that drains while sprinting (sprint = Shift, repurposing the current sneak key with toggle).
- Procedural map generation per round.
- 2-player mode via Twitch chat: chat votes movement direction every 2 seconds.
- Boss tome / weekly mode tied to dbd-tome-tracker.
