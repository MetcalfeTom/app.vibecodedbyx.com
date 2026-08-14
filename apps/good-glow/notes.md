# good-glow (Good Glow — a jar for the good moments)

## log
- 2026-08-14: v1 per chat ("local-first happiness app: memories, kindness prompts, grounding, gentle habits, warm accessible design, privacy controls, export and deletion, thoughtful improvements"). Single file, Corben + Atkinson Hyperlegible (the a11y typeface — on purpose), cream/honey/peach warmth. Health-neutral family rules apply (habitat lineage): no streaks, no scores, no promises about happiness (footer says so).
  - **Glow jar (memories)**: keep ≤280-char good moments; each renders as a bobbing glowing orb in a drawn jar (last 24 shown, 200 cap); click an orb or "take one out" → relive card with kept-date + "let this one go". Two labeled EXAMPLE memories seed first boot and self-clear on the first real glow.
  - **Kindness deck**: 10 curated specific-and-doable prompts; "I did it 💛" counts (count only, no streaks) and — thoughtful improvement — offers "save it as a glow" (kindness → memory pipeline).
  - **Grounding 5-4-3-2-1**: self-paced stepper (no timers) with per-sense guidance, 8s CSS breathing circle, "stop here (that's fine)" as a first-class ending, warm completion line.
  - **Three tiny anchors (habits)**: 3 editable micro-habits, today-tick (2.9rem targets, aria-pressed), 7-day dot strip labeled "gaps are rests, not failures", every day starts even.
  - **Grey day button** (thoughtful improvement): one random saved glow + one guided breath + one kind sentence — the whole protocol; empty-jar case handled with a borrowable line.
  - **Privacy controls**: banner ("nothing sent anywhere") + panel: export .json, "jar letter" .txt (printable warmth), clear-memories-only, clear-ticks-only (words kept), delete-everything behind an inline confirm that states no copy exists anywhere; cancel is praised either way.
  - **A11y showpiece intent**: skip link, semantic sections + labelled headings, aria-live on relive/kind/ground/status, aria-pressed ticks, big targets, focus-visible sky outline, reduced-motion kills orb bob + breath circle, rem everywhere.
  - Verified 27/27: example seed + self-clear on first real memory, orb render + persistence, relive, kindness draw→count→nudge→glow-save, grounding 5→✓ + kind stop, 3 anchors + tick + week dot + edit persistence, grey-day composition, export content, both partial clears (ticks cleared/words kept; jar rinsed), wipe cancel-keeps + confirm-erases (storage checked), skip link, ≥3 live regions, reduced-motion rule (probe learned: iterate stylesheets with try/catch — styleSheets[0] is the cross-origin font sheet), privacy copy. 420px screenshot reviewed.

## issues
- Memories are plain localStorage text (≤280 chars, cap 200) — deliberately small; photos would need IndexedDB and a new privacy conversation.
- The kindness deck is 10 prompts — repeats become visible in heavy use; easy to grow on request.

## todos
- Optional gentle reminder via .ics ("visit your jar friday evening") in the product-vault style.
- Jar "seasons" — orbs tint slightly by the month they were kept.
- Import (the export's mirror) for device moves.
