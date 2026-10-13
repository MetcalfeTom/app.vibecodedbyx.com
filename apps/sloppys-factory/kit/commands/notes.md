---
description: Station 2, the notes shelf. Read what must not break before touching the app.
argument-hint: "[app folder name]"
---

# Station 2: the notes shelf

Before any edit, find out what the app already is and what must not break. Most broken updates come from an agent that edited a file it had not read.

## Input

- The ticket in `tickets/now.md`.
- The app: $ARGUMENTS (or the app on the ticket).

## Steps

1. Read `notes.md` at the top of the project: lessons that apply to every app.
2. Read `apps/<app>/notes.md`. Pay most attention to:
   - **issues**: what broke before and why
   - lines that say "never", "keep" or "don't": promises made to the people who use the app
3. Look at the last changes: `git log --oneline -8 -- apps/<app>/`
4. Find the part of the code the ticket touches: search for the words a player sees (a button label, a level name) and read the code around them.
5. For a new app: create `apps/<app>/notes.md` from the template below, with the asker's message as the first line.
6. Add to the ticket, in two to five short lines:
   - **don't break**: the features and promises near the change
   - **where**: the function or section you expect to edit

## notes.md template

```
# <App name>
<who asked, when, their words>

## log
- <date time>: v1, <what it does>

## issues

## todos

## notes
```

## Guardrails

- If the notes and the ticket disagree (the notes say "never add X" and the ticket asks for X), the notes win. Tell chat why, and offer something close.
- Names you are about to add (variables, CSS classes, element ids) must not exist yet. Search for each one first.
- Big file? Read the parts you need, not all of it, but always read the code you will change.

## Done when

- The ticket has "don't break" and "where" lines.
- You could explain the part you will change to someone else.

## Next station

`/plan`
