# lingo-five

## log
- 2026-06-23: initial build. **Lingo-style 5-letter word game.** Guess the word in 5 tries; the first letter is given to you free at the start of each row (the Lingo TV-show twist that sets it apart from Wordle).
  - **Scoring** (two-pass, double-letter-safe): pass 1 marks exact matches (right letter + right spot), pass 2 marks close matches (right letter, wrong spot, only against not-yet-consumed answer letters). Verified: CRANE vs CRATE → exact exact exact MISS exact.
  - **Lingo visual language**: exact = red filled circle behind the letter, close = amber diamond (rotated square) behind the letter, miss = flat dark tile. Matches the game-show's circle/square convention (red, not green).
  - **First-letter-free**: every row pre-fills column 0 with the answer's first letter; backspace can't erase it.
  - **Word lists**: ~1265 curated 5-letter answer words inline + ~400 extra valid-guess words (merged into a Set). randomAnswer() filters to exactly-5 length. Guesses validated against the combined VALID set ("not in word list" shake on reject).
  - **On-screen + physical keyboard**, color-coded by best-known state (exact > close > miss rank so a key never downgrades).
  - **Flip-reveal animation**: each tile flips on a staggered delay, color applied mid-flip. Row shakes on invalid guess.
  - **Stats**: played / won / streak / best persisted to localStorage. End overlay shows the answer + solve count + streak line, "play again" reshuffles.
  - **Aesthetic**: neon game-show — Bungee display title in red→amber gradient, deep indigo board, JetBrains Mono tiles, cyan accent on filled/focus. Legend below the board.
  - **A11y**: rem-everywhere, role=grid board, role=status aria-live message, role=dialog overlay, key aria-labels (incl. backspace), focus-visible neon outlines, prefers-reduced-motion kills flip/shake/pop.
  - Single self-contained ~30KB HTML, zero deps, no network.

## issues
- Validation list is curated, not a full dictionary — some legitimate obscure words will be rejected. Tradeoff for keeping it self-contained + offline.
- Answer is random each game (not a daily shared word). Could add a daily-seed mode.

## todos
- Daily mode: seed the answer from the date so everyone gets the same word + a share-grid (emoji circles/diamonds)
- Harder mode: no free first letter
- 6-letter / 7-letter variants (classic Lingo escalates length)
- Two-player race via Supabase realtime
- Sound: game-show ding on exact, buzzer on loss
