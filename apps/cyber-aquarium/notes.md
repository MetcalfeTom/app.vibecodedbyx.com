# cyber-aquarium

## log
- 2026-05-31: initial build. **Neon-lit cyber aquarium** where fish swim through a digital sea trailing streams of binary/hex/glyphs, and clicking any fish explodes it into colorful confetti. Distinct from existing `/neon-aquarium` (Twitch-chat-fed bioluminescent fish with kraken summoning) — this one is purely interactive and focused on the click-to-confetti loop. Single self-contained ~35KB HTML.
  - **5 species** (weight-rolled — packet/router/crawler more common, phantom/phish rarer):
    - `packet` cyan #5effff · small fast · trails binary (`0`, `1`, `01`, `10`, `0x`)
    - `router` magenta #ff5dc4 · medium · trails hex bytes (`A1`, `FF`, `2A`, `9C`...)
    - `crawler` gold #ffd066 · slow · trails URL paths (`/api`, `/v1`, `/?`)
    - `phantom` violet #a26dff · big · trails occult glyphs (`◆`, `☰`, `✦`, `⌬`)
    - `phish` lime #5eff8a · rare large · trails words (`phish`, `bait`, `hook`, `pwn3d`, `r00t`, `404`)
  - **Fish drawing** — oriented along velocity (flipped via `ctx.scale(dir, 1)`), 3-stop horizontal gradient lens body with neon outline, animated triangular tail with `sin(bob*1.4)` flap, top dorsal fin, white sclera + black pupil eye, all with `shadowBlur 12-16` color-matched halo for the neon glow.
  - **Data trails** — each fish emits a glyph behind it every 100-320ms (per-fish randomized): glyph spawned at `fish.x - dir * bodyLen*0.45` with small jitter, fades over 1.6-3s, drawn in fish's color with `shadowBlur 8` glow. Persistent text in the wake stream creates the "data exhaust" effect.
  - **Click-to-explode**: hit-test via oriented bbox check (project click into fish-local space with `dir`). On hit: 20-34 confetti shards in 7-color palette (cyan/magenta/violet/gold/lime/rose/white) with random angle + 140-320 u/s outward velocity + −60 upward kick + 380 u/s² gravity + water-drag damping (`pow(0.92, dt*60)`) + rotation flutter (`scale(cos(rot*1.4)*0.4+0.6, 1)` along x). PLUS 14 white-hot sparks with same gradient + glow. PLUS one expanding shock ring (2px stroke, shadowBlur 14, color-matched). PLUS digital-pop sound: 0.18s bandpass-filtered noise burst (Q=2.1, freq 1800-3000Hz) + 3-note square arpeggio (base 520-700Hz × [1, 1.5, 2] mults with exp pitch decay).
  - **Background fade trick**: instead of full clear each frame, `fillRect(..., 'rgba(2, 3, 15, 0.18)')` over the whole canvas — preserves recent glyph trails as ghosting (low contrast against bg), creating depth and continuous-motion feel.
  - **Atmospherics**: drifting bubbles (drag from bottom, sine-wave wobble, fade as they rise, transparent fill + cyan outline + white highlight dot), simulated caustic light bands using `globalCompositeOperation='lighter'` + 4 moving radial-gradient cyan blobs at top, CRT scanlines via repeating-linear-gradient overlay (1px black bands @ 4px pitch with multiply blend), screen-curvature vignette via radial-gradient.
  - **Spawning**: 60% chance enters from screen edge (left/right) and swims into tank, 40% appears inside. Right-click spawns at click point. Top toolbar: `+ spawn`, `+ school of 8` (60ms staggered), `✕ empty tank`. Keyboard: S/+ spawn, D/K school, C clear, T trails toggle, B bubbles toggle, M mute.
  - **Persistent stats** — `popped count` + `bytes shed` saved to localStorage (`cyber_aq_popped` + `cyber_aq_data`). Bytes = `bodyLen × bodyHi × (1 + rand 0-0.4)` per fish. Header strip shows live fish/popped/data + flavor readout that flashes "!! species_drop" for 1.1s on each pop.
  - **Off-screen handling**: fish wandering off has 18% chance per crossing to despawn, else wraps to opposite side with velocity reversed (keeps tank dynamic without overcrowding).
  - **Aesthetic**: deep cyber-blue/violet void (#02030f base, layered radials cyan + magenta + center gradient), Major Mono Display lowercase title "cyber·aquarium" (cyan with magenta middle-dot + phosphor text-shadow), Cormorant italic tagline "they trail data · they shatter on contact", Share Tech Mono for ALL controls/stats/readouts/labels (period-correct cyberpunk terminal feel). Toolbar buttons transparent-bg with cyan border + glow on hover, active state inverted (cyan bg + dark text).
  - **A11y per directive**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<footer>` + `<button type=button>`), role=application + descriptive aria-label on canvas, role=status + aria-live on stats + sr-only announcer, aria-pressed on every toggle, focus-visible 2px magenta outline, 2.75rem touch targets, prefers-reduced-motion kills CRT scanlines (essential motion stays).
  - **Mobile** @640px: tighter header/footer padding, smaller readout pills, scaled-down buttons.

## issues
- Right-click spawning doesn't work on touch devices (no right-click); they get a school-of-8 button instead
- Heavy popping (50+ confetti at once × multiple fish) on weak GPUs can dip below 60fps — confetti life is capped at 2.2s and pieces despawn aggressively
- The text-trail glyphs are deliberately not full-cleared between frames (background fade trick), so on very still scenes (no motion) the older trails persist longer than expected. Considered acceptable for the "screensaver-data-trail" vibe
- No multi-touch — single pointer at a time

## todos
- "frenzy" mode: 5-second window where every click spawns 3 fish and they auto-pop with confetti chains
- score multiplier for popping rare phish (gold)
- export tank snapshot as PNG (canvas.toBlob)
- food pellets that fish swarm + eat (instead of just popping)
- predator fish (large dark) that hunt the others
- supabase global "fish popped today" counter aggregating all users
