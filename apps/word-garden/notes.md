# Word Garden

## log
- 2026-04-21: Created. Canvas-based night meadow where typing unique words grows neon flowers that fade to grey dust on silence. **Flower gen**: each word → `fnv1a(word.toLowerCase())` → mulberry32 PRNG → hue (from 9-entry PALETTE_HUES + jitter), petalCount (5–12), petalShape (round ellipse / teardrop quadratic), petalLen, petalWidth, stemLen (120–300), stemBend, centerR (4–10), leafCount (1–3), swayPhase, pollenCount. Duplicate word = revive existing flower (saturation=1, pulseBoost). **Silence decay**: `grace=4s`, `fullDecay=18s`; `silenceK = clamp((silence-grace)/(fullDecay-grace))`, `targetSat = 1 - silenceK`, flower.saturation lerps toward target at rate `dt*1.5`. When sat<0.05 → `spawnDust(f)` emits grey-drifting particles, flower `dusting=true`, fades alive→0, removed from state. **Input**: `[a-zA-Z\u00C0-\u024F']+` tokens; word finalized when input ends with non-letter or new token appears; submit resets alive flowers' saturation. **Scene**: moon with radial glow (top-right), 80 twinkling stars, 32 fireflies wandering upper 2/3, ground gradient + swaying grass tufts, procedural wind `sin(t*0.4)*0.5 + sin(t*1.1+1.3)*0.15`. **Flower draw**: curved Bezier stem w/ stemBend×wind, 1–3 leaves along stem, bloom with N petals (round or teardrop), radial gradient glow, center dot + speckles, drifting pollen when healthy (sat>0.7). **HUD**: Blooms / Unique / Dusted counters + silence progress bar with staged labels ("listening" / "petals fading" / "turning to dust" / "silence"). Optional chime audio (toggle button), bell pitched from hue. Cormorant Garamond italic title + IBM Plex Mono body + DotGothic16 labels; dark indigo-violet bg with pink/moss accents.
- Pollinations OG image.

## features
- Procedural neon flower per unique word (hash-seeded)
- Silence-based saturation decay (4s grace → 18s full dust)
- Dust particle emission on flower death
- Duplicate word revives existing flower
- Moonlit scene: stars, fireflies, wind, swaying grass
- HUD counters + silence progress bar
- Optional chime audio (hue-pitched bell)
- Live typing indicator w/ caret

## issues
- Many flowers at once (50+) can slow low-end devices due to gradient bloom per flower.
- Dust particles persist until off-screen or life expires — caps at ~200 via per-flower spawn cap.
- Non-latin scripts outside `\u00C0-\u024F` (Cyrillic, CJK) won't tokenize as words.
- Silence reset is global — one keystroke revives all flowers at once.

## todos
- Save garden snapshot as PNG
- Localstorage persistence (restore last garden)
- Flower picker cursor (click to inspect / revive)
- Weather: rain that revives, wind gusts that scatter
- Share garden code (seed string of all words)
- Alternate mode: typing a sentence builds a bouquet
