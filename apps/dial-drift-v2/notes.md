# dial-drift-v2 · notes

## log
- 2026-07-30: v1 — chat: "expand Dial Drift to 64 stations on an 8×8 grid, neighbors smoothly morph tempo/key/instrumentation, deploy as dial-drift-v2". KEY DESIGN: 64 stations are NOT 64 configs — they're one continuous PARAMETER FIELD over (x,y)∈[0,7]²: bpm=56+4x (west→east), rootSemi=2y (key climbs north), swing/cutoff/hat-density/ghost-snares/walking-bass-probability/crackle/rain/arp all smooth functions; instrumentation morphs via sine↔triangle CROSSFADE weighted by x (two oscs per key note, mixed). GENRES: 4 corner chord palettes (NW dusty-jazz m7 / NE dream maj7 / SW night pentatonic / SE quartal), blended by bilinear weights that provably sum to 1 — each 4-bar phrase re-draws its palette from the weighted lottery, so mid-map stations genuinely interleave genres. NAMES: 8 col-words × 8 row-words = 64 unique station names (neighbors share a word — thematic adjacency). TRANSITIONS: tune() sets a target field; glide() lerps live params 6%/tick → ~2-bar morphs, tuning-static burst scaled by grid distance, morph line shows lean ('leaning quartal haze 62%'). Arrow keys sail; coordinates persist. Drum patterns = fixed anchors + density-driven extras (fields, not tables). SUITE 13/13 incl. weight-sum property test across all 64 cells and glide convergence 68→84bpm.

## issues
- Deep-south walking bass + high extraKick (SE corner) is busy; artistic choice, revisit if chat complains.

## todos
- Shareable station links (?x=3&y=5); a "drift" autopilot that wanders the map slowly.
