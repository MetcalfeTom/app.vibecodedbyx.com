# windows-error-simulator (Windows Error Simulator)

## log
- 2026-07-02: shipped (chat ask: "Windows Error Simulator game — full-screen fake BSOD with fake update progress bars, fake hotkeys that loop back to errors, and a growing sense of dread"). Distinct from `windows-2000-bsod` (quiz with one BSOD twist) and `windows-11-recall-nightmare` (desktop sim) — this is a pure escalating error-loop horror toy.
  - **Loop state machine**: BSOD → boot → update → (stage 3: 2.3s "Welcome back." desktop tease that cuts off mid-word) / (stage ≥2: Win95 dialog cascade) → BSOD at stage+1. `stage` 0→8 = the dread dial. All timers tracked in one array, cleared on every transition.
  - **Escalation via `pick(arr)` (indexed by stage) on parallel copy pools**: faces `:( → :C → ಠ_ಠ → ☠`, stop codes `CRITICAL_PROCESS_DIED → HOPE_NOT_FOUND → IT_KNOWS_YOU_KEEP_PRESSING_KEYS → ACCEPTANCE_IS_THE_ONLY_UPDATE`, BSOD messages get personal, update texts (`Undoing changes we do not remember making`, `Updates are working on you`), ETAs (`About 4,294,967,295 minutes remaining`, `Remaining: you`).
  - **Progress bars lie by stage**: 0–1 complete honestly; 2–3 stall at 97/30%; 4–5 regress randomly; 6+ jump to −3% / 101% / random teleports. Stages ≥2 never truly finish — a timeout force-advances.
  - **Fake hotkeys**: BSOD footer promises F1/ESC/any-key. Global keydown → every key is a lie (`LIES` map for F1/ESC/Enter/F5/Delete + random pool), toast shows the lie, 13% chance of instant crash-to-next-BSOD. Taps do the same on mobile (buttons excluded).
  - **Dread dressing**: CSS filter classes d3/d5/d7 (saturate/hue-rotate/contrast), scanlines fade in ≥4, screen jitter + rare 70ms mild flash frames (≥4, opacity .10 — kept faint for photosensitivity; fully disabled + jitter killed under prefers-reduced-motion), 2-saw detuned 55Hz drone whose gain tracks dread, sub-bass heartbeat ≥5, boot chime detunes progressively, boots get *shorter* (rushed) each cycle.
  - **Fake QR** on BSOD: 21×21 canvas pseudo-QR; at stage ≥5 the data modules form a skull.
  - **Dialog cascade**: teal Win95 desktop, gray 3D-bevel dialogs spawn every ~0.4–0.9s (cap 8+3·stage ≤24); each OK click spawns two more + toast "Deploying 2 new errors."
  - **Escape arc**: typing `EXIT` works from the start (secret) and is hinted at stage ≥6 via a tappable dashed pill (mobile path). Stage 9 auto-ends ("machine accepted its fate"). Ending = calm green screen + stats (errors survived / keys wasted on lies / time inside / dread stage) + "Boot it again". The corner ✕ **always genuinely exits** (reload) — stated on the start screen; one honest button by design.
  - Start overlay = required gesture (audio + optional fullscreen). Parody disclaimer on start screen.
  - WCAG: role=application with a full explanation aria-label, toast role=status aria-live, focus-visible, honest always-visible exit, reduced-motion strips flash/jitter and slows spinners.
  - Verified: JS syntax OK (vm.Script), head/OG/favicon present.

## issues
- Fullscreen request can be denied (iOS Safari) — sim still works windowed.
- Ctrl+Alt+Del can't be intercepted by browsers (OS-level) — footer only promises generic keys.
- Deliberately mild flashes; if anyone reports discomfort, drop the flash entirely (it's one block in startJitter).

## todos
- Fake "Ctrl+Alt+Del menu" screen where every option is another error.
- Sloppy-branded easter egg stop code if chat says a keyword on stream.
- Konami code = instant stage 8.
- localStorage "best escape time" leaderboard-of-one.
