# neon-glass-calc

## log
- 2026-06-02: initial build. **Glassmorphism calculator** with cyan + magenta neon accents and a divide-by-zero roast.
  - **Aesthetic**: deep purple-void background with two drifting blurred orbs (cyan top-left, magenta bottom-right, 18s ease-in-out animation), faint 48px grid overlay, frosted-glass panel (`backdrop-filter: blur(28px) saturate(140%)` + 1.5px `rgba(255,255,255,0.18)` border + multi-layer glow shadow), 135° gradient highlight overlay across the panel surface.
  - **Display number**: 'Audiowide' (futurist neon-style font) clipped to a linear-gradient text fill (cyan → soft violet → magenta) with a 28px cyan glow. On error, the gradient swaps to red-gradient and a 0.4s flicker keyframe runs.
  - **Keys**: glass squares — base `rgba(255,255,255,0.10)` + soft inner highlight + drop shadow. Operators get cyan-tinted borders + cyan glow; active operator pulses with a stronger 60px halo. Equals key is a magenta-gradient slab with 80px magenta halo. All keys lift-on-press.
  - **DIVIDE-BY-ZERO ROAST**: 14-line pool, randomly picked when the player attempts `n / 0`. Shows as a Caveat-italic line in the top-left corner of the display (✦ icon prefix, red glow), slides in over 0.4s, auto-clears after 3.5s. Display shows "ERR" in red-gradient.
    - Sample lines: "Bold move. Mathematically inadvisable.", "Zero said no. Respect zero.", "Division by zero — the universe folds its arms.", "404: dividend not found in this dimension.", "Pythagoras left a voicemail. He's disappointed."
  - **Compute engine**: identical FSM to /quiet-calculator — current / stored / op / justEvaluated, chained operators apply left-to-right, `Number(r.toPrecision(12))` cleanup so `0.1 + 0.2 = 0.3`. Verified in build sanity test.
  - **Keyboard support**: full — 0-9 / + - * × × / / Enter = . , Backspace Escape c % all wired, pressed keys flash cyan briefly so input is visible.
  - **A11y**: rem-everywhere, semantic markup, `role=status aria-live="polite"` on the display, `aria-label="Calculator keypad"` on the pad, focus-visible 2px cyan outline, 3.3rem key targets, `prefers-reduced-motion` kills the orb drift + error flicker.
  - Single self-contained ~17KB HTML, zero deps.

## issues
- `backdrop-filter` isn't supported on some older Android browsers — the glass falls back to a flat translucent surface, still readable but loses the frosted vibe.
- Roast pool only has 14 lines — adventurous chatters will see repeats fast. Could expand.
- Active-operator glow uses 4 stacked box-shadows; cheap modern desktops fine, mid-range mobile may stutter if you mash keys rapidly.

## todos
- Sound: synth bleep per key + a sad-trombone descending sawtooth on divide-by-zero
- More roast lines (target 30+) + occasional "you tried it 3 times in a row" escalation
- Optional "rude mode" toggle for spicier roasts
- Mini "history tape" panel sliding from the right edge
