# icq-classic

## log
- 2026-05-04: shipped — nostalgic ICQ landing page on a Win98 teal desktop. Three stacked windows in classic 3D-bevel chrome (gradient navy→sky title bars, Tahoma 11px, MS-Sans-Serif fallback, beveled buttons that depress on `:active` via dual `inset` box-shadows).
  - **The flower**: hand-built SVG daisy — yellow center with `'Press Start 2P'` "ICQ" text in dark green, 5 green petal ellipses (top + 2 upper-side + 2 mid-side), 1 red petal at the bottom (the iconic touch), green stem with two leaves. Bottom red petal wags 2° on a 6s ease-in-out loop while online (killed by `prefers-reduced-motion`). Tray icon is a smaller variant. "I seek **you**" tagline below in pixel font.
  - **UIN display**: VT323 28px on a black panel with a green CRT phosphor glow + repeating-linear scanline overlay. New random 9-digit UIN seeded on boot; `Add User` button reassigns.
  - **Status menu**: dropdown of all the canonical statuses — Online / Away / N/A / DND / Free for Chat / Invisible / Offline. Each option carries a `data-color` so the pill-dot retints on change. Picking Offline plays the door-close sound; anything else plays the door-open creak.
  - **Contact list**: 3 grouped sections (Online / Away-N-A / Offline) with 8 mock buddies (pinkmoon99, h4xx0r_kid, mom 💐, AIM_DEFECTOR, discoflora, late4school, webringPete, dialup_dad). Each row has a status dot (green online, yellow away, orange n/a, red dnd, gray offline, hollow invisible), name, optional away message tooltip. Click a contact → pops the chat window, plays canned hello lines via `uh-oh!` and triggers tray flash. Offline contacts trigger a `knock-knock` instead. Online count `5/8 online` updates from the data.
  - **Chat window**: separate floating .win, opens with a small scale + opacity transition. Tahoma 12px chat feed with red `who:` prefix for them and blue for you. Send → message-sent whoosh + canned ~800-1900ms reply with `uh-oh!` re-trigger.
  - **Six iconic sounds — all synthesized in Web Audio (no copyrighted samples)**:
    - **uh-oh!** — two-syllable chirp: short sawtooth glide 380→320Hz (the "uh"), 160ms gap, longer 440→480Hz sawtooth + 880→960Hz sine harmonic (the "oh"), each layered with a bandpass-filtered noise puff for breath/voice texture.
    - **Door open** — bandpass-noise sweep 200→1200Hz over 450ms with a low 60→90Hz sine rumble underneath.
    - **Door close** — 90→50Hz sine thud + lowpass-noise body + delayed bandpass tap (the latch click).
    - **Knock-knock** — pair of bandpass thumps 180ms apart, each a 160→90Hz sine + 520Hz Q=5 noise transient.
    - **Auth chime** — C/E/G triangle bell triplet at 100ms intervals, doubled with sine harmonics for warmth.
    - **Send whoosh** — bandpass-noise 600→2800Hz Q=2 ramp + 520→920Hz sine glide.
  - **"Play sign-on sequence" demo button**: stages all six sounds in order so visitors hear the whole emotional arc — door creaks → auth chime → uh-oh → knock → send → close — over ~3.7s.
  - **Sign-On button**: ramps connection seg from "◐ Connecting…" → "● Connected", flashes a green-tinted overlay, plays open + auth on entry, then a delayed `uh-oh!` simulating an inbound message hitting at the moment you log in.
  - **Tray + start bar**: pinned bottom row mimics Win98 taskbar (start button with daisy + Press-Start-2P label, task button for ICQ, system tray with daisy icon + clock). Tray daisy `flash` animation pulses brightness on every inbound message. Click tray to dismiss + play door-open.
  - **Mute toggle** in the sounds panel disables all `tone()`/`noiseBurst()` calls without tearing down the AudioContext.
  - **Aesthetic**: Tahoma + MS Sans Serif + 'Press Start 2P' (logo/start button) + 'VT323' (UIN CRT panel). Teal `#008080` desktop with subtle 1px scanline + radial highlight. Faux desktop icons in upper-left (My Computer / Internet / My Documents / Recycle Bin) for Win98 vibes.
  - **Accessibility**: rem-friendly Tahoma sizing, semantic `<main>`/`<nav>`/`<section>`/`<dialog>` for chat, `aria-pressed`/`aria-hidden` on the chat window, `role="log"` `aria-live="polite"` on the chat feed, contact list rows are tabbable + Enter/Space activated with `role="button"`, status dropdown is a real `<select>`, mute is a real `<input type=checkbox>`, focus-visible dotted outlines on all buttons, `prefers-reduced-motion` kills the petal wag, tray flash, and chat-window transitions, skip link to the main ICQ window.

## issues
- "Uh-oh!" is a pure-synth approximation. The real ICQ sample is a human voice; without a recording we can only suggest the cadence. Could add a TTS variant via `speechSynthesis` for browsers that support `en-US` voices, but voice availability is wildly inconsistent.
- AudioContext only resumes after a user gesture — sign-in's auto-played sounds work because the click already unlocked it. Pre-gesture page loads will play silently if any sound is fired.
- Win98 chrome leans on heavy box-shadow stacks; on very low-DPR phones the bevel hairlines can blur. Acceptable trade for accuracy.

## todos
- Optional speechSynthesis "uh-oh!" voice fallback toggle (with male/female voice selector).
- Drag-to-reposition the chat window (real Win98 windows could be dragged by the title bar).
- More contact actions: right-click menu (View Info / Send URL / Send File / Block).
- ICQ floating message-pop animation when an inbound arrives — jiggle the daisy in the tray harder.
- Persist user-set status to localStorage so it survives reload.
