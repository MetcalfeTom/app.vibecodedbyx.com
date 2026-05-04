# sloppy-portal

## log
- 2026-05-04: shipped — minimalist multi-thread chat backed by localStorage. Pollinations text API for AI replies (system prompt: lowercase, calm, brief, friend-like). Three localStorage keys: `sloppy-portal-threads-v1` (thread metadata array), `sloppy-portal-msgs-{id}` (per-thread messages), `sloppy-portal-rain-v1` (matrix rain toggle pref). Sidebar lists threads w/ rel-time + delete; head shows live-status pill (ready/thinking/warn). Composer auto-grows up to 14rem, Enter sends / Shift+Enter newline / Ctrl+Cmd+N new thread. Empty state explains the local-only nature. Export thread as `.txt` (head + role-stamped body). Wipe All confirms before clearing every key. 20s fetch timeout w/ AbortController, falls back to a small local quip pool on network failure or auth-banner detection. Aesthetic: warm paper bg w/ angled fiber grain (multiply-blend repeating-linear), Newsreader italic mark, IBM Plex Sans body, IBM Plex Mono micro-text, orange `#e76341` user bubble + cream bot bubble. Mobile @780px collapses sidebar to off-canvas drawer w/ scrim + hamburger.
- 2026-05-04: added matrix rain toggle (chat ask). Fixed-position canvas under the app (z-index 0, mix-blend-mode multiply, opacity 0.78 when on). Katakana + halfwidth + symbol glyph pool, ~16px font, one column per ~16px screen-width. Per-frame light paper-tinted alpha-fill (0.16) leaves a brief afterimage instead of pure black trails — keeps the warm bg readable. Head glyph drawn in sage-green (`rgba(58,111,86,0.85)`, the same accent as the live-pulse dot) with a faint ink-tinted glyph above for a soft falling tail. Speeds 1.4–3.8 px·tick, glyph swap rate 4%/tick. ▒ Rain button in sidebar foot toggles via `aria-pressed`, persists to localStorage. Resize handler re-buffers at devicePixelRatio (capped 2). Skipped the typical pitch-black bg: the brief is **toggle**, not "Matrix takeover" — the warm paper continues to set the mood underneath.

## issues
- Pollinations is the only AI backend — no key/login fallback. If their endpoint changes shape, the local quip pool kicks in but it's only 4 lines.
- Threads + messages live in `localStorage` only. Clearing site data wipes everything; no cloud sync.
- Matrix rain mix-blend-multiply over the warm paper reads more "antique scoreboard" than canonical green-on-black. That was intentional — but a future variant could ship a pure-black bg toggle alongside.
- Long thread titles ellipsize at 48 chars; auto-titled from first message and never re-derived.

## todos
- Streaming response (read SSE chunks from Pollinations into the bubble live).
- Search across thread bodies.
- Per-thread system-prompt override (different "personas").
- Optional Supabase sync for logged-in users (would need an opt-in toggle).
- Right-click thread → rename inline.
