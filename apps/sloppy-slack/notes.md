# sloppy-slack (Sloppy Slack)

## log
- 2026-08-07: **v2 REDESIGN** (three stacked chat asks: dark theme + collapsible sidebar for channels AND DMs + threaded conversations + high-contrast message stream). Same tables, no schema changes — threads and DMs ride namespaced channel keys.
  - **Darker theme + contrast pass**: base deepened to near-black (#070c0a), panels #0e1a14/#0a1410; message stream runs BRIGHT (#f6f1e2 at weight 400, names at 800, timestamps lifted to #9db5a2, dim tone raised) for the high-contrast follow-up.
  - **Collapsible sidebar**: ☰ in the main header — desktop toggles a true collapse (grid drops the column, state persisted in localStorage), mobile keeps the drawer. Sidebar now has two sections: PONDS and **DIRECT RIPPLES**.
  - **DMs**: click any creature in FLOATING NOW → a DM opens on channel key `dm:<uidA>:<uidB>` (sorted). Presence payload now carries uid. DM list discovered on boot via `like('dm:%<myuid>%')`, partner names cached in localStorage and refreshed from incoming messages, unread badges per DM, header reads "@ Creature · a direct ripple · not actually private (it's a pond)" — honest, since RLS is read-all by design.
  - **Threads**: hover any channel message → 🧵 reply. Replies live on channel `t:<channel>:<msgKey>` where msgKey = created_at+'_'+user_id (sanitized; messages table has no PK column, so this composite is the stable identity). Channel load does ONE extra like-query (`t:<chan>:%`, 300 rows) → threadIndex with counts; parents render "🧵 N replies" chips; the right-hand thread pane (3-column grid on desktop, overlay ≤900px, fullscreen mobile) shows parent + replies + its own composer. Realtime inserts route three ways: thread channels update chips/open pane, dm channels update DM list/unreads, plain channels as before. Threads disabled inside DMs (kept linear in the deep).
  - **Verified**: syntax + id cross-check + a fresh 6/6 backend e2e for the NEW paths: two anon creatures, parent message, thread reply 201, the app's exact thread like-query finds it, DM insert 201, DM discovery like-query finds the whisper. Scratch → atomic deploy.
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
