# sloppy-kernel

## log
- 2026-06-23: initial build. **Fake interactive alien kernel dashboard** that blends absurd syscalls with a faux-PowerShell terminal.
  - **Core vitals**: 6 alien-flavored fluctuating bars (telepathy load, antimatter buffer, scream pressure, temporal flux, primordial goo, ambient vibes). Drift every 1.2s; bars turn amber >65% / red >85%.
  - **Syscall console** (clickable buttons + terminal): `scream()` (full-screen AAAA overlay + log flood + a process flips to 'screaming'), `dance()` (body wobble + cycling phosphor colors + boogie ticks), `forget_the_stack()` (wipes the process table + drops antimatter to 2, then slowly "remembers" and respawns), `summon()` (materializes a random absurd entity), `vibe_check()` (reads the vibes bar → verdict), `panic()` (dramatic glitch + fake oops, recovers), `snack()` (boosts vibes/goo), `reboot()` (glitch → clears log → re-boots).
  - **Run Android App** (the forbidden magenta button): staged install log → "kernel said no" → green Android crash overlay with a from-another-dimension fatal error (errno -42 EXENO), screen glitches, a process becomes a zombie, dismiss on tap.
  - **Faux-PowerShell terminal**: prompt reads `PS C:\xenu>`. Accepts BOTH bare syscall names AND Verb-Noun cmdlet aliases — Invoke-Scream, Start-Dance, Clear-Stack, Invoke-Summon, Test-Vibe, Invoke-Panic, Get-Snack, Restart-Kernel, Start-AndroidApp. Plus PowerShell built-ins: Get-Process (formatted Handles/NPM/PID/Name/State table), Get-Help, Clear-Host, Get-Uptime, Get-Vitals, whoami, exit (refuses). Unknown commands get a PowerShell-flavored CommandNotFoundFromAnotherTimeline error. Case-insensitive, strips trailing ().
  - **Process table**: 9 silly alien procs (screamd, wobble_engine, goo.sync, tentacle.fs…) with fluctuating CPU + random states (running/sleeping/zombie/screaming/dreaming), updates every 1.6s.
  - **Live dmesg log**: boot sequence on load + ambient drip every 3.2s, capped 200 lines, color-coded (info/ok/warn/err/alien-magenta), uptime-stamped.
  - **Aesthetic**: CRT phosphor terminal — green/cyan/magenta on near-black, Major Mono Display title, VT323 terminal text, JetBrains Mono UI, scanline overlay, blinking blips.
  - **A11y**: rem-everywhere, role=log aria-live dmesg, role=dialog android overlay, labeled command input, focus-visible cyan outlines, prefers-reduced-motion kills glitch/dance/spin/scream animations.
  - Single self-contained ~30KB HTML, zero deps, no network.

## issues
- Everything is fake — no real system access (by design + per security rules; this is pure theater).
- The scream overlay flashes; gated behind prefers-reduced-motion but still bright. Acceptable for a joke app.

## todos
- Web Audio: actual alien SFX (scream synth, dance beat, panic siren, android error buzzer)
- Tab-completion for cmdlets in the terminal
- A "memory leak" minigame where goo slowly fills until you snack()
- Persist a fake "achievements" log (first scream, survived android, etc.)
