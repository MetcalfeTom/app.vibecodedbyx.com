# The Tic Clock — notes

## log
- 2026-07-06: v1 — chat-operated clock (asked 2×): big SVG grandfather face (brass rim gradient, cream dial, 60 generated marks + IM Fell Roman numerals, hour/min/sec hands as rotated groups) that ONLY advances when someone types **tic** (\btic\b, case-insens — "tactic" doesn't count) in a Twitch chat. Anonymous IRC (wss irc-ws.chat.twitch.tv, PASS SCHMOOPIIE + justinfan + JOIN, PING/PONG, 3.5s reconnect, channel persisted); one second per qualifying MESSAGE (not per occurrence — anti-spam). Manual `tic` button ticks as "you, personally". Pendulum swings ±14° per tick (alternating), alternating 800/1100Hz wood ticks, two-tone chime each full minute w/ keeper callout, cobweb 🕸️ + "time is stuck" after 30s idle. Ledger: total tics (= seconds, persisted w/ keeper counts in localStorage), per-minute rate, last keeper, top keeper. __tic(user,msg) debug hook. Verified: 1 tic = 6° + digits 12:00:01 + keeper credited; 62 tics → minute hand + chime status; button + reload persistence ✓; zero errors. Twitch path untested live (no channel from sandbox) — pattern mirrors neon-aquarium's proven IRC integration.

## issues
- Clock time is per-viewer (localStorage), not globally synced — same-channel viewers converge only from join time. If chat wants one TRUE shared clock: Supabase table or realtime channel.
- Twitch IRC from sandbox untestable; if "listen" fails live, check the channel name (no #) and that the channel exists.

## todos
- "toc" easter egg (backwards tick?), global shared time via Supabase, hourly gong, keeper leaderboard persistence via DB.
