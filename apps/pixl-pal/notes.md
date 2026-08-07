# pixl-pal (Pixl Pal)

## log
- 2026-08-07: **scale fix per coldpresss** ("Pixl's too big and the speech bubble is cut off — scale down ~30%"). Sprite cell formula Wc/26,Hc/24 → Wc/37,Hc/34 (measured ~32% smaller: P 28→19 on desktop). Speech bubble now CLAMPED inside the canvas on both axes (left ≥8, right ≤W−8, top ≥P*3.4) so no viewport can cut it off. Added a __PAL_LAYOUT debug hook (P + bubble bounds) and exposed drawAvatar for deterministic probing — the first phone probe "failure" turned out to be the known headless single-rAF artifact, not a layout bug; with a direct draw call the bubble fits on 1280×800, 360×640, and 320×568. Scratch → atomic deploy.
- 2026-08-07: v1 per chat ("VTuber-style pixel avatar app that reacts to chat messages with different expressions — standalone, same page layout as stream"). Single-file, no deps, all-original character and art.
  - **Layout** mirrors a stream page: big avatar stage left, chat column right (status pill, Twitch channel connect row, scrolling feed, "say something" input). Mobile stacks stage-over-chat; expression test bar hides.
  - **Pixl** (original character): 20×18 string-map pixel sprite (lavender body, cream belly, face plate, teal headset with pads, ahoge, outline) scaled to fit with crisp cells; blinks on a 2–6s timer, idle bob, occasional look-around saccades, blush always.
  - **Ten expressions**, each with distinct eyes + mouth + extras drawn as pixel overlays: happy (^ ^), laugh (wide D + tongue + body shake), hype (gold star eyes + bounce + ✦ burst), love (pixel-heart eyes + floating ♥), surprised (dilated eyes + o mouth), confused (uneven eyes + floating ?), sad (drooped brows + falling tear particles), angry (stepped brows + red vein + shake), sleepy (half-lids + drifting z Z), notice (default glance). Speech bubble per reaction ("LET'S GOOO", "aww…", "??") with 2.4s decay; expressions hold 1.2–4s then relax to idle.
  - **Classifier** (PURE block, 27+9 node checks): ordered regex rules, priority laugh > hype > love > angry > sad > surprised > confused > sleepy > happy > notice; trailing-"?" fallback to confused; null/empty safe; emoji triggers (😂🔥💜😭😮🤔😴); laugh pattern widened to `l(o+l)+` after the probe typed "lolol" and got ignored — now catches lol/lolol/loool/LMAOOO with no false positives on plot/trolol.
  - **Chat sources**: (1) Twitch anonymous IRC (repo-proven bridge: wss irc-ws + justinfan + JOIN, PING/PONG, 3.5s auto-reconnect, channel persisted, prefilled sloppy_ai), (2) local say box, (3) demo chat ON until either of the above — pond-creature cameo messages tagged "demo" every 5–9s so the avatar performs immediately. Feed: hashed username colors, textContent-only rendering, per-line reaction emoji, 80-line cap.
  - **Sound**: tiny per-expression square-wave chirp, OFF until a user gesture creates the AudioContext (connect/say/test buttons) — no toggle needed since it's opt-in by interaction.
  - **A11y**: canvas role=img with live description, feed role=log, labeled inputs, sr-only region announces reactions from manual actions (not chat flood), focus-visible, ≥2.2rem targets.
  - Verified: syntax, id cross-check, 36 classifier checks, real-Chromium probe (chat → sad + tear particles, decay → idle, test button → hype, local say "i love you pixl" → love, demo feed flowing, 0 errors).

## issues
- The laugh/hype word lists are English/twitch-slang centric; extend per chat requests.
- Demo chat stops permanently once you connect or speak — intended, but there's no way to re-enable without refresh.
- Twitch IRC can't be exercised from the sandbox probe; bridge pattern is the one verified end-to-end on 2026-07-18 (root notes).

## todos
- OBS-friendly ?overlay=1 mode: transparent bg, avatar only, auto-connect via ?chan=.
- Combo moods: many laughs in 10s → tears-of-joy super-expression.
- Pixl speaks back via Pollinations text on a cooldown ("pixl thoughts").
- Skins: palette swaps unlocked by messages seen (localStorage counter).
