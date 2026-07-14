# game-shelf · notes

## log
- 2026-07-14 v1.0: chat asked "list every game app with a short description" — 286 games is unreadable in stream chat, so the list became an app. Catalogue auto-extracted from every app's <title> + meta description (script in this session), keyword-classified into 11 genres, hand-pruned ~90 non-games (toys/tools/viz). Embedded as JSON; client-side search + genre chips (aria-pressed), internal links to /<app>. Bowlby One SC + Atkinson Hyperlegible + Space Mono, CRT-dark lime/pink.

## issues
- Catalogue is a snapshot — new games won't appear until this page is regenerated. Regen: rerun the extraction script from session notes (title+desc → filter → bucket).
- Genre buckets are keyword heuristics; a few games are debatable shelf placements.

## todos
- Regenerate periodically or on request.
- Random-game button ("surprise me").
