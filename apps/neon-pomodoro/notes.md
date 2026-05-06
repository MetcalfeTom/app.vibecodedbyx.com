# neon-pomodoro

## log
- 2026-05-06: shipped — sleek pomodoro timer with neon aesthetics + customizable focus intervals.
  - **Glowing SVG ring** (220×220 vbox, 100r) drawn with a stroke-dasharray (628.32 = 2πr) + a JS-driven `stroke-dashoffset` so the fill sweeps clockwise (rotated −90deg so it starts at 12 o'clock). Stroke color is `var(--phase)` driven by a CSS custom prop so the ring re-tints when phase changes. Drop-shadow filter on the SVG produces the neon halo + a softer secondary blur for depth.
  - **3 phases** with their own color theme: **Focus** (red), **Short break** (orange), **Long break** (amber). `body[data-phase]` swaps `--phase` + `--phase-deep` CSS vars so the ring, button, headline shadow, and ready-dot all retint together.
  - **Customizable intervals** in a collapsible settings panel:
    - Focus 5–90 min, Short break 1–20 min, Long break 5–60 min, Sessions per cycle 2–8.
    - 4 quick **presets**: classic 25/5/15, long 50/10/30, short 15/3/10, sprint 45/5/20 — clicking one snaps the sliders + remembers the active preset (gold-bordered).
    - 5 toggles: **auto break** (auto-start break after focus, default ON), **auto focus** (auto-start next focus after break, default OFF), **sound**, **tick** (every-second click), **notify** (browser Notification API on phase end, opt-in via permission prompt).
    - **Alarm preset selector** — see chime list below.
    - **MP3 upload** — see custom alarm section.
  - **Cycle pips** below the ring show progress through the sessions-per-cycle counter; filled pip turns the phase color with a glow.
  - **Counter + persistence**: lifetime total sessions, today's count, and a **streak** counter (consecutive days with at least one focus session). Streak math: yesterday counted → +1, gap > 1 day → reset to 1 on next session. Stored in `localStorage['neon-pomodoro-v1']`.
  - **Page title** updates live to `MM:SS · phase — Neon Pomodoro` so the tab is a usable mini-clock when the timer is in another window.
  - **Keyboard**: Space toggles start/pause, R resets the current phase, N skips to next phase. Ignored when typing in an input.
  - **Aesthetic** (red + orange neon palette per chat ask):
    - Bg: deep crimson-black `#180304` with red + orange + amber radial corner glows.
    - Synthwave horizon grid in red + orange stripes, masked to fade upward.
    - Title: Audiowide cream "neon · pomodoro" with phase-tinted neon shadow + ember `3px 3px 0` drop shadow; "pomodoro" word in orange with red-deep echo.
    - Stats pills (today / all-time / streak) in IBM Plex Mono.
    - Phase label in IBM Plex Mono with a pulsing dot when running, dimmed when paused.
    - Cormorant italic tagline "deep work, neon glow."
    - `:focus-visible` on every interactive control with orange/amber outline (≥3px on primary buttons, 2px on toggles + presets).
  - **Audio (Web Audio synth)**:
    - **5 synth alarm presets** + **2 added by chat ask** = 7 total:
      - **Synth Bell** — original 3-note triangle triad with octave-up overtones (0.6s decay).
      - **Soft Chime** — 4-note major-arp sine cascade, 1.1s decays, gentlest option.
      - **Old Clock** — 6 rapid bandpass-square ticks at 1.2 kHz Q=12 (0.18s spacing) — staccato wind-up.
      - **Buzzer** — 3 sawtooth slides 180→220 Hz (0.32s spacing) — the "your laundry's done" archetype.
      - **Triumph Horn** — I-IV-V-I major-chord progression, sawtooth + triangle harmony through 1.8 kHz lowpass.
      - **Laser Pulse** *(chat ask)* — 3 sci-fi descending zaps (1800→220 Hz sawtooth swept through bandpass 2400→800 Hz Q=6) plus a highpass-noise tail per pulse for that synth-blaster feel.
      - **Gong** *(chat ask)* — short bandpass-noise mallet strike + 5 inharmonic partials at fundamental 88 Hz × [1.0, 2.31, 3.07, 4.21, 5.83] (intentionally non-integer ratios for that bronze-bowl shimmer) with stacked exponential decays up to 3.4s for a long bloom.
    - **Custom MP3 upload** *(chat ask)* — file input accepts `audio/mpeg|mp3|wav|ogg`, capped 12 MB. Saved as a Blob in IndexedDB (`neon-pomodoro` / `alarm` store, key `mp3` + meta `mp3-meta`) so it survives reloads without bloating localStorage. On boot, `loadCustomAlarmFromIDB()` re-creates an object URL + pre-warms an HTMLAudioElement. The "Custom" option in the preset select is disabled until a file is loaded; once loaded, its label shows the filename. Clear button removes the file from IndexedDB and reverts to Synth Bell.
    - **Test button** plays the currently-selected preset (or the custom mp3) so you can audition before committing.
    - Bell falls back to the Synth Bell if the custom mp3 fails to play (autoplay block, decode error).
    - Tick sound (every whole second when ⌗ tick is on) is a 1800 Hz square pop, 40ms decay, very quiet.
  - **Smart timer engine**: rAF-driven for a smooth ring fill; DOM updates throttled to ~10 Hz to keep things efficient. When `remainMs` hits zero the engine renders one final `00:00` frame, schedules `nextPhase()` after a 60ms cushion (so the ring + bell sync feel right), and either auto-starts the next phase or pauses based on the auto-break / auto-focus toggles.
  - **Accessibility**: rem units, semantic `<main>`/`<header>`/`<section>`, role="status" + aria-live="polite" on the timer + phase label so screen readers announce phase changes, ≥2.85rem primary button height, ≥2rem toggle height, focus-visible outlines, prefers-reduced-motion no-ops the dot pulse + ring transitions, skip link to canvas, settings header is a real button (Enter/Space toggles).

## issues
- IndexedDB writes happen async; if a user uploads then immediately closes the tab before the transaction commits, the mp3 won't persist. Realistically this is sub-second.
- HTMLAudio autoplay is allowed only after a user gesture; the first phase-end after a fresh page load can occasionally be silent if the user never clicked Start (i.e., they just tested the alarm via a no-op route). The Synth Bell uses Web Audio which we always `ac().resume()` on first interaction, so the standard flow is fine.
- The "Custom" mp3 plays once per phase end; no looping. If the chosen file is longer than ~3 seconds it'll just keep playing through the next phase if the user is fast. Could add a maxPlayMs cap later.
- Streak math compares `todayKey()` strings; switching time zones mid-day could nudge the boundary by a session.

## todos
- A "long press to full reset" interaction on Reset that wipes cycle progress + today's count.
- Quick-action chips next to the ring: +5m / −5m to nudge the current phase length on the fly.
- Pomodoro **task list** so each focus block is tagged with what you're working on.
- Optional Pollinations integration: at the end of every cycle, pull a one-line "encouragement" from the text endpoint.
- Picture-in-picture / mini-window mode using the Document Picture-in-Picture API.
- Per-preset volume slider (some user-uploaded mp3s clip louder than the synth bell).
