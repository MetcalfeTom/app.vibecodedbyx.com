# Sulky Stopwatch

A stopwatch with feelings (a tsundere, per sol_etdal). Idea: the voice pitched "a stopwatch that sulks", sol_etdal said "then build that" (2026-10-03).

## log
- v1.0 (2026-10-03): tomato enamel watch with a face. Crown = start/stop, side button = lap/reset (also buttons below, Space/L/R).
  Moods: ok → bored at 30 s idle (digits wobble) → sulk at 60 s idle if any time is on the clock (else it dozes, z).
  Sulk: mittens over the digits (digits fade out), keeps counting; "say something nice" box. Nice words → peek then ok;
  grudge grows each sulk (needs 1, 2, 3 nice words); mean words → spite: red digits run backwards for 5 s; neutral → "that's not a compliment".
  3 quick pats on the face while sulking → a 2.2 s peek. Tab hidden > 15 s while running → instant sulk "oh, NOW you're back."
  Time is integrated from performance.now deltas × rate (rate -1 during spite, clamped at 0). Idle is real time.

## issues
- The hands' fingertips left gaps over the digits; fixed by fading the digits out in sulk (the hands are the show, not the cover).

## todos
- sol_etdal / voice ideas: personality types (clingy one that panics when stopped, smug one that brags about laps).
- Maybe a "peek between fingers" frame, sounds (a huff), saving best laps.

## testing
- `window.__SS`: st(), setIdle(ms), setMood(m). Probes hm/pss1.js (start → bored → sulk), hm/pss2.js (neutral, nice, grudge, spite).
