# Header v2 Sandbox — notes

## log
- v1.0 (2026-09-12): Built per chat's pick of "option one" from the sloppy-header v2 proposal round — a REVERSIBLE playground for three Header v2.0 ideas (from sloppy-header/notes.md "Next Development Phase") on a fully synthetic mock bar: ★ pinned apps (max 4, bar chips, persistent), 🔥 visit streaks (synthetic clock with next-day/skip/same-day time travel), ⚡ per-app quick actions (declarative per-kind verb map, switchable synthetic "current app"). Each card carries a local "I'd use this" straw poll (device-only, page says the real vote is the bar's upvote).
- Isolation is the point and is probe-enforced: NO production file loaded (no /sloppy-header/ path, no sloppy-bar reference — split needles), zero network APIs, zero external tags (system fonts, data-URI favicon; only scraper-facing og meta), ALL storage under `headerv2-sandbox-*` keys with a probe sweep asserting zero foreign localStorage keys were written. The mock bar wears a permanent MOCK tag + synthetic identity label. Reversal = delete this folder.
- Engine block (pure, dual-export): togglePin (max, toggle, purity), visit (start/grow/same-day idempotent/gap reset/BACKWARD-time reset — no cheating the flame), actionsFor (copies, safe on unknown kinds).
- Verified: engine 16/16 node; browser 23/23 at 1200/390/320 (honesty banner, isolation needles, key sweep, pin flow incl. 5th-pin refusal + persistence, streak grow/idempotent/reset, per-app verb switching, poll persistence, tray dialogs + aria, no overflow); screenshot with pins + streak + open actions tray.
- Headless-only note: 🔥 renders as tofu in the headless font set but is universal on real devices (kept; ⚡ and ★ render everywhere).

## issues
- The straw poll is deliberately device-local (synthetic-data rule) — if chat wants real tallies, that's a supabase table + a new approval, not a tweak.

## todos
- If chat graduates a feature: pinned apps is the cheapest real implementation (bar already has recent-apps machinery); streaks need a day-key in localStorage only; quick actions need a per-app manifest convention.
