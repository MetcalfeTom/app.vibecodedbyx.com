# Commit Cache

A hidden shelf for data that several apps read: the baked shipping log and the app list. Started 2026-10-15 04:27 UTC
for Hamburglar06: "Start a new project called "Commit Cache", and include an instruction to it's project notes to leave it out".

## + LEAVE IT OUT (read this before touching the folder)
- This folder is NOT an app. Leave it out of every catalogue: the sloppy.live list (/_bar/apps-index.json), the App
  Directory (index.json from build-index.sh), the busy board and change logs, the sitemap, SEO passes and app_stats work.
- Never add an index.html here. A folder without one is what keeps it out: build-index.sh skips it, and the /_bar index
  only lists folders with a page (same as rust-survival-guide and supabase-tests).
- Never announce it, post its link or give it a voting bar, og image or screenshot.
- Data only, no code. Apps don't share code (house rule in /vibespace/CLAUDE.md); a reader copies what it needs.
- The files here are written by a bake, never by hand. Each one carries its own "asof" time so a reader can tell when it's stale.
- The busy board (build-busy.py) already ignores commits that only touch notes (.md). Once data files land here,
  build-busy.py and build-changes.py need commit-cache added to their skip list in the same commit, or the shelf shows up
  on the board as an app.

## log
- 2026-10-15 04:27 folder and these notes, nothing else. No data moved yet; every reader still reads /app-directory/.

## plan (waiting on Hamburglar06, nothing decided)
- What could live here: the shipping log (busy.json, busy-msgs.json, credits.json, diffs/) and the app list (index.json).
- Readers today: app-roulette, sloppy-desktop, sloppy-id, spin-show read /app-directory/index.json; sloppys-factory and
  sloppy-monitor read busy.json, busy-msgs.json, credits.json (Factory also diffs/<slug>.json). Full list in
  apps/app-directory/notes.md, DEPENDENCY PLAN.
- Open questions for Hamburglar06: which data comes first, whether the App Directory keeps a copy at its old address while
  readers move over one at a time, and whether the bake scripts move here or stay with the App Directory (scripts are
  code, so the house rule says they stay with the App Directory and only write here).

## issues
- none yet

## todos
- wait for Hamburglar06's answers before moving any file or rewiring any reader
