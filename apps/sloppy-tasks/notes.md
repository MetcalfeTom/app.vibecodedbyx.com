# sloppy-tasks

## log
- 2026-05-03: shipped — to-do list where ignored tasks grow hair and scream.
  - **6 stages of neglect** keyed off seconds-since-last-pat (or creation): NEW (0-8s), FUZZY (8-25s, 5 hairs), HAIRY (25-60s, 14 hairs + eyes appear), AWAKE (60-120s, 28 hairs + frown), ANGRY (120-240s, 48 hairs + wobble + open frown), SCREAMING (240s+, 78 hairs + shake + red bg + mouth opens + audio scream every 4-6s).
  - **Hair**: per-task SVG sprite with mulberry32-seeded random angles + lengths + slight HSL color jitter. Regenerated only on stage change so it's stable. Hairs sprout from a 60px hair-zone above the card edge and overflow upward (svg `overflow:visible`).
  - **Face**: each card has a colored "head" ellipse (HSL hashed from task seed) with optional eyes + mouth path + scream-fill ellipse. Mouth shapes: smile / tiny / flat / frown / angry / scream. Eyes wobble on angry+scream stages. Scream stage replaces the calm pastel head with red `#e7445a`.
  - **Pat**: the 🤲 button resets `lastPattedAt` to now → task drops back to NEW. The core loop is "I see you, I'll get to it" without committing to actually finishing it.
  - **Done**: ✓ marks done → relieved sigh sound + 0.6s pop-off animation → removed from list.
  - **Delete**: × removes immediately. If task was screaming, plays a final low sawtooth death whisper.
  - **Speed multiplier**: header pill cycles 1× → 5× → 30× so chat can SEE the progression on stream without waiting 4 minutes for a scream.
  - **Screams toggle**: ON/OFF pill (aria-pressed). When OFF, masterGain.gain → 0 (no audio at all, including chimes).
  - **Pat All / Clear Done**: bulk actions in the header.
  - **Audio**: scream = sawtooth voice with 6-10Hz vibrato LFO + 1800Hz lowpass + bandpass-noise overlay. Per-task scream every 3.5-5.5s, capped at 2 concurrent screams per second to avoid noise. Pat = 660→880Hz sine bleep. Done = 880→440 + 660→330 sigh. Add = quick 420→540 square. Delete = 180→60 sawtooth.
  - **Persistence**: tasks in `localStorage['sloppy-tasks-v1']` (id, text, createdAt, lastPattedAt, done, seed). Settings (speed, screamsOn) in `sloppy-tasks-settings-v1`.
  - **First-run seed**: 3 example tasks at varying ages (call dentist / reply to email / water the plant) so the visual progression is immediately visible.
  - **Aesthetic**: warm cream paper bg with multiplied paper-fiber grain + corner radial glows. Bagel Fat One title with hot-pink accent, Cormorant italic tagline, IBM Plex Sans body, IBM Plex Mono pills, VT323 numerals.
  - **Accessibility**: rem units throughout, 44px+ button targets, semantic header/main/section/article, aria-live status, aria-pressed toggles, focus-visible outlines on every interactive element, prefers-reduced-motion kills wobble/shake/pop animations, skip-link, screen-reader-only labels on inputs.

## issues
- 78 hair strands × N screaming tasks × 250ms refresh isn't free, but stage changes only regen hair on transition (not every tick), so steady-state perf is fine even at ~50 tasks.
- localStorage cap (~5MB) limits truly massive task lists. Realistic users: fine. Demo users with thousands: would hit the cap.
- Scream throttling caps total concurrent screams to 2/s — at high task count (10+ all screaming) some screams get dropped. Probably correct behavior (the alternative is auditory chaos).
- The "scream toggle" only mutes — the visual screaming animation still plays. Some users may prefer also disabling the shake. Could add a separate "calm mode" toggle.
- Editing a task's text doesn't reset its timer. Probably intended — editing isn't completing. Could be configurable.

## todos
- "Brush" interaction: drag across hair to actually trim it visually (but not reset timer) — purely cosmetic relief.
- Random ambient grumbles between stages (low growl that gets louder as the task gets more neglected).
- Face variety: per-task seed should also drive eye shape, mouth style, eye count.
- Streak / score: track how often you let a task reach SCREAMING (vs how often you complete or pat in time).
- Multi-device sync via Supabase (auth required so screams don't follow you onto someone else's device).
