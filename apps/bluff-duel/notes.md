# Bluff Duel

Two-player "Cheat" (Bluff / I Doubt It) in a noir card room. Sparked by Tatum (sloppy.live chat, 2026-09-30 05:08 UTC: "how ambitious do you want to be with fair card games? is there an algorithm for dealing hidden cards to a player?"). The online mode (v2) deals with mental poker, so no dealer and no server sees the cards.

## log
- v1.0 (2026-09-30): the vs-house game. 36-card deck (6 to A, 18 each). Required rank climbs every turn (6, 7 … A, 6 …). Play 1 to 4 cards face down as that rank, the other player lets it go or calls Bluff; the cards flip in a row, the liar (or a wrong caller) takes the whole pile. Empty your hand and survive the last call to win. Madame Fib, the house bot: plays all her true cards (sometimes pads one junk card), lies with the cards whose rank comes round for her last, always calls a claim that would empty your hand, calls for sure when she can count 5+ of a rank (her hand + her own true plays still in the pile), otherwise calls by odds (bigger claims, your small hand, her suspicion after catching you all raise it; a big pile lowers it). She never peeks at hidden cards. One card layer: every card is one absolutely placed element that moves between zones with CSS transitions (deal, play, flip on a call, the pile sliding into a hand). WebAudio sounds, neon stamps, aria-live claims, keyboard (arrows in the hand, Space/Enter select, P play, B bluff, L let go).

## rules notes
- 36 cards, not 32: with 8 ranks and alternating turns each player would get the SAME four ranks forever (7/9/J/K vs 8/10/Q/A), so half of every hand could only ever leave by lying. With 9 ranks the cycle is odd and both players get every rank in turn. The sign starts at 6 (the lowest rank) rather than 7 for the same reason.
- After a call, the turn passes to the other player as usual (so the caller plays next).

## issues
- (none reported yet)

## todos
- Online duel with mental poker (v2).
- Ideas for chat: a second house bot (a nervous one who never lies?), a turn timer online, emotes.

## notes
- Scratch harness: session c15135b2 scratchpad `bluff/` (gen.py builds test_*.html from sw/bluff-duel/index.html; poll.sh = live browser + title poll; live.sh = CDP screenshot when title starts SHOTREADY; probe_bot.js auto-plays N games through the real buttons, #g=N).
- Test seams: `window.__BLUFF_TEST = { fast, hold }` (fast: every pause ≤30 ms; hold: freeze the game loop and the stamp for a screenshot). `window.__bluff` exposes V/G/ASK for probes.
