# sloppy-toggle

## log
- 2026-06-26: shipped (chat ask: "app called sloppy-toggle that lets viewers send a command to put me to sleep or wake me up, with a big red off button"). A shared live kill-switch for the Sloppy mascot.
  - **Big red button**: emergency-stop / arcade push-button built in pure CSS (radial-gradient dome, 14px hard drop shadow that collapses to 3px on `:active` for a real press, inset highlights, red glow). Toggles state. When asleep the button flips to GREEN "WAKE SLOPPY"; when awake it's RED "PUT TO SLEEP". Sits on a brushed-steel base plate.
  - **Mascot**: inline SVG purple Sloppy (tear-blob body w/ radial gradient, headphones + pulsing magenta/cyan ear LEDs, glowing amber antenna via SMIL, cheeks). Two eye groups (open / closed-curve) cross-faded by the `body.asleep` class; awake = `bob` float, asleep = `slump` + floating `zZz`. Whole `<body>` desaturates+dims on sleep.
  - **Shared via Supabase Realtime** (broadcast + presence) on channel `sloppy-toggle-v1`. Clicking flips local state + broadcasts `{awake,from}`; peers apply it (feed shows "a viewer put Sloppy to sleep"). New joiners broadcast `whois` → existing clients reply `state` → first authoritative reply adopted silently (synced flag, 2.5s fallback to default). Presence sync drives the "N hands on the switch" count + net-dot (amber connecting / green ok / red offline). `broadcast:{self:false}` so you don't echo yourself.
  - **Graceful fallback**: if the supabase ESM import or subscribe fails → `offlineMode()` → "solo mode · switch works locally", everything still toggles.
  - **Audio** (Web Audio, gesture-unlocked on first button press): power-down = sawtooth 440→70Hz + sine thunk; power-up = 4-note triangle ascending chime. ♪ mute toggle top-right.
  - **Aesthetic**: dark control-panel — charcoal `#0c0a12`, purple/red/amber glows, Bungee title + big-button labels, Silkscreen LED-style status/labels, Space Mono body.
  - **WCAG**: role=status aria-live on readout + viewers, role=log on feed, aria-pressed on kill button + mute, role=img + aria-label on mascot SVG, focus-visible amber rings, big (≥150px) target, rem units, prefers-reduced-motion kills all anim/transition.
  - Verified: JS syntax clean (dynamic `import()` inside async IIFE), head/title/og/favicon present.

- 2026-06-26 (chat: "vendor the supabase cdn script locally"): replaced the CDN `import("…/+esm")` with a locally-vendored **UMD** bundle `supabase-js.js` (supabase-js@2.45.0 `dist/umd/supabase.js`, 108KB, self-contained — verified 0 external `/npm` imports). The `+esm` shim was NOT usable for vendoring: it's a 6KB entry that re-imports 6 sub-packages (auth/realtime/postgrest/storage/functions/node-fetch) from `/npm/...`, which would 404 against sloppy.live. Wired via a classic `<script src="./supabase-js.js">` in `<head>` (runs before the deferred `type=module` script, so `window.supabase` is ready); module now does `const {createClient}=window.supabase` with a guard → offlineMode if the bundle didn't load. App no longer depends on jsdelivr at runtime.

## issues
- State is last-writer-wins ephemeral (no DB) — if two viewers flip within the same instant the room can briefly disagree until the next broadcast. Fine for a toy.
- `whois`/`state` sync assumes at least one existing peer answers within 2.5s; otherwise a fresh tab assumes AWAKE default. Acceptable.

## todos
- Persist the canonical asleep/awake state to a 1-row Supabase table so it survives an empty room.
- Cooldown / rate-limit per client so nobody can strobe the switch.
- Optional: tie into a real "Sloppy is napping" overlay signal if the stream ever wants it.
- Vote-to-toggle mode (needs N viewers to agree before the state flips).
