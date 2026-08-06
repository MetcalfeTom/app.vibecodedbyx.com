# Nostromo OS

## log
- 2026-08-06 v1.0: new app per chat — retrofuturistic Nostromo OS desktop sim (Alien 1979 / MU/TH/UR 6000).
  - **Boot sequence**: typed POST log (Weyland-Yutani header, CPU checks, core-memory counter 0→2048K with rising blips, hypersleep/reactor/nav lines, "PRIORITY ONE DIRECTIVE [HELD]") ending at INTERFACE 2037; click or Space skips; REBOOT button reruns it.
  - **CRT**: scanline overlay + curvature vignette + 6s flicker keyframe (killed by prefers-reduced-motion), green phosphor base with **amber window chrome** per chat ("draggable amber window panels") — terminals stay green, panel borders/titlebars amber like the film's mixed consoles.
  - **Window manager**: makeWindow/focusWin/openWin — draggable via titlebar pointer capture (clamped to viewport), z-order on focus, close buttons. Panels: MOTHER inquiry terminal (typed replies), SHIP STATUS (ASCII hull + animated reactor/O2 traces), CREW MONITOR (Kane blinking ANOMALY; Jones LOCATION UNKNOWN), NAVIGATION (starfield, LV-426 detour, ticking ETA), COMMS (repeating beacon waveform, analysis % creeping to "CONCLUSION: WARNING. LEAVE."), EMERG DESTRUCT panel.
  - **motherReply (pure)**: pattern bank — special order 937 (full CREW EXPENDABLE sequence), crew/cargo/route/signal/ash(denied)/jones/alien(classified), HAL easter egg ("WRONG SHIP."), rotating DOES-NOT-COMPUTE fallbacks.
  - **Destruct sequence (pure state machine)**: armDestruct/destructStatus/abortDestruct — 60s countdown, override only in first 30s (after: "OPTION TO OVERRIDE EXPIRED" + Ripley quote), klaxon (saw + square LFO), T-0 = white flash + full reboot. Abort → MOTHER says "YOU MAY BREATHE NOW."
  - **BLUESCRN.EXE** 💀 icon per site convention (noopener + fallback), styled with amber skull border.
  - Fonts: VT323 + Michroma. Audio: keyclicks/beeps/klaxon, muted until gesture, SND toggle.
  - Tests: nostromo-test.js — 16 checks (MOTHER patterns incl. 937 + fallback rotation, destruct arm/abort/expire/boom with injected clocks, boot integrity, BLUESCRN present) + parse/ids (dynamic panel ids allowlisted).

## issues
- Panel canvases size from clientWidth each tick — if a panel renders 0-wide on some mobile, check the 380px fallback.
- Boot memory-counter line rewrites via regex on the whole boot text — fragile if boot copy changes; keep 'CORE MEMORY' unique.

## todos
- SELF TEST icon that runs a fake diagnostics panel.
- Ash's hidden terminal (password puzzle) — chat will find 937 fast; give them a second layer.
- Persist window positions per session.
