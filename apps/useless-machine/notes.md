# useless-machine (Useless Machine)

## log
- 2026-07-02: shipped (chat asks: "useless machine — box with a toggle switch; when flipped, a mechanical finger pushes it back off" + immediate follow-up "twelve escalating shutoff animations, from a gentle nudge to a chaotic slap" — built the 12-level system in before first commit).
  - **Scene** (side view, pure DOM/CSS in a fixed-aspect .scene): spotlight room, wooden table + shadow, charcoal box with brass plate ("USELESS MACHINE MK.I" + mood line), red LED (lit while ON), feet, top **slot + hinged lid** (transform-origin at hinge), red-knob **toggle lever** (rotate ±32°), and the **arm** — rod + red fingertip, z-layered BEHIND the box so rotating up through the open lid reads as "emerging from inside." Arm poses: HIDE 118° / PEEK 96° / OUT 38° / PRESS 30°.
  - **Motion engine**: `move(el, transform, ms, ease)` = promise-wrapped CSS transitions (double-rAF then timeout), `wait()`, `shake(intensity,ms)` = Web Animations API random-decay translate on the scene. All durations clamped ≤60-80ms under prefers-reduced-motion.
  - **12 escalating techniques** (`LEVELS` array of [name, fn]; flips 1–12 walk the ladder in order, veterans get random picks from the angry half 8–12; brass plate announces "technique #N — name"):
    1. the gentle nudge (slow, apologetic) 2. the standard procedure 3. the brisk dismissal 4. the double-check (taps lever twice extra) 5. the ambush (lid cracks, peek, waits, slams) 6. the slow creep (suspense) 7. the disapproval (turns off then finger-wags no-no-no) 8. the speedrun (~350ms blur) 9. the overruling (presses and HOLDS 1.5s, trembling) 10. the mockery (flips it back ON itself, then off) 11. the tantrum (misses, whacks the box, shake, then slaps it off) 12. THE CHAOS SLAP (lid flung open + crash, full 360° arm windmill 118°→−330°, double box-shake, lid double-bounce; rotation snapped back to normal range transition-less afterward).
  - **Machine loop**: while switch is ON keep executing techniques (user re-flipping mid-retract is caught by the loop). Clicking the lever while ON lets you turn it off yourself → plate: "…you turned it off yourself. thank you."
  - **Audio** (Web Audio, gesture-init on first flip, mute toggle): servo = lowpassed sawtooth sweeps, switch clicks (2 pitches), lid thud, bandpass-noise whack + crash for tantrum/chaos.
  - **Stats** persisted to localStorage: "you flipped it on N times · the machine said no M times". Idle life: with ≥4 flips, every ~14s (40%) the lid cracks open for a silent peek.
  - Space/Enter flips. Tribute footer (Minsky 1952). WCAG: switch is a real button with aria-pressed + aria-label, scene role=application, counters aria-live, focus-visible brass outline, reduced-motion strips shake + near-instant moves.
  - Verified: JS syntax OK, 12 techniques present, head/OG/favicon.

## issues
- The arm hides "inside" the box via z-layering, not clipping — on very wide/short viewports the tucked arm stays safely below the box top edge (angles chosen with margin), but if the scene aspect is ever changed, re-check ARM_HIDE.
- CHAOS SLAP relies on a −330° end pose being visually identical to PRESS (30°), then a transition-less snap back to 118° after tucking at −242° (≡118°). Don't "simplify" those numbers.

## todos
- Rare 13th secret technique (machine refuses to come out; lever turns off untouched — "telekinesis").
- Combo detector: 5 flips in <10s triggers tantrum immediately.
- Tiny achievements ("flipped 50 times: certified menace").
- 2026-07-02 (fix, chat report ×2: "lid twitches instead of swinging open… during reset"): the lid was driven by the shared transition-based `move()` helper; overlapping sequences (a re-flip during retract, idle-peek racing the loop) reset `style.transition`/`transform` mid-flight → twitch. Lid now has a dedicated **`lidTo(deg,ms,ease)`** driver using the Web Animations API: explicit `rotate(from)→rotate(to)` keyframes, current angle tracked numerically in `lidAngle`, any in-flight lid animation `cancel()`ed first, final transform committed on finish/cancel. All 16 lid call sites converted (constants now numeric: SHUT 0 / CRACK −14 / OPEN −58, chaos bounce −70/−52/−64). Arm intentionally stays on the transition system — the CHAOS windmill needs string-keyframe angle interpolation (118°→−330°), and matrix-based from-states would shortest-path it.
