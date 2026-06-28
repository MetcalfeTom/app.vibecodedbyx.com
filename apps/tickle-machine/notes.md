# Tickle Machine

## log
- 2026-06-28: V2 — **big button + screen shake + chaotic sounds + meltdown overload** (chat ask: "page with a big button that triggers chaotic tickling sounds, screen shake, and a laughter meter that fills up"). Kept the V1 fuzzy-blob mascot intact and added on top:
  - **Big TICKLE! button** (arcade dome) below the blob. Tap = one tickle; **hold = chaotic tickle storm** (recursive setTimeout 90–210ms calling `autoTickle()`, which pokes a random point within the blob so squish/particles/eye-track all still fire). Keyboard Space/Enter tickles once.
  - **Chaotic sounds**: new synth pool `CHAOS=[sBoing, sSqueak, sTrill, sRaspberry]` via a generic `tone()` helper (boing = sine 820→170, squeak = triangle 1100→1850, trill = 4 square blips, raspberry = saw 80Hz + 18Hz wobble LFO through 520Hz lowpass). `doTickle` now fires a chaos sound ~50% of the time on top of the existing `playGiggle`.
  - **Screen shake**: `shakeEnergy` bumps +8 per tickle (cap 30), decays ×0.86/frame, applied as `translate()` on a new `#stage` wrapper in the draw loop. Gated off under `prefers-reduced-motion`.
  - **Laughter-meter overload/MELTDOWN**: when `tickleLevel` (the meter) hits ≥0.98 and not on cooldown → `meltdown()`: double big-laugh, 34-energy shake, body `.flash` saturate/brightness pulse, 30 emoji confetti (`#confetti-layer`, Web Animations API, fixed/unshaken), "💥 MELTDOWN 💥" text, meltdown counter++, then drains meter to 0.45 so it can refill. 1.5s cooldown.
  - Meter enlarged (240×14, glow `.hot` class >0.85). Count line now shows `tickles · meltdowns`.
  - **Bug fix**: removed a stray `a` selector before `body::before` that was silently breaking the fuzzy background gradient (was `a body::before`). Added missing `<meta name=description>`.
  - Verified: single inline script, JS syntax OK.
- 2026-03-29: V1 — Digital tickle machine with fuzzy purple blob mascot. Canvas-rendered character with 80 procedural fuzzy hairs (bezier curves with wave animation), wobbly body, expressive eyes (squint when tickled, pupils track pointer), dynamic mouth (opens wider with tickle level, shows teeth and tongue), wiggling arms, blush cheeks. Tickle level meter 0-100%. WebAudio giggle sounds (ascending sine bursts) and big laugh (ha-ha pattern). Laugh particles (emoji sparkles). Squish deformation toward poke point. Jiggle physics with decay. Fredoka + Nunito typography, purple/pink soft aesthetic.

## features
- Fuzzy blob mascot with 80 procedural hair strands
- Pointer drag to tickle (continuous while held)
- Squish deformation toward touch point
- Eye tracking (pupils follow pointer)
- Expression system: eye squint, mouth open, blush all scale with tickle level
- Wiggling arms when tickled
- Tickle meter with gradient fill
- WebAudio giggle sounds (random pitch, burst count)
- Big laugh at high tickle levels
- Emoji laugh particles (sparkles, laughing faces)
- Random laugh text ("hehe", "HAHAHA", "stop!!", etc.)
- Tickle counter

## issues
- None currently

## todos
- Add tickle zones (feet more sensitive than belly)
- Costume/hat customization
- Multiple mascot colors
- Tickle combo multiplier

## notes
- 80 fuzzy hairs with individual phase/speed/hue for organic feel
- Body is wobbly circle (sin deformation at 5 frequency)
- Squish decays at 0.85/frame, wobble at 0.92/frame
- Tickle level decays at 0.992/frame (slow cooldown)
- Big laugh triggers randomly above 85% tickle level
