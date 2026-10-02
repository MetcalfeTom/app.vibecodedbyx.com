# Bracket Link

Tatum's idea (2026-10-02): a tournament bracket for an online group, no accounts.

## How it works
- No database. The whole bracket (title, names, winners, id) is base64url JSON in the URL hash: `#b=` organizer copy, `#view=` look-only copy.
- localStorage `bracket-link-v1` keeps the organizer's last bracket; a link in the address bar wins over it.
- Single elimination, size = next power of 2, standard seeding (1 v 16, 8 v 9...), byes go to the top seeds and auto-advance.
- Winners stored per match id as a player index; layout() drops any stored winner that is no longer in its match, so undoing an early result unravels the later rounds.
- Same number of names = rename, results kept. Different count or shuffle = restart (with a confirm strip).
- Test hook: `window.__BL` (S, layout, enc, dec, clean, render, link, view).

## Look
Paper sheet taped to a pub wall: #f2eee3 paper, ink #15120e, one red marker #d7342a, gold champion. Big Shoulders Display + Spline Sans Mono.

## Log
- v1.0 link-encoded bracket, share link + organizer link, view mode with "make my own copy", champion banner + confetti.

## Issues
- Tatum wants players to report results themselves and the organizer to settle disputes, ideally with a database. A live shared table is a new online mode: needs Fela/Thomas, don't promise it.

## Todos
- Report links: a player taps the winner in their view copy, gets a tiny link for the group chat; the organizer opens it and accepts it into the master copy (two matching reports = agreed).
- Placeholder names (Player 1..N) that players claim through the same report links (Tatum).
- Organizer picks the bracket size ("how deep") with open slots.
- PNG export of the sheet.
