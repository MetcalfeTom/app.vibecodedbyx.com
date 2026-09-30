# Snap Duel

Two-player Snap on a smoky pub table. Idea by Tatum (sloppy.live chat, 2026-09-30 03:26 UTC: "how about a simple card game like snap? try using the shared database for match-making").

## log
- v1.0 (2026-09-30): first build. 32-card deck (7 to A, 8 ranks, so a match turns up about every 10 flips), 16 each. Cards flip on their own, alternating, each onto its owner's face-up pile; tempo speeds up from 1.15 s to 0.68 s per flip over 2:30. Tops match in rank → first SNAP wins both piles (shuffled under the stack). Wrong snap pays 2 cards to the opponent and locks the button for 0.7 s. Stack empty → turn your pile over. Win: opponent has 0 cards, or most cards at 2:30; level on time = sudden death (next snap decides, 30 s cap then dead heat). Three bots: Doris (600–1200 ms, misses 25%), Reg (350–900 ms, 12%), Vic (270–600 ms, 5%), all with occasional false snaps on "similar" cards (same suit / both court cards). Online via "Find an opponent" (see model). WebAudio sounds (flip, slam, win arpeggio, buzzer, last-5s ticks), shake + SNAP! stamp, reduced-motion respected, aria-live announcements.

- v1.1 (2026-09-30): lobby fix for Tatum's report ("Couldn't reach the online lobby", their browser's lobby GET came back 404). Cause: the live host serves a different /supabase-config.js (no default export, and its database has no snap_duel_lobby; the table exists in the project the MCP tools manage and the on-disk configs name). The app now loads its own copy of the connection file, /snap-duel/supabase-config-fixed.js (wire-desk's copy, which works live, plus a `soloClient()` export). Search tries the shared session (sb-auth-token cookie, keeps the Twitch name) and, if any step fails, once more with a private session (cookie sb-snap-duel). Failure now says which step failed, e.g. "(list PGRST205)", titles the card "Lobby's shut", offers the bot plus Try again; the menu shows "Lobby offline right now" when the peek errors. Same nick in two tabs of one browser: the opponent shows as "<name> II".

## model
- Engine class = the dealer. Runs locally vs a bot, or on the HOST in online games (host is seat 0, joiner seat 1). The joiner is a thin client: it only renders events and sends {t:'snap', seq, react}.
- Every state change bumps `seq`; `mat[seq]` = were the tops a match. A claim for the current seq on a match wins; for an old seq that WAS a match → "too late" (no penalty); for a non-match → foul.
- Online judging: first valid claim opens a 200 ms window, lowest self-reported reaction time wins (so the joiner's network lag doesn't lose every race). The host also adds 180 ms to the flip interval while a match is showing.
- Events carry a snapshot (seq, stack/pile counts, both tops, time left), so the joiner resyncs from any event.
- Matchmaking table `snap_duel_lobby` (id bigserial, room, role 'host'|'join', name, status 'waiting', + user_id/created_at/updated_at). Only rows from the last 40 s count. Flow: search waiting hosts (oldest first) → insert own 'join' row pointing at that room → Realtime channel `snap-duel:room:<room>` → send hello every 0.9 s → host checks the join row exists in the table → 'accept'. No host found → insert own 'host' row and wait (20 s, then offer the bot / keep waiting; host row re-inserted every 30 s). Two hosts waiting at once: the newer one drops its row and joins the older. Rows are deleted as soon as a match is made or search is cancelled; own rows older than 40 s are deleted when a search starts.
- Disconnects: 'bye' on leave/pagehide, pings every 2 s, >9 s silence (or presence leave + 2.5 s silence) = opponent left → you win by forfeit.
- Connection: CFG_URLS = /snap-duel/supabase-config-fixed.js, then ./supabase-config-fixed.js relative to the page. NEVER import /supabase-config.js here (the live host's copy is the wrong one, and it signs in on import). getDb(how): how = 'shared' (supabaseSession(), memoized) or 'solo' (soloClient(), own anonymous session, memoized). Errors carry a step code (module/session/list/realtime/insert/timeout) + the PostgREST code; console.warn logs the full reason.
- Test seam: `window.__SNAP_TEST` = { db(how), peek(solo), transport(room), gameMs } replaces Supabase + Realtime. `window.__snap` exposes V/G/NET/Engine/stamp for probes.

## issues
- Headless `--virtual-time-budget --screenshot` freezes the CSS flip animation at its first frame (cards look like thin backs at the stacks). Real browsers are fine; take screenshots with a live browser + CDP.
- The oversized smoke blobs made `.table` a scroll container that got scrolled (only the SNAP button showed on desktop). Smoke now lives in its own clipped layer and `.table` uses overflow:clip. Keep new decorative layers inside `.fxl`.

- Can't test the live DB path from the sandbox without writing rows (sign-in + lobby insert). Verified instead: the deployed file loads its own config copy and reads the real table (read-only), two frames meet over real Realtime with a fake table, and stubbed failures (stale session, 401 list, 404 table, everything down) fall back or show the fail card. If a viewer still sees the fail card, ask for the code in brackets and the console line starting "[snap-duel] lobby".

## todos
- Chat ideas welcome: jokers / "snap on same colour" house rules, emotes in online games, a weekly fastest-snap board.
- Play the bot while waiting for an opponent, and get pulled in when someone sits down.

## notes
- Scratch harness (session c15135b2 scratchpad snap/): stub.js (fake lobby in localStorage mirroring RLS + BroadcastChannel transport), probe_bot.js (auto-plays a full bot game through the real button), probe_shot.js + live.sh (CDP screenshots), run.sh (virtual-time dump-dom probes), gen.py (rebuilds test_*.html from index.html), test_online.html#s=main|tie|alone|retry|fail (two iframes), test_rt2.html (real Realtime + fake table), shot2.html#s=match|down, snap-duel/probe.html + probe_mod.js (real module load, read-only). stub.js takes #dbfail=insert|list|404|all.
