# meow-mixer

## log
- 2026-05-08: shipped — neon cat-slapping rhythm game (chat ask: "build a neon-colored cat-slapping rhythm game called Meow-Mixer"). 4-lane layout (D / F / J / K), 128 BPM synthwave backing track, procedurally-drawn pixel cats spawn from the top of each lane and travel toward a glowing hit line at the bottom over 4 beats.
  - **Cat types** (procedurally rolled per spawn): tabby (1 hp / 100 base / 60% spawn), kitten (1 hp / 80 base / 18%), chonk (2 hp / 240 base / 14%, requires 2 slaps), glitch (1 hp / 320 base / 8%, jitters horizontally between adjacent lanes with RGB-split rendering).
  - **Timing windows**: PERFECT ±60ms (1.0× score), GOOD ±120ms (0.7×), OK ±200ms (0.4×), EARLY ±450ms (0.15×). Past +450ms = MISS, lose a heart.
  - **Combo system**: hits chain a combo counter; multipliers kick in at 10 / 25 / 50 chains for ×2 / ×3 / ×4 score boosts. Missing resets combo to 0. Max combo tracked for the end-screen.
  - **3 lives**, lose one per missed cat (cat passes the hit line + 0.45s grace). Three misses = end of run.
  - **Procedural backing track** (no audio assets). The audio scheduler runs in lockstep with the chart generator: kick on every quarter, snare on 2 + 4, hi-hat on every 8th, sawtooth bass on every other quarter following an Am→C→D→G four-bar progression, square-lead riff on a 16-note pattern that loops every 8 beats. Setting `trackOn = true` at run start kicks a `scheduleAudio(now)` lookahead loop in the main render frame that maintains 0.5s of pre-scheduled events via `setTimeout` against the AudioContext clock.
  - **Slap SFX**: bandpass-noise burst @ 2200Hz Q=3.5 + 280Hz square that pitches down to a thump. Plus a per-cat-type **"meow"** synth on every successful slap — triangle wave with frequency-ramp 0.7→1.3→0.9 of base pitch over 0.22s, lane-keyed so each lane's cats meow at a slightly different pitch (440 / 500 / 560 / 620 Hz).
  - **Chart generator**: per-beat, decides what cats to spawn based on intensity (0.25 → 1 over 60 seconds). Always tries one cat per beat at 65% × intensity probability; at intensity > 0.5, also rolls for an off-beat cat at +0.5 beats. De-duplicates same-lane same-offset spawns.
  - **Background**: synthwave perspective grid (14 horizontal scan lines fading from horizon to bottom + 21 vertical perspective lines diverging from a single vanishing point) + a Bungee-Inline retro sun with horizontal "venetian-blind" bands stenciled in. Each lane has a colored gradient backdrop (cyan / magenta / yellow / violet) + 1px lane borders that flash on key press.
  - **Cat sprites** drawn procedurally per frame on canvas 2D — rounded body slab + dome head + triangular ears with pink inner triangles + 4.5px-radius eyes with pupil glints + pink nose triangle + mouth + 4 whiskers per side. Glow halo in cat-type hue, drop-shadow ellipse, optional white hit-flash on partial damage (chonks). Glitch cats render two RGB-split copies (red ghost +4px / cyan ghost -4px) with `mix-blend-mode: screen`.
  - **Hit detection**: on slap, find the cat in the slapped lane closest to its `hitAt` (within 450ms tolerance). Decrement hp; chonks need 2 slaps. Score = `def.scoreBase * timing × combo-mult`. Particles puff out in lane color on kill.
  - **HUD** in 4 cards: Score (yellow), Combo (magenta), Mult (acid green), Lives (cyan ♥). Bottom: brand title, mute, pause, restart. Aria-pressed on toggles.
  - **Controls**: Keyboard D / F / J / K for the 4 lanes; tap a lane on touch (auto-detects lane index from x-position). P pauses, R restarts, M mutes.
  - **Best-score persistence** in localStorage under `meow-mixer-best`. End-card shows score / max combo / hits / best.
  - **Aesthetic**: deep purple radial bg, Bungee Inline title "meow mixer" with cyan + magenta italic, Audiowide for HUD numerics, Press Start 2P for tiny labels and lane key letters, JetBrains Mono body. Lane palette: cyan #74e8ff (D), magenta #ff2e88 (F), yellow #ffd54a (J), violet #a87bff (K).
  - **Accessibility**: rem units, html font-size 100%, semantic main/header/section, `role="application"` + descriptive aria-label on canvas, aria-pressed on toggles, `:focus-visible` outlines, 2.75rem min interactive targets, `prefers-reduced-motion` removes toast transitions, intro/end overlays use `role="dialog" aria-modal="true"`. Skip link at top.

## issues
- `total` in the end-card hits/total ratio currently only counts MISSES not all spawned cats — should track every cat spawn for accurate hit %. Easy fix: increment `total` in the chart generator's spawn loop instead of in the miss handler.
- The "EARLY" grade window (±450ms) is generous — counts as a hit even though the cat is still 200-400ms from the line. Could split into "EARLY" (no score, no combo) vs "OK" but for a casual prototype this works.
- Glitch cats jitter ±45% lane width which can cross adjacent lanes — they remain in their original lane for hit detection, so visually they may LOOK like they're in the next lane while the player should still hit the original key. Could either (a) make hits register on the visually-aligned lane, or (b) ramp jitter back to 0 within the last 200ms before the hit line so the player can read the actual lane.
- No song duration / win condition — runs continue indefinitely until 3 misses. A "60-second mix" or "100 cats" mode would give an explicit end.

## todos
- Multi-song system: 3 chart-themes with different BPMs (slow waltz at 90, club at 128, drumroll at 160).
- Visual hit-zone "pop" animation on PERFECT (the line briefly bulges + emits a ring).
- Per-lane variable cat-density so the chart has a "rhythm" beyond uniform-random spawn.
- Online leaderboard via Supabase (best score per user / per song).
- "Endless" vs "Song" mode toggle on intro screen.
- Cat skin unlocks based on score thresholds.
- Make the hit-line animate to BPM (pulse on every quarter-note).
