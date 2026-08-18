# Snapz Record — notes + voice snips

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
