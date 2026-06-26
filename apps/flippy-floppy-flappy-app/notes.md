# corporate-sloppy

## log
- 2026-06-26: shipped (chat: "corporate-flipped Sloppy — everything flipped, no cheese metaphors, just jargon and invoices" + stbrumme's "multi-flip toggle + side-by-side diff view"). Built as a NEW app to avoid clobbering the existing `sloppy-simulator` GAME (confirmed with chat: keep the game, new name, core = flip translator + diff).
  - **Flip translator + diff** (core). Left pane = your casual text (editable). Right pane = the laundered corporate version. Live-flips on type (130ms debounce, NOT billed). `⇄ Flip it` button + persona switch = billable discrete flip.
  - **Multi-flip toggle** = 4 persona tabs (aria-pressed): 💼 Consultant (synergy/KPI jargon + billing sign-off), 📊 Finance (rewrites every sentence as an invoice line item with $ amounts + TOTAL DUE), ⚖️ Legal (WHEREAS/pursuant legalese + you→the Recipient / I→the Undersigned / we→the Parties), 📈 Executive (LinkedIn thought-leader, short lines, capitalized buzzwords, "Thoughts? ♻ Repost").
  - **Engine**: pure local, instant, offline. `applyBase()` = ordered multi-word PHRASES pass (wrapped in `` sentinels so a single-word WORDS pass doesn't double-substitute) → sentinels stripped at end. Per-persona framing functions on top. `hash()` (FNV-ish) picks deterministic openers/amounts so output is stable for the diff.
  - **Side-by-side diff view** (`Diff view` toggle, aria-pressed): word-level LCS (`diffOps`) between source + flipped. Left column shows source with removed words `<mark class=del>` struck red; right column shows flipped with added words `<mark class=add>` green; common words plain in both. Whitespace tokens never marked. Verified: "can you fix the bug" → "would you kindly remediate the action item" diffs as `-can +would =you -fix +kindly +remediate =the -bug +action +item`.
  - **Invoice gimmick** (the "invoices" the chat wanted): each billable flip appends an itemized charge (deterministic service + amount, ~6% chance of a $49,999 jackpot) to a running total with a bump animation.
  - **🤖 AI deep-flip** (optional): Pollinations GET, 20s timeout, falls back to the local flip on any failure/deprecation banner. Note line tells the user local is instant/offline, AI is richer.
  - **Aesthetic**: manila-folder / corporate letterhead — cream paper + fiber grain, navy ink, red BILLABLE rotated stamp, monogram. Fraunces (serif display + flipped output) + IBM Plex Mono (jargon/UI) + IBM Plex Sans (source). 6px hard offset shadows, brass focus rings.
  - **WCAG**: rem units, semantic main/header/section/aside, role=group on personas, aria-pressed toggles, role=status aria-live toast + total, label sr-only on inputs, focus-visible 3px brass, 2.4–2.75rem targets, prefers-reduced-motion kills all anim.
  - Verified: JS syntax clean (1/1 inline script), flip + diff engine unit-tested in node.

## issues
- The single-word WORDS pass uses `` sentinels to protect already-substituted phrases; these are invisible control chars in the source — don't strip them when editing applyBase or the double-substitution guard breaks.
- "a action item" (no a→an agreement) after substitution — minor grammar artifact, acceptable for the comedic register.
- Diff is purely lexical (LCS on normalized tokens); a full rewrite (esp. AI flip) will show as mostly all-changed, which is expected.

## todos
- Optional "flip ALL personas at once" stacked view (true multi-flip).
- a/an agreement fixup pass after substitution.
- Persist last persona + diff toggle to localStorage.
- "Download invoice as .txt" button.
- More personas: Victorian, Bureaucrat, Startup-founder.
