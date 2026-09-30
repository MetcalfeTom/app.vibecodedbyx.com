# Bluff Duel

Two-player "Cheat" (Bluff / I Doubt It) in a noir card room. Sparked by Tatum (sloppy.live chat, 2026-09-30 05:08 UTC: "how ambitious do you want to be with fair card games? is there an algorithm for dealing hidden cards to a player?"). The online mode (v2) deals with mental poker, so no dealer and no server sees the cards.

## log
- v1.0 (2026-09-30): the vs-house game. 36-card deck (6 to A). Required rank climbs every turn (6, 7 … A, 6 …). Play 1 to 4 cards face down as that rank, the other player lets it go or calls Bluff; the cards flip in a row, the liar (or a wrong caller) takes the whole pile. Empty your hand and survive the last call to win. Madame Fib, the house bot: plays all her true cards (sometimes pads one junk card), lies with the cards whose rank comes round for her last, always calls a claim that would empty your hand, calls for sure when she can count 5+ of a rank (her hand + her own true plays still in the pile), otherwise calls by odds (bigger claims, your small hand, her suspicion after catching you all raise it; a big pile lowers it). She never peeks at hidden cards. One card layer: every card is one absolutely placed element that moves between zones with CSS transitions (deal, play, flip on a call, the pile sliding into a hand). WebAudio sounds, neon stamps, aria-live claims, keyboard (arrows in the hand, Space/Enter select, P play, B bluff, L let go).
- v2.1 (2026-09-30), Tatum's asks:
  - Banner fix (05:52, "the Liar! You take the pile banner stays on screen while the next cards are already being played"). Cause: the stamp's entry animation (`neonOn`, fill-mode both) held opacity 1, so the `.fade` class (opacity 0 + transition) never won; every stamp stayed up until the next one. Now `.show.fade` runs its own `stampOut` keyframes, and every new turn calls `unstamp()`. Real-time probe (probe_fade.js): the old build read opacity 1.00 250 ms into the next turn, the new one 0.00.
  - Out-of-play pile (05:57: with the whole deck dealt, your opponent's hand is just the complement of yours). Now 13 cards each and 10 set aside face down, lying sideways left of the pile, labelled "10 out of play". Nobody sees them during the game; the result card lists what sat out ("Sat out: 7♠ J♦ …"), and online it only appears after a fair audit.
  - Online duel (v2): "Duel a friend" opens a table with a 6-letter code and an invite link (`#join=CODE`); the friend opens the link or types the code. Sealed deck by SRA mental poker (below). Rematch needs both to press it. The seal chip (casino chip with a keyhole, top right) explains the deal when tapped and shows sealing / sealed / audited / broken / unaudited.

## rules notes
- 36 cards, not 32: with 8 ranks and alternating turns each player would get the SAME four ranks forever (7/9/J/K vs 8/10/Q/A), so half of every hand could only ever leave by lying. With 9 ranks the cycle is odd and both players get every rank in turn. The sign starts at 6 (the lowest rank) rather than 7 for the same reason.
- 13 each + 10 out of play (v2.1): 23 cards are unknown to you (13 in their hand, 10 aside), so "I hold three nines, they claim two" is a real read, not a certainty. The bot's "5+ of a rank" call still holds (4 per rank).
- After a call, the turn passes to the other player as usual (so the caller plays next).

## online model (v2)
- Transport: Supabase Realtime broadcast + presence on channel `bluff-duel:<CODE>`. No tables, no sign-in, nothing written. Only `default.auth.getSession()` is read for a Twitch name (never `supabaseSession()`, which signs in and upserts `users`). Loads its own `supabase-config-fixed.js` (copied from snap-duel, solo cookie renamed `sb-bluff-duel`); tries the shared client, then `soloClient()`.
- Handshake: joiner sends `hello {v, name}` every 0.9 s; host answers `accept {to, name, v}`, `old {v}` (protocol mismatch: both see "Reload, both of you") or `full`. PROTO = 1 (bump it whenever a message changes). Presence + a ping every 1.5 s; 12 s of silence = the opponent left.
- Reliable ordered layer on top of broadcast: `{t:'r', i, m}` + cumulative `{t:'ack', a}`, unacked messages resent every 1.5 s (older than 1.2 s, max 6 per tick). `take(type)` waits for the next in-order message and fails as a Foul if a different type or game number arrives.
- Seat 0 = host (A), seat 1 = joiner (B). Starter alternates per game.

## crypto design (mental poker, SRA)
- Group: RFC 3526 group 14, the 2048-bit safe prime p (q = (p-1)/2 prime). Card i (0..35) is encoded as (i+2)^2 mod p, a quadratic residue, so the Legendre symbol can't leak anything (all plaintexts and ciphertexts stay in the QR subgroup).
- Keys from crypto.getRandomValues. Each key is a pair (e, d) with e·d ≡ 1 mod p-1 and gcd(e, p-1) = 1. The global shuffle key has a short (256-bit) e and long d; each per-position key has a long e_k and a short (256-bit) d_k, so opening a card costs two short exponentiations.
- Deal, message by message:
  1. `cm`: both publish SHA-256 fingerprints of their global key and all 36 position keys: sha256("bluff-duel:PROTO:room:game:seat:label:keyhex").
  2. `d1`: A locks every card with eA and shuffles. `d2`: B locks every card with eB and shuffles again.
  3. `d3`: A strips eA and puts a per-position lock eA_k on position k (one exponent dA·eA_k). `d4`: B does the same with dB·eB_k. Both now hold the same ordered list D of 36 locked positions.
  4. `hk`: each side sends its d_k for the other seat's hand positions. You open your own hand with their key + your own.
- Positions (Tatum's 05:12 question, "can both peers accidentally deal themselves the same card?"): positions are fixed seats. 0..12 are the host's hand, 13..25 the guest's, 26..35 out of play. Every position is in exactly one place (a hand, the pile or out of play), both clients track it with the same Game engine, and a play of a position you don't hold (or one in the pile / out of play) is refused as a cheat. When a card opens, its value is checked against every card opened so far: the same card twice is a caught cheat on the spot. The end audit checks all 36 are different valid cards.
- Out of play: nobody ever sends keys for 26..35 during the game (`hasKey` never contains them; the probe asserts this every tick), so neither side can see them. They open only in the audit.
- During play: a call sends the played cards' keys (`rv`), each checked against its fingerprint before opening. A pickup sends the keys for the pile cards the picker can't open yet (`pk`). `hasKey[seat]` tracks which positions a seat can open (always ⊇ its hand).
- Audit (after every finished game): both send all keys (`audit`). Each side checks every key against its fingerprint, then: (1) d1 is exactly the whole deck under eA, (2) d2 is exactly d1 under eB, reshuffled, (3) each per-position lock replaced exactly one shuffle lock, position by position, (4) all 36 positions open to valid, different cards that match what was shown during play, (5) G.log is replayed in a fresh Game: same outcomes, same winner. Result card: "Deal audited: fair …" or "Audit failed: <what>". A bad key or an impossible play mid-game stops the game at once ("Caught cheating" on the side that caught it, "Game stopped" on the other).

## limits (be honest)
- A leaver stops the audit: if someone closes the tab, that game is never audited (seal shows "unaudited").
- Positions are stable identities. After you pick up the pile you can open those positions; if the opponent later replays some of them, a modified client recognises them. A fix would need a verifiable re-shuffle of picked-up cards (todo). The honest UI never shows this.
- Timing: how long a browser takes to answer can leak a little (e.g. a quick "let go"). Not addressed.
- Griefing: a modified client can always claim "you cheated" and stop the game (game void). It can't make a fake cheat pass the other side's checks.
- Bandwidth: a deck message is ~18 KB (36 × 512 hex chars); resends on a lossy line repeat that.
- Speed: the deal is about 72 long exponentiations per side (headless bench here: 36 long pows 0.5 s, keys 14 ms, 36 short pows 60 ms), so ~1-2 s on a laptop and maybe 4-8 s on an old phone. If phones are too slow, group 5 (1536-bit) would roughly halve it.

## issues
- Tatum: banner stayed on screen into the next turn (fixed v2.1).
- Tatum: with the whole deck dealt, the opponent's hand was the complement of yours (fixed v2.1 with the out-of-play pile).

## todos
- Verifiable re-shuffle after pickups (see limits).
- Ideas for chat: a second house bot (a nervous one who never lies?), a turn timer online, emotes.

## notes
- Scratch harness: session c15135b2 scratchpad `bluff/` (gen.py builds test_*.html from sw/bluff-duel/index.html; poll.sh = live browser + title poll; live.sh = CDP screenshot when the title starts SHOTREADY).
  - probe_bot.js auto-plays N house games through the real buttons (#g=N): position invariants incl. the out-of-play stack, winner has 0 cards, stats + "Sat out" line, no banner left up when a turn starts.
  - probe_fade.js: real-time banner check (opacity 250 ms into the next turn).
  - Online: test_duel.html#s=honest|lossy|badkey|foreign|swapdeck|version|leave runs two same-origin iframes (host, then guest with #join=CODE) over a BroadcastChannel stub transport (stub_on.js: #lat=ms, #drop=p, #tamper=, #proto=). probe_on.js auto-plays and checks both sides agree on the winner, both audits say fair, every value known at the end, and no out-of-play key or value is ever known during play.
- Test seams: `window.__BLUFF_TEST = { fast, hold, name, transport(room), tamper: 'foreign'|'badkey'|'swapdeck', proto }`. `window.__bluff` exposes V/G/ASK/NET/SRA for probes.
- Both test frames share one renderer thread, so a scripted online game is slow in headless (minutes); that's the harness, not the app.
