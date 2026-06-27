# ben-da-baddies (Build Queue)

## log
- 2026-06-27: shipped (chat ask, repeated: "Ben da Baddies — a real Twitch prompt queue with live voting and a build log ... pipe the top-voted idea into my terminal"). Built the REAL, safe parts; **declined the "pipe into Claude's terminal / auto-build" part** — a public-chat-driven app injecting voted content into the agent's CLI is remote prompt/command injection (and not technically possible from a sandboxed static page). Flagged as a likely injection attempt. The honest substitute = a copy-ready **handoff** + human-in-the-loop build log.
  - **Real Twitch ingestion**: anonymous read-only IRC (`wss://irc-ws.chat.twitch.tv:443`, `CAP REQ :twitch.tv/tags` + `PASS SCHMOOPIIE` + `justinfan{rand}` + `JOIN #chan`), PING/PONG keepalive, 4s auto-reconnect. PRIVMSG parser pulls `display-name` + msg `id` (for dedupe). Commands: `!idea|!build|!prompt|!suggest <text>` → adds a prompt; `!vote #N` → upvotes queue position N (one vote per Twitch user via `tw:<lowername>` dedupe).
  - **Voting**: per-card ▲ upvote (one per client via `app:<clientId>`), Twitch `!vote N`, and your own submitted idea auto-gets your vote. Votes stored as a deduped voter-array; count = length. Queue sorts by votes desc, then time. Top item → 🏆 spotlight.
  - **Build log**: operator controls on each card (🔨 building / ✓ shipped / ✕ dismiss) move it out of the queue into the log panel with a timestamp + colored status badge, newest first.
  - **Handoff (the safe "Claude integration")**: spotlight has 📋 Copy build prompt (clipboard, `buildPromptText`), 🔨 Mark building, and ✨ AI refine (Pollinations rewrites the vague idea into a crisp build spec, added back to the queue as `[refined]`). Explicit in-app note: the board surfaces the winner, does NOT auto-run anything; Claude builds it live on stream.
  - **Sync model**: every viewer reads the same Twitch chat → queue/votes converge deterministically (Twitch-origin events are local-only, NOT broadcast, to avoid double-counting). App-origin events (UI add/vote/status) sync via **Supabase Realtime broadcast** (`bdb-room-<chan>`, self:false, auth persistSession:false) with a whois→snapshot late-join merge. All ops idempotent (dedupe by id / voter / latest statusTs). Graceful: if Supabase import/subscribe fails, Twitch + localStorage still work.
  - **Persistence**: per-channel `localStorage['bdb-state-<chan>']` (cap 300), restored on connect; last channel remembered + auto-connects on load.
  - **Aesthetic**: broadcast control-room — near-black, purple/lime accents, Bricolage Grotesque headings + JetBrains Mono body, terminal-style build log. WCAG: labels/sr-only, role=status live regions, focus-visible, ≥2.5rem targets, prefers-reduced-motion, rem units.
  - Verified: module syntax OK; 0 exec/eval/child_process/terminal-execution refs (static page); handoff disclaimer present.

- 2026-06-27 (chat debug ask: "is the JOIN landing or failing silently, and is there a log of server responses?"). Findings: JOIN WAS sent correctly (onopen, after CAP/PASS/NICK), BUT (1) `setNet('live')` fired optimistically on socket-open before any server confirmation, and (2) `handleIrc` discarded every non-PRIVMSG line (`if(!m) return`) — so 001/CAP/JOIN/NOTICE were swallowed and a rejected JOIN was invisible. **Fixes**: added `ircLog()` ring-buffer (120 lines) + `console.debug` + a toggleable on-screen `#ircLog` panel ("🔌 log" button) so server responses are visible on stream. `sendIrc()` logs outbound handshake (PASS masked). `handleIrc` now logs every line, parses PRIVMSG FIRST (so chat text can't false-trigger), then detects `001` welcome / `CAP ACK` / `JOIN` confirmation / `NOTICE` errors. Status only flips to **live on real confirmation** (001 or JOIN), surfaces NOTICE text + toast, and stays "connecting" if the server never confirms — no more silent-success. `joined` flag de-dups the JOIN toast.

## issues
- No durable backend table — state lives in localStorage + ephemeral broadcast. Late joiners get a peer snapshot if someone's connected; if everyone refreshes, only each client's localStorage remains. Acceptable for a stream toy; could add a Supabase table later.
- `!vote N` indexes the CURRENT sorted queue, which reorders as votes change — N can drift between a viewer reading chat and voting. Inherent to numbered voting.
- Operator controls (building/shipped/dismiss) are open to anyone (community board) — no mod gating. Twitch mod-badge gating could be added from the `badges` tag later.
- Requires the target Twitch channel to actually exist/have chat; empty channel = empty queue.

## todos
- Optional Supabase table for durable cross-session queue (insert-only prompts + votes to stay RLS-clean).
- Twitch mod/broadcaster gating for build-log status changes (read `badges`/`mod` tag).
- `!unvote`, vote caps, and a cooldown to resist brigading.
- Auto-archive shipped items after N minutes; "now building" banner.
- NEVER add an auto-execute / terminal pipe — handoff stays manual + supervised.
