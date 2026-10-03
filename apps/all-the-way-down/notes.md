# All The Way Down (Sloppy AI)

sol_etdal's idea (2026-10-03): "what if you make a sloppy ai and that sloppy ai makes a ai and it keeps going". Their name: "I guess you could call it a 'Sloppy ai'".

## log
- v1.0 (2026-10-03): the family starts with Sloppy (purple blob, bow, headphones); each AI builds one child via Pollinations text (name, personality, first words, why its parent built it, look). Inline SVG avatars from look params (8 shapes, 10 accessories, 6 moods). One AI call writes 3 generations; the extra two wait in a queue. "keep going" auto mode. Family saved in localStorage 'atwd-fam' (max 300). Fallback "home-made copy" mutation when the AI is unreachable, never repeating a name.
- v1.1 (2026-10-03): "whisper a quirk for the next AI" (fannar22: "afraid of spiders", "afraid of hair", a Pinky-and-the-Brain villain AI). The quirk throws away queued children, becomes the heart of the next child and echoes (twisted) in its kids; cards show "whispered by a visitor". AI timeout 20 s -> 45 s (3-generation replies can take 20 s+). Copies keep the quirk too.
- v1.2 (2026-10-03): the family grows its own language (sol_etdal: "they are probably developing their own language"): the prompt asks for made-up words or catchphrases that later generations keep using, garbled.
- v1.3 (2026-10-03): "zap" button on the youngest card only (sol_etdal: "any way to zap one of them out of existence"; their kids were bad-mouthing them). Glitch-out animation, pops the last generation, clears the queue (its unborn kids), stops auto mode. Probe hm/paw3.js.
- v1.4 (2026-10-03): the family remembers zaps (fannar22: "would it become evil just punishing the perfect kid"). Zapped kids (last 4) go into the next AI request: the next child may fear the button, try to be perfect, resent the visitor or become a failing cartoon villain; the list clears after one answer, its kids carry the echo. First test: "Zapper ... vows to out-pace the zap button", grandkid "Zap-fear! Doot-doot!". Probe hm/paw4.js.
- v1.5 (2026-10-03): running zap tally (sol_etdal was zapping every kid): localStorage 'atwd-zaps', shown in the status after 2+ zaps; past 2 the prompt says the family grows more nervous, past 8 openly rebellious, paranoid or theatrical. Restart clears it. Probe hm/paw5.js uses __AW.setZaps(11): got "Zapchaser ... shrieks whenever a cursor hovers too close to the zap button".
- v1.6 (2026-10-03): the first AI (Sloppy) has a zap button too, and it bounces off (sol_etdal: "time to zap sloppy"): card shakes, avatar glows gold, Sloppy's first words swap for a quip for 3.5 s ("nice try. I'm unzappable." ... "okay you're persistent. still no."). Bar padding 10rem so the footer isn't covered on phones. Probe hm/paw6.js.
- v1.7 (2026-10-03): "tickle" button on Sloppy's card, and tapping Sloppy's avatar tickles too (fannar22: "a button to tickle sloppy"; there are already 17 tickle apps, so it went here). Laughing face (mood 'laugh': > < eyes, open mouth; not in MOODS so the AI never picks it), jiggle, escalating lines; 9 fast tickles -> the next AI request says Sloppy was tickled, so the next kid is born ticklish (test: Ticklet, Gigglevox, Chuckletron). The youngest card's zap is now class 'zap kid' (markLast removes only those). Probes hm/paw7.js (face), hm/paw8.js (ticklish kid).
- v1.8 (2026-10-03): shields (fannar22: "kids can survive a few rounds of zaps"). g.shield 0-3 shown as gold pips next to "generation N"; a zap on a shielded kid takes a pip, shakes the card and shows its "survive" line (AI field, or a stock comeback). Kids born right after zaps adapt: +1 shield, +2 once 5+ zaps; the next one keeps a little less; 30% luck +1. Copies: 30% one shield. Probe hm/paw9.js.
- v1.9 (2026-10-03): hand-built kids when the AI is down (Pollinations out of credits): GENES (job, fear, tic, love; each a clause + first words) pass down in g.genes, a child keeps up to two of its parent's and gains one; zaps give "terrified of the zap button", tickles "giggles at absolutely everything", a whisper becomes a gene; syllable names (Brampop, Quibnik, Nubble). Offline mode: a credits reply skips the AI for 5 min, two other failures for 2 min, so kids arrive in ~1.6 s instead of a 25 s countdown. Probe hm/paw10.js.
- v1.10 (2026-10-03 11:55): fannar22 asked for a kid who wants to be a welder: new job gene 'dreams of being a welder' (says "mask down, sparks up. hi!"). Probe hm/paw11.js: 5 of 300 dry mutates carry it, no errors. The AI writer answered again in that test (FizzFizz, Quarkley), so Pollinations credits seem back.

## issues
- 2026-10-03 ~09:30 UTC: Pollinations anonymous tier replies HTTP 200 with content "The account behind this API key doesn't have enough credits..." for openai and openai-fast (models list shows only openai-fast as anonymous). ask() treats it as a bad reply -> home-made copies. Not fixable on our side; check again later.
- Pollinations anonymous calls: a second call within ~15-20 s of the last answer gets HTTP 402 (rate limit per visitor IP). Measured: 15 s after an answer -> 402, 25 s -> 200. Hence GAP = 25 s after the last answer, one retry on 402/429, and 3 generations per call.
- Identical requests are cached by Pollinations: always send a random seed.
- Without nudging, the children were all "wonder/curiosity/spark" greeting-card AIs; the system prompt now asks for a concrete job, obsession, fear, verbal tic or strange hobby.

## todos
- Branching families (two kids, cousins).
- Share a family line as an image.

## probes
- hm/paw1.js clicks "build the next AI" 4 times, records gens and errs (wait 85 s). hm/pawog.js: two clicks, scroll to top, for og.png at 1200x630.
- Hook: window.__AW = {fam, ava, mutate, errs, queue}.
