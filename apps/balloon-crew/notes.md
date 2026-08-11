# balloon-crew (Balloon Crew)

## log
- 2026-08-11: v1 per chat ("safe Twitch-chat interactive game, shared on-screen challenge, clear instructions, graceful offline fallback") + immediate refinement ("numeric messages steer position safely, rate limits, offline demo controls"). Single file, Gluten + IBM Plex Mono, sunset-sky palette.
  - **The challenge**: one shared hot-air balloon over scrolling painterly terrain; dodge mountains (low), storm clouds (high), flapping geese (mid, drifting). 3 hearts, crash knockback, distance = crew score, best persisted, auto-relaunch 8s after going down.
  - **Chat control (democracy windows, 4s)**: UP/DOWN/HOLD (+u/d/h/!x/stay aliases) counted once per user per window with live vote bars — OR type a NUMBER 0-100 as a precise altitude vote; the window's MEDIAN number outranks commands entirely ("precision beats shouting"). Decisions ease the balloon toward a target (dashed crew-target line on canvas) rather than impulsing it.
  - **Safety by construction**: read-only anonymous IRC (repo-proven bridge w/ backoff reconnect), strict parse regexes (101+, free text, injection strings → null), usernames textContent-only + 20-char cap, per-user 800ms rate floor, 300-user window cap, 600-entry rate-map recycling, no raw chat ever rendered (only recognized-vote glyphs in the commander ticker).
  - **Graceful offline fallback**: demo crew of 5 bots votes (numbers + commands, gentle survival instincts) whenever unconnected or on connection loss (banner explains each state); keyboard is always a voter — arrows/H + number keys 1-9 = 10-90m; input-field guard.
  - **Instructions**: persistent how-to card covering commands, numbers, median rule, rate limit.
  - Verified: syntax + id cross-check; 15-check rules probe (parser incl. aliases/0/100/101-reject/injection-reject, median math, numbers-outrank-commands, majority, tie→hold, empty→hold, rate limit rejects <800ms repeat, window cap at 300, target set, demo votes flowing offline, banner, instructions text) + 8-check manual-frame physics probe (easing both directions, distance, mountain hurt+knock-up, goose hurt, third-crash game-over, 8s auto-restart). SANDBOX ARTIFACT (known from pixl-pal notes): headless shell fires rAF once — loop verified via exported tick() with synthetic timestamps; real browsers unaffected.

- 2026-08-11 (same session): **📟 ASCII terminal mode + debug console** (chat, two follow-ups). Persisted toggle swaps the painterly canvas for green phosphor on black: scanlines, terminal header (dist/best/♥), multi-line ASCII balloon with LIVE ALTITUDE printed in the envelope, /\-stack mountains, (######) clouds with \/\/ lightning, ~v~/-v- flapping geese, dashed crew-target line, *** BALLOON DOWN *** banner. Debug prints per request: console.debug '[balloon:ascii] frame N · dist · alt → target · obstacles' EVERY ascii frame + console.log '[balloon:steer]' on every numeric vote and every altitude decision (median count included). Probes: mode toggle+persist, pixel-sampled dark/phosphor ratios, painterly round-trip, ≥N frame prints captured via console hook, vote + decision prints exact. FALSE-ALARM AUTOPSY: a 'steering broken' probe result was actually a demo-bot's numeric vote sharing the window — median({44,90})=67, exactly as designed; clean-window rerun → 90. Screenshot reviewed (found dt could run NEGATIVE under non-monotonic manual timestamps — floored at 0). Headless single-rAF artifact handled via exported tick().

- 2026-08-11 (focused test round, per chat): **numeric-steering → console-frame integration verified 8/8 on the deployed file**: steer decision line logged, 150 ASCII frame lines appended AFTER it, every frame prints the voted target (85), altitude parses monotonically convergent 40→≥80, dist stays non-negative (dt-floor regression), full-canvas phosphor sample green. NO rendering issue found — the round's two initial reds were probe-side (expected convergence in 0.5s when the easing deliberately takes ~2.5s; pixel sample window missed all sprites). Easing pace documented as intentional.

## issues
- Median steering means a coordinated chat can fly precisely — intended. A troll typing 0 is one vote among many; the median shrugs.

## todos
- Milestone banners (500m: balloon confetti).
- Crew roster panel (who voted this flight).
- Seasonal skies (night flight after 21:00, borrowing Sprout & Snip's clock trick).
