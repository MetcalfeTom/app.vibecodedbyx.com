# By Heart

Learn a text word for word by typing it from memory. Per Tatum (sloppy.live chat, 2026-09-27): "stores a custom string that you have to type from memory (ignoring punctuation/caps)", default "The quick brown fox…", and "as you type correctly, it can fix missing capitals and punctuation", plus a local collection of strings.

## log
- 2026-09-27 v1.0: shelf of texts in localStorage (`by-heart-v1`: {texts:[{id,title,text,best:{level:{acc,secs}}}], seeded, tipSeen, last}); five public-domain starters (fox, Dickinson, Sonnet 18 opening, NATO alphabet, 30 digits of pi). Editor with word count, delete needs a second tap. Four levels: Read (all words dim), Gaps (~half hidden, hash of the word index), Initials (first letter + underline), By heart (nothing past the caret, not even line breaks). Typing: norm() = lowercase, accents stripped, everything but letters/digits dropped, so "summer's" = "summers", "555-0199" = "5550199". A right word auto-advances (no space needed) and appears with its real capitals and punctuation; a committed wrong word is a slip (shake), two slips on a word reveal it in yellow; a committed prefix is kept ("x ray" for "X-ray"); "?" or the Peek button shows the next word. Tokens that are only punctuation ("-", "—") fill in after the word before them. Score = clean words (no slip, no peek) / words; best per level on the card ladder; opening a text starts at the first level not yet cleared at 90%. Finish dialog: next level, again, share link (`#learn=` base64url JSON {t,x}, ≤6000 chars; the page's own data), home.
- 2026-09-27 v1.1 (Tatum: "the text flashes when each new word is added"): the sheet is rebuilt with innerHTML on every word, so every finished word replayed the chalk-in fade. Now only the word just finished (and a dash after it) gets `.fresh` and animates; freshTo resets after each draw.
- Headless probe: scratchpad gaunt/bh_build.py (modes flow / mid / heart / home).

## issues
- LESSON: don't give a dialog a class that is also a state class elsewhere. The finish dialog was `.done` and every finished word was `.w.done`, so each typed word became a full-screen fixed overlay (and a text-shadow animation on ten of them hung SwiftShader). Dialog is `.fin` now.
- Mobile keyboards may autocorrect; norm() forgives caps and punctuation but not a changed word.

## todos
- Auto-suggest the next level when a round is flawless (the voice pitched "nudge you up a level").
- Maybe: spaced repetition reminders (which text is due), line-by-line mode for long texts.
