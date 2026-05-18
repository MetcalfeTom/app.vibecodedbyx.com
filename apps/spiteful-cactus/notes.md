# spiteful-cactus · notes

## log
- 2026-05-18: v1 — **mean-spirited pixel-art cactus that grows on insults** per chat ask. Self-contained ~39KB. Single canvas, pure CSS/JS, persistent localStorage.
  - **Pixel renderer**: 96×128 canvas drawn pixel-by-pixel via tiny `px()` + `rect()` helpers; CSS scales it ×4 with `image-rendering: pixelated`. 14-colour indexed palette (terracotta + dirt + 3-tone cactus green + flower pink + flower yellow + cream spines + ink). Stages of growth driven by the insult count, all deterministic via a `mulberry32` PRNG seeded by the count so the cactus rebuilds identically across reloads.
  - **Anatomy**: terracotta pot (rim + body + bottom shadow + dirt strip with sparkle pixels), 3-tone cactus column with vertical ridge stripes (alternating shade + light columns every 3px so the body has texture), rounded top (corner-knockoff + dome of 2 stacked pixels), up to **four arm-pairs** that unlock at insults ≥ 6 / 14 / 30 / 55 (horizontal segment → vertical lift with rounded tip, each side-aware), cream chevron-cluster **spines** scattered procedurally (count = `12 + insults * 0.9` capped at 140), **pink + yellow flowers** that bloom from insults ≥ 22 (alternating placement: arm tips on even indices, body crown on odd), and an **angry face** at ~22% body height (slanted brows pointing inward + beady eyes that narrow into slits at insults ≥ 40 + mouth that escalates: grumpy dot → small frown → wider sneer → toothy grin at the highest stages). At insults ≥ 110 a **cosmic halo** of 12 amber dots orbits the face.
  - **8 growth stages** with hand-written names + sub-lines: sprout (0–3 · *unbothered, mostly*), thirsty (4–9 · *showing up to the conversation*), prickly (10–21 · *getting comfortable*), snide (22–39 · *sharper than you remember*), malicious (40–69 · *thriving on this*), baroque (70–109 · *blooming spitefully*), cosmic (110–199 · *beyond your comments*), sovereign (200+ · *reigns over your tab*).
  - **40 hand-written snarky rebuttals**, including: "every drop of your hate makes me taller.", "your insults are watering me. keep going.", "your therapist would say you're projecting.", "i drink your tears and bloom.", "small person, small words.", "i felt nothing. i'm a plant.", "i have seen empires fall. you are not one.", "louder, i'm rooted in spite.", "i'm growing FLOWERS on your contempt. flowers.". Picker: `REBUTTALS[(fnv1a(text) ^ count) % 40]` — deterministic per (text, count), so the same insult at the same time always gets the same comeback.
  - **Hall of Fame** (per chat ask · top 5 most creative insults). Lives in its own gold-bordered panel under the history with an engraved-stone aesthetic. Scoring formula: `length × 0.35 + unique-words × 6 + long-words(≥8 chars) × 4 + punctuation-variety × 3 + uppercase-count × 0.3`. Single-word junk like "wow" (~7) doesn't clear the **12-point floor**. Shakespearean compound insults clear ~88. Each new entry that scores past the floor + isn't a dupe gets sorted into the top-5 list; medals 🥇🥈🥉 on the top three with gold/silver/bronze borders. Acknowledged in the bubble with "(admitted to the hall · N spite)" when a fresh entry lands. Persists in localStorage alongside history.
  - **Stats row** (3 cards): insults total, current pixel height, current stage name + sub-line.
  - **Inputs**: textarea (max 240 chars), big BUNGEE-SHADE pink FEED THE CACTUS button with chunky 4px drop-shadow + tactile press-down animation, ♪ mute toggle, ⌫ reset (confirms wipe of count + history + HOF).
  - **Bubble**: cream paper-style speech bubble with 3px ink border + pink shadow + tail. Types out the reply character-by-character at 22ms/char with a blinking ink caret.
  - **FX**: 0.35s shake keyframe on the cactus canvas when an insult lands. Web Audio synth: sine-pluck `sndThump` (180→45Hz exp ramp + bandpassed noise burst) on every insult, 3-note triangle arpeggio `sndChime` (C5-E5-G5 ascending) when crossing into a new stage. Muted by default.
  - **Aesthetic**: deep purple night (#18102b), terracotta pot, cream + pink + amber accents. Bungee Shade title (pink ·), Cormorant italic tagline, Press Start 2P chip labels, VT323 HUD digits, Special Elite body. Night-sky background pseudo-elements: 7 hand-positioned stars + a bottom-right radial-gradient moon.
  - **WCAG**: rem-everywhere, semantic main/header/section/aside, `aria-live="polite"` on the bubble, `role="img" aria-label` on the cactus canvas, label-for on the textarea, focus-visible amber-yellow outlines, ≥2.75rem tap targets, `prefers-reduced-motion` kills all keyframe animations + transitions.
  - **OG image**: Pollinations flux (no `referrer` — that endpoint rejects it per project notes).

## issues
- The first audio is gated on a user gesture (mute toggle or FEED button). If a user opens the page and never interacts, no sound fires — by design (muted on first boot anyway).
- Spine placement randomness reseeds on every render, so spines technically shift slightly between draws of the same count. Acceptable — they're chaotic-looking by design.
- The HOF picker rejects exact-duplicate text (case-insensitive trimmed match). Two distinctly-phrased insults at the same score WILL both enter; entries beyond rank 5 fall off when a higher-scoring one arrives.
- Reset wipes the HOF along with everything else (matches the "the cactus forgets you" vibe). If chat asks for the HOF to persist across resets, add a separate "memorial" flag in storage.
- localStorage cap is the only limit on history length; we ring-buffer at 12 entries.

## todos
- "Daily best" — a separate slot at the top of the HOF that resets midnight, encouraging fresh entries
- Mood ring on the pot · subtle colour shift in the terracotta as the cactus escalates
- Cactus types · player chooses sprout style at first feed (saguaro / barrel / prickly pear)
- Achievement chips · "first 100 insults", "all stages reached", "100-spite insult"
- A "release the cactus" exit button that opens a new page showing the cactus alone in fullscreen, dot-clean for screenshots
- Pollinations LLM hook · use the Pollinations API to score creativity AND occasionally generate a one-off custom rebuttal (rate-limited)
- Sharing · "POST YOUR BEST" copies the best-rated insult + cactus stage to clipboard as text
