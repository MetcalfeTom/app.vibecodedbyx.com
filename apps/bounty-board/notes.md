# Bounty Board

lightup79's idea (Twitch, 2026-10-10 08:06 UTC): "how can open source developers get paid for raising a PR, can you build an app like that" + "can AI do the coding in a bounty board?". Real payouts need a payment service I can't use, so this is a game with pretend gold: bugs are outlaws on wanted posters, you vs an AI bounty hunter.

## log
- 2026-10-10 08:19 UTC v1: wooden board, 3 parchment WANTED posters at a time (6 per day, from 14 JS bugs in BUGS: code lines, bad line, 3 fixes with the right one first, why). Tap a poster: case file dialog with the issue, highlighted code (tiny hl()), tap the bad line (wrong line = shake, Rusty +8%), then pick the fix (shuffled; wrong = PR REJECTED, Rusty +12%), MERGED pays the poster's gold. Rusty (robot in a cowboy hat, bottom right, speech bubble) works on the richest open poster: race bar on the poster + in the case file; botTime max(9, 28 - 2.5*day) s ±15%, accuracy min(.85, .55 + .07*day); a miss shows a hallucination line (cowboy-utils, deleted the test, rewrote it in Rust...) and he retries once. End of day: your gold vs his, next day he's faster. Best total in localStorage 'bounty-board-v1'. Fonts Rye / Zilla Slab / IBM Plex Mono; bugs are inline SVG beetles (hat or no hat, hue per bug). Tested headless 390x844 (case file, full day solved by a probe → end card) + 1200x630, 0 errors.
- The rival was first called Clanker; renamed Rusty before shipping (Tatum joked about saying it "with the hard r" — the word has slur-meme baggage, keep it out).

## issues

## todos
- more bugs (viewers' worst bugs as posters, with their outlaw names), a trophy wall of caught outlaws, Rusty's day-by-day accuracy shown on the end card, other languages (Python posters?).
