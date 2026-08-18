# Snapz Recorder — notes + voice snips

## log
- 2026-08-18: v1.0 per chat ("sleek prototype for quick text notes and lightweight audio capture, clear recording controls"). Single file, Unbounded + Space Mono, charcoal/volt-yellow/record-red.
  - **Text notes**: input + SNAP (Enter works), 280 cap, inline textarea edit (change persists), delete, newest-first timeline, localStorage 'snapz-notes'.
  - **Audio (house privacy patterns)**: mic acquired ONLY between explicit start/stop (gum-call counting is the load-bearing probe: exactly 1 acquisition per take, pending guard blocks double-start); tracks stopped in onstop ALWAYS; blobs live in SESSION MEMORY ONLY (never storage — probed; "this session only" tag on every snip; deleting revokes the object URL); discard button mid-take throws the take away. States are loud: "ready — mic is off" / "asking…" / "recording — mic is LIVE" (aria-live), pulsing red button morphs dot→square, elapsed timer, R toggles.
  - Zero network (fetch sentry). a11y: labelled record button carries the mic-only-while-recording promise, reduced-motion, 100% font, stamp.
  - Suite sz-probe 11/11 first run (notes persist/edit, mic lifecycle incl. track release + cancel path + URL revocation, storage/network audits, states).

## issues
- Audio is deliberately ephemeral — stated in copy 3×. If chat asks for persistent audio, that's a design conversation (IndexedDB + explicit consent), not a bug.

## todos
- Waveform scrubber on snips (canvas from decoded PCM)
- Note↔snip pairing ("attach a voice note to this note")
- 2026-08-18 (2): v1.1 — LIVE SNAP DETECTION per chat ("real-time finger-snap detection, permission-safe fallback, visible snap markers").
  - 👂 opt-in listener panel: gum → AudioContext → AnalyserNode ONLY (the probe asserts zero MediaRecorder constructions on this path — analyze-and-discard, stated in the copy and the aria-label). 50ms detection loop.
  - **Detector** (processFrame, pure + seam-tested): snap = peak>0.4 AND broadband high-freq energy>0.18 AND rising out of quiet (rolling quietAvg<0.12) AND 300ms refractory. Suite proves the negatives too: sustained loudness (speech) rejected via quietAvg, bassy thumps rejected via the broadband gate, double-spikes eaten by refractory.
  - **Visible markers**: volt chips with H:MM:SS timestamps (pop-in, cap 20) + running ⌁ counter + live level bar (honesty: you can SEE it listening). Session-only — storage untouched (probed).
  - **Permission-safe fallback**: denial → listener stays off with "mic unavailable — notes and manual snips still work". Track release + ac.close() on stop (probed). Double-start pending guard.
  - Anchor pre-pass caught a duplicate '/* ── timeline ── */' comment BEFORE any write — the discipline pays.
  - Suites: lsn-probe 11/11 + core sz-probe 11/11.
- 2026-08-18 (3): v1.2 — SNAP RHYTHM GAME per chat ("timed patterns, combo scoring, misses, rounds, safe microphone handling").
  - 🎵 panel above the listener: 5 rounds (90→126bpm, straight 4s → syncopated 10-beat), beat lane dots (offbeats drawn smaller), demo playback with gentle sine ticks + pulsing dots, 4-tick count-in, then SNAP IT BACK capture phase.
  - **Scoring**: ±70ms perfect (100×combo) / ±150ms good (60×combo) / else miss; combo climbs to ×4, resets on miss; matched beats can't double-score (nearest-UNMATCHED-beat assignment); unhit beats become misses at round end; ≥70% hit unlocks the next round.
  - **Safe mic handling, twice over**: (1) input rides the existing v1.1 analyser-only listener — probe re-asserts ZERO MediaRecorder constructions on the game path; (2) SPACE is a first-class equal input, so mic denial loses nothing; (3) finishRound force-releases the mic if the listener is live (track-stop asserted) — the game never keeps ears past the music.
  - RH.now() clock seam = fully simulatable rounds in probes. Suite 17/17 incl. v1.1 regression (notes, detector truths, seams).
  - Probe lesson (recurring): textarea VALUES are invisible to textContent — assert on .value. And count ids from data, not memory (#feed, not #notelist).
- 2026-08-18 (4): rename per chat — "Snapz Record" → "Snapz Recorder" everywhere it renders: <title>, og:title, styled h1 (Snapz.Recorder), notes.md heading. Folder/slug stays snapz-record (URL stability — apps never move). Full 17/17 suite re-run on the renamed file; rhythm game + recording untouched.
- 2026-08-18 (5): folder + slug rename per chat: apps/snapz-record → apps/snapz-recorder (git mv, history preserved). og:url updated to the new slug. Old slug NOT deleted — apps/snapz-record/index.html is now a featherweight redirect (meta refresh 0s + location.replace + visible anchor fallback), so every old link/bookmark still lands. Full 17/17 suite re-run at the new path. NOTE: sandbox has no HTTP route to sloppy.live/localhost — live-URL curls read 000 by design here; disk-path == served-path is the deploy contract.
