# stutter-clock

## log
- 2026-05-10: shipped (chat ask: "check the current date and time, then build a glitchy clock app that visually stutters and resets itself sporadically"). Distinct from existing `glitch-clock` which is a clean neon analog clock that glitches once per minute — this one is a dying-CRT digital clock that's actively unreliable, with constant micro-stutters, garbled hex segments, RGB splits, brief inversions, and full kernel-panic resets back to 00:00:00.
  - **Time mechanics**: Real wall-clock time (`Date.now()`) is the truth, but `state.displayMs` is what's rendered. During a stutter window, the display is FROZEN at the value it had when the stutter began — so the seconds visibly hang for 80–260ms before snapping forward. During garble windows the displayed string has random hex chars (0–F) substituted for digits at 55% probability per char (colons + dots stay legible). On panic, the display HUD-clock "uptime since last reset" counter resets to 0, but the wall-clock time underneath keeps being correct — it's the *delivery* that's broken, not the time itself.
  - **Glitch density** scales with elapsed runtime: `loadFactor = 1.0 → 1.6` over 10 minutes, so the clock degrades the longer you watch.
  - **Per-frame glitch rolls** (scaled by loadFactor × dt × 30): stutter ~4%, garble ~1.2%, RGB split flare ~1.8%, brief inversion ~0.5%, full kernel panic ~0.06% (≈1 every 25–60s natural). Long frames (dtMs > 32) auto-bump dropped-frame counter and fire a stutter on 40% chance to compound the broken feel.
  - **Kernel panic overlay**: full-screen BSOD-style blue (#0011a8) takeover for 1.4–2.5s with random panic frame number, random hex registers, randomised drift percentage, classic "If this is the first time you have seen this error" copy. Title `*** KERNEL PANIC #042 ***` jitters ±2px. Closes with a 3-tone ascending boot beep + 800ms RGB-split "monitor coming back online" effect.
  - **Hand-coded 5×7 pixel font**: 0–9, colon, period, A-F. Each digit is a 5-wide × 7-tall string-array stencil rendered cell-by-cell with `fillRect`. Sub-pixel jitter applied during stutters/garbles for a "buffer corruption" wobble. Phosphor green (#3df09a) primary, with shadow-blur halo for the CRT bloom. RGB split paints the same string 3× with red/cyan/lime offsets via `globalCompositeOperation = 'lighter'`.
  - **Tear bands**: during stutters, 3 random-Y horizontal slices are read via `getImageData` and `putImageData` to a sideways-offset position — giving real CRT signal-tear without faking it with rectangles.
  - **HUD**: top-left build tag "CHRONO::4242 · BUILD 26.05.10-BROKEN", top-right pulsing amber "⚠ PHOSPHOR LEAK · OSC DRIFT 0.42%". Bottom row: CRASHES (red, 3-digit), UPTIME SINCE RESET (HH:MM:SS, resets each panic), DROPPED FRAMES (amber, 4-digit), JITTER (EMA of |dtMs - 16.7|, turns amber >8ms / red >16ms), and a FORCE PANIC button (Space/Enter also works) so curious users can trigger it on demand.
  - **Background scroll**: 17 `kernel.softlock`-style log lines drift upward at 9 px/s, recycling at the bottom with randomised float values for "live debug" feel. Drawn at 0.08–0.18 alpha so the foreground clock dominates.
  - **Status line** under the date toggles between `STATUS :::: NOMINAL` (green-dim), `STATUS :::: STUTTER` / `PARITY ERROR` / `PHASE BLEED` (amber) depending on what's actively glitching.
  - **Audio** (WebAudio synth, gated behind first user interaction): bandpass-noise click on stutter (60ms, freq 2400+random), descending sawtooth + sub thump on panic (440→60Hz, with 120→20Hz sub), 3-tone ascending square boot on recovery. No ambient drone — the visual chaos carries the mood.
  - **Aesthetic**: Pure dying-CRT phosphor. `body::before` repeating-linear scanline overlay at 33% alpha multiply-blended; `body::after` radial vignette + top edge glow; deep void background with green radial accent at 50%/40%. VT323 + Major Mono Display + IBM Plex Mono + Share Tech Mono. Crosshair frame corners (24px ticks at 35% alpha) frame the canvas in surveillance-monitor style.
  - **Accessibility**: `role="application"` + control-summary aria-label on canvas. Hidden `<span aria-live="polite">` updates every 10s with the current time + reset count for screen readers. `role="alert"` + `aria-hidden` toggle on the panic overlay. `prefers-reduced-motion` zeroes the warn-pulse animation. 2.75rem min interactive target on the FORCE PANIC button. Pixel font is rendered crisp not anti-aliased so high-contrast against background.

## issues
- `getImageData`/`putImageData` for tear bands during stutters can briefly hit 60fps performance on low-end mobile. Stutter window only fires the slice 3× per frame so it's bounded, but on a slow GPU the stutter visually compounds with the actual lag — which is arguably on-theme.
- Panic overlay is a single full-viewport div; if the user resizes during a panic it doesn't reflow gracefully (the body text could overflow on very narrow screens). 1400-2500ms is brief enough this rarely shows.
- No way to "fix" the clock — by design. Force panic is the only user input besides observing.
- localStorage is NOT used — every page reload starts at panic count 0. Could persist across reloads but the temporary nature is more on-brand.

## todos
- A "MAINTENANCE MODE" toggle that pauses all glitching for users who want a stable digital clock view.
- Different panic flavors: hardware fault (red BSOD), thermal shutdown (orange), ghost in machine (purple).
- Tachyon clock: backward-running display for ~5s during certain panics.
- "WALL CLOCK" alternate mode where the HH:MM:SS is fine but the milliseconds display is constantly garbled.
- Full-screen request via Fullscreen API for the dying-CRT immersion.
- Sound toggle (currently audio plays after first interaction with no mute).
- 12/24h preference + timezone offset display.
- Theme cycle: phosphor-green / amber / cyan / red.

## design-notes
The trick here was distinguishing this from the existing `glitch-clock`. That one is a clean neon analog clock with a periodic glitch — readable, decorative. This one is the opposite: deliberately *frustrating* to read, with a real chance you can't see the actual time at any given moment. The aesthetic is "your monitor is dying" not "the clock has a fun visual effect."

The full kernel-panic reset is the headline. It's a hard interrupt: the clock face is replaced for 1.5–2.5s with an actual fake BSOD, and when you come back the "uptime since last reset" counter has been zeroed. The wall-clock time underneath is still correct (because it's `Date.now()`), but the persistent display has a discontinuity. So the clock is unreliable in the *meta* sense — the broken hardware loses track of how long it's been running, even if the time it shows is fundamentally correct.

The pixel-font rendering was a deliberate choice over canvas `fillText` — CRT digital clocks have a chunky segmented look and the per-cell `fillRect` lets sub-pixel jitter ride on top for the "the buffer is corrupting" feel during stutters. Drawing each "1" cell with `shadowBlur 18` gives the phosphor bloom essentially for free.

Status line + jitter EMA in the HUD give the player a constant numerical readout of "how broken is this right now" — even when the clock face looks fine, you can see jitter ticking up to 8ms+ and know a stutter is imminent.
