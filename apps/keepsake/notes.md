# Keepsake — notes

## log
- 2026-08-18 v1.1: **permission ledger + activity log + one-tap revoke** (chat request,
  4 capabilities). LEDGER ('keepsake-ledger-v1'): save & recall granted at init (core),
  DRAWING & SPEAKING revoked until asked — each row states in plain words what it
  touches + granted/revoked timestamp + single-tap flip (no confirm: that IS the
  feature). Revoking never deletes data (stated). Gates: save→keep() refuses politely;
  recall→bring() keeps the pocket closed; draw→240×160 sketch pad appears, doodles
  attach as PNG dataURLs and show on resurfaced memories; speak→read-aloud button on
  the memory card, revoke fires speechSynthesis.cancel() immediately. SPEAK HONESTY
  NOTE: browser/OS voice engines may themselves use the network — Keepsake still sends
  nothing; "if that matters, leave it revoked". ACTIVITY LOG ('keepsake-log-v1',
  cap 200, newest first, clearable): permission flips, keeps (with/without sketch),
  resurfacings, read-alouds, exports, ledger init. Still ZERO app network requests
  (probe re-asserts empty resource log). 21/21 ledger suite + original 22/22 untouched.

## issues addendum
- Headless speechSynthesis is getter-only on window — plain stub assignment silently
  no-ops; probes must Object.defineProperty (and stub SpeechSynthesisUtterance too).

- 2026-08-18 v1.0: private local fragment journal, ZERO network requests BY
  CONSTRUCTION — no webfonts (deliberate documented deviation from the house webfont
  convention: the request demanded no network calls, so typography is a hard-styled
  Georgia/Iowan/Palatino stack), no og:image, data-URI SVG favicon, no fetch/XHR;
  probes verify performance.getEntriesByType('resource').length===0 AND grep the app
  script. Features: fragments (600 chars) tagged mood (6 chips) / place / names
  (comma→lowercased array); localStorage 'keepsake-v1'. RESURFACING: "bring one back"
  with optional mood/place-substring/name filters returns EXACTLY ONE memory — random
  among the minimum-seen group (strict least-resurfaced: nothing repeats while an
  unseen fragment waits; the earlier top-3 slice was probabilistically flaky and
  probe-caught), seen/lastSeen tracked, age strings ("from 3 months ago"). Archive
  details: browse (escaped), per-fragment delete, JSON export blob, double-confirm
  wipe (self-disarms 4s). Privacy card teaches DevTools verification. 22/22 probe ×3
  runs + screenshot.

## issues
- Probe self-reference: grepping outerHTML for 'fetch(' matched the probe's own check
  string — scope source-greps to the app's script element (or concat-split the needle).

## todos
- Optional: "on this day" surfacing if chat asks; import from exported JSON.
