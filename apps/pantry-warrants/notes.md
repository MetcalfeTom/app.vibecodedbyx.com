# Pantry Warrants — justice for the expired

## log
- 2026-08-19: v1.0 — built per chat. Food entry (name + date, both validated with in-character errors), 4 tiers by date math: fresh (🟢 "law-abiding citizen · N days of freedom"), watch (0-3d, 🟠 UNDER SURVEILLANCE, "expires TODAY. the office sharpens its stamp."), warrant (expired ≤30d: full WANTED poster — deterministic charges×2 + alias from FNV-1a hash, AT LARGE day count, escalating REMARKS at 7/14 days, reward "one clear conscience and shelf space", rotated EXPIRED stamp), haunted (>30d: 👻 NOTICE OF HAUNTING, violet poster, "presumed sentient... approach with tongs and humility"). Serve/consume buttons with ceremony lines ("composted with full honors"). Docket sorted by urgency. LOCAL-ONLY stated twice + probed. A11y: labels, aria-live status, role=group posters with narrated labels.
- SCREENSHOT-CAUGHT BUG: signed >> shifts on FNV hashes went NEGATIVE → ALIASES[-n]=undefined rendered as "alias undefined"; probe's /alias/ regex matched it happily. Fixed with >>> + new no-undefined-in-warrants check over 10 names. LESSON: screenshots audit CONTENT the way probes audit logic — and probe regexes should hunt the word "undefined" in any templated HTML.
- Probe 15/15. Zero external assets, multi-alphabet sweep clean.

## issues
- none open.

## todos
- printable warrant (window.print CSS), repeat-offender tracking, if chat asks.
