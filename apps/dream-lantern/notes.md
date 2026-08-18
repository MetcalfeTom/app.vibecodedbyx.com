# Dream Lantern — notes

## log
- 2026-08-18 v1.0: melody-matching door mystery. Lantern hums a 5-note pentatonic target
  (randMelody: bounded walk on 7-degree ladder); 5 doors each sing theirs — exactly one
  matches, decoys are perturb(target, changes) with changes shrinking as rounds deepen
  (3→1), guarded against accidental equality. Music-box bells (3 inharmonic partials,
  fast attack, 1.3s decay). Wrong pick: door shakes, lantern flickers, doors SHUFFLE
  (melodies re-seat, G.correct re-indexed via order.indexOf) — "wrong doors wander".
  Right pick: door swings open (rotateY), rising arpeggio, dream-world overlay (aurora
  gradient, 6 floating 🌸 islands, blur-in) with attempt-aware line; "dream deeper"
  starts the next round with closer decoys. Starfield canvas behind. Marcellus +
  Cormorant italic, indigo night. Reduced-motion kills all animation. 15/15 probe
  (pure helpers, one-correct invariant, shuffle keeps tracking, unlock flow, round 2)
  + screenshot.

## issues
- chooseDoor is real-time gated by playMelody's setTimeout done callback (~1.9s) —
  probes must wait ≥3.5s virtual time per pick.

## todos
- Optional: score of rounds survived; more door count at high rounds.
