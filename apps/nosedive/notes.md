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
