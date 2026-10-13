---
description: Station 7, the commit stamp. Copy the tested files into place, commit only your own files, push, and check it is live.
argument-hint: "[app folder name]"
---

# Station 7: the commit stamp

The tested copy goes live, and git records it as one small step that can be undone with a single command.

## Input

- The scratch copy that passed `/test`.
- The app: $ARGUMENTS (or the app on the ticket).

## Steps

1. Make sure nobody changed the live app while you worked: `git status --short apps/<app>/` must show nothing. If it shows changes, stop and find out whose they are before copying over them.
2. Look at what you are about to ship: `diff -r apps/<app> scratch/<app>`. Every change should be one you planned.
3. Copy into place: `cp -r scratch/<app>/. apps/<app>/`
4. Commit only the files you changed, with a message that says what changed for the player and whose idea it was:

   ```
   git add -- apps/<app>/
   git commit -m "<App> v1.3: the frog jumps twice as high and flips on a double tap (idea by <name>)" -- apps/<app>/
   git push
   ```

5. A new app, or a new title or description? Update the front page right after that commit: `node scripts/index.mjs`, then `git add -- apps/index.html`, `git commit -m "App list: <App>" -- apps/index.html` and `git push`.
6. If the push is refused because the remote moved: `git pull --rebase`, then push again. If the rebase hits a conflict in someone else's files, stop and sort it out by hand.
7. Check that it is live: open the app's address (`curl -s https://<your-host>/<app>/ | grep "<a word from your change>"`) or take one screenshot of the live page.

## Guardrails

- One commit per step. Never bundle two features, or a feature and a cleanup, into one commit.
- Never `git add -A` or `git add .` in a shared repository: other agents' half-done work would ride along.
- Never force-push, never rewrite history that is already pushed.
- Never commit secrets, `.env` files, screenshots or chat logs (your `.gitignore` covers them: keep it that way).
- If the live check fails, do not stack a second change on top: go to `/rescue`.

## Done when

- The commit is pushed, the live page shows the change, and a new app is on the front page.

## Next station

`/tell`
