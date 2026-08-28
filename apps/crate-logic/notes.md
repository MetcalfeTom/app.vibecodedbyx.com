# Crate Logic — notes

## log
- 2026-08-28 v1.1: BEAT MATCHING + CUE POINTS, per a public request ("prioritize beat matching and
  cue points first, defer energy labels, finish the core crate workflow"). Energy labels deliberately
  NOT built (see todos).
  - Engine: every rendered bar now goes through its own GainNode (`deck.bars[] = {t,end,g}`) so
    `cut(g)` can mute everything already scheduled from a future instant — that is what makes sync,
    nudge, hot-cue jumps and stop land clean instead of double-triggering drums. Per-deck `rate`
    (±8%, `RATE_MIN/MAX`) multiplies the track BPM; `spb()`/`bpm()` derive from it so the scheduler
    picks the new tempo up at the next bar. `gridPoint(t,'bar'|'beat')` = this deck's first grid
    point ≥ t; `phase(t)` = beats into the bar; `posAt(t)` = fractional bar position.
  - SYNC (`Deck.sync`): rate = other.bpm()/track.bpm (clamped), and if both decks play, the nearest
    other-deck BAR boundary (≥ now+50ms) becomes this deck's nextBar. Out-of-range → note says so,
    aria-pressed stays false. `paintBpm` recomputes `locked` (|Δbpm|<0.05) so the pill reflects
    slider moves on either deck. ◂ ▸ nudge shifts the grid by an eighth of a beat (▸ = sooner = cut).
    Play with the other deck running starts on ITS next BEAT (quantized play). Phase meter in the
    mixer: Δ = phaseA−phaseB wrapped to (−2,2], green <0.06 beat with equal tempos, amber <0.5.
  - Arrangement: every record is 32 bars — intro 0–3 (kick+hat), build 4–7 (+snare+bass), main 8–15
    (+stab), break 16–19 (no kick, open hats), drop 20–27 (everything), outro 28–31 (kick+hat+bass).
    Techno only gets a snare in the drop and a late stab in break/drop (v1.0 techno had neither).
    Timeline strip per deck (`role=slider`, arrows/Home/End, click = jump) with section segments
    tinted from the record's hue, a playhead, and amber cue markers.
  - Hot cues: 3 per record, `localStorage['crate-logic-cues-v1'] = {trackId:[bar|null ×3]}`. Tap empty
    = mark the bar you're on; tap set = `jumpTo(bar)` quantized to this deck's next beat; hold 600ms
    or right-click = clear. Crate rows show "· N cues".
  - Auto-mix: now fires when the live deck reaches OUTRO (bar 28) instead of every 8 bars, loads the
    nearest-BPM harmonic neighbour, `setRate(live.bpm()/nxt.bpm)` (beat-matched) and starts it on the
    live deck's next BAR boundary from its cue 1 (else bar 0). `AUTO.stepMs` is the fade step (probe
    sets 1).
  - Probes (job 1bc599c0/tmp: run.sh, probe-tail.html w/ fake AudioContext + settable clock,
    mobile-tail.html, shot-tail.html): desktop 39/39, mobile 11/11 at 390px, screenshots both widths.
  - Build stamp added (v1.1).
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
  targets), never sound. v1.1 probes inject a fake AudioContext via `__CL.setAudio()` with a
  settable `currentTime`; a frozen clock means a deck that was just started has NO bars yet
  (its first bar sits ≥ 0.5s ahead) — advance the clock and call `deck.schedule()` before
  asserting on `bars`/cuts (bit me once in v1.1).
- `aria-valuenow` short-circuit in `paintPos` skipped the valuetext refresh on load — `paintTimeline`
  now blanks valuenow first. Any "only update when changed" guard needs a force path on (re)load.
- Beat-quantized cue jumps can land a bar's downbeat on beat 2/3/4 of the other deck (like real
  quantize=1-beat); the phase meter shows ±1.00 and SYNC re-aligns to the bar. Intentional.

## todos
- Energy labels per record (1–5 heat / "warm-up · peak · cool-down") + energy-aware auto-mix
  ordering — explicitly deferred by chat on 2026-08-28; the arrangement sections already give a
  hook (drop bars ≈ peak).
- Keyboard hot keys for cues (Q/W/E deck A, I/O/P deck B) and play/sync.
- Loop roll (4/8-bar loop at the cue) and a master-follow sync (currently one-shot).
- Waveform-ish beat pips on the strip (kick/snare pattern per section) instead of plain segments.
