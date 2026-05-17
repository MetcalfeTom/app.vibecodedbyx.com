# pixel-dragon · notes

## log
- 2026-05-17: v1 — **tiny pixel dragon tamagotchi that grows as you type** per chat ask: "build a tiny pixel dragon tamagotchi that grows as we type." Shipped at `/pixel-dragon`. Single-file (~26KB), no backend, localStorage persistence.
  - **5 lifecycle stages**: egg → hatchling → juvenile → adult → ancient, gated by cumulative chars typed (0 / 20 / 100 / 350 / 1000). Each stage transition fires a CSS-spark burst + amber `🐣 it hatched!` / `✨ grew to JUVENILE` toast (`stagepop` keyframe with overshoot bounce) + 4-note major arpeggio chime if sound is on.
  - **Renderer**: 180×135 canvas with `image-rendering: pixelated` so the CSS-upscaled view stays crisp. Drawing is fully procedural via 4 primitive helpers — `fillCircle` / `fillOval` / `pixelLine` / `dot` — composing distinct sprites per stage. No raster assets needed.
  - **Egg**: 14×17 cream oval with brown speckles and progressively-revealed crack lines that scale with `state.fed / 20`. At ~80% progress a tiny eye peeks out of the shell. Subtle ±1px wobble jitter once fed > 12 chars.
  - **Hatchling**: round-head profile with one oversize golden eye + tiny ear-horn nubs + stubby tail. No wings yet. Eye-blink every 7s (shared cycle). Soft mood-aware palette — purple/cyan when joy+hunger are healthy, washed grey when neglected.
  - **Juvenile**: distinct head + body, both eyes, folded wing nubs, curling tail with horn-tipped end, belly scales, two legs, snout. Three back ridges in amber.
  - **Adult**: full body with **flapping wings** (`wingFlap(t) = 0.55 + 0.45·sin(t/280)`), swept-back horns, claw tips on 4 legs, spike-tipped curled tail, faint ember smoke trail from the nostril (`((t/240)|0) % 4` rotates the wisp particles).
  - **Ancient**: massive, 6-horn crown, glowing amber eye with `ember` core, diamond scale pattern, larger wings (×1.35 extension), multi-spike tail, embers orbiting in 6-position elliptical paths (`r = 28 + (i%3)*4`, vertical squash ×0.6). Smoke wisp has 3-particle tail.
  - **Wings** drawn with a barycentric `pointInTri` fill between origin / elbow / tip points, scaled by extent + side flag (so back-wing draws right, front-wing left). Wing finger lines added as 1px shadow strokes.
  - **3 stats** (hunger / joy / magic) with colored progress bars + tabular-num values. Each typed char applies bias: vowels boost hunger (+1.2 each), digits boost magic (+2.2 each), other printable chars boost joy (+0.45 each) on top of a flat +0.32 hunger / +0.18 joy per char baseline. Hunger + joy decay at 2/min and 1.5/min respectively via a 4s setInterval that catches up time skipped while the tab was backgrounded (capped 1hr/tick to avoid huge negative shifts).
  - **Mood palette**: dragon body color recomputed each frame from `(joy + hunger) / 2`. Below 22 the dragon goes desaturated grey-purple with greyed horns and a dim wing. Healthy = vivid `#b886ff` body / `#ffe080` eye / `#ffba4a` horns / `#5e3ea0` wings / `#ff8a3a` ember.
  - **Feed input**: single textarea, counts net new chars per `input` event (so backspaces don't increment, paste of 50 chars adds 50). Soft-clears when textarea > 800 chars to keep DOM lean. Each new char fires a per-stage-pitched square blip (50ms throttle) if sound is on. localStorage `pixel-dragon-v1` snapshot on every mutation: `{fed, name, hunger, joy, magic, bornAt, lastTick, soundOn}`.
  - **4 action chips**: NAME IT (prompt, 18-char cap), PET (click-or-keyboard, +8 joy + 8-spark heart burst centered on canvas + 2-note chime; canvas itself is also clickable for same effect, `cursor: pointer`), SOUND on/off toggle (default OFF — respects autoplay policy + only inits AudioContext on first toggle), NEW EGG (confirm-gated wipe, preserves sound preference).
  - **Aesthetic**: deep `#0a0420` midnight-violet bg with 3 layered radial accent glows (violet top / cyan bottom-right / magenta bottom-left), pure-CSS twinkling-star backdrop (9 radial-gradient pinpricks at fixed positions with 4.6s opacity sine). Silkscreen for stage labels + headers + buttons; VT323 for stats + body; Cormorant Garamond italic for the "feed it with words · watch it grow" tagline. Magenta + cyan duotone title with 3-layer drop shadow + pixel emboss.
  - **Stage-up celebration**: floating Silkscreen toast at 30% viewport with `stagepop` cubic-bezier(.34, 1.40, .50, 1) overshoot keyframe (2.6s total: pop-in scale → settle → hold → fade-up); accompanied by 24-particle radial spark burst (per-particle `--dx/--dy` random angle/distance via CSS vars), 5-color cycle (magenta / amber / cyan / violet / white), 12ms stagger between particles.
  - **Accessibility (WCAG-AA per project convention)**: `100% root font-size + rem` everywhere; semantic `<main>` / `<section>` / `<header>` / `<h1>`; ARIA `role="img" aria-label` on the dragon canvas + `aria-live="polite"` on stage label / grow text / inventory; `role="group" aria-label` on stats; `:focus-visible` 3px amber outline; all interactive elements ≥44px min-height (chips, textarea, name input). `@media (prefers-reduced-motion: reduce)` kills the twinkling-star animation, the spark burst (opacity: 0), all bar/button transitions, and swaps the stage-pop bounce for a flat fade. Tagline italic respects reading order.
  - **OG image**: Pollinations flux seed 42424. NO `referrer` param (per the project note that the image API now rejects it).

## issues
- Stage progression is purely cumulative — there's no concept of regression. A dragon that's been ancient stays ancient even if hunger drops to 0. Considered making the dragon visibly "wilt" stage if heavily neglected for hours, but elected for simpler monotonic growth to keep the toy feel.
- Magic doesn't decay (only the other 2 stats do). Magic acts as a passive XP-style stat that just sits where you've built it up by typing digits. Could later turn it into a spend-able currency for cosmetic accessories.
- The textarea soft-clears at 800 chars (keeps last 160) so super-long pastes don't bloat the DOM, but the fed counter still increments correctly. A few users typing very long passages might briefly see content scroll back unexpectedly.
- Sprites are procedurally drawn, not hand-pixeled — they have a consistent geometric feel but lack the bespoke charm of true hand-pixeled art. Trade-off for keeping the file under 30KB and making all 5 stages cohesive.
- No save-export — your dragon is browser-localStorage only. Clear cookies = lost dragon.
- Eye-blink uses a global `(t/1000)|0 % 7` cycle, so all dragons across all visits blink in lockstep (mostly invisible since you only see one dragon, but conceptually impure).

## todos
- Cosmetic accessories (hats, scarves, horn covers) spent for magic stat.
- A "fire breath" button at ancient stage that briefly burns the input text.
- Multiple eggs (collect a clutch).
- Save-to-image: download a PNG snapshot of your fully grown dragon.
- Twitch chat → fed source (every chat message feeds your dragon too).
- Achievements: "first hatch", "1000 chars", "named", "fed at 3am" etc.
- Touch-screen typing improvements (currently mobile keyboards work but the input could be friendlier).
- A "rest" mode where you can hover-pet without typing.
- Color variant per dragon name hash (different chromas based on FNV-1a of name).
- Sound pack: alternate creature voice (chirps, growls) instead of pure synth blips.
