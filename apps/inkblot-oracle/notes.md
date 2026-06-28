# inkblot-oracle (Inkblot Oracle)

## log
- 2026-06-28: **oracle now answers with a single evocative word** (chat ask). Prompt rewritten to demand EXACTLY one lowercase word (creature/object/feeling, no punctuation/explanation). Added `oneWord()` safety net that, even if the model disobeys ("I see a wolf prowling"), skips a STOP-word list of leading filler (a/the/i/it/looks/like/…) and returns the first meaningful token — verified: "I see a wolf prowling"→wolf, "It looks like a crab to me"→crab, "Butterfly."→butterfly. FALLBACK pool changed to single words (moth, seahorse, vortex, reckoning…); offline path just shows one word. Empty/garbage → fallback.
- 2026-06-28: shipped (chat ask: "Rorschach inkblot generator that draws symmetric abstract shapes and lets the AI guess what it looks like"). Self-contained canvas + Pollinations vision.
  - **Symmetric blot**: drawn to an offscreen `ink` canvas clipped to the LEFT half (so nothing crosses the midline), then composited onto the display as `drawImage(ink)` + a mirrored `translate(W,0) scale(-1,1) drawImage(ink)` → bilateral symmetry. Ink = a central mass straddling the mid-line + 3–6 organic `smoothBlob`s (quadratic-smoothed random radial points), 18–45 splatter dots, 2–4 curved `tendril`s, with a faint blurred bleed layer for organic edges.
  - **Seeded & shareable**: `mulberry32(hashSeed(seed))` PRNG drives every random call, so the same 5-char seed always reproduces the same blot. Seed shown as "#XXXXX" on the plate; a seed input lets you load a specific one; "New blot" rolls a fresh seed. Classic black ink OR a "colour" toggle (random-hue dark inks).
  - **The AI actually looks**: "🔮 Ask the oracle" downsizes the canvas to 360px JPEG, sends it as an `image_url` data-URL to `text.pollinations.ai/openai` (model `openai`, vision) with a prompt to playfully name what the shapes resemble in 1–2 sentences (no meta words). Verified the endpoint returns 200. 22s timeout + graceful fallback to a hand-written whimsy pool ("two bears high-fiving over a campfire…") clearly labelled as offline. Typewriter reveal of the interpretation.
  - **Aesthetic**: vintage psychology plate — cream card with "PLATE Nº" + seed corner labels on a moody dark ground, Playfair Display title, Cormorant italic for the oracle's voice, IBM Plex Mono UI.
  - **WCAG**: canvas role=img + aria-label, role=status aria-live on the oracle text, seed input labelled, focus-visible gold, prefers-reduced-motion skips the typewriter + bleed blur.
  - Verified: syntax OK; vision endpoint 200; seeded determinism.

## issues
- Drawing the canvas onto itself for the blur "bleed" works in modern browsers; skipped under reduced-motion.
- Vision quality varies — the model sometimes describes literally ("a black shape"); the prompt nudges it toward concrete creatures/scenes. Fallback covers outages.
- It's a toy, not a real psychological instrument (footer says so).

## todos
- Save/download the blot as PNG with its seed.
- "What do YOU see?" input to compare your read vs the oracle's.
- A few classic-plate presets; an animated ink-bloom reveal.
- Multiple oracle "personalities" (cryptic / clinical / unhinged).
