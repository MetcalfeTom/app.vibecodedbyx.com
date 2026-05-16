# windows-2000-bsod · notes

## log
- 2026-05-16: v1 — **faithful Windows 2000 desktop with a personality-quiz wizard that BSODs after three random questions** per stacked chat asks: "create a 2000s windows screen game that ends in a bsod twist after three random questions" + clarification "create a windows-2000-bsod app with a grey desktop, three questions, and a funny twist." Renamed the in-progress `profiler-2003` directory to `windows-2000-bsod` and reskinned from XP-bliss to Win2K-grey per the clarified spec.
  - **Win2K desktop**: dark grey radial-gradient wallpaper with a faint dithered repeating-linear texture (so it doesn't look perfectly flat). 6 desktop icons hand-drawn with emoji glyphs + black-text-shadow labels (Personality Profiler, My Computer, My Documents, Recycle Bin, Network Neighborhood, Internet Explorer). Single-click selects (blue highlight + dotted outline), double-click opens (only Profiler does anything; others pop an authentic-looking "This program cannot respond at this time" Win2K modal).
  - **Win2K taskbar**: classic grey with 2px white top border + inset highlight, Start button with chunky 3D bevel + 4-square coloured Windows flag rendered via CSS grid, task buttons that toggle window minimize, system tray (volume/network/clock).
  - **Start menu**: vertical blue side-strip with rotated "**Windows** 2000" text, item list with emoji glyphs, divider, Shut Down at bottom. Clicking Shut Down does the funny thing: triggers the BSOD path immediately (the only real shutdown this PC knows).
  - **Wizard chrome**: 3D-beveled grey window with the blue→cyan gradient title bar, Marlett-style title-bar buttons (`_`, `▢`, `×`), white wizard-header strip with a blue gradient banner block on the left (matches Win2K setup wizards), grey footer with `< Back`, `Next >` / `Finish`, and `Cancel` buttons. Default button gets the inner outline ring. Buttons have proper 3D bevels that invert on `:active`.
  - **3 random questions** pulled from a 15-question pool (tea, number, animal, sandwich, weekend, colour, holiday, pizza, era, superpower, villain, cereal, conflict, season, instrument). Each has 4 absurd multiple-choice options. Distinct picks per session — replay value because chat sees different combos every reboot.
  - **Loading screen**: between question 3 and the BSOD, the wizard shows an "Analysing your personality..." progress bar with 12 escalating-confusion messages ("Initialising personality matrix..." → "Cross-referencing 7,000,000,000 known profiles..." → "Aligning chakras..." → "Loading inner child..." → "Hmm. That's unusual." → "Wait, that can't be right." → "ERR—"). Bar fills toward 98% then crashes.
  - **BSOD**: pixel-faithful Win2K stop-screen (deep blue `#0826f5`, Lucida Console / Consolas, white "PERSONALITY PROFILER" heading on a light grey strip). Includes the canonical "A problem has been detected and Windows has been shut down to prevent damage to your computer." copy, a STOP code with 4 random hex parameters, fake driver address + datestamp, then the personalised twist: the user's three answers echoed back as `USER_PREF_TEA: STRONG`, etc., followed by one of 8 random punchlines ("These preferences are mutually exclusive."; "Personality dispenser jammed. Please contact your sysadmin to schedule a new self."; "Insufficient vibe coverage detected. The Profiler recommends touching grass."). Error name is generated from the user's last answer (e.g. `OWL_NOT_FOUND`, `STRONG_INSTABILITY_DETECTED`, `PERSONALITY_TUNA_FAULT`). Blinking white block cursor at the bottom. 600 ms input-lock so a stray click can't skip the punchline.
  - **Reboot loop**: BSOD → click/keypress → POST screen (Phoenix BIOS 4.0, CPU = Pentium III 933 MHz, RAM check, fake WD hard drive + Plextor CD-R, "Press <DEL> to enter SETUP") → 2.2 s → Windows 2000 boot splash (centered "Windows **2000** PROFESSIONAL" logo + Knight-Rider sweeping loading bar + "Built on NT Technology" + copyright) → 3.2 s → Win2K startup chime → desktop returns → wizard reopens with a fresh trio of questions. Full loop is ~6 seconds and immediately replayable.
  - **Audio (Web Audio synth)**: button click (square 900 Hz blip), critical-stop ding-dong (descending sine pair E5 → C5 over 0.55 s), POST beep (square 880 Hz 0.32 s), startup chime (3-note triad arpeggio C-E-G). All gated on first user gesture for browser auto-play policy.
  - **Window dragging**: title-bar drag with clamp into viewport so windows can't be lost off-screen.
  - **Accessibility basics**: keyboard nav on icons (`tabindex`), focus outline on buttons, semantic structure, prefers-reduced-motion isn't yet honoured for the boot animations (todo).
  - **OG image**: Pollinations flux seed 2000.

## issues
- Win2K BSOD sound was actually silent on most installs (the "ding" played only if Windows had finished booting); ours plays the descending two-tone for game-feel even though it's slightly anachronistic. Worth it.
- The chat may try to "win" — the only way out of the wizard is to Cancel/X, which returns them to the empty desktop. They can double-click the icon to reopen.
- The taskbar clock uses local time. Fine.
- POST + boot timings are tuned for feel (~5.5 s total reboot). Slower would be more authentic but tested impatient on stream.
- Auto-play audio is suspended until first pointerdown — sometimes the first round's BSOD ding lands silent if the user got there via icon double-click. Subsequent rounds always have sound.

## todos
- Add a fake "Internet Explorer 5.5" window that loads a stuck "Cannot find server" page as a second clickable program.
- Welcome screen could feature the iconic "Click Next to continue" with a friendly clippy-style assistant.
- Honour `prefers-reduced-motion` to skip the boot animations.
- Multiple BSOD variants — IRQL_NOT_LESS_OR_EQUAL, PAGE_FAULT_IN_NONPAGED_AREA, BAD_POOL_HEADER — for re-roll novelty.
- "Safe Mode" boot path: pressing F8 during the boot splash takes you to a deliberately broken Safe Mode desktop where the wizard refuses to open.
- Save the cumulative count of "crashes" to localStorage and surface it on the BSOD ("This computer has crashed 12 times today").
