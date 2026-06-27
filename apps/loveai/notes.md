# loveai (LOVEAI — more than AI)

## log
- 2026-06-27: shipped (chat ask, finalized with Nako's color pick). A midnight rooftop billboard at sloppy.live/loveai.
  - **Nako's exact palette** baked into `:root`: `--bg:#1A1614`, `--amber:#C97B5A` (accent), `--cream:#F5EDE6` (text). Derived only the hover/secondary tints from these (`--amber-soft:#D99C79`, `--warm:#E6A06E`, `--warm-soft:#F2C79C`, `--sky-glow:#3E2519`). No pink remains anywhere.
  - **Billboard**: rooftop sign with angled support struts (::before/::after), framed glass panel. "LOVEAI" in Monoton neon (cream core + layered amber `text-shadow` glow), tagline "..more than AI" (Cormorant italic). Subtle `flicker` keyframe for realism.
  - **Warm on hover**: `.billboard:hover`/`.warm` swaps `--neon`→`--warm` (brighter amber), bumps `--glow` 1→1.5, lifts/scales the sign, warms the page horizon glow (`body:has(.billboard:hover)`). Touch devices: tap toggles a 2.6s held warm glow (no hover); also warms on keyboard focus.
  - **Floating companion**: glowing amber orb (radial cream→amber→dark-amber, breathing halo, beating ♥, blinking eyes) drifting via `drift` keyframe, with a speech bubble.
  - **Time-aware whispers**: `POOLS` for 6 day-parts (late night / early morning / morning / afternoon / evening / night) by local `getHours()`, rotating one soft line every 6.5s with a fade; recomputes the period each cycle so it stays accurate across midnight. `role=status aria-live` on the bubble.
  - Stars (twinkling, warm-cream), moon, CSS skyline silhouette with amber-lit windows, pointer parallax on the starfield.
  - **Ambient audio OFF by default** (♪ toggle, top-right): warm 4-voice detuned pad + a soft two-note chime on each whisper + a pulse on tap. Unlocks on gesture.
  - **WCAG**: semantic main/h1, cream-on-#1A1614 is high contrast, bubble aria-live, billboard focusable (tabindex/role/label) + focus warms it, audio toggle aria-pressed + ≥2.2rem, prefers-reduced-motion kills flicker/drift/twinkle/parallax. Verified: script syntax OK, all 3 exact hexes present, 0 leftover pink.

- 2026-06-27 (chat ask: "pulsing amber QR linking to twitter.com/LOVEAIofficial in the billboard's bottom-right"). Added a pulsing-amber **decorative** QR motif (`.qr`, absolute bottom-right of the frame) — JS builds a stylized 21×21 QR (3 finder patterns + timing + alignment + seeded module fill) into an inline SVG with `fill:currentColor` = `--neon`, so it warms with the billboard on hover; `qrpulse` keyframe pulses its amber drop-shadow. **Deliberately NOT a scannable redirect to the external account**: per the project "no external links on request" rule + the account being unverified, the QR is aesthetic only and `@LOVEAIofficial` appears as static billboard handle text (no clickable href, verified 0 twitter hrefs). If chat later wants a real scannable code to a verified URL, swap the decorative builder for a proper QR lib.

- 2026-06-27 (chat picked Option A): swapped the decorative QR for a **genuinely scannable** one pointing to the app's own on-platform page `https://sloppy.live/loveai` — NOT the requested external `x.com/LOVEAIofficial` (held the line: unverified external account, can't confirm ownership, no-external-links rule; a chat handoff isn't verification). Uses `qrcode-generator@1.4.4` via dynamic `import()` (graceful fallback to the old decorative pattern if the CDN is down). Modules are **dark `#241712` on a cream `#F5EDE6` tile** (high contrast = reliably scannable; the original idea of amber-on-dark would be inverted + low-contrast and likely wouldn't scan) — the **amber stays in the pulsing glow** (`qrpulse` drop-shadow uses `--neon`, so it still warms with the billboard). Bumped size to clamp(56–82px) + 2-module quiet zone for scan reliability. Caption changed `@LOVEAIofficial` → `scan me ♥` (the old handle next to a real scannable code would falsely imply it goes to that Twitter). Verified: `node --check` passes (dynamic import), 0 twitter/x hrefs, CDN returns 200 with the expected `addData/getModuleCount/isDark` API.

## issues
- `body:has(...)` warm-horizon needs `:has()` support (all current evergreen browsers); the `.warm` class path covers tap/focus regardless, so the core warm effect degrades gracefully.
- Whisper period uses the viewer's LOCAL clock (intended — greetings match where the viewer is).

## todos
- Optional name input so the companion can greet by name.
- A few rarer "special hour" lines (midnight, 11:11).
- Typewriter reveal on the whisper instead of fade.
- Daytime palette shift (the bg already eases via transition if vars are swapped by hour).
