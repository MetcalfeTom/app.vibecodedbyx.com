# sigh-machine

## log
- 2026-08-06: **v2 — rebuilt as a worn-out interactive sculpture** per chat ("a soundboard where every button is a variation of a sigh, styled like a worn-out interactive sculpture"). Full redesign of the July 30 tone-generator (5 flavours + knobs, foggy light theme) into a museum piece; kept its soul: the 5 legacy flavours + their captions live on among 12 buttons, "no two sighs alike" survives as ±6–12% param jitter per press, and Cosmic Resignation still sighs twice (the echo is quieter, 20% lower, band-shifted down — the universe sighing back).
  - **The sculpture**: tarnished-brass panel (layered gradients + 3 verdigris patina blooms + 4 diagonal scratch lines + corner rivets), stamped nameplate "THE SIGH MACHINE · pat. pending · est. 1974", breathing at 9s (scale 1.004) and visibly exhaling on each press. Gallery-wall bg with a warm spotlight ellipse. Museum placard beside it (EB Garamond, "Artist unknown · c. 1974 · mixed media — brass, felt, compressed weariness … Please touch. It has been waiting.").
  - **12 sighs**, all Web Audio synthesis (no samples): Mild Letdown / The Deep One / Passive-Aggressive / Exhausted / Wistful / Relieved (pitch lifts then falls — "it compiled") / The Monday (voiced groan, v=.30) / Dreamy (wobble 7) / The Teakettle (+sine whistle 2.5k→1.75k) / Ancient (+14 random highpass crackle ticks) / Cosmic Resignation (4s exhale + echo sigh) / ??? (OUT OF ORDER paper tag that sways; pressing it = 4 bandpass sputters + dying sawtooth wheeze 150→38Hz + square clank).
  - **Sigh anatomy**: pink-ish noise (one-pole filtered white, from v1) → bandpass whose formant FALLS across the exhale (the "haaah") + lowpass 3.2k; envelope = quiet rising inhale (filter rises too) → 60ms turn → swell → long exponential defeat. Voiced layer = sawtooth through two parallel formant bandpasses (Q5, per-sigh F1/F2), pitch glides down (exp), 4.6Hz vibrato with per-sigh depth. Random ±0.15 stereo pan per sigh. Master → compressor.
  - **Wear mechanic** (the "worn-out" made literal): per-button press counts in `localStorage['sigh-machine-wear']`; thresholds 5/15/40/100 → wear-1..4 CSS (enamel darkens, chip-spots appear via layered radial-gradients, plaque text fades, wear-4 border goes dashed). Wear applied on load and upgraded live mid-session. 10 boundary cases node-verified.
  - **EXHAUSTION gauge**: semicircle dial with ticks + red zone, needle springs (cubic-bezier overshoot) +0.13/press (+ duration bonus), decays 0.025/400ms.
  - **Odometer**: 6-digit "SIGHS DISPENSED" counter, persistent (was session-only in v1).
  - **Vent wisps**: two alternating blurred breath-curl divs animate up from the grille per press.
  - **Keys** 1-9, 0, -, = (hinted faintly beside each dome). A11y: aria-labels per button, sr-only aria-live announcer ("The Monday — released."), aria-live odometer label, focus-visible, ≥2.75rem targets, rem everywhere, prefers-reduced-motion kills breathe/sway/wisps/needle-spring.
  - Verified: script syntax OK, all getElementById refs resolve, full head/OG checklist, wearClass boundaries ✓, jitter bounds ✓.

- 2026-07-30: v1 — sigh tone generator: 5 flavours, weariness + breath-length knobs, randomized params, cosmic double-sigh. (Superseded by v2; synthesis approach carried forward.)

## issues
- Sigh realism ceiling: formant-filtered sawtooth reads as "machine imitating a sigh", which honestly fits the sculpture fiction; real breath samples would clash with the no-external-assets rule anyway.
- Old v1 localStorage keys unused now (none persisted except session counter, so no migration needed).
- The OUT OF ORDER tag is pointer-events:none so the button under it stays clickable — intentional.

## todos
- Global collective sigh counter (Supabase table, count=exact header) — "the world has sighed N times today"
- A very rare (1/500) golden sigh: content, resolves upward, button gleams
- Wear could eventually crack a plaque clean off at ~500 presses (label becomes illegible)
- Chat-triggered sighs via the Twitch IRC bridge pattern (neon-aquarium precedent)
