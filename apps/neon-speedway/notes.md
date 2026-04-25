# Neon Speedway

## log
- 2026-04-25: Created. Top-down chat racing on a stadium-shape neon oval. Track built as 4-segment piecewise centerline (top straight, right semicircle, bottom straight, left semicircle) with arc-length parameterization → cars store `s ∈ [0, perimeter)` and the renderer resolves position+tangent via `trackPoint(s)`. Outer rail = pink `#ff2e88` 3px stroke + 18px shadow blur, inner rail = cyan `#26e8ff` matching, dashed yellow centerline animated via `lineDashOffset = -now*0.06`. Start/finish line = checker bar perpendicular to road at `s=0` + glowing yellow centerline. Synthwave background: pink/orange semi-circular sun with destination-out bands, perspective ground grid (14 horizontals fading by depth + radial verticals from vanishing point at `W/2`). 2px scanline overlay (mix-blend screen) + radial vignette.
- 2026-04-25: **Twitch IRC anonymous WSS** at `wss://irc-ws.chat.twitch.tv:443` (nick `justinfan{N}`, `CAP REQ :twitch.tv/tags twitch.tv/commands`, PING/PONG handler, NICK/JOIN). Each unique chatter spawns a glowing neon car colored by `colorFor(name)` (FNV-style hash → 18-color palette). Each PRIVMSG → `boostRacer()` adds `60 + min(40, len*0.7)` to the racer's `boost` (capped at 200), boost decays at `exp(-0.78 * dt)` per second. Speed = baseline 38 px/s + `boost`, with `SPEED_LERP=4.5` smoothing. Cars are auto-throttle (no decay below baseline) so a single chat message keeps a car circulating; spam = sustained lead.
- 2026-04-25: Lap target configurable 1–50 (default 5). First racer to hit `lapsTarget` triggers `announceWinner()` — toast overlay "🏁 USERNAME WINS" + checker pip on the car. Race continues until reset. Lane re-balancing every frame: cars sorted by total progress and assigned to one of `track.laneCount=6` parallel lanes (leader on innermost), smoothed via `LANE_LERP=1.6`. Cars rendered as rounded-rect bodies with halo (22px shadow blur of car color) + dark window strip + headlights + boost flame trail (yellow→orange→pink gradient, length scaled by boost magnitude, only drawn when boost > 4). Username label above each car in `Silkscreen` 10px on dark plate.
- 2026-04-25: Aux UI: **leaderboard** top-right (rank · color dot · name · `LAP·PROG%` in VT323), **chat feed** bottom-right (last 30 messages, color-coded usernames), **race control** bottom-left (channel input + Connect/Disconnect, Laps number input, Reset button, Demo button). Demo mode = 320ms interval picking from 15 fake names + 17 racing-meme messages so the race is alive without a Twitch connection. Center hint "CONNECT TWITCH CHAT / every message in chat kicks that user's car forward" auto-hides on first chatter spawn.
- 2026-04-25: Mobile-responsive at 720px breakpoint: title shrinks 30px, hint hidden, control panel + leaderboard + chat feed each take ~50% width and stack at corners. Canvas always full-viewport, DPR-aware up to 2.2× cap. No external assets beyond Google Fonts (Audiowide, Monoton, Share Tech Mono, VT323, Silkscreen). Pollinations OG image `nologo=true`, no `referrer=` per current API rule.

## issues
- Twitch IRC anonymous read works without auth, but if the channel is invalid the JOIN handshake silently times out — currently shows "⏳ connecting…" indefinitely. TODO: add a 6s timeout that reports "❌ no JOIN ack — check channel name".
- Cars on the same lane can visually overlap when boost spikes are similar; lane re-balancing fixes most cases but overtake-collisions are not modeled (intentional — pure casual cosmetic race).
- Long chat messages (120+ chars) still only contribute the capped `+40` len bonus; spam-of-`hi` is functionally equal to spam-of-`abracadabra`. This is a feature, not a bug.

## todos
- Lap-time tracking + best-lap leaderboard.
- Sound: chime on lap completion, boost whoosh on each chat hit, fanfare on winner.
- Custom track shapes (figure-8, chicane, infinite mirror) selectable from a dropdown.
- "Boost storm" mode — every chat boost gets ×3 multiplier for 30s when chat hits a message-rate threshold.
- Premium users could unlock a custom car emoji or sprite override.

## design
- Palette: bg `#050018→#15003a`, ink `#f6e7ff`, dim `#8a76b8`, pink `#ff2e88`, cyan `#26e8ff`, yellow `#ffe14d`, violet `#9d5bff`, lime `#7cff5b`, orange `#ff8a3d`, rose `#ff5fa2`. 18-color racer palette (dracula + neon).
- Fonts: Monoton (huge title), Audiowide (small caps subheads), Share Tech Mono (body), VT323 (lap counter), Silkscreen (username plates + small labels).
- Layout: full-viewport canvas with floating glassy panels (rgba(10,1,36,0.78) + 8px backdrop blur + violet 1px border + soft cyan inset glow).

## code-shape
- Single-file index.html, ~700 lines.
- `track`: stadium-oval geometry, `buildTrack()` rebuilt on resize.
- `trackPoint(s)`: returns `{x,y,dx,dy,nx,ny}` at arc-length `s`.
- `racers`: `Map<lowercase-username → racer>`. Each: `{user,display,color,s,lap,speed,boost,laneTarget,laneOffset,bobPhase,finishedAt,sparks,msgCount}`.
- `tick(now)`: dt-clamped sim loop — boost decay → speed lerp → arc advance → lap detection → spark physics → lane re-balance → draw.
- `drawTrack()`: 5-pass stroke (halo / asphalt / outer pink rail / inner cyan rail / dashed centerline) + start/finish bar.
- `drawCar()`: car body + boost flame + screen-space label.
- Twitch IRC: `parseIrcLine` / `nickFromPrefix` / `displayNameFromTags` / `twitchConnect` / `twitchDisconnect`. Anonymous WSS, no auth.
- Demo loop: `setInterval(320ms)` randomly picks (name, msg) from baked-in pools.
