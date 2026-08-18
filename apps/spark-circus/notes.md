# Spark Circus — chain-reaction sandbox

## log
- 2026-08-18: v1 per chat ("safe interactive chain-reaction sandbox, draggable parts, catalysts, reset, playful feedback"). Single file, canvas 480×560, Chewy + Baloo 2 + Space Mono, circus cream/red/teal.
  - 7 draggable parts: dominoes (topple + trigger neighbours + push balls/bells/balloons/fizz at half-fall), ramps (segment physics from the pinball lab; tap = rotate 15°), springs (launch ≥560 up), balloons (pop → 26 confetti + radial impulse), fans (beam force, tap = flip), fizz-pod CATALYSTS (one charge: 3s of bubbles + speed multiplier on balls within 130px), bells (pentatonic-ish ding + wobble). Start flag draggable, unique, survives clear.
  - Editing: palette chip drag→drop places at pointer (tap = drop mid-board); placed parts drag to move, off-board to remove; layout persists localStorage. ▶ play spawns the spark ball; ↺ reset restores dominoes/balloons/fizz/bells + zero chain; ✨ example rebuilds the starter machine; 🧹 clear keeps only the flag.
  - Feedback: squash/stretch ball, confetti, bubbles, wobbles, rotated event stamps (CLACK!/BOING!/POP!/DING!/FIZZZ!), chain counter + persisted best, soft synth SFX + mute.
  - **Bug found by suite**: floor-mounted springs never fired — floor bounce ran before spring check per substep and flipped vy negative. Fixed by lifting the spring check above the floor collision.
  - **Probe lesson (3rd time today)**: spring assert checked vy AFTER 0.4s — gravity had decayed the -560 launch to -290. Track min-vy during the run. Count/measure from data, never from memory.
  - Suite sc-probe 18/18: preset boots, gravity/ramp/domino-chain/bell/balloon in a REAL uninterrupted run, fizz speed-boost vs control, spring launch, reset restoration, tap-rotate via real pointer events, off-board removal, palette drag-drop, persistence, clear/example, a11y.

## issues
- Domino↔domino triggering is reach-based (tip x within 26px) — very wide dominoes spacing silently breaks chains; the example spacing (36px) is the reference.
- Emoji chips tofu in headless shots only.

## todos
- Ball count part (multi-ball chaos)
- Share layouts as compact codes
- Optional chain-goal puzzles ("ring 3 bells with one ball")
