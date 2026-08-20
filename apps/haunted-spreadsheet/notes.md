# SPRDSHT-97 — the haunted spreadsheet

## log
- 2026-08-20: v1.0 — built per chat: self-editing formulas, cursed macros, office ambience, safe reset. REAL FORMULA ENGINE, zero eval: tokenizer + recursive-descent parser (numbers, refs A1-H12, + - * / parens with correct precedence, SUM/AVG over ranges, unary minus), cycle detection → #SPIRAL!, everything else wrong → #GHOST!; hand-verified seed budget (D4=37.2, TOTAL B9=236.62, souls F8=94). THE HAUNTING (seeded mulberry(999), 9s timer, all types individually triggerable via __HS.hauntOnce): drift (formulas grow +0.13), whisper (empty cells speak from a 7-line pool), selfref (formulas gain +ME where ME = the haunt count — self-reference that stays evaluable and visibly corrupts downstream totals), swap, reverse. Possessed cells glitch purple (reduced-motion kills it). CURSED MACROS, all in-page fiction: TidyColumns (sorts items, one qty becomes 13), AutoReport (writes DO NOT PRINT row with a live SUM), MailMerge97 (a memo denying floor 13 into column H). OFFICE AMBIENCE toggle: 120+240Hz fluorescent hum through lowpass, random bandpass key-clacks, rare 440+480Hz phone ring ("there is no phone in this office"). SAFE RESET: ⛨ EXORCISE — restores seedGrid() exactly (probe: JSON-identical), zeroes the count, clears storage + log, aria-label promises "Always works" and the probe holds it to that. 🕯 hold-spirits pauses all self-editing (timer disarmed, aria-pressed). Séance log (role=log aria-live). Grid: role=grid, click/arrow selection, formula-bar editing (Enter commits + moves down, Esc reverts), per-cell aria-labels including raw formula + computed value, type-to-edit forwarding. Local-only persistence. Probe 13/13 first run.

## issues
- probe must exorcise() first for a known state — the haunt timer may fire during long test runs otherwise.

## todos
- CHART.EXE that draws a slightly wrong bar chart, printing "queue" easter egg, shareable haunted-sheet codes, if chat asks.
