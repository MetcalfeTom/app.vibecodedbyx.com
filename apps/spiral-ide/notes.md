# Spiral IDE

## log
- 2026-08-05 v1.0: new app per chat — "a spiral IDE where code orbits to the center before executing."
  - **Ceremony pipeline**: RUN → `planOrbiters(source)` (pure: non-empty lines → orbiters w/ golden-angle starts 2.39996·i + 0.14s stagger) → **infall** phase: each line spirals in on `r = R0·(1−p)^1.35`, cyan glow, absorb spark ring + rising triangle blip per line → **burn** phase (singularity spins 6× faster) → **outflow**: console output spirals OUT of the center (green; errors red saw-blips) then docks into the readable log panel → endRun.
  - **Execution**: real JS in a **Blob Worker** (user's own code, worker scope — no DOM), console.log/info/warn/error captured via postMessage, return value shown as `→ …`, 200-line output cap, **3s kill-timer** (`⏱ terminated — spiraled deeper than 3 seconds`), empty output gets the '∅ silence' line. Worker refusal/onerror handled.
  - **Editor**: textarea w/ Tab=2-space insert, Ctrl/Cmd+Enter runs, 4 example programs (fib / ascii starfield / primes / a deliberate crash).
  - **Stage**: 110-star field, 3-arm log-spiral singularity w/ ember core + pulse, status pill ('IDLE · THE CENTER IS PATIENT' / INFALL / EXECUTING / …).
  - Aesthetic: deep-void purple/ember/cyan, **Monofett** display (spiral letterforms) + Fira Code. prefers-reduced-motion: skips infall/outflow animation, executes immediately.
  - Tests: spiral-smoke.js (9 checks — planner purity, infall absorption, verbatim source to worker, queue-behind-burn, outflow drain, error round-trip, dock order) + parse/ids.

## issues
- Sync infinite loops in user code are killed by worker.terminate() at 3s — the ONLY reliable guard; don't replace worker exec with main-thread eval ever.
- Output >200 lines truncates with a notice; the outflow pump runs at ~8 lines/s so huge outputs take a while to fly out (they dock in order regardless).

## todos
- localStorage persistence of editor buffer.
- Share-a-snippet via URL hash (base64 source) — mind length limits.
- Syntax-highlight overlay (careful: keep textarea as source of truth).
