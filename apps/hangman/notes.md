# Hangman (neon edition)

## log
- 2026-09-26 · **Guess together mode** (linka_chat asked for a word game chat plays together). Solo / together switch in the header.
  - Everyone in together mode shares one word and one set of 6 lives.
  - Each player can guess one letter every 3 s. The client enforces 3 s, and the replay ignores letters closer than 2 s apart by server time.
  - The feed shows who guessed which letter, and a letter key's tooltip shows the same.
  - The end screen shows who guessed the last letter or made the final miss. "Next shared word" starts a round only when the current one is over, or stale after 10 minutes.
  - While a word is live, a category click only picks the list for the next word.
  - Solo stats are untouched in together mode. The chosen mode is remembered.
- 2026-09-26 · og.png is now a real screenshot of together mode (1200×630).
- 2026-09-26 · Português word list (30 words, accents dropped so everything is on the A-Z keys), playable solo and together.
- 2026-09-26 · team pill in together mode: words solved – hanged over the last 20 shared rounds (+ the current one once it ends), refreshed every 20 s. First live hour: 2–3.
- 2026-09-26 · phones: categories are one swipeable strip (no heading, no counts), smaller gallows and a two-line feed, so the word and keyboard are on the first screen.
- Earlier: neon solo game, 8 built-in categories, custom lists in localStorage.

## how together mode works
- Tables (default RLS: read all, write own, pass user_id):
  - `hangman_rounds (id, cat, word, name)`. `word` is scrambled: char+7 and reversed.
  - `hangman_guesses (id, round_id, letter, name)`.
- The current round is the newest row whose unscrambled word is really in its built-in category. Bogus rows from devtools are skipped. The first word seen for a round id sticks in memory.
- Every client polls every 2 s (8 s when the tab is hidden) and replays guesses in id order. All screens agree without server code.
- Supabase only signs in (anonymous or Twitch) when someone picks together, via the module script at the bottom (`window.hmNetGo`).
- Names come from Twitch `preferred_username`, or `guest-xxxx` for anonymous players.

## issues
- Testing from the sandbox: on http://127.0.0.1 the supabase cookie session does not stick, so inserts fail RLS. Map a `*.sloppy.live` hostname to the local server (`--host-resolver-rules`) and it works.
- The round id sequence skips numbers after failed inserts. The first live round was #5.
- Someone could read the word from the network tab. The scramble only prevents accidental spoilers.

## todos



