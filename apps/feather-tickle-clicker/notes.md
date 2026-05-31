# feather-tickle-clicker

## log
- 2026-05-31: initial build. **Tap-to-tickle clicker with haptic-vibe CSS animations + Supabase high-score leaderboard.** Distinct from existing /tickle-feather (drag-feather-across-blobs sim) — this is a tight 30-second arcade clicker focused on combo-stacking + phone vibration feedback.
  - **Data**: new `feather_tickle_scores` table (default RLS, read-all, insert/update-own) with columns: `user_id` (auto), `username`, `best_score`, `total_taps`, `longest_combo`, indexed on `(best_score)` + `(user_id)`. Submit logic = select-then-update (cumulative `total_taps`, max of `best_score` + `longest_combo`); first-time submitters get an insert.
  - **Core loop**: tap the giant pink blob → +5 base × combo multiplier (`1 + floor(combo/5)`). Combo increments on each tap within 1.1s of the previous, resets after. 30-second round → modal → leaderboard.
  - **Haptic vibe stack** — every tap fires three coordinated feedback channels:
    1. **`navigator.vibrate()`** scaled by combo bucket: 16ms (low) → 22 → 32 → 48 → 70ms (huge combo). Critical combos (≥15) get 48ms; huge combos (≥30) get a `[70, 18, 48]` pattern.
    2. **CSS keyframes** — `.blob-wrap.tapped` triggers `blob-jiggle` (cubic-bezier overshoot: 1.2x0.78 squash → 0.85x1.18 stretch → 1x1 settle); `.blob-wrap.combo` triggers `blob-shake` (10-step rotational+translate shake). Re-trigger trick: remove class → force reflow (`void el.offsetWidth`) → add class.
    3. **Screen-level haptic CSS**: `body.haptic-shake` (4-step 2-3px translate jitter) on huge combos, `body.haptic-pulse` (1% scale pulse + 5% brightness boost on `.stage`) on critical combos.
  - **Combo escalation visual cascade** — face animates with combo: mouth widens (default → wide → very-wide-with-tongue), eyes squish into laughing slits ≥15 combo. Mood text floats above blob in 8 tiers ("heehee!" → "eep!" → "ahaha!" → "stop!! 😆" → "UNCLE!!" → "NO MORE!" → "HELP!!" → "💀💀💀") with bounce-in keyframe + 700ms display + rate-limited to 240ms.
  - **Floating score**: every tap spawns a `+N` div at tap point with float-up keyframe (0.9s ease-out, 110px rise + scale 0.6→1.2→0.9 + slight rotation wobble). Color/size scales: default berry, ≥15 combo → tangerine bigger, ≥30 combo → grape biggest with double-shadow.
  - **Sparkle particles**: 5-15 per tap (scales with combo), radial burst in 5-color palette (berry/lemon/grape/lime/tangerine), each with `--dx`/`--dy` CSS vars driving directional fade-out + scale-down + rotate.
  - **Feather cursor** (desktop only) — SVG of a pink-tipped quill with 8 plume vanes, follows pointermove with 7% ease, rotates -15° on tickle. Hidden on `pointer: coarse` (touch).
  - **Audio synth** (muted by default; toggle to enable) — `playGiggle(combo)`: 3-note triangle-wave arpeggio at base 660Hz + combo×12 + ±60Hz jitter, each tone exp-decays. Every 12th combo tap fires `playCritChime`: 4-note major arp at 880/1108/1318/1760Hz.
  - **Two modes**: ▶ 30-second timed (counts toward leaderboard, modal shows score/taps/peak-combo/best with NEW PERSONAL BEST banner if applicable, vibrate-pattern celebration) + ∞ free play (no timer, no submission, same combo+vibe mechanics).
  - **Combo meter**: top-of-stage gradient bar (lime → lemon → tangerine → berry) fills with combo/50, multiplier readout below pulses grape on crit.
  - **Leaderboard modal**: top 25 by `best_score`, top-3 get gold/silver/bronze rank-badge color, current user highlighted with berry-tint background and "(you)" suffix.
  - **Best score persistence**: localStorage `feather_tickle_best` for instant display + Supabase row as source-of-truth for cross-device.
  - **Keyboard**: Space = tickle at blob center (simulates tap), Enter = start/again, L = leaderboard, Escape = close modal.
  - **Aesthetic**: pastel candy palette — cream→sky-pink radial bg + lemon/lime corner glows, Bowlby One SC 3D-shadowed title ("FEATHER TICKLE" with berry+tangerine offset shadows), Fredoka 700 body, JetBrains Mono numerals. Chunky 2-3px ink-bordered buttons with 3px hard offset shadow + press-into-shadow animation. Pink fluffy SVG blob (200×200) with radial-gradient body + ellipse blush + tracking eyes + dynamic-path mouth + show-on-crit tongue.
  - **A11y per directive**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<footer>` + `<button type=button>`), role=application + descriptive aria-label on stage, role=status + aria-live on stats + toast + sr-only announcer, role=dialog aria-modal on result + leaderboard modals with aria-labelledby, aria-pressed on haptic + mute + practice toggles, focus-visible 3px berry outline + offset, 2.75rem touch targets, prefers-reduced-motion kills blob jiggle/shake + screen-shake + reduces floater duration.
  - Single self-contained ~32KB HTML.

## data sources
- feather_tickle_scores (created in this app)

## issues
- `navigator.vibrate` only fires on Android Chrome/Firefox + some Samsung Browser — iOS Safari ignores silently (CSS haptic CSS animations carry the load there)
- Drag-tickle throttled to 75ms apart so users can't infinite-combo by spinning the cursor
- Practice mode shows the combo meter but doesn't gate it; the meter doesn't update score-relevant multiplier display since practice doesn't submit
- Sparkle particles cap is implicit — no GC cap; if a user hammers fast for 30s with high combos, ~3000 DOM nodes get created and removed which can stutter low-end mobile (would need pooling for v2)

## todos
- Daily/weekly leaderboard tabs (use `updated_at` filtering)
- Different blob skins as unlockables based on total_taps
- Boss combo: at ≥40 combo a temporary 5-second "ultra" mode appears
- Tickle "weak points" — random highlighted zones on the blob that give bonus points for 1s
- Sounds: 8-bit version toggle, voice giggles via SpeechSynthesis
- Combo-decay grace period extends slightly with each successful tap (rewards consistency)
