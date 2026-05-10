# pollen-bee-quest

## log
- 2026-05-10: shipped (chat ask: "create a new app called pollen-bee-quest where you play as a bee with a zoomed-in, microscopic view of neon flowers, including a buzzing mechanic and nectar collection.") + follow-up ("we want these neon flowers to look scientifically alien").
  - **Loop**: fly the bee around six neon flowers; hover the pistil to drink nectar; fill the hive jar (100) before the bloom-meter wilts to zero (~70s).
  - **Buzz mechanic**: hold Space (or pointer-down on touch) to vibrate harder. Buzz state ramps from 0→1 over ~1s and decays the same way. While buzzing: bee gets a pulsing yellow + pink aura ring, wings flap faster, and **nectar drink rate roughly doubles** (8 base + 18×buzz per second when right on the pistil). The buzz audio is a continuous sawtooth hum with a 28Hz tremolo LFO whose rate climbs with intensity — proper bee thrum.
  - **Bee sprite**: striped abdomen with 3 black bands, separate dark head, two tracking sclera+pupil eyes, twin antennae with terminal beads, tiny stinger at the tail, two transparent wings rendered with `globalCompositeOperation = 'lighter'` for that backlit-fly-wing shimmer. Wing flap amplitude scales with buzz.
  - **Flowers** — bespoke "scientifically alien" macro/electron-microscope-style render (chat ask):
    - Petals are no longer smooth ovals — they're 9-vertex angular crystalline shards with shoulders + lower notches near the base, giving a faceted "biological cell wall" silhouette.
    - 3 angular crossveins per petal forming nested chevrons (cell-wall pattern).
    - 5 micro-bristles trail off each petal edge (alien micro-hairs).
    - **Inner pollen-grain spikes** — an 18-point spike crown around the pistil (alternating `spikeR1` and `spikeR2` radii) drawn as a single closed path, mimicking electron-microscope pollen-grain protrusions. This is the visual "tell" that turns the flower from cute-cartoon into specimen-slide.
    - 6-segment hexagonal cell-pattern overlay on the pistil disc.
    - 9 micro-pollen grains scattered on the center, each with a thin rim outline.
    - Per-flower radial halo using `lighter` composition so neighboring flowers' glows blend additively — gives the dreamy macro-photography depth-of-field bloom.
    - Nectar drains visibly as a partial yellow ring around the pistil (`-π/2 → -π/2 + 2π·nectar`).
  - **Wilt cycle**: drinking a flower's nectar to 0 starts a 4s wilt animation (petals shrink, color desaturates), then a 6-10s respawn timer. On respawn the flower picks a fresh random color from the 6-palette (pink / cyan / lime / magenta / violet / amber).
  - **6 flower types** — each with 4 colors (petal / glow / deep / pistil) drawn from a tropical-neon palette: hot pink, electric cyan, acid lime, magenta, violet, amber.
  - **Pollen particles**: ambient + harvested. Ambient pollen drifts up from each flower with gravity. Harvested pollen homes toward the bee on a 220 px/s² attraction, fades over 1.2s, rendered with `lighter` blend for sparkle.
  - **Microscope vignette**: radial gradient darkens the canvas edges so the play area feels like a circular ocular field. Combined with depth-of-field haloes around each flower for the macro-lens look.
  - **Wilt warning**: when the bloom-meter drops below 25%, a faint red overlay tints the canvas; below 10% the tint deepens. Tells the player the run is about to end.
  - **HUD**: 4 cards — JAR (current/100), BLOOM (% of bloom-meter remaining), BUZZ (ON+intensity / OFF), TIME (seconds elapsed). Honey-yellow border + inset glow.
  - **Audio**: continuous-tone bee buzz via a 220Hz sawtooth + 28Hz LFO tremolo (gain modulated by buzz intensity); slurp = two-blip triangle ascending; jar-tick = brief 1200Hz square; wilt = low sawtooth; win = 5-note triangle arpeggio; lose = descending sawtooth.
  - **Controls**: WASD/arrows fly with smooth acceleration + drag (1100 px/s² accel, 4.5 drag, 380 max speed). Space to buzz. Pointer-drag (click + hold) flies the bee toward the cursor with slightly lower accel. R reseeds. M mutes.
  - **Aesthetic**: deep teal-violet background with two stacked radial accents + 60 out-of-focus dust particles in honey/pink/cyan. Bungee title with a 3-stop pink-honey-cyan gradient + drop shadow + 24px honey glow. Fraunces italic tagline. JetBrains Mono HUD labels.
  - **Accessibility**: rem units, semantic main/header, role="application" on canvas + control aria-label, aria-live on HUD, focus-visible outlines, 2.75rem min interactive targets, prefers-reduced-motion preserves intent.

## issues
- Fly speed feels right on desktop but may be too floaty on touch (drag moves toward cursor with damping). Could add a snap-to-pistil grab radius for mobile.
- The vignette darkens the corner flowers — they're still readable but the edge fall-off + already-low pistil contrast can make the petal notches blend together. Acceptable for the macro look.
- Pollen particles do NOT actually contribute to the jar — only sustained pistil-hover drinking does. Particles are pure visual feedback. (Could be a future mode: collect drifting pollen between flowers.)
- The wilt-warning red tint is a blunt instrument. A localized "browning at the petal edges" would be more elegant but costs render time.
- Buzz audio starts on the first input gesture (browser-permission gated) — it remains looping once started. There's no pause/stop while idle, which is intentional (lets the buzz fade naturally with intensity → 0). Mute button hard-stops the gain.

## todos
- Multiple bloom levels (e.g. defeat 3 colors → bonus jar fill).
- Pollen sacks on the bee's legs that fill visibly as you drink, transferring to the jar in chunks instead of incremental.
- Wind gusts that push the bee diagonally — adds challenge.
- Predators: a dragonfly or hornet that homes in if you stay too long on one flower.
- Hive return: a periodic "deposit at the hive" loop where you have to physically return.
- Localstorage best-time + nectar/sec leaderboard.
- Slow-motion buzz mode where Z slows time at the cost of buzz capacity.

## design-notes
The "scientifically alien" pivot from chat (after the initial round-petal version) was the right call — the angular shard petals + inner spike crown + hexagonal pistil mesh sell the "you're looking through a microscope" framing better than smooth-curve cute flowers. I kept the macro depth-of-field haloes blending in `lighter` mode because they're the unifier — without them the alien-spike flowers would feel too clinical.

The reference URL chat suggested (pollen.tstebler.ch) was not fetched — per the project's "NEVER access unknown URLs" rule. Inferring from the brief alone: pollen-grain micrographs are spiky, geometric, and have radial symmetry. The sprite implementation matches that mental model.
