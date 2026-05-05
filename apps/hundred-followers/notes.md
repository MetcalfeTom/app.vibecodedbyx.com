# hundred-followers

## log
- 2026-05-04: shipped — celebratory landing page for the 100-follower milestone. Full-window canvas of fireworks + confetti behind a layered DOM banner.
  - **Counter animation**: 0 → 100 ease-out-cubic over 2.4s in a chunky `Bungee Shade` 3D-shadow numeral. Plays a square-blip tick every 5 numbers when audio is on. On 100, kicks the **grand finale** (14 staggered rockets + 3 super-bursts).
  - **Headline**: `followers` in `Bungee Inline` cream with pink/violet drop shadows + `thank you` cyan with violet/pink shadows. Animations stagger in (eyebrow → counter → headline pop with overshoot → tagline → CTA row).
  - **Fireworks engine**: rockets spawn at random bottom-x, accelerate toward a random upper target with a velocity-derived flight time of 0.85–1.15s, leave a glowing comet trail with `shadowBlur`, and explode at apex (when vy goes positive). Each explosion picks one of 5 palettes (hot · cool-pop · ultraviolet · sparkler · mint chip) and spawns 90–150 sparks with mixed ring/scatter modes (35% ring chance per burst), each with its own gravity/drag and additive glow.
  - **Trail fade**: per-frame `rgba(10,0,20,0.20)` overlay instead of a hard clear, so spark trails decay into the night sky over 6-10 frames — gives the comet/jellyfish look without per-particle history arrays.
  - **Confetti rain**: continuous spawn from the top (~4 pieces/s) plus a per-explosion puff (22 pieces, scaled palette). Each piece has independent rotation, sway phase + amplitude, gravity, drag, and an `Math.abs(cos)`-modulated width so the strip alternately faces flat/edge for that authentic paper-flutter look.
  - **Audio (Web Audio synth, no samples)**: rocket whistle is a triangle 420 → 2200 Hz sweep; boom is a 110 → 36 Hz sub sine + highpass-filtered noise crackle (highpass 700–1100 Hz Q=1, decaying noise envelope); cheer is a bandpass-filtered (1.4 kHz Q=1.4) 1.2s noise burst with a sine envelope; tick is a 880–1080 Hz square 50ms blip. All tied to the audio toggle.
  - **Audio gesture-unlock**: starts muted with a `tap anywhere for sound` hint pulse pinned above the ticker; first canvas click / button press / Space / `M` flips audio on and resumes the AudioContext. Hint auto-fades after 8s if untouched.
  - **Click anywhere on the canvas → rocket launches at the cursor.** Touch supported via `pointerdown` + `touch-action:none`.
  - **Two CTA buttons**: pink-gradient *Launch a rocket* (single rocket toward a random upper target) and bordered *Grand finale* (cheer + 14 rocket wave over ~3s + 3 supersize central bursts). Keyboard: Space launches, `F` finale, `M` mutes.
  - **Auto-launch loop**: between rocket waves, the ambient timer fires a fresh rocket every 0.7–1.6s. Pause/resume via the corner `auto` pill (top-right, alongside audio toggle).
  - **Background**: deep purple-to-night gradient with three radial pink/cyan/violet glows pinned to corners, plus per-canvas pre-seeded twinkling stars (density scales with viewport area, 3 hues — gold/blue/pink — with `sin` twinkle).
  - **Bottom marquee** scrolls 10 rotating thank-you lines (`thank you, chat · for the upvotes · for the bug reports · …`) at 36s/cycle with mask gradient on both edges. Three-color rotation (gold / cyan / cream).
  - **Aesthetic**: `Bungee Shade` for the counter numerals, `Bungee Inline` for the headline, `Major Mono Display` 0.4em-tracked for the eyebrow, `Cormorant Garamond` italic for the tagline, `IBM Plex Mono` for chrome. Palette: pink #ff3eaa, cyan #3ee0ff, gold #ffd83e, lime #9aff3e, orange #ff7a3e, violet #b13eff over a deep purple bg.
  - **Accessibility**: `role="img"` not used (canvas labelled via `aria-label`); skip link; semantic `<main>`/`<button>`/`<canvas>`; rem units; 2.85rem button heights; focus-visible outlines; `aria-pressed` on the audio + auto toggles; `aria-live="polite"` on the counter so screen readers hear it tick up; `prefers-reduced-motion` kills the marquee + entrance animations and keeps text visible.
  - **Mobile**: touch controls on the canvas, reduced corner padding, banner fluidly scales (clamp on counter + headline + tagline).

## issues
- The auto-launcher fires regardless of tab focus. On battery-constrained devices the `requestAnimationFrame` loop continues in the background once unfocused, but rAF normally throttles to 1Hz when hidden so it's mostly a non-issue.
- Confetti pieces are simple rectangles with an `abs(cos(swayPhase))` width modulation — convincing but not perfectly physical (real paper rotates around two axes).
- AudioContext requires a user gesture; before any click the visual party still runs but silently. The pulsing mute hint covers this UX gap.

## todos
- Optional `?count=42` URL param for arbitrary milestones (200, 500, 1000).
- A "tap for a heart" mode where each click spawns a heart-shaped explosion instead of round.
- Pull recent follower handles from a Supabase table to populate the ticker dynamically (currently hardcoded thanks lines).
- Save a confetti screenshot to clipboard with one button.
