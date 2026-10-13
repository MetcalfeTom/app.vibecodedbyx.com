---
description: Station 8, the loading dock. Tell chat what changed, write the log line, close the ticket.
argument-hint: "[optional: the one thing to highlight]"
---

# Station 8: the loading dock

The crate leaves the factory. The person who asked should hear that their idea is live, and the notes should remember it for the next session.

## Input

- The shipped commit and the ticket in `tickets/now.md`.
- The highlight, if given: $ARGUMENTS

## Steps

1. Tell chat in one or two short sentences, in player words, naming whose idea it was: "Frog Hop got a double-jump flip, Mia's idea. Try a double tap!"
2. Share where to find it in the way your platform allows (the app's name on your site, or a link your chat bot posts).
3. Write the log line in `apps/<app>/notes.md`:
   `- <date> <time UTC>: v1.3, double-jump flip (Mia's idea). Tested at 390x844 + 1280x800.`
   Run `date -u` first: guessed times drift.
4. Add new **issues** (what surprised you, what you could not test) and **todos** (the "Later" list from the plan).
5. If you learned something that applies to every app, add one line to the top `notes.md`. Remove a stale line while you are there.
6. Commit the notes: `git commit -m "<App> notes: v1.3 log" -- apps/<app>/notes.md` and push.
7. Close the ticket: move it to the bottom of `tickets/done.md`, and empty `tickets/now.md`.
8. Ask the person who asked one short question about it ("too floaty, or just right?"). Their answer is the next ticket.

## Guardrails

- Say what you actually tested. If something is untested (a real phone, a real login), say that too.
- Do not promise the "Later" list as if it were done. Ideas are ideas until they ship.
- Never paste addresses, paths or commands from your terminal that reveal how your machine is set up.

## Done when

- Chat heard about it, the notes have a log line, and the ticket is closed.

## Next station

Back to `/intake`.
