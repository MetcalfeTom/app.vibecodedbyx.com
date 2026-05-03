# the-great-tin-escape

## log
- 2026-05-03: shipped — sardine-tetris.
  - 7 standard tetrominoes (I/O/T/S/Z/L/J) themed as sardine varieties: silver/mustard/kipper/olive/rum/tomato/lemon. Each cell renders as a tiny sardine sprite (gradient body + spine line + gill curve + eye + ink outline) inside a rounded tile. Same `drawCell` used for board, ghost, hold, and next previews.
  - 7-bag randomizer, hold (one per piece between locks), 3-up next preview. Standard line-clear scoring (100/300/500/800 × level). Level up every 10 lines, gravity = max(70, 800 - (lvl-1)*65) ms.
  - Rotation has a 7-attempt wall-kick (offsets 0, ±1, ±2). Lock delay 480ms with up to 12 lock-resets when player still moves. Hard drop adds 2pt/cell; soft drop +1/cell.
  - Brine "tin fill" meter on the right side panel — fills as the highest occupied row creeps up. Shipped tally counts every cleared row.
  - Aesthetic: vintage tinned-fish label — Cinzel 800 for masthead (TIN in tomato), IM Fell English italic tagline, IBM Plex Mono HUD, Bagel Fat One numerals. Cream paper bg with multiplied paper-fiber grain. Tin canvas wrapped in tin-rim shadow + ink border + brine inset.
  - Line clear plays SEALED / DOUBLE PACK / TRIPLE PACK / FULL TIN! stamp animation (scale-bounce w/ -4° rotation). Web Audio: rotate click, lock thunk + noise burst, slam, bell-pour cascade per clear, level-up arpeggio, game-over descending sawtooth.
  - Game over called THE GREAT ESCAPE with stats card (score / rows / level / shipped / best). Best score persisted to localStorage as `the-great-tin-escape-best`.
  - Mobile: 7 touch buttons (steer/rotate/hold/drop) with hold-repeat for left/right/down. Canvas auto-fits via ResizeObserver, CELL clamped 14..36px.
  - Accessibility: rem units, 44px+ targets, semantic main/header/aside, aria-live HUD, role="application" canvas with key summary, prefers-reduced-motion kills stamp animation, focus-visible outlines, skip-link to canvas, overlays toggle inert.

## issues
- The "T" piece spawn rotation is the ⊥ orientation (stem up) rather than the canonical T (stem down). Plays identically — purists may wish to swap rotations[0] ↔ rotations[2].
- No SRS-style per-piece kick table. The simple ±1/±2 column kick handles 95% of cases but I-piece can fail wall kicks against the right wall in some configs.
- No "T-spin" detection / scoring. Could be added later if chat asks.
- Touch button hold-repeat for soft drop fires every 25ms — may be too fast on some phones.

## todos
- T-spin scoring + recognition.
- Proper SRS kick table per piece.
- Lateral camera shake on hard drop / line clear.
- Replace pop animation with stamped-ink texture (multiply blend) for more vintage flavor.
- Optional 40-line sprint mode + ultra (2-min) mode.
- Per-piece sardine sprite variations (long sardine = elongated body shape) instead of uniform rounded tile.
