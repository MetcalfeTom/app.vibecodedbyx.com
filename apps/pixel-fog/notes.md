# pixel-fog · notes

## log
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
