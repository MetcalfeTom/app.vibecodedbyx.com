# brine-sewer-crawl

## log
- 2026-05-10: shipped (chat asks: "build a top-down survival game called brine-sewer-crawl where you play as a pickle scavenging bug parts, with a tight flashlight vision and limited stamina" + tech-stack question "can you use three.js or do we have to stick to 2d canvas" — answered: 2D canvas is the better tool here for the flashlight cone effect, and explained why in the response + a comment block at the top of the JS).
  - **Stack decision** (committed inline as a JS comment): 2D canvas + `globalCompositeOperation = 'destination-out'` masking. Three.js would need a shadow-volume / shader to get the same flashlight cone — much more code for diminishing returns on a top-down view.
  - **World**: 1600×900 brick-walled sewer with a hand-curated maze of ~17 wall segments forming corridors, 6 brine puddles (radial-gradient pools with shimmer), 8 bug parts scattered across the level, 6 wandering enemies, and a green hatch exit at (1480, 820). Camera follows the player.
  - **Player (the pickle)**: cucumber-shaped sprite with longitudinal stripes, warts, and a tiny eye on the pointed end. Movement axis-separated against walls. Walk at 130 px/s, sprint at 220 px/s while holding Shift (drains brine stamina at 25/s). Stamina regenerates 12/s when not sprinting. 3 HP, 1.2s i-frames after a hit. Aim follows mouse cursor when recently moved (last 2s) else snaps to movement direction.
  - **Flashlight cone (the headline feature)**: dark overlay at 0.94 alpha covers the screen, then `destination-out` "erases" two shapes — a small ambient circle around the player + a wide flashlight wedge in front via `arc(0, 0, 240, -0.42, 0.42)` rotated by the player's aim. Inside the cone, a brighter hot-spot uses a second eraser pass at `coneR * 0.7` for the typical flashlight intensity falloff. The cone radius shrinks slightly when stamina is below 25 (low-brine flicker).
  - **Bug parts** — 4 procedural sprites:
    - **leg**: zigzag insect leg with two joint dots
    - **wing**: translucent triangle wing with veins
    - **mandible**: V-shaped mandible pair with sharp tip dots
    - **carapace**: curved chitin shard with a sheen line
  - **Pickle battle cry pop-up** (chat ask: "make sure there is a text pop up for the pickle rick battle cry when scavenging parts"): each part pickup spawns TWO FX entries — a tiny `+leg` / `+wing` etc. tag at the part's position AND a chunky **glowing battle-cry banner** over the player's head. 10-line cry pool: "I'M PICKLE BRINE!", "BRINE TIME!", "GHERKIN MODE!", "I'M IN THE WALLS!", "PICKLEFIED!", "ASCEND, CUCURBIT!", "FERMENTATION COMPLETE!", "DILL WITH IT!", "MORTY, IT'S ME, A PICKLE!", "CRUNCH ENGAGED!". The cry renders in Press Start 2P bold with a green shadowBlur halo, jiggle-scaled 1.0±0.05 on a 6Hz sin wave for 1.3s, then fades.
  - **Enemies** — 3 kinds, all top-down primitive sprites:
    - **Roach**: small/fast (95 spd, 8 hp, 1 dmg). 6 animated legs sin-flapping, gold beady eyes, antennae.
    - **Spider**: medium (80 spd, 18 hp, 1 dmg). 8 radial legs, dark body, 8-eye cluster.
    - **Larva**: slow tank (50 spd, 25 hp, 1 dmg). Bloated grub with segment ellipses.
    - All start wandering on a random heading; alert when the flashlight cone passes over them OR within 60u, then chase at full speed for 4s.
  - **Cone-of-vision detection**: enemies use `Math.cos(angle - aim) > Math.cos(0.42)` AND `dist < 240` AND `lineHitsWall` raycast — so walls block the cone realistically.
  - **HUD**: 4 stat cards in a row above the canvas — SHELL (HP) · BRINE (stamina) · PARTS (collected/total) · DEPTH (m from spawn).
  - **Aesthetic**: deep teal-black palette with brine-green accents (`#9ef07a`) and brick-brown walls. Press Start 2P title with green/cyan glow + drop shadow. CRT scanline overlay on every frame at 33% interlace alpha. Brick walls drawn with horizontal courses + offset vertical lines + sparse green moss dots on the top edge.
  - **Audio**: WebAudio synth — square footstep on sprint, two-tone triangle pickup chime, noise+sub hurt, low noise bug-skitter, 5-note triangle win, descending sawtooth lose.
  - **Mobile**: ◀ ▶ ▲ ▼ fixed pad on coarse-pointer devices (sprint via no-pad shift currently — desktop only).
  - **Accessibility**: rem units throughout, semantic main/header/section, role="application" + control-summary aria-label on canvas, aria-live HUD, focus-visible 3px brine-green outlines, 2.75rem min interactive targets, no animations gated by prefers-reduced-motion (no CSS animations to gate; only canvas).

## issues
- No mobile sprint button — touch users get walking speed only. Workaround: the level is paced for walking. Could add a SPRINT pad button.
- Flashlight cone occasionally clips through walls when the player stands right against a corner (the cone gradient passes through but enemies aren't actually visible because lineHitsWall blocks alert). Cosmetic mismatch; not exploitable.
- Bug spawns are fixed positions — no respawn/wave system. Once cleared, the path home is empty. By design (early-run survival horror feel) but a v2 could add roaming spawners.
- Battle cry can stack — collecting 2 parts in quick succession overlaps two cry banners. Acceptable; reads like the pickle is hyped.
- No localStorage best-time / completion-time persistence yet.

## todos
- Mobile SPRINT pad button (currently desktop-only).
- Wave-based bug respawns after collecting 4 parts (the sewer "wakes up").
- Brine canister pickups that refill stamina mid-run.
- Headlamp upgrades: wider cone / longer range / battery-free at high score.
- A second floor "DEPTH = -2" with tighter corridors after the first hatch.
- Best-time + completion-rate persisted to localStorage.
- Predator: a "SEWER GATOR" boss past wave 2 that's too big to kill, only outrun.

## design-notes
The flashlight cone is the entire game — every other system orbits it. Walls block the cone via raycast in alert checks, so an enemy can be behind a wall and you'll see them only when you round the corner. The brine flicker (cone radius drops with low stamina) gives a clear feedback loop tying the meter to the moment-to-moment readability of the level: as you exhaust yourself, you literally see less of the world.

The pickle-rick battle cry pop-up was a great chat ask because it gives the otherwise-quiet scavenging moments a dopamine spike. The 10-cry pool with random selection avoids verbatim quoting of any specific show line while leaning hard into the energy. Glow + jiggle-scale + shadowBlur gives the pop the visual weight of a comic-book sound effect. Pickle Rick's signature attitude — "I am inconvenient, loud, and refuse to be mortal" — survives the parody filter.

The 2D canvas decision saved easily 200 lines of three.js setup and shader code without losing anything visually. Three.js shines for actual 3D — top-down with cone vision is canvas's home turf.
