# Crate Logic — notes

## log
- 2026-08-18 v1.0: DJ crate manager, all audio synthesized (no samples/copyright).
  16 original tracks {title, artist, genre, bpm, camelot, root, hue} across house/techno/
  dnb/lofi. Pure rules exposed on seam: camelotCompatible (same slot, ±1 with 12↔1 wrap,
  relative maj/min), bpmCompatible (±6%), compatible = both. Crate rows: Camelot art tile,
  BPM/key columns (hidden ≤640px), →A/→B load buttons; green .compat highlight vs the
  reference deck; loaded rows dimmed; genre chips + name/BPM sort toggle. Decks: spinning
  platter CSS (reduced-motion kill), per-deck lookahead scheduler (nextBar + 120ms timer)
  rendering genre-specific bars — 4-on-floor house/techno w/ open hats + stabs, dnb break,
  lofi swing — kick/hat/snare/bass/stab all Web Audio primitives, bass rooted from Camelot
  key. Equal-power crossfader (cos/sin). AUTO-MIX: arms live deck, every 8 bars pickNext()
  chooses nearest-BPM harmonic neighbor not already loaded, loads idle deck, ~6s stepped
  crossfade, swaps AUTO.live. Unbounded + Space Mono, dark club magenta/cyan.
  15/15 probe (after fixing MY miscounts: 6 compat rows not 5, 3 dnb tracks not 4) + screenshot.

## issues
- Probe lesson repeated: count fixtures from the data, not from memory — two false fails
  were probe arithmetic, not app bugs. Recount before touching the app.
- Audio scheduling is real-clock; probes assert state machine (loads, AUTO flags, fader
  targets), never sound.

## todos
- Waveform strip per deck; BPM nudge (tempo bend) if chat wants deeper mixing.
