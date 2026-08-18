# Pixel Detective — notes

## log
- 2026-08-18 v1.2: **spoilers out, earned clues in** (chat request). Case briefs
  rewritten atmospheric and tool-free (probe asserts no tool names leak). New clue
  ladder per case: 3 stepwise clues (vague → category → names-the-tool), EARNED via
  investigation effort — tool/filter switches +1, wrong accusations +3 ("legwork"),
  +1 per 10s — unlocking at 5/12/20; button shows honest progress text, capped at 3,
  reset per case. Explanations PRESERVED for later review two ways: the post-solve
  explainer stays exactly as before, plus a new 📁 closed-cases archive card
  (details/summary per solved case, persists across cases). 13/13 clue probe
  (no-spoilers sweep, gating, no-double-dip, cap, archive) + full 28/28 regression.

- 2026-08-18 v1.1: **case 6 · the lighthouse code** (chat request: white/blue/green/red
  light filters, distinct hidden numbers, science, challenge mode). Subtractive-color
  physics done honestly: digits inked in GREY (absorbs all → white lamp), YELLOW
  (absorbs blue), MAGENTA (absorbs green), CYAN (absorbs red) on a pale lighthouse
  scene; filters multiply the image by their transmission ([1,.07,.07] etc.) — an ink
  goes dark ONLY under light it absorbs, and the explainer connects it to real
  narrow-band forensic photography. Per-filter tool notes teach each reveal. 4-digit
  code answer (fixed 3719 for the case). KEEPER'S CHALLENGE after solving: digits
  reshuffle randomly, 45s oil timer, best time in localStorage. Case-6 UI swaps the
  forensic toolbar for the lamp row. Probe now 28/28 incl. pixel-measured absorption
  (cyan lum ~91 under red vs wall ~254; thresholds set from measurement, not vibes)
  and a screenshot-vs-pixels dispute resolved the right way: my eye claimed the magenta
  digit showed under red; getImageData said (230,5,14) vs wall (225,16,15) — invisible.
  Pixels win.
- 2026-08-18 v1.0: steganography-detection teaching game, 5 cases, all evidence drawn
  procedurally (192×128, seeded mulberry32 — deterministic for probes). Cases/tools:
  1 faint ink (+6 on a FLAT wall → contrast boost ×14 around median), 2 LSB (blue&1
  word mask → LSB lamp), 3 changed few (+2 nudge → |after−before|×60 diff view; teaches
  comparison forensics), 4 loud crowd (red-channel-only +7 → channel isolation),
  5 double blind (diff reveals "LSB" hint → LSB lamp reveals ZEPHYR — detection is a
  chain). 8 forensic views (exhibit/original/diff/lsb/r/g/b/boost) with plain-language
  tool notes; accuse input (case-insensitive), per-case explainer (how it hid / how you
  found it), progress dots, done card, re-open. Ethics card: teaches DETECTION, honest
  about real steganalysis using statistics, zero anchors in the doc (probe-enforced),
  harmless fruit/weather words only. Special Elite + IBM Plex Mono noir. 17/17 probe
  (pixel-level: boost delta >60, LSB 255/0, diff dark-outside, hint-then-word chain,
  full 5-case solve run, no-links, aria) + screenshot of CANARY mid-boost.

## issues
- Probe caught a real design flaw pre-ship: case 1's original ±60-amplitude scene
  drowned the +6 whisper even after boosting (player-unsolvable). A whisper needs a
  quiet wall — flatScene() (±3) fixed it; verified visually.

## todos
- A case 6 with noise-matched LSB (needs histogram thinking) if chat wants a harder file.
