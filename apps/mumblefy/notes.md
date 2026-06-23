# mumblefy

## log
- 2026-06-23: **slur INTENSITY slider** (mild / medium / unhinged) per a re-request for the app. A deterministic post-pass `applyIntensity(text, level)` layers on top of whatever singer style is active: level 1 untouched, level 2 light extra vowel-stretch + soft final-stop drops, level 3 aggressive per-vowel stretch + interior-consonant dissolve + run-on word fusing + trailing elongations ("iii fooouund aaa looeee fooor meee"). Same FNV+mulberry seeding so it stays stable on re-render. 3 amber pills in the action row; default medium.
- 2026-06-02: initial build. **Phonetic lyric converter** — paste lyrics, pick a singing voice, get them rewritten the way that singer actually pronounces them.
  - **7 singer styles**, each a pure text-transform function:
    - **Bon Iver** — soft falsetto mumble: drops final stops (t/d/k/p), softens t→d between vowels, -ing→in', you→yuh, the→th', collapses doubled letters, trails "mmm" hums on longer lines.
    - **Thom Yorke** — wavering warble: tremolo vowel-stretch (random 1-3 repeats, mixed case for shiver), floats "oh-oh-oh"/"aa-aah" after lines.
    - **Sinatra** — smooth crooner: lengthens the last vowel of longer words, drops jazzy "baby"/"now"/"mm-hmm" at line ends.
    - **Death Metal** — guttural growl: ALL CAPS, doubled harsh consonants, EE→EH/OO→UH, "BLEAGH"/"RRRAARGH" inserts.
    - **T-Pain** — autotune melisma: last-vowel pitch runs ("-eo-oe-e"), every long word gets a vocal run.
    - **Opera** — rolled Rs, dramatic a/o stretches, "AAAH"/"bravissimo" flourishes.
    - **Drunk Karaoke** — slurs (s→sh), drops random consonants, random caps, "WOOOO" / "wait how doesh it go".
  - **Stable output**: per-word mulberry32 PRNG seeded by FNV-1a hash of the word + its offset, so the same input always produces the same rewrite (no flicker on re-render). transformWords() preserves punctuation + line breaks via regex replace on `[A-Za-z']+` only.
  - **Live conversion** on every keystroke (input → output pane). Copy button (clipboard), clear, sample-verse drop-in.
  - **Aesthetic**: warm dim stage — amber/rose/gold on near-black, Fraunces serif display + italic output, Bricolage Grotesque UI, JetBrains Mono meta. Each singer card has its own accent color on the left border + name. Output glows gold.
  - **A11y**: rem-everywhere, role=radiogroup on singer picker + aria-checked, labeled textareas, focus-visible gold outlines, prefers-reduced-motion.
  - Single self-contained ~22KB HTML, zero deps, no network.

## issues
- Rules are heuristic, not a real phonetic engine — they capture the *vibe* not IPA accuracy. That's the joke.
- Death-metal consonant-doubling regex `[RGKBDTGRRGH]` is a loose char class; works but isn't linguistically principled.

## todos
- More singers: Dylan nasal-drawl, Björk staccato, ASMR whisper, vaporwave-slow, Gregorian chant
- "intensity" slider per style (mild → unhinged)
- SpeechSynthesis read-aloud of the converted text
- Shareable permalink (encode lyrics + style in URL hash)
