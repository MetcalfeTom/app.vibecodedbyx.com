# glitch-tv (GLITCH.TV — Recursive Stream)

## log
- 2026-06-28: shipped (chat ask: "Twitch clone page that embeds the sloppy.live livestream inside itself recursively, with fake chat that parrots real chat with a one-line delay" / "hall of mirrors"). Parody streaming-site UI ("GLITCH.TV · not Twitch", purple #a36bff).
  - **Real stream**: Twitch embed `player.twitch.tv/?channel=sloppy_ai&parent=<hostname>&muted=true` (channel confirmed from sloppy-twitch app). `parent` = `window.location.hostname` so it works on sloppy.live and nested (all ancestors same origin).
  - **Recursion (hall of mirrors)**: a picture-in-picture `.pip` iframe in the video's bottom-right loads `location.pathname + '?d='+(depth+1)`, staggered 700ms so the outer level paints first. **Depth is clamped** (`MAX_DEPTH=2`, read from `?d=`, clamped `0..MAX`) to PREVENT runaway nesting / browser meltdown. At `depth===MAX_DEPTH` the PiP shows a static "🪞∞ it's clones all the way down" mirror-floor tile instead of another iframe. So 3 visible levels (d0,d1,d2).
  - **Player budget**: real Twitch player only at `depth<=REAL_PLAYER_MAX(1)` → max 2 live muted players; deeper levels show an animated CSS "fakevid" equalizer placeholder ("sloppy_ai · recursive feed · depth N"). Keeps it light.
  - **Echo chat (one line behind)**: anon Twitch IRC (`wss://irc-ws.chat.twitch.tv:443`, `PASS SCHMOOPIIE` + `justinfan<rand>` + `CAP REQ :twitch.tv/tags` + `JOIN #sloppy_ai`, PING/PONG, PRIVMSG regex with optional `@tags` for color). **Delay mechanism**: each new real message flushes the *previously held* message into the visible log and holds the newest — so the panel is always exactly one message behind. A faint `.pending` line shows "⏳ user is about to say…" to visualise the lag. Each nested level runs its own independent IRC + delay, so deeper mirrors lag further → hall-of-mirrors of delay. Username colors from IRC tag `color` or hashed palette. HTML-escaped.
  - **Chrome**: top nav (logo/search/Log In/Sign Up — all cosmetic), left sidebar of fake live channels (caffeine_overflow, 404_streamer, rubber_duck_dev, npm_install_life, infinite_loop) with jittering fake viewer counts, streamer row (Follow/Subscribe), category tags. Local chat input echoes a cosmetic "you" message (NOT sent to real chat — labelled).
  - **Aesthetic**: Twitch-dark but distinctive — Bricolage Grotesque display + JetBrains Mono chat, purple accent, glowing PiP border. Footer discloses it's a parody and chat is one line late on purpose.
  - WCAG: lang, nav/main/aside semantics, role=log aria-live=polite on chat, labelled inputs, focus-visible, prefers-reduced-motion stops the equalizer. ≤980px stacks (sidebar hidden, chat below).
  - Verified: JS syntax OK; embed/IRC/recursion wiring present. (No local HTTP server reachable from sandbox to smoke-test render; served statically by the web tier.)

## issues
- Multiple live Twitch players (2) + 3 anon IRC sockets across nested levels — kept low via depth/player caps, but on weak mobile devices the nested players + canvas can still be a bit heavy. Bump REAL_PLAYER_MAX to 0 if perf complaints (then only the top level loads the real video).
- Twitch may occasionally refuse a 2nd embed or show a "content unavailable" frame if rate-limited; the placeholder path is the fallback look for deeper levels.
- `?d=` is clamped server-agnostically in JS; can't infinitely nest even if a user hand-edits the param.

## todos
- Optional "🔇/🔊" to unmute only the top player.
- Make nested levels feed chat via postMessage from the top socket instead of each opening its own IRC (fewer sockets).
- A "depth" slider so users can crank the mirror count (still capped).
- Fake "raid" / emote-rain easter egg when real chat says a keyword.
