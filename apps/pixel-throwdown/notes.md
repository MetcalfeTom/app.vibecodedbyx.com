# Pixel Throwdown — notes

## log
- 2026-09-08 v1.0 — built per chat ("apply immediate throws, cooldown feedback, and pixel badges to the realtime rock-paper-scissors game, then verify the live room flow") — no RPS app existed among 1607 (grape-duel is cards), so this is the fresh build with all four asks in from the start. IMMEDIATE THROWS: your hand renders the instant you press (punch animation), solo bot reveals 420ms later for drama; in live rooms an early opponent throw shows only ❕ (no spoilers) until you commit. COOLDOWN FEEDBACK: 1.4s between rounds — striped bar drains with aria progressbar + countdown label, buttons disabled, throwHand hard-gated (probe-pinned). PIXEL BADGES: six 8×8 bitmask canvases (image-rendering:pixelated) — first win / streak 3-5-10 / comeback (win after 3 straight losses) / mirror match (3 draws) — earn rules pure in the engine, minted with a pop animation, persisted localStorage (streaks session-scoped, earned forever). LIVE ROOMS: supabase Realtime broadcast+presence (`rps:room:CODE`, 4-char no-confusing-letters codes, presence 2/2 → LIVE; stale-round throws ignored; opponent-left surfaces + room stays joinable; leave → solo vs BOT-9000, seeded deterministic). TRANSPORT SEAM: makeTransport swaps to an in-page loopback bus when __RPS_LOOPBACK — the probe drives the ENTIRE room flow (waiting→2/2→hidden early throw→resolve→peer receipt→stale ignore→leave) over the real app logic; the real wire separately verified live from the sandbox (SUBSCRIBED + presence track). ENGINE 19/19 node (9-case resolve matrix, badge boundary cases incl. 2-losses-is-not-a-comeback, codes, bot determinism+variety) + RPSAPP 25/25 at 1200/390/320. Jacquard 12 + Silkscreen, arcade navy.

## issues
- Streaks intentionally reset per session (stats.streak/lossRun zeroed on load); earned badges never reset except via seam resetStats.

## todos
- Best-of-5 match framing + rematch handshake message.
- Sound blips (WebAudio) on throw/win.
