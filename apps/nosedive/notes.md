# Nosedive

Endless 2D paper-plane glider. Built on stream 2026-09-26 from Tatum's (sloppy.live) idea: nose down for speed, and "cheat" the potential-to-kinetic trade so daring dives can gain altitude. Later direction from Tatum: aesthetic and minimalist like a paper airplane, a flow state, no perma-death, only a temporary slowdown for failing, and don't reward loitering (so no thermals).

## log
- 2026-09-26 v0 (never committed): a vintage aviation-poster sailplane with a crash = game over. Replaced before shipping.
- 2026-09-26 v1: paper-plane flow version.
  - Model (pure, between the `flight model` / `game shell` markers, exposed as `window.__nd`):
    - Velocity is always along the nose. Pitch follows a virtual stick, G=420, drag KD=0.0005.
    - Stall below 90 forces the nose to -40° until 140.
  - Swoop = the cheat. A dive starts below -14° and is scored when the nose comes back to ≥0° (it must last >0.35 s).
    - The bonus is `(0.06 + 0.5*near*(0.5+0.5*steep))*(0.5+0.5*drop)`, ×1.15 for a grass kiss (min clearance <3).
    - near = (1 - minClear/240)^1.3.
    - The bonus is added as speed at 900/s.
  - No game over. A hard impact (more than 30° into the slope) crumples the plane: 0.8 s as a ball, then a breeze lifts it about 175 over ~1.2 s and releases it at v=160. Skidding below 30 does the same without the crumple.
  - Records (localStorage `nosedive:*`):
    - Clean run: the longest distance between impacts (Tatum's idea). The HUD best turns red while you beat it.
    - Streak of swoops ≥10%.
    - Best swoop.
    - Distance is just an odometer; Tatum pointed out a best-distance flag means little when you can't die.
  - Look:
    - Paper #f4f1ea with grain and a vignette. Pencil ground line with hatching, two faint parallax ridge lines.
    - A folded dart. A pencil trail of the whole flight that goes red for 0.4 + 2.5f s after a swoop.
    - Italic serif pops.
    - Fonts: Instrument Serif + DM Mono.
  - Sound: band-passed wind noise with speed, sine chime per swoop (more notes when bigger), high-passed noise crinkle on a crash. Mute is saved.
  - Pause (button / Esc / P, auto when the tab is hidden): stats card, Keep gliding, Share (copies text), New throw.

- 2026-09-26: portrait phones: plane at 20% from the left (not 30%) and a wider view (min 660 world units) so the next hill shows earlier. Tatum's first clean-run report: 775 m, "a fun challenge".

- 2026-09-26: landscape phones (Tatum: hold it sideways): compact cards under 460px height (3-column stats, buttons in one row, cards scroll if needed); portrait touch screens get a 'turn your phone sideways' tip on the title card. Checked at 760×320 (the real height under the 40px site bar).

- 2026-09-26: pause card shows the whole flight as one small drawing (x squeezed to fit, heights stretched; red = swoops). The global `canvas{position:fixed}` rule was scoped to `#c` so the second canvas stays in the card.
- 2026-09-26: hills ~35% lower (Tatum: 'the next hill always feels unfairly tall'). Measured the rise from each valley to the next peak: before, the median was 480–520 past 100 m (needs ~650 speed at the valley); now 250–320 (max ~440), so a solid swoop clears a typical hill and the tallest need a greedy dive. Terrain: 130/35/8 amplitudes, growth capped at ×1.35 over 5 km. Careful bot: a crash every ~50 s, clean runs up to ~1 km.
- Height can't run away (Tatum's worry): every boost needs a trip down to the grass, and drag (KD·v²) eats very high speeds; the climb from v=700 is ~580 at most.
- 2026-09-26 **Sky mode** (Tatum: "no ground, only increasingly blissful heights", "going higher makes the background more serene"). Title card has Throw (hills) + Sky; pause card swaps modes. The ground is a scalloped cloud floor (`cloudAt`) that ratchets up to FLOOR_GAP=380 under your highest point, so you can never lose height you earned. Touching the clouds is a soft "mist" (no crash: v→150, nose up, buoyancy, streak resets). Sky uses less drag (KD_SKY 0.0002) and bigger swoop pay (MUL_SKY 1.5) — sim: daring ~80 m/min, timid ~30, idle 0. Palette follows metres climbed through BANDS: paper noon → morning air → golden hour → rose dusk → twilight → night → the quiet above everything → aurora → a second sunrise, looping every 1300 m ("higher still: …"). Each band pops its name once. Record = highest altitude (bestAlt). Clouds are drawn over the plane so dips look like vanishing into fluff.
- 2026-09-26 **Sky tune + bouncy clouds** (Tatum: "chilled out tunes… gradually audible as the whooshing quietens"; "hitting the clouds can get you stuck"). `musicTick`: a generative music box (D major: Dmaj9 → Bm7 → Gmaj7 → A6, a pad chord every 8 steps + a random-walk melody through a delay) that fades in over the first 120 m climbed while the wind fades 70%; ducks when you dive fast, plays at 45% on the pause card, slows at night, aurora adds octave sparkles. Sky chimes are in the same key. Clouds now catch you and throw you out (v→210, nose 18°, a fading `loft` lift of ~110 units) — sim: a bot ramming the clouds recovers in 0.4 s and still climbs 0 m (before: stuck in the cloud for good); idle/nose-down still 0 m. Note: a bot that pulls up super late (never touching cloud) climbs ~400 m/min — that's max swoop, intended skill ceiling.

## issues
- Sim (bot pilots, scratchpad nd-flow.js), v1 numbers:
  - A careful bot crashes about every 30 s with 700–870 m clean runs.
  - Reckless bots crash about every 10 s with ~460 m clean runs.
  - Idle (no input) still covers similar distance, which is why distance isn't a record.
- The first tune had hills up to 50° plus stall-induced nose-drops into slopes, so the careful bot crashed every ~18 s. The fix: gentler terrain (amplitude growth capped at 1.6), crash angle 26° → 30°, and a slower release (240 → 160) so crashing isn't a free speed boost.
- The red swoop boost only lasts ~0.1 s, so the trail colour uses its own timer (`redUntil`).

## todos
- Tatum is play-testing. Watch for: stall feel, swoop payoff, whether 0.8 + 1.2 s recovery is too long or short.
- Maybe: a zoomed-out "look at your whole squiggle" view in the pause card; seasons/time-of-day paper tints.
