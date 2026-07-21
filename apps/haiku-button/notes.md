# haiku-button · notes

## log
- 2026-07-21: v1 — chat ask "build a haiku button app that turns text into haikus live". FULLY LOCAL engine (Pollinations text API is 402-paywalled for anon as of today — probed both POST /openai and GET endpoints; don't retry it here). Tokenizer + English syllable heuristic (vowel-group count, silent -e minus -le, -es/-ed corrections, hiatus bump for io/ia/ua/eo, numbers = digit count, floor 1) → cutHaikus(): for every start index, greedily pack CONSECUTIVE words into 5/7/5-syllable lines; exact cuts lead, best near-misses (sorted by total deviation) follow so the 俳句 button always cycles (cap 16). Live recompute on 140ms-debounced input; button/Ctrl+Enter = next cut; counts row shows per-line syllables (moss=exact, vermilion=off) + "true 5·7·5" badge. Washi/ink/vermilion aesthetic, Shippori Mincho + Zen Kurenaido + Fraunces. WCAG basics: rem-everywhere, aria-live cards, sr-only label, focus-visible, ≥2.75rem targets, reduced-motion. TESTS (node stub-DOM live-fire): syllable spot-checks (~1-off in 22 — "create" hiatus 'ea' not bumped, known limitation), true-5·7·5 found in sample rant, 4 distinct cuts over 4 presses, short-input graceful, HTML escaped (XSS probe).

## issues
- Syllable heuristic is ~95% on common English; proper nouns/loanwords can be off by one. The counts row makes errors visible instead of hiding them.
- Cuts use consecutive words only (keeps the user's phrasing intact). No word-reordering mode.

## todos
- Kigo (season word) detector — highlight if the haiku accidentally contains one
- Share-as-image (canvas render of the card with the 句 stamp)
- Japanese input support (count morae instead of syllables)
