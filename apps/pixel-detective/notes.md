# Pixel Detective — notes

## log
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
