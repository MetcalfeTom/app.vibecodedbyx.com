# Word Hatchling

sol_etdal's idea (2026-10-03): "an AI that knows nothing and can't speak until you speak to it… if I said 'hello man' it will only know hello and man… every new word I say puts it in a dictionary". No LLM: a bigram Markov chain built only from what you type, saved on the device.

## log
- v1.0 (2026-10-03): egg in a nest (0 words) → cracking (1–4, parrots one or two words) → hatchling (5–19) → chick (20–59, wings + tuft) → chatterbox (60+, pointy hat). Reply length grows by stage (LEN). New words light up (teal wavy underline). Brain in localStorage hatch-brain {v: word counts, nx: bigrams, st: starters, en: enders}, last 8 lines in hatch-log; cap 3000 words. Tap the creature to make it babble. Optional voice (speechSynthesis, high pitch), off by default. "forget everything" asks for a second tap. Dictionary in a <details>, every word (up to 1000 shown), most used highlighted.

## issues
- Emoji in CSS ::before rendered as tofu in headless; the log uses a CSS yolk dot instead.

## todos
- Ideas: let it ask "what's ___?" about a word; teach by tapping dictionary words; share a creature's dictionary as a link.

## testing
- window.__WH: M(), babble(heard, fresh), stageOf(n), nWords(). Probe hm/pwh1.js teaches five sentences (hello world first).
