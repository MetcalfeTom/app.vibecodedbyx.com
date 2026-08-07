# laugh-track-bot (The Laugh Track)

## log
- 2026-08-07: v1 per chat (missmeowd's request: "a laugh-track bot that plays a random cackle on every chat emoji"). Single-file, no deps, every sound synthesized — zero samples.
  - **Core loop**: any chat message containing an emoji fires a laugh. Emoji detection via `\p{Extended_Pictographic}` + regional-indicator pairs (flags — a gap the test suite caught) + text faces (xD, :D, :), ;), :p) in the PURE `detectEmojis`. 380ms debounce so emoji walls don't machine-gun; ≥3 laughs within 2.6s = **pile-on**: layered applause (up to 26 filtered noise claps) + 2-3 stacked laughs.
  - **Six laugh types, all synthesized fresh per fire** (randomized pitch/syllable-count/rate/formants — no two identical): cackle (witchy 280-420Hz, 5-8 fast syllables + trailing breath), guffaw (chesty 110-160Hz), wheeze (noise-burst silent-laugh decaying, + tiny squeak), giggle (rapid 420Hz+ blips), evil (slow low ascent + drawn-out finale note), snort (double nose-noise + chuckles). `voice()` = sawtooth/triangle through bandpass formant with per-syllable pitch fall; master → compressor.
  - **Emoji bias table**: 💀😵🫠→wheeze, 😈👿🦹🧛→evil, 🤭😊🥰→giggle, 🐷🐽→snort, 😤🦍🐻→guffaw, 😂🤣😹🧙→cackle; anything else random. Tested per-mapping.
  - **Stage**: marquee LAUGH sign with bulb ring that blazes on fire, laugh-type caption ("the silent wheeze", "villain monologue laugh"), 14 canvas audience blobs that bounce open-mouthed (double for pile-ons), floating emoji rising from the stage, stats (laughs / biggest pile-on / driest spell).
  - **Audio arming**: big ARM THE LAUGH TRACK button (gesture requirement) with pressed state + volume slider through the master gain; connect/say/test buttons arm silently.
  - **Chat**: Twitch anonymous IRC (repo-proven bridge, generation-guarded + exponential backoff reconnects + console `[laugh-track:irc]` logs, channel persisted, prefilled sloppy_ai), local say box, and 7 test-cackle emoji buttons.
  - **A11y**: labeled everything, sr-only live region for arm/test events (not chat flood), feed role=log, focus-visible, ≥2.75rem targets, reduced-motion kills float/press animations.
  - Verified: syntax, id cross-check, 21 pure checks (multi-emoji counts, ZWJ families, flags after the fix, text faces, no false positive on "index.dat", full bias table, null safety), Chromium probe (emoji→cackle + sign lit, plain text→no fire, debounce, 😈→evil, feed rendering) — 0 errors.

## issues
- Twitch's own emote codes (Kappa etc.) are plain text and don't trigger — only Unicode emoji + the text-face list. Add popular emote names if chat requests.
- The debounce means an emoji flood yields ~2.6 laughs/sec + pile-on applause rather than true chaos; intentional (ears matter).

## todos
- OBS overlay mode (?overlay=1: transparent, sign+audience only, auto-connect).
- Per-user laugh signatures (hash username → consistent laugh type).
- "Tough crowd" mode: emojis get a single dry cough instead.
- Crossover: pipe fires into pixl-pal so Pixl laughs along.
