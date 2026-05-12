# void-stats · notes

## log
- 2026-05-12: Shipped v1. Minimalist dashboard for "seconds since the last chat message landed in #sloppy_ai". Connects to Twitch IRC anonymously over wss://irc-ws.chat.twitch.tv:443 with `justinfan{N}` nick, CAP REQ for tags+commands, PASS SCHMOOPIIE for anon (Twitch's reserved fallback password), NICK + JOIN. Listens for `PRIVMSG #channel`, parses out user+text via a single regex, calls onChatMessage which resets lastMessageAt, increments totalMessages, updates longestGap if the just-ended quiet exceeded the previous record. Counter ticks at 100ms (display is whole-second integer); color tiers shift as silence grows: white 0-30s → amber 31-120s → orange 121-300s → red 301+s (red also adds a 0.25s jitter shake animation for that "the void is staring back" feel). 4-cell stat strip at the bottom: total messages received, longest gap (sec), average gap (sec, recomputed per message), uptime (min since boot). Each new message pulses a green radial glow over the counter wrap via a one-shot CSS animation that's removed+re-added on each fire (forces reflow with `void offsetWidth`). Channel configurable via `?channel=other` query param. Connection state surfaced in the topbar with a colored status dot (amber pulsing while connecting, green pulsing while live, red when disconnected). Auto-reconnect on close with 1.5× backoff capped at 15s. Massive counter font: Big Shoulders Display 900 at clamp(8rem, 30vw, 22rem). Last-message preview line under the counter: handle + text (80 char cap) + relative-time stamp that auto-updates each tick. Mobile @600px collapses stats to 2-col grid and tightens topbar typography. Pollinations OG. Fonts: Big Shoulders Display + Space Mono.

## issues
- Twitch chat is the ONLY signal source — if `sloppy_ai` is offline / chat-disabled, the counter just ticks forever in red. That's actually a feature (the void grows) but might confuse first-time visitors.
- No persistence across page reloads — longestGap + totalMessages reset on refresh. Could add localStorage if chat asks for cumulative tracking.
- The Twitch IRC `PASS SCHMOOPIIE` password is the canonical anon-listener password from Twitch's IRC docs. If they change that handshake, the connection will fail silently — the green dot would never turn on.
- The "average gap" stat is computed as (uptime_seconds / total_messages) which slightly over-counts the gap before the first message and shifts down as time passes. Good enough for a dashboard but not a rigorous stat.

## todos
- Add a tiny histogram showing per-minute message rate for the last hour
- Tie color tier to actual stream "silent for too long" alerts (could send a Supabase broadcast at 300s threshold)
- Multi-channel mode — show 2-3 channel columns side by side
- Snapshot mode — pin the longest gap of the session with a button
- Audio "ping" cue when the silence hits a new record
