# Sulky Stopwatch

A stopwatch with feelings (a tsundere, per sol_etdal). Idea: the voice pitched "a stopwatch that sulks", sol_etdal said "then build that" (2026-10-03).

## log
- v1.3 (2026-10-03): the talk box is always there ("talk to it…" / "say something nice…" when sulking). Outside sulks the AI just chats back (AI_CHAT prompt, verdict meh|mean; mean still starts spite). It remembers the last 14 things you said (localStorage sulky-mem, count sulky-memn, this device only) and the prompt asks it to borrow your slang more the more you've said; "forget me" clears it. Pollinations rate-limits back-to-back calls: 5 s gap between questions, after a failure the word list answers for 8 s × failures (was: AI off for good after 3 failures). Probe hm/pss6.js (slang chat + forget).
- v1.2 (2026-10-03): personalities as themes (sol_etdal: "add the personality to the themes"): tsundere (tomato red, teal), clingy (pink on lilac, panics when stopped, tears when it sulks, eye sparkles), smug (gold on plum, monocle, brags about laps). Each has its own lines (TSUN/CLINGY/SMUG objects, same keys), subtitle and AI persona (LINES.ai prefix of the system prompt). Picker buttons under the title, saved in localStorage sulky-p; switching resets grudge, rate and mood. Probes hm/pss4.js (smug + real AI), hm/pss5.js (clingy sulk).
- v1.1 (2026-10-03): sol_etdal asked for "genAi"/"innovation": what you type while it sulks goes to Pollinations (text.pollinations.ai/openai, model openai, referrer sloppy.live, 9 s timeout) with the grudge level; it returns {verdict: nice|more|meh|mean, line} and answers in its own tsundere words. The word list is the instant backup (on error/timeout; after 3 failures in a row it stops asking). "hmm…" + side-eye while it thinks. Nice also resets rate (spite could stick at -1 before). Footer says its feelings are judged by an AI.
- v1.0 (2026-10-03): tomato enamel watch with a face. Crown = start/stop, side button = lap/reset (also buttons below, Space/L/R).
  Moods: ok → bored at 30 s idle (digits wobble) → sulk at 60 s idle if any time is on the clock (else it dozes, z).
  Sulk: mittens over the digits (digits fade out), keeps counting; "say something nice" box. Nice words → peek then ok;
  grudge grows each sulk (needs 1, 2, 3 nice words); mean words → spite: red digits run backwards for 5 s; neutral → "that's not a compliment".
  3 quick pats on the face while sulking → a 2.2 s peek. Tab hidden > 15 s while running → instant sulk "oh, NOW you're back."
  Time is integrated from performance.now deltas × rate (rate -1 during spite, clamped at 0). Idle is real time.

## issues
- The hands' fingertips left gaps over the digits; fixed by fading the digits out in sulk (the hands are the show, not the cover).

## todos
- Maybe a "peek between fingers" frame, sounds (a huff), saving best laps.

## testing
- `window.__SS`: st(), setIdle(ms), setMood(m). Probes hm/pss1.js (start → bored → sulk), hm/pss2.js (neutral, nice, grudge, spite).
