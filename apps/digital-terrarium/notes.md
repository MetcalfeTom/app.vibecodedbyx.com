# digital-terrarium · notes

## log
- 2026-05-16: v1.0.2 — **second pass on Twitch connection** per chat report: "check why the terrarium isn't showing chat messages, it seems the connection is still failing." Compared line-by-line against neon-aquarium V11 (which is the proven working reference in this repo) and found three concrete issues:
  1. **PRIVMSG regex was too strict** — `^:([^!]+)![^ ]+ PRIVMSG #([^ ]+) :(.*)$` requires the line to start with a colon, but if Twitch ever sends IRCv3 tag prefixes (`@tag=value ...`) it silently drops them. Replaced with the proven `indexOf(' PRIVMSG ')` + manual position-based extraction from neon-aquarium.
  2. **PONG format was wrong** — was sending `PONG ` (with space) + `line.substring(5)` which strips the colon prefix; the proven form is `'PONG' + line.substring(4)` (no space) which preserves the colon. Twitch is permissive here but matching the working pattern eliminates the variable.
  3. **Default channel `sloppyXP` was misleading** — cleared the input default to an empty placeholder. The connection-looks-broken-but-actually-the-channel-is-just-empty failure mode is now visually obvious.
  - **Plus diagnostics added** — `tdbg(...)` namespaced `console.log` calls fire on every connect / open / error / close / send / channel change so you can open DevTools and see exactly what the WebSocket is doing. Live status pill now reads `live · #channel · N msg` and increments as PRIVMSGs arrive, so you can tell at a glance whether the connection is healthy but the channel is just quiet.
  - **Plus disconnect button** — clicking Connect while live now disconnects, instead of immediately reconnecting.
  - **Sanitiser tightened** — channel name now strips to `[a-z0-9_]` only, matching the working aquarium's whitelist.

- 2026-05-16: v1.0.1 — **bugfix: Twitch chat connection appeared to "not work"** per chat report: "the twitch chat connection in the digital-terrarium isn't working, can you check the event listener?" The connection itself was fine — the bug was in `pushChatLine`: the trim-to-MAX_FEED `while` loop scheduled removals via `setTimeout` (for the fade-out animation) but checked `chatFeed.children.length` synchronously, so the loop never saw the count go down and **infinite-looped the moment a 7th message arrived**, freezing the page entirely. Symptom from outside looked like "chat just doesn't work". Replaced with a synchronous `chatFeed.firstChild.remove()` loop and added a `parentNode` guard to the 7s fade so already-removed lines don't double-remove. The previous logic worked fine when manually adding 6 or fewer bugs but exploded on first real chat burst.

- 2026-05-16: v1 — **pixel terrarium with Twitch-chat-named bugs that try to escape** per chat ask: "create a digital terrarium where weird pixel bugs are named after recent chat messages, and they crawl around trying to escape."
  - **The terrarium**: full-viewport canvas with a centered glass tank framed in dark wood, sat on a wood-grained surface with a warm bedside-lamp glow from the top-left. Interior has a layered gradient sky→soil, a 36px chunky pixel soil layer with speckle + moss-line, 3 hand-drawn rocks of varying sizes, 3 leafy plants of varying scales rendered in pure pixels. Glass walls have a subtle green wash + a triangular diagonal sheen highlight + dark inner seams + bright outer seams. Lid is a small wooden plank with breathing holes that lifts off when toggled.
  - **Bugs (procedural)**: each spawned bug derives its DNA from `mulberry32(fnv1a(name + user))` — same message = same bug forever. DNA: hue/sat/light, body width/length, head extra radius, 4/6/6/6/8 legs (insects more common than spiders), leg length, 65% chance of antennae (1-3 px), 18% chance of wings, one of 4 patterns (none/spots/stripes/gradient), 1-2 eyes, head darkness, speed. Rendered once to a 16×16 offscreen `<canvas>`, scaled 2-4× when drawn so they look chunky and pixel-perfect.
  - **AI state machine**: `falling → wander → climb-left/right → push → falling/dig`. Spawn drops them from the top with gravity + tiny bounce on the soil. Wander walks left-right on the soil; hitting a wall has 70% chance to start climbing, 30% to turn around. Climbing pins them to the wall with a 2%-per-tick slip risk that drops them back down. At the top, they enter `push` and head-butt the lid with a `sin(age*12)` bob for 3-6s before giving up and falling. **Dig** occasionally buries them halfway in the soil for 2-5s. Open the lid while a bug is pushing → it `escaping`s upward off-screen with fading alpha.
  - **Twitch chat integration**: anonymous IRC WSS (`wss://irc-ws.chat.twitch.tv:443`, `PASS SCHMOOPIIE` + `justinfan{rand}` + `JOIN #channel`), PRIVMSG parser with PING/PONG keepalive + 3.5s auto-reconnect. Each chat message spawns one bug named after the full message (capped 80 chars), with the user attribution kept for the tooltip. `!`-prefixed messages are skipped (so command-bots don't fill the jar with junk). Connection status pill in the top-left panel: idle/connecting (amber blink)/live (green pulse)/error (red).
  - **Live chat feed**: bottom-left vertical list of the 6 most recent messages, each with the username in gold and a 7s auto-fade. Hidden on mobile to save space.
  - **HUD**: top-left Twitch panel with channel input + Connect; top-right specimen counter ("N bugs in jar · M escaped · K hiding"); bottom-center add-bug input + Lid toggle ("🔒 Lid Closed" / "🔓 Lid Open" with a red tint when open + a small in-canvas "LID OPEN" warning).
  - **Bug name tooltip**: hovering any bug shows their username, the full message they were named after (italic IM Fell English), and their state + leg count + age in seconds.
  - **Manual add**: enter any name in the bottom input and "+ Spawn" to add a bug without a chat connection. Useful for testing and for solo viewers.
  - **Cap**: MAX_BUGS = 80; spawning past the cap culls the oldest bug to keep frames smooth.
  - **Audio (synth)**: short square blip on spawn (frequency varies per bug), sawtooth thunk on lid toggle, two-tone sine sparkle when a bug escapes. Auto-resume after first pointerdown.
  - **Seed**: 8 demo bugs drop in over the first ~2s on load so the jar isn't empty for the title screen — "hello world", "i love this stream", "POG", "wen sloppy 2", "send help i'm stuck in the terrarium", "i am the lid", etc.
  - Pollinations OG flux seed 72472.

## issues
- The bug sprite generation uses a sparse-wing pattern with `Math.random()` rather than the seeded `dna.rng` — so wing pixels won't be deterministic. Cosmetic; bugs still look fine. Future fix: use `dna.rng()` in the wing loop.
- Climbing bugs pin to the wall with discrete x-snap rather than smooth — looks intentional (pixel-perfect aesthetic) but could be lerped if it feels too snappy.
- No save state. Each page reload starts a fresh jar.
- IRC drops happen behind some corporate networks; the 3.5s auto-reconnect handles transient drops but not strict blocks.
- Hovering a fast-moving bug is hard to land — could enlarge the hit box slightly.

## todos
- Sub-bugs that emerge from a parent every ~30s when 2 bugs of similar DNA touch (mating mechanic).
- A "feed" action that drops a pixel pellet which all nearby bugs path-find to.
- Day/night cycle that changes the bedside-lamp glow over a few minutes.
- A second tank ("nursery") for hatchlings that you can swap to.
- Save the most-prolific chatters to a "specimen log" sidebar.
- Click-to-pick-up a bug and gently relocate it.
- A small bug-microscope window that zooms in on a bug and shows its full DNA breakdown.
