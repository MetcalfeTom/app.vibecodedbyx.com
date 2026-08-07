# sloppy-slack (Sloppy Slack)

## log
- 2026-08-07: v1 per chat ("Slack clone with real-time chat, channel persistence, pond creature theming, existing database"). Single-file, ESM supabase-js 2.45 (jsdelivr, repo pattern). Generic workplace-chat layout with entirely original pond branding — no third-party assets.
  - **Tables** (created via MCP, default RLS: read-all / write-own, auto user_id+timestamps): `sloppyslack_channels` (name, topic, creature; indexed on name) and `sloppyslack_messages` (channel, body, creature, avatar; indexed on channel + created_at).
  - **Persistence**: channels load on boot (deduped by name); an EMPTY table triggers seeding of the four defaults — #the-shallows ("water is warm · no predators before noon"), #bread-ventures ("series A(nas) only"), #molting-support, #deep-end ("ties required — shrimp exempt, ironically"). Anyone can dig a new pond ([a-z0-9-] name ≤24, topic ≤80, dupe-guarded). Messages: last 100 per channel, day dividers, Slack-style grouping (consecutive same-author within 5min renders compact).
  - **Realtime** (one channel `sloppyslack-rt`): postgres_changes INSERT on messages (append if current channel + ripple animation, else unread badge per channel) and on channels (live list growth); broadcast `typing` → "Gerald & Bernard are rippling…" (1.8s send throttle, 3.2s decay); presence tracks {name, avatar} → "FLOATING NOW" avatar row + count. Connection pill: surfacing… / live / lost.
  - **Creature identity**: auto-generated on first visit (name pools like "Waverly of the Shallows", "Bog (Pre-legs)", 12 pond avatars), persisted in localStorage, renameable via dialog (re-tracks presence live).
  - **Send**: Enter (shift+enter = newline), 500-char cap, 1.5s cooldown, optimistic-free (renders via realtime echo of own insert), failure restores draft + flashes the pill. All message text rendered via textContent (no HTML injection).
  - **Aesthetic**: deep-pond greens (#0d1f1a / #122a20), lily accent, cream text, Sora (first use) + IBM Plex Mono, circular 🪷 send button, rippleIn glow on fresh messages. Mobile: sidebar becomes a drawer ≤760px.
  - **A11y**: role=log aria-live on messages, labeled inputs/dialogs, Esc closes overlays, focus-visible, ≥2.75rem targets, reduced-motion kills ripple/drawer transitions.
  - **Verified**: script syntax + $-ref/id cross-check, and a 6/6 END-TO-END BACKEND TEST against the live database (python urllib): anonymous auth grants session → channels seed + persist → message insert 201 → read-back → forged user_id rejected 403 by RLS. The first browser probe partially booted and actually ran the app's own seeding path (channels existed on the second check), then fell to the headless virtual-clock racing real network — a known probe limitation, not an app bug. "first ripple 🪷" left in #the-shallows as the opening message.

## data sources
- sloppyslack_channels, sloppyslack_messages (created for this app)

## issues
- Headless Chromium + --virtual-time-budget can't complete multi-roundtrip auth boots (virtual clock outruns real network) — backend path proven via direct REST instead. For future realtime apps: test the API path directly, don't fight the probe.
- No pagination past 100 messages per channel; add range-based "older ripples" loading if any pond gets deep.
- Channel list dedupes client-side; two simultaneous first-visitors could double-seed defaults (harmless — dedupe hides it, but rows exist).

## todos
- Emoji reactions on messages (new table or jsonb column).
- @creature mentions with highlight + notification dot per channel.
- Twitch-auth display names for logged-in users (auth context from the header).
- /me actions and a /molt command that re-rolls your creature.
