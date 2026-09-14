# Mug Shelf — notes

## log
- v1.1 (2026-09-14, a8eff6f22): dark-green room per chat — page #162e22 + white #f5f7f2; mug tiles deliberately STAY light (dark-outlined art loses edges on dark panels — the framed-art rule); primary button darkened after failing contrast; both grids moved to minmax(0,1fr) after a 1px 320 overflow (that lesson again). Style suite 10/10 ×3 (computed colors + WCAG arithmetic in the asserts) + functional 17/17 ×3 verbatim on stamped bytes.
- v1.0 (2026-09-13): Generic seasonal mug collector per chat's option-B pick (after the read-only check confirmed no Starbucks gallery ever existed and the brand-parody caveat was given). ZERO brand anything — probe asserts the brand word never appears (with a split needle, since the first run's regex matched its own probe source — that lesson again).
- 32 ORIGINAL mugs, all procedural canvas ceramics: deterministic per-id specs (4 shapes × 8 patterns × seasonal palettes × 2 handles), rim/inner/outline passes, steam wisps on the two seasonal specials per line, metallic sheen on the 2 rare glazes per season; a pixel-diff probe proves different ids draw visibly different art. Names are 32 original two-word cozy titles.
- Loop: the Counter offers a weighted trio (unowned ×4, rares gated ~10%), keep ONE; duplicates → saucers (rare dup = 3); 6 saucers buy a season-locked hunt; visits bank to 8, regen 1/3min (engine-pure regen with carry + cap, probe-verified on a mocked clock). Checklist: 4 seasons × 8 slots, silhouette "?" until owned, ★ marks rares, per-season + total counts. Ratings: 1–5 stars per owned mug (radiogroup), persisted, top-5 favourites list.
- Persistence: single localStorage key mug-shelf-v1 {owned, ratings, saucers, visits, lastTs, visitN}.
- Yeseva One + Karla, terracotta/cream ceramic-studio look; responsive 2-col → 1-col, 4-col checklist on phones; 44px controls; honest aria labels ("Unknown winter mug").
- Verified: engine 12/12 node (catalog uniqueness/determinism/rare rule, trio distinctness + seed determinism + season lock + measured unowned bias 0.62+, dup economy incl. rare×3, regen carry/cap/idle); browser 17/17 at 1200/480/320 (canvas ink per offer, pixel-diff art distinctness, keep→checklist→persist, deterministic dup→saucer path via keep() seam, hunt spend+lock, rating persist + favourites, mocked-clock regen, a11y, overflow); screenshots both widths.

## issues
- keep() doesn't verify the mug is in the current trio (used by the probe as a seam); harmless single-player, but if a leaderboard ever lands, validate against currentTrio first.

## todos
- Trade-in: 3 saucers reroll the counter; a shelf-share PNG export; seasonal rotation events if chat wants live-ops.
