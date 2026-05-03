# corporate-succulent

## log
- 2026-05-03: shipped — desk-plant survival w/ silent judgment of coworkers.
  - **Sun + light system**: a sun moves left→right across a window strip over `DAY_SEC = 64s`; the light spotlight on the desk slides from desk-left to desk-right. Light intensity = `sin(dayProg·π)` (zero at dawn/dusk). Days increment with chime + bubble.
  - **Stem growth**: succulent has chained segments, each with a direction + length. Player aims with mouse (relative to pot, clamped to upper hemisphere — succulents don't grow down). When the stem TIP is in the spotlight AND aimed roughly toward the sun, light is absorbed (`align = max(0, dot(aim, sunDir))`); growth = `lightGain * (0.25 + lightAccum * 0.55)`. New segments spawn when aim diverges enough from the last segment, otherwise the last segment lerps + extends — produces a smooth curving stem that records its lean history.
  - **Water mechanic**: water depletes 1.3/sec from 100. Owner waters event every 22-48s (78% chance to actually water, +30-65); 22% chance "owner forgot you again". Water = 0 → wither + game over. Tint reddens when water <30.
  - **Coworkers**: spawn from L/R edges every 1.6-5s, walk along upper or lower lane (never through desk vertically). Each gets a name (16-name bag), shirt color, hair seed, optional mug/phone accessory. Top-down rendering: shoulders ellipse + arms swing + head + hair cap + accessory. Hover within 36px shows their name.
  - **Judgment system**: click a coworker within 28px → render judgment (43-line pool of corporate snark) in a thought bubble above them. Combo timer: judgments within 4s stack (×N counter, purple bubbles at ×3+). Each judgment slightly boosts `lightAccum` (spite is photosynthesis). Judged coworkers walk slower for 2s w/ a fading purple aura.
  - **Aesthetic**: top-down office — carpet base w/ stipple weave + grey wall band + window strip w/ mullions + drifting cloud ellipses + sun. Desk = wood gradient + grain curves + monitor + keyboard + mug + sticky notes. Pot = terracotta gradient. Succulent = teardrop leaves with green→dark gradient + pink Echeveria tips, base rosette + segment-join leaves + tip rosette w/ pink bud. Aim indicator = dotted green line from tip in aim direction.
  - **Audio**: HVAC + fluorescent ambient (60Hz sine + 121Hz triangle through 280Hz lowpass), judge blip (square + bandpass noise sparkle), grow chime (random pitched triangle), water (3-note rising sine), wither (descending sawtooth + noise), day chime (3-note triangle).
  - **Loop**: fixed-step physics 1/120s w/ accumulator + spiral-of-death guard (max 8 catch-up steps, drop backlog if hit).
  - **Persistence**: best ever height in localStorage as `corporate-succulent-best`.
  - **Aesthetic typography**: Bricolage Grotesque 800 title (LEAF in jade green), Fraunces italic tagline, IBM Plex Mono HUD pills, Bricolage 800 numerals.
  - **Accessibility**: rem units, aria-live HUD, role="application" canvas with control summary, semantic main/header, prefers-reduced-motion kills bubble animation, focus-visible outlines, skip link, overlays toggle inert.

## issues
- The succulent stem can occasionally develop sharp angles if the player whips the mouse around. The bend-vs-spawn threshold (last.len > 14 && angDiff > 0.25) handles common cases but extremes still happen.
- Coworker walk animation is purely top-down (just shoulders and a head). At small scales they read as "person dots" — could add a slight side-on tilt or distinct walking gait per coworker for character.
- No way to actively drink water — it depletes regardless of player action. Could add a "water drop" particle the player can catch on the desk.
- The "judge" interaction has no consequence beyond score — coworker keeps walking. Could add: at high judgment combos a coworker gets so judged they leave the office for the day (visible storm-out animation).
- Sun beam renders as a yellow trapezoid — could be replaced with parallax light shafts for more atmosphere.

## todos
- Boss event: HR Director walks past — judging them either drains water (HR retaliates) or jumps you a level if you hit the bubble within a window.
- Random office events: blinds close (light blocked 8s), fire drill (all coworkers stampede + huge combo opportunity), team lunch (no coworkers for 30s).
- Different succulent varieties unlocked at height milestones (Aloe, Haworthia, Christmas Cactus).
- Multiplayer: see other plants on other desks via Supabase presence.
- Achievements: "Wilted gracefully", "Caught 10 in a single combo", "Survived a week", "Identified the same crocs-wearer twice".
