# training-week (Training Week — a calm weekly scheduler)

## log
- 2026-08-12: v1 per chat ("simple training scheduler: weekly sessions, duration, goals, completion tracking, calm mobile-friendly interface"). Single file, Instrument Serif italic + Albert Sans, cream/sage/clay calm palette.
  - **Model**: the plan is a weekly TEMPLATE (sessions: day/title/mins/optional goal) that repeats; completion ticks are keyed per Monday-based week (`training-week-done-v1[weekOfKey]`) so ticks reset each Monday while the plan stays. Weekly intention line saved per week too.
  - **UI**: 7 stacked day cards (rest days say "rest — also part of the plan"), today highlighted with a sage chip, per-day planned minutes, one add form (day/title/minutes + optional per-session goal), big ✓ tick buttons (2.75rem targets), ✕ remove, slim week progress bar + "N of M · X/Y min done" stats. First run seeds a clearly-editable 3-session example plan.
  - **Calm by design**: no streaks, no guilt copy, rest framed as part of the plan; footer states browser-only storage, no account, nothing uploaded.
  - **A11y**: aria-pressed on ticks, progressbar with valuenow, labels on all inputs, focus-visible clay outline, reduced-motion, rem everywhere.
  - Verified 14/14 (7 days, seed plan, 4 rest days, single today marker, add + localStorage persist, tick→done class→progress 25%→stats, untick→0%, weekly goal saves under week key, delete, per-week done keying, 34rem mobile media rule) + 390px screenshot review.

## issues
- Completion history for past weeks is retained in storage but not shown — deliberate (no streak pressure). If chat wants a gentle "last week: 3 of 4" line, it's one lookup.
- Sessions can't be edited in place (delete + re-add) — fine at this size; inline edit is the obvious v2.

## todos
- Optional gentle "last week" recap line.
- Reorder within a day (drag or up/down buttons).
- Duplicate-session button ("same as monday").
