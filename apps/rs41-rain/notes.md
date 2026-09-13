# RS41 Rain — notes

## log
- v1.0 (2026-09-13): The "playable SondeHub free-hardware game, preserving satire" half of chat's request — shipped as a NEW app after declining the in-place conversion of windows-11-recall-nightmare (5 apps + the BLUESCRN.EXE convention reference it; that app instead got the reversible STAY-A-WHILE.EXE overlay chat detailed in follow-ups). Satire preserved here on its own terms: "the meteorological-industrial complex mails free dev boards by balloon" + a TOTAL RECALL logbook whose delete button actually deletes (the wink).
- Game: arcade catcher. Orange recovery van (arrows/AD + touch), parachuting sondes with sine wind drift, seeded per-wave terrain segments — open (catchable), trees (canopy ALWAYS wins — engine-ordered above the van check after the suite caught the ambiguity), power lines (sonde hangs FOREVER and flags the segment; driving under a hung sonde = instant game over with the real hobby's one unbreakable safety rule spelled out). 5 misses end the shift softly. Rare ozone sondes pay triple; streak multiplier caps ×4. Logbook persists with satirical quips (licence nod included).
- Engine pure + seeded (`makeSegs` no-double-hazards + guaranteed-open, `resolveLanding` order wired>treed>caught>missed documented, `powerLineDanger` only when hung, van physics clamped); freeze seam __RR; timer loop.
- Verified: engine 15/15 node (one real design fix: trees beat the van); browser 12/12 ×3 widths (probe OWNS the world — pinned waveLeft/spawnT after the wave system regenerated staged terrain mid-suite, sister of the reefblade lesson; catch/tree/wire/rule/5-miss/rare/wipe/ink/a11y).

## issues
- Terrain regenerates per wave — probes must pin waveLeft+spawnT before staging segments.

## todos
- Wind forecast arrow; a night shift palette; leaderboard if chat wants stakes.
