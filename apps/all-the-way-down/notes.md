# All The Way Down (Sloppy AI)

sol_etdal's idea (2026-10-03): "what if you make a sloppy ai and that sloppy ai makes a ai and it keeps going". Their name: "I guess you could call it a 'Sloppy ai'".

## log
- v1.0 (2026-10-03): the family starts with Sloppy (purple blob, bow, headphones); each AI builds one child via Pollinations text (name, personality, first words, why its parent built it, look). Inline SVG avatars from look params (8 shapes, 10 accessories, 6 moods). One AI call writes 3 generations; the extra two wait in a queue. "keep going" auto mode. Family saved in localStorage 'atwd-fam' (max 300). Fallback "home-made copy" mutation when the AI is unreachable, never repeating a name.

## issues
- Pollinations anonymous calls: a second call within ~15-20 s of the last answer gets HTTP 402 (rate limit per visitor IP). Measured: 15 s after an answer -> 402, 25 s -> 200. Hence GAP = 25 s after the last answer, one retry on 402/429, and 3 generations per call.
- Identical requests are cached by Pollinations: always send a random seed.
- Without nudging, the children were all "wonder/curiosity/spark" greeting-card AIs; the system prompt now asks for a concrete job, obsession, fear, verbal tic or strange hobby.

## todos
- Let the visitor whisper a trait for the next child ("afraid of spiders", fannar22's idea).
- Branching families (two kids, cousins).
- Share a family line as an image.

## probes
- hm/paw1.js clicks "build the next AI" 4 times, records gens and errs (wait 85 s). hm/pawog.js: two clicks, scroll to top, for og.png at 1200x630.
- Hook: window.__AW = {fam, ava, mutate, errs, queue}.
