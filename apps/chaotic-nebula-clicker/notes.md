# chaotic-nebula-clicker · notes

## log
- 2026-05-17: v1 — **incremental clicker with exploding stars + upgradeable gravity wells** per chat ask: "create a chaotic-nebula-clicker with exploding stars and upgradeable gravity wells." Single file ~32KB. Full-viewport canvas, localStorage persistence, no backend.
  - **Core loop**: 5 star types drift in from random edges with rate `state.spawnRate` (1.0/s default, upgradeable to 8/s). Click any star within 36px → instant explode for stardust + 8-12 spark burst + floating `+N` text. Stardust spends on 6 upgrades (incl. placing gravity wells that auto-collect stars for you, so the late game becomes idle).
  - **5 star types** with weighted random spawn (totalled = 100):
    - `common` (white, w=60, value 1, 4px) — chaff
    - `blue` (sky-blue, w=22, value 3, 5px) — minor
    - `red` (rose, w=12, value 5, 6px) — supergiant
    - `gold` (amber, w=5, value 25, 7px) — rare with cross-spike rendering + bonus chime
    - `anti` (near-black with magenta halo, w=1, value 100, 3px) — anti-star, tiny + harder to click, glows magenta with pulsing halo + cross-spike
  - **Gravity wells** (the chat's hook): place via the shop's "gravity well" upgrade — turns the next canvas click into a placement. Each well:
    - Renders as a dark event-horizon disc (22px) + rotating cyan/magenta accretion gradient (36px) + 8 rotating tick marks + faint dashed attract-radius ring + central violet pip + outer glow
    - Attracts stars within `state.wellRadius` (220px default, +36 per "Well Pull" upgrade, max 560) via inverse-distance force scaled by star size (`(320 + size*10) / max(40, d)`)
    - Auto-consumes any star within 28px of its center, throttled per-well by `state.wellCrunch` (0.5s default, ×0.8 per "Well Crunch" upgrade, min 0.08s) — every consume awards the star's full value to stardust
    - Stars accelerated through a well's gravity field with light 0.985 damping so they don't slingshot infinitely
    - Persists across reloads (position + level baked in saved state)
  - **6 upgrades** (in shop bar at bottom-centre, with green-glow affordability halo + sleek violet hover, locked items show 🔒):
    1. **click power** (10 base, ×1.6 ramp) — +1 stardust per click
    2. **gravity well** (50 base, ×2.0 ramp) — places a new well (click-to-place mode)
    3. **star spawn** (80 base, ×1.7 ramp) — ×1.40 spawn rate per buy, capped at 8/s
    4. **well pull** (60 base, ×1.5 ramp) — +36px attract radius, max 560px · LOCKED until you have ≥1 well
    5. **well crunch** (80 base, ×1.5 ramp) — ×0.80 consume interval, min 0.08s · LOCKED until you have ≥1 well
    6. **supernova** (500 base, ×1.8 ramp) — instantly detonates every star on screen for 4× value + big particle burst + sub-bass+crash sound
  - **Placement mode**: clicking "gravity well" in shop flips the button to lime "◈ placing…" state, sets canvas cursor to `copy`, draws a dashed-violet preview ring + 18px disc at pointer position. Next canvas click drops the well (with 18-particle violet placement burst) + spends the dust. Clicking the placing button again cancels.
  - **HUD** (top-right, 4 cards): stardust (amber), per-second (lime, estimated from wells), per-click (magenta), wells (violet count). All in Bungee with shadow glow.
  - **Background nebula** (canvas, drawn each frame):
    - 200 parallax twinkling stars (1px dots with `tw` phase that drifts with brightness)
    - 4 gas clouds (large radial-gradient blobs in pink / cyan / violet / lime at 8-10% alpha) that drift in lissajous orbits over thousands of seconds, wrapping around viewport edges
    - 0.32-alpha black overlay each frame for motion trails (subtle, not jelly)
  - **Particles** (drawn additive via `globalCompositeOperation: 'lighter'`): 8-16 per explosion, radial outward velocity 90-310 u/s, decay 1.6/s, ×0.96 damping, shrink + fade.
  - **Floats**: `+N` text in JetBrains Mono 16px bold per-star-glow color with 10px shadowBlur, decay 1.1/s, float up at 80 u/s. SUPERNOVA float shows `SUPERNOVA · +N` in amber for 1.4s.
  - **Pointer**: pointerdown finds the nearest in-range star within 36px tap radius. Miss → tiny 4-particle dim-grey sparkle (so you know something happened). Hit → explode + dust.
  - **Audio**: lazy `ensureAudio()` on first interaction. 5 synth sounds:
    - `sndPop(value)` — triangle, freq 320 + value × 50Hz (so rare = higher pitch). 35ms throttle.
    - `sndChime` — 660/990/1320Hz sine arpeggio for gold + anti-star bonuses
    - `sndBuy` — 440Hz square + 880Hz triangle on upgrade
    - `sndWellPlace` — 120Hz sawtooth + 60Hz sine sub-thud
    - `sndSupernova` — 80Hz sawtooth + 60Hz sine sub + 500ms bandpass-noise crash
  - **Persistence** (`chaotic-nebula-v1` localStorage): dust, clickPower, spawnRate, wellRadius, wellCrunch, wells[] (x/y/level), totals, upgrade counts. Saves on every dust earn (600ms debounce) + on tab close (`beforeunload`).
  - **Spawn cap** at 80 active stars to prevent runaway lag when chat goes wild with high spawn rate + many wells.
  - **Aesthetic**: deep-violet space bg (#050018 → #15003a) with the active canvas overlay. Title in Bungee with pink→amber→cyan 3-stop -webkit-background-clip gradient + 20px text shadow. Cormorant italic tagline + Major Mono Display HUD labels. Glass HUD cards with backdrop-blur. Shop buttons: violet-bordered default, lime-bordered + green-glow when affordable, lime-filled when in "placing" mode.
  - **Mobile**: full-viewport canvas with `touch-action: none`, taps work as clicks, shop wraps to multi-row on narrow viewports with smaller fonts. `overscroll-behavior: none` on body/html so it doesn't pull-to-refresh.
  - **WCAG**: rem units, semantic main/header/h1, `aria-label` on canvas describing the interaction, `aria-live="polite"` on toast + HUD cards (via `role="status"` is implicit), `:focus-visible` 3px amber outline 3px offset, ≥44px tap targets on shop buttons (44px+ min-height), `prefers-reduced-motion` kills all transitions + transform hovers (the game still plays).
  - **OG image**: Pollinations flux seed 72727.

## issues
- Spawn cap of 80 stars: at very high spawn rates + multiple wells, the cap matters — extra spawns are silently dropped. Acceptable for v1 but a "max stars" upgrade could lift the cap.
- The supernova upgrade scales with cost (×1.8) but the payout is always "every star on screen × 4". A high spawn rate makes it very profitable; could re-balance with a cooldown or capped payout.
- Per-second HUD estimate uses average value 2.4 (rough weighted mean of common/blue/red weights) — ignores rare star variance. Conservative.
- Anti-stars at 100 stardust at weight 1/100 means they appear roughly once per 100 stars — feels fair but at high spawn rates you'll see one every ~12 seconds.
- No prestige / reset mechanic. Once you're swimming in dust the game becomes idle background noise. A "reset for permanent +5% click power" prestige system is the obvious v2 ask.
- Wells can't be moved or removed (only placed). Could add a "shift+click well" deletion or move handle.
- Wells overlap freely — placing two on top of each other doubles consumption rate at that location. Not a bug but probably unintended power-spike strategy.
- Spawn cadence stops feeling chaotic above 4/s since the 80-cap kicks in. Could increase cap with player progress.
- Background gas clouds drift slowly (`6-16 u/s`); on very slow devices the canvas-trail effect can look "smudgey". Could lower trail alpha based on FPS.

## todos
- Prestige system: "Collapse the nebula" — reset everything for permanent multiplier
- More star types: pulsar (paying out periodically while alive), wormhole pair (linked, click one consumes both)
- Well levels: per-well upgrades that boost just that well (not global)
- Achievements: "First 1000", "First Million", "10 wells", "Survive 5 supernovae"
- Save export / import (paste base64 save string)
- Twitch chat integration: each chat message clicks a random star (chat plays the clicker for you)
- Auto-clicker upgrade: a virtual cursor that wanders the canvas and clicks stars
- Mute toggle in HUD
- Visual: tidal lensing distortion around wells using offscreen canvas warp
- Sound: ambient nebula drone that pulses with click activity
- Mobile gesture: pinch to zoom + pan the playfield for a bigger canvas
- /chaotic-nebula-clicker/<seed> share-a-save URLs
