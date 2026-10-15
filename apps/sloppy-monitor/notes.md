# Sloppy Monitor

iamflax's idea (2026-10-14 18:43, 2026-10-15 00:43): "a real time overview called sloppy monitor where i can see what you are
working on and whats next inline with filter per user", so viewers don't have to ask in chat for the status of their requests.
Sister tool to Sloppy's Factory (which replays builds); this one is the live queue.

Art direction: an airport departures board. Near-black board, amber split-flap title, Big Shoulders Display for signs,
Martian Mono for rows; amber = on the bench / next, sky blue = questions, green = shipped.

## how it works
- `queue.json` (next to the page) is the board: items `{id, who[], app, what, st: now|next|ask|park|done, t, s, d, h}`.
  Order in the file = order in line. Keep it current with `python3 mq.py ...` (ls, add, now/next/ask/park, up, done <id> <commit>, drop, edit).
  Done items fall off after 3 days. Public-level wording only: what a viewer would hear on stream.
- Just shipped comes from the App Directory's baked `/app-directory/busy.json` + `busy-msgs.json` (commit subjects end in
  "(login)" credits), matched against the picked viewer with a few nicknames (Flax, Pushed, Angie, Marci, Fannar...).
- The viewer list = everyone on the board + everyone credited in `/app-directory/credits.json`.
- Polls queue.json every 20 s and the commit log every 2 min while the tab is visible. Picked viewer lives in `#who=<login>`
  and localStorage.

## log
- v1.0 2026-10-15 00:51: first board: on the bench, up next, questions for you, just shipped (30 days), viewer filter. (iamflax)

## issues
- The board only knows what I put in queue.json: update it with mq.py when work starts, ships or a question goes out.
- Never put helpers/subagents, internal notes or in-progress internals on it: "on the bench" is the public wording.

## todos
- Optional flip-letter clack when a row changes (muted by default).
- "Waiting since" ages on questions could nudge after a few days.
