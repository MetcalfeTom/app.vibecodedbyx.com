# Leftover Court — tap-based leftover verdicts

## log
- 2026-08-18: v1.0 per chat ("playful accessible tap-based verdict game, safe food guidance, transparent uncertainty"). Single file, Playfair Display + Special Elite + Space Mono, mahogany/parchment/brass courtroom.
  - **16-case pool, 10-case seeded dockets** (session counter persisted → reshuffles). Cases built on real rules cited by name: the two-hour rule (counter-night rice, buffet chicken, party dip, overnight pizza, counter-thawed chicken), the 3–4 day rule (day-3 keep, day-7 lasagna toss, day-4-exact fuzzy KEEP — the window's last day), freezer-pauses-the-clock, hard-cheese-endures, and when-in-doubt (mystery tub, twice-reheated).
  - **Sensory testimony INADMISSIBLE**: red rotated stamps on every look/smell/taste fact + aria narration "sensory testimony carries no weight"; pool-integrity probe asserts every sensory fact is flagged and no ruling text leans on one. "The nose is not an expert witness" is the tagline.
  - **Transparent uncertainty**: every case labeled cert high|fuzzy; rulings show a certainty chip — bright-line green vs "HONESTLY FUZZY — reasonable guidance differs here; that uncertainty is not a loophole, it is precisely why doubt defaults to the bin" (5 of 6 fuzzy cases toss; the one fuzzy KEEP is day-4-exact with the flip warned).
  - Gentle: wrong = "overruled" + rule taught, no lives/penalties (probed absent). Keys K/T/N. Session titles (Honorable Fridge Justice → Well-Meaning Bailiff).
  - Suite lc-probe 17/17 first run (pool integrity, inadmissible flags+narration, both verdict paths, double-judge block, keyboard, perfect-session title, reshuffle, negation-stripped language audit, USDA-by-name, zero links, a11y+stamp).
  - Mid-write corruption caught pre-probe again ('astonishment' inside a hex color) — 3rd stray-token incident today; always grep new writes for [a-z]{6,} inside color/emoji literals.

## issues
- Case ages are typed exhibits, not real timers — footer says so.

## todos
- Docket of the day (date-seeded shared docket)
- Two-player bench (pass the gavel)
