# The Quiet Kitchen — a sound-sorting puzzle with no sound

## log
- 2026-08-20: v1.0 — built per chat: kitchen-sound sorting with AUDIO-FREE visual cues, rounds, scoring, kind resets. DELIBERATELY SILENT — the hygiene check asserts no AudioContext anywhere; probes verify every waveform SVG is aria-hidden with the card's aria-label carrying full meaning (onomatopoeia + description). This is the access-first inversion: a "sound" game that never needed ears. 20 SOUND CARDS with a 6-shape visual language (spiky/bumps/flat/pulse/drops/clacks): SIZZLE argues with pans, DRIP is patient, HMMMMM is the kitchen's drone note, KACHUNK delivers. Three AMBIGUOUS cards (CLATTER, FSSSHH, POP) accept a second home "with a nod". SORTING: select card → select bin (4 homes with flavor lines); right = kind confirm + first-try scoring; wrong = the card EXPLAINS ITSELF ("oil only argues on the stove") and holds no grudge — retry until placed, and placement always counts. THREE ROUNDS of 6 (seeded deal, deterministic, probed) → final tiers all warm, including zero-first-tries: "every sound found home in the end, and that was always the whole game." KIND WIPE resets the round's attempts but keeps earned score ("knowing a kitchen takes visits"). Probe 12/12 (one probe-side fix: select() toggles, so the retry loop was deselecting its own card).

## issues
- select() is a toggle — probes (and future features) must not re-select an already-selected card before placing.

## todos
- a legend panel teaching the six wave shapes, harder mode with shapes only (no words), if chat asks.
