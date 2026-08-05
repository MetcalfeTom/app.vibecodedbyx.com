# Mandela County

## log
- 2026-08-05 v1: chat asked for "a Mandela County survival game where you text with locals and one wrong reply gets you erased by an alternate — CRT terminal aesthetic, hidden trust meter per contact". Green-phosphor CRT phone (VT323 + Special Elite, scanlines, curvature vignette, hue-glitch when an alternate texts). **Engine (pure logic, testable)**: a night = ordered list of THREADS (one contact each) played in sequence; each thread is a small node graph. Choices carry a hidden trust delta and either advance (`to`) or end (`end:'survive'|'erased'`). Trust per contact is HIDDEN (per request) — surfaced only obliquely via a deliberately-unreliable signal glyph (alternates fake full ████ bars) and the tone of replies. **Erasure** two ways: any `end:'erased'` choice (instant), or trust floored to 0. Clearing all threads = 06:00 AM dawn = you survived. **The horror**: 6 contacts — real Mom/Dale/Riley + the automated county alert (which reveals YOU are the last uncopied person), vs. alternates wearing Mom's and Dale's voices plus an UNKNOWN hunter. Each alternate has a documented "tell" (misspelled safe-word, wrong legal name, a shadow that "went ahead of him", baiting the safe-word) and the correct play is to notice without opening the door. Spotting an alternate (resisting with a strong-trust reply) increments a counter shown at dawn. Clock runs 10PM→6AM across midnight. Typewriter message delivery, per-event WebAudio blips + alternate sub-bass. 10/10 checks green: data integrity (all `to`/`end` resolve), every thread survivable, optimal play wins, both erasure paths, spotted counter, alt/real balance, clock labels across midnight, every alternate carries a tell.

## issues
- Trust deltas + node graphs are hand-authored; if adding contacts, keep the "all choices resolve + every thread survivable" invariants (the test enforces both — rerun mc-test.js).
- Difficulty is "read carefully" not reflex — there's no timer on replies (intentional; the dread is in the choice, not the clock). If chat wants a reply timer, add per-node countdown that erases on timeout.

## todos
- Branch the night order / randomize which of Mom & Dale is the alternate on a given run (currently fixed: real first, alt-copy later).
- A rare 7th "it's you texting yourself" thread.
- Save the best dawn (most alternates spotted) to localStorage.
