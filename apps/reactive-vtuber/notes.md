# reactive-vtuber (Reactive VTuber)

## log
- 2026-06-28: shipped (chat ask: "simple reactive vtuber prototype — bouncy png avatar with idle sway, mic-driven mouth flap, dropdown to pick local emoji or image"). Lightweight, distinct from the heavier `pngtuber-maker` (which does 4-pose upload/AI-gen + ZIP export). This is a one-screen toy.
  - **Avatar**: DOM-based (no canvas). A `.avatar` container holds an emoji `<div>` OR an uploaded `<img>` (object-URL) + a `.mouth` overlay. Dropdown `<select>` has an emoji `<optgroup>` (14 face emojis) + a "📁 upload image…" option that fires the hidden file input and snaps the select back to the last emoji (`lastSel`). Custom image swaps `faceImg` in, hides the emoji.
  - **Mic VAD**: `getUserMedia({audio})` → `AnalyserNode` (fftSize 1024) → per-frame **RMS** of time-domain data, EMA-smoothed (`level += (r-level)*0.45`). `talking = level > thr()`; threshold from sensitivity slider (`0.006 + sens/100·0.10`). Audio never leaves the browser.
  - **Reactivity (single rAF loop)**: (1) **idle sway** = `sin(t*1.5)*3°` rotate + `sin(t*0.95)*5px` bob (toggle); (2) **talk bounce** = the signature PNGTuber pop — avatar lerps `translateY` to −18px while talking, settles when quiet (toggle); (3) **mic scale** = `1 + min(0.08, level*0.4)`; (4) **mouth flap** = `.mouth` height `3→35px` + width `24→36px` scaled by `level/MAXRMS` (toggle, MAXRMS=0.22). All three transforms composed into one `avatar.style.transform`. Status dot + meter + "listening/talking" label update live.
  - **Aesthetic**: cozy purple stream-overlay — radial stage card with floor shadow, Fredoka display + Space Mono. Start overlay handles the required mic-permission gesture; mic-error state if blocked.
  - WCAG: role=img+aria-label on emoji avatar, labelled select/slider, role=status aria-live for avatar-load, focus-visible, prefers-reduced-motion kills sway/bounce. ≥2.5rem targets.
  - Verified: JS syntax OK; head/og/favicon present.

## issues
- The mouth overlay is a generic dark ellipse placed at ~24% from the bottom-center of the avatar box — it lines up well on most face emojis but won't match an arbitrary uploaded image's real mouth. That's the prototype limitation; users with their own art can toggle "mouth flap" off and rely on the bounce. A real fix = two-pose swap (closed/open images) like pngtuber-maker.
- Single Start tap needed (browser mic-permission gesture) — unavoidable.
- Threshold needs per-room tuning via the sensitivity slider.

## todos
- Two-image mouth-pose swap (closed/open) for uploaded avatars instead of the overlay.
- Blink (only feasible for image poses, not single emoji).
- Save chosen emoji + settings to localStorage.
- Optional "scream" big-bounce on very loud peaks.
- Background / green-screen color picker for OBS chroma-key.
