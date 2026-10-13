---
description: The reject bin. Something broke live - revert first, then find out why.
argument-hint: "[app folder name and what is broken]"
---

# The reject bin: when something breaks live

Visitors are looking at a broken app right now, so the first job is to make it work again, not to understand why. Understanding comes after.

## Input

- What is broken, and where: $ARGUMENTS

## Steps

1. **Look first.** Take a screenshot of the live page and read the console errors (`node scripts/shot.mjs` works on the live address too). Write down what you see.
2. **Find the last good version:** `git log --oneline -8 -- apps/<app>/`. Usually it is the commit before the newest one.
3. **Revert the bad commit:** `git revert --no-edit <commit>` and push. This adds a new commit that undoes it; history stays intact.
4. **Check it is live again**, with a screenshot.
5. Tell chat in one line: "Frog Hop broke for a minute, it's back to the last version. Fixing it properly now."
6. Now find out why, in the scratch copy, and run the whole line again: `/plan`, `/build`, `/gate`, `/test`, `/ship`.
7. Write it down under **issues** in the app's notes: what broke, why, and the rule that would have caught it. Add the rule to the top `notes.md` if it applies to every app.

## Guardrails

- Revert before you debug. A quick fix on top of a broken app usually breaks something else.
- Never `git reset --hard` and push, never force-push. A revert is safe; rewriting history is not.
- Never delete an app to "fix" it.
- If two rounds of fixing make it worse, go back further to a version that worked, and plan smaller.

## Done when

- The live app works again, chat knows, and the notes say what happened and what rule came out of it.
