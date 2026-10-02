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
- v1.1 report links (`#r=`, ~50 chars): in the share link a player taps a name -> sheet with "X won" and "send my name" -> a link for the organizer. The organizer opens it: the master copy comes from localStorage, an inbox strip offers add / rename / dispute (switch or keep) / out of date / not this device. Bracket size picker (how deep) + "fill empty slots with Player N" for lazy organizers (Tatum). Tabs follow each other through the storage event.

## Issues
- Tatum wants players to report results themselves and the organizer to settle disputes, ideally with a database. A live shared table is a new online mode: needs Fela/Thomas, don't promise it.

## Todos
- Personal links per player (Tatum): the organizer keeps a secret in the master copy, each player's link carries their seat + a token derived from it, so a report says whose link it came from; two players' matching reports = agreed.
- PNG export of the sheet.
