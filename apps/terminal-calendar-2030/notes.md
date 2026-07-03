# terminal-calendar-2030 (Terminal Calendar 2030)

## log
- 2026-07-03: shipped (chat ask: "pure retro HTML terminal with a blinking green cursor, a working monthly calendar grid showing July 2030, and clickable date cells with a typewri[ter effect]" — message truncated at "typewri", interpreted as typewriter output on click).
  - **CRT shell**: green phosphor `#33ff66` on near-black radial glass, dual bezel rings via box-shadow, scanline `::before` + vignette `::after`, 7s flicker keyframe on the inner content. VT323 throughout. Fake prompt header (`> cal --year 2030 --interactive`) + 3-line boot sequence (650ms cadence).
  - **Calendar**: real date math, **Monday-first** grid (`(getDay()+6)%7` lead), defaults to **July 2030** (verified: Jul 1 2030 = Monday → 0 lead cells, 31 days). ◄ ► month nav with year rollover; each swap types "month buffer swapped: MONTH YEAR."
  - **Clickable dates → typewriter**: every cell is a real `<button>` (aria-label "JULY 15, 2030"); click highlights the cell (`.sel` inset glow) and **typewrites a deterministic future log entry** into the output line at 18–44ms/char with longer pauses after `.`/`,`. Entries: FNV-1a hash of the date picks from OPEN×MID×CLOSE pools (10×10×10 = 1,000 combos) → "LOG 2030-07-15 [MON] // the toaster negotiated a firmware truce after an unlicensed rain shower. Witnesses: one cat."
  - **Blinking cursor**: block `█`-style span after the typed text, 1.06s steps blink. Typewriter is token-interruptible (clicking a new date cancels the previous animation cleanly).
  - WCAG: buttons everywhere, table + aria-labels, output aria-live=polite, focus-visible phosphor outlines, ≥2.2rem nav targets, prefers-reduced-motion kills flicker/blink and prints entries instantly.
  - Verified: JS syntax OK; July 2030 grid math correct; head/OG/favicon present.

## issues
- Log entries are date-deterministic but purely fictional/comedic; if chat wants real personal notes per date, that's a localStorage (or Supabase) feature away.

## todos
- `note <text>` command to attach your own entry to a selected date (localStorage).
- Keyboard navigation (arrows move the selected cell, Enter reads it).
- A `today` command that jumps to the real current month for contrast.
- Amber/white phosphor theme toggle.
