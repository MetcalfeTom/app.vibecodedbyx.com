# knuckle-shake (Knuckle Shake)

## log
- 2026-07-04: shipped (chat ask: "tiny web app called knuckle-shake that shakes the browser window any time you type a misspelled word into the text field").
  - **Real spellcheck**: typo-js (hunspell engine, jsdelivr) + `dictionary-en@4.0.0` .aff/.dic (~550KB, fetched at boot with an armed/failed status line; graceful "shake-free mode" fallback). Affix rules mean inflections work: verified live in node — teh/somthing/runnign flagged, running/don't/something pass, 9/9 cases. en_US: British spellings (colour) get rattled — documented on-page as "dictionary: hunspell en_US".
  - **Judging**: a word is checked exactly once when COMPLETED (separator typed after it; regex on text before caret + `checkedUpTo` high-water mark so backspacing/re-typing doesn't double-count; trailing word judged on blur). Passes: <2 chars, contains digits, Capitalized proper nouns, ALL-CAPS acronyms; apostrophes/hyphens kept in the word.
  - **The shake**: can't move the real OS window (browser security), so the page shell takes the hit — WAAPI random-decay translate+rotate, amplitude/raps scale with CONSECUTIVE offense streak (8→26px, 2→4 knuckle raps), plus a red vignette flash. Streak resets on any correct word. prefers-reduced-motion: flash only, no shake (stated in footer).
  - **Knock audio**: per rap = 210→80Hz sine thump + bandpassed woody snap; mute toggle.
  - **Stats row**: words / offenses / accuracy% / worst streak + "the window objects to 'teh'" callout (textContent-injected, no HTML from user input).
  - **Aesthetic**: Dept.-of-Spelling office memo — ruled manila paper, Special Elite typewriter + Libre Baskerville italic, red ink stamp, dark desk bg.
  - WCAG: labelled textarea, role=status dictionary line, aria-pressed mute, focus-visible, reduced-motion path.
  - Verified: inline JS syntax OK; dictionary integration tested end-to-end in node with the exact CDN files (9/9).

## issues
- en_US only — British spellings shake. Could add a dialect toggle (dictionary-en-gb exists on the same CDN).
- ~550KB dictionary download on first load (cached after); status line makes the wait visible.
- Words only judged at completion — mid-word typos don't shake until you hit space (by design; judging mid-word would rattle constantly).

## todos
- en_GB / dialect toggle.
- "Personal dictionary" — right-click a flagged word to whitelist it (localStorage).
- Escalation mode: at streak 5+, the textarea itself starts drifting.
- Leaderboard of longest correctly-spelled streak.
