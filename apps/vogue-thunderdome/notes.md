# vogue-thunderdome · notes

## log
- 2026-07-14: v1.0 (chat: "fashion battle royale, five AI designers, single elimination, audience votes on each elimination"). Five personas w/ taste vectors [bold,elegant,cozy,edgy,minimal] + exit/win/snipe quip pools: Mara Minim (less), Leo Baroque (more — cameo crossover from clothes-minded's judging panel, now competing), Nova Flux (chrome futurist), Granny Ostrovsky (maximal craft), Kilowatt (voltage streetwear). **Look generation**: softmax-weighted sampling `exp(dot(option.a, taste)·0.28)` over silhouettes/fabrics/swatches/patterns/accents — Mara's looks measure 8.7 avg minimal vs Leo's 2.3 (60-sample test). **Rounds**: 8-brief pool (Chrome Gladiator, Funeral for the Sun…), never repeated in a season; all survivors generate a look; arena canvas draws them on spotlit podiums (procedural models, pattern tiles, fabric sheen/flutter). **Elimination**: crowd of 100 sim voters each votes out the worst brief-fit (±12 noise → the worst look tops the tally 25/25 statistically but upsets are possible); the PLAYER's ballot = +35 votes (~26% of the room, enough to flip a close race). Bars animate, gong, exit quip + a survivor snipes. 5→4→3→2→1 = 4 rounds → 👑 champion, crowns persisted per designer in vt-crowns (meta-narrative across seasons: the cards show career crowns). Anton + Fraunces italic + Plex Mono; void/gold/hot-pink chain-link arena. WCAG basics; sound off by default (gong/fanfare synth). Node 6/6.

## issues
- Player can't SAVE a favorite, only eliminate — chat may want a "shield" vote too.
- Crowd noise ±12 means the objectively-best look basically never leaves early; drama comes from mid-pack. Could add a "scandal" random event.

## todos
- Shield/save ballot alongside the eliminate ballot.
- Head-to-head finale: last two get a special brief + bigger crowd.
- Season history panel (who won which brief).
- Twitch-chat voting bridge (anon IRC read, like neon-aquarium) so the real audience votes.
