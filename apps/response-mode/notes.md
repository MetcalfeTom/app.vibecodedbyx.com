# Response Mode — broadcast trigger board

## log
- 2026-08-19: v1.0 — built per chat (poll: B, "independent response-mode dashboard"). A broadcast-desk status board: two lamp-buttons (MENTION-ONLY amber / COMMAND-ONLY cyan, aria-pressed radio pair), a huge current-trigger label colored by mode, per-mode editable trigger text (32-char cap, empty→default fallback), session flip-log (12-entry cap, colored left borders), localStorage persistence ('response-mode-v1', validated on load). HONESTY BY DESIGN: the subtitle states outright that the board shows the mode YOU set and does not reach into any bot — chat asked for "without changing backend behavior" and there is no backend hook to change; this board never pretends otherwise. Aesthetic: navy console + scanlines, Bricolage Grotesque + Azeret Mono, amber/cyan lamps. WCAG basics on first commit (semantic, aria-live modeline, aria-pressed lamps, focus-visible, 2.75rem targets, reduced-motion). Probe 10/10 incl. id cross-check; screenshot reviewed.

## issues
- none yet.

## todos
- if chat ever wants this to REFLECT a real bot state, it needs a real upstream source (e.g. a supabase row the bot writes) — do not fake liveness before that exists.
