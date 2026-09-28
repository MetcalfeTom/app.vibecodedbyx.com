# Smush Solver

A helper for the word game Smush (Tatum's idea and rules, 2026-09-28 on stream). Type your board, tap the spicy tile, get every playable word sorted by score, with a look-ahead that says whether you can still use up every tile.

## Rules as Tatum described them
- A central golden tile (infinite uses) plus 8 plain tiles with 5 uses each. Every word must include the golden letter.
- Words are 3+ letters (2-letter words in a list are ignored). The same word can't be played twice.
- All plain uses must be spent: the game ends when they're gone, so the last word has to use exactly what's left.
- Letter values: Scrabble by default, but Tatum isn't sure, so each letter's value can be changed while editing (saved in localStorage `smush_vals`).
- A spicy letter changes after each word (random as far as we care; there's a deterministic algorithm but reverse engineering it is out of scope). A word containing it scores double.
- Dictionaries (built-in and imported) contain words the real game rejects, so the ✗ button hides a word for good (localStorage `smush_nope`).

## Word lists
- Built-in: words.js, ~42k words = wordslide's hand-written lists (words.js + words-extra.js) + generated plural/-ed/-ing forms (some aren't real words) + glyph-grove's 2-letter list (ignored at MIN 3).
- Bring your own: a local file picker only (.json or .txt). Accepts a JSON array, {"words":[...]} (Tatum's file), any object whose biggest array is the list, an object keyed by words, or plain text. Stored in IndexedDB `smush-solver`/kv/'dict' on the device. NO fetching of URLs (stream rule).

## How the look-ahead works
- Plain letters pool by letter (two tiles with the same letter = 10 uses). State = remaining uses per distinct letter, mixed-radix code (≤ 6^8 = 1.68M) + two 20-bit packed halves (5 bits per letter, guard bit) for a borrow-free fit check.
- A Web Worker (blob from #wk) runs a memoised DP best(state) with repeats allowed, only trying words that contain the first letter still left (order doesn't matter for a partition). That's an upper bound and a fast dead-end test (best < 0 = can't finish even with repeats).
- No repeats: branch and bound over distinct words (bnb), bound = DP value, 250k nodes for the top plan, 4k per candidate; played + ✗ words count as used. after codes: -3 doesn't fit, -2 pending, -1 dead end (proven), -4 no finish found in budget ("risky").
- Timing: 774 candidates for E + RSTALNIO: DP ~2 s in node, ~4 s headless; all rows filled in ~6 s. Big imported lists will be slower; rows show "checking…" meanwhile, scores work at once.

## Look
Hot-sauce label: cream paper, chili red #cf2f19, mustard gold #e0a21f, ink #241913. Fraunces (900, SOFT 100) + Martian Mono. Chunky tiles with 5 pips, the golden tile glows, the spicy tile gets a 🌶️ and a red border.

## log
- 2026-09-28 v1: board entry with uses −/+ and letter values, spicy tile tap, ranked candidates (score now / with look-ahead), played ✓ (takes uses from the fullest tile with that letter, undo), ✗ game says no (with undo toast), find box, best finish plan, BYOD file picker, new game keeps letters.

## issues
- Probe: scratchpad smush/mkprobe.py (?g=&p=&sp=&play=N&fresh=1) seeds localStorage and waits for EV.done.

## todos
- end-of-game replay: your words next to the best finish (voice's idea, not promised)
- faster DP for 200k+ word lists if it drags (e.g. drop dominated anagram words, iterative DP)
- expected spicy value in the look-ahead (each future word has ~k/9 chance to double)
