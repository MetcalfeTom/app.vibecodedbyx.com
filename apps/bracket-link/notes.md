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
- v1.2 personal links (Tatum): the organizer copy holds a key `k` (never in `#view=` links, see pub()); a player link is `#view=...&me=<seat>.<token>`, token = cyrb53(k:id:seat). The player's browser remembers the seat per bracket id (`bracket-link-me`) and strips `&me` from the address. Signed slips record who said what in `S.g[match] = [a, a's pick, b, b's pick, first-slip time]`: both agree -> on the sheet by itself, disagree -> the organizer picks, one slip and 15 quiet minutes -> it counts (sweep(), checked on load and every 30 s). The token is a friendly lock, not crypto.
- v1.3 the organizer sets the quiet time (5 min to 2 h, or never) in Player links, stored as `S.q` (default 15) so players see it in their slip text too (Tatum).
- v1.4 slips are short codes, not links (Tatum: a link back to the organizer felt unsafe): `BL-` + base64url of `[id,'w',m,w,a,b,seat,sig]` or `[id,'n',seat,name,sig]`, ~55 chars. sig = cyrb53(token|this exact slip), so a code posted in the group chat can't be reused for another result (v1.2 sent the raw token: fixed). The organizer pastes into the "got a slip code?" box, or pastes anywhere on the page. Old `#r=` links still open, as unsigned.
- v1.4 fix: `/re/.test(undefined)` tests the word "undefined", so a missing id passed the check and every bracket had id undefined. All string checks go through is(re, v) now.

## Issues
- Tatum wants players to report results themselves and the organizer to settle disputes, ideally with a database. A live shared table is a new online mode: needs Fela/Thomas, don't promise it.

## Todos
- PNG export of the sheet.
- With a database (needs Fela/Thomas): slips go straight to the organizer's copy, the 15-min quiet rule runs on its own.
