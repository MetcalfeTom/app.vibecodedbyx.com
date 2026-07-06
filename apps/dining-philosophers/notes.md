# The Dining Philosophers — notes

## log
- 2026-07-06: v1 — classic concurrency sim (chat ask: 5 animated circles, per-philosopher chopstick states, live deadlock counter, speed slider, click-to-resolve). Single HTML, no libs. **Sim**: state machine THINK→HUNGRY→HAS_LEFT→EATING per philosopher (rAF, dt×speed 0.25–4×); left stick = own index, right = (i+1)%5; the 250–650ms pause between picking left and reaching for right is the deadlock window (deliberately naive — no arbitration). **Deadlock**: predicate = all five in HAS_LEFT holding their left stick → counter++, wine banner, stage panic pulse, faces 😱, SIM FREEZES (step(0)) until user clicks a philosopher → forceDrop releases their sticks + 0.4–1.3s backoff → cycle resumes. **Visuals**: SVG symposium — round table ΣΥΜΠΟΣΙΟΝ, 5 plates, 5 chopstick groups that TRANSITION (0.35s) between table-home (neutral wood) and holder-side positions (terracotta when held; left/right side of plate shows WHICH stick), philosopher circles w/ emoji state faces + names (Socrates/Plato/Aristotle/Diogenes/Hypatia), Overheard panel w/ per-state quote pools, starving-longest tracker. GFS Didot + Space Mono, marble/terracotta. Keyboard: philosophers are focusable buttons (Enter/Space = drop). **Tested**: __dp.starve() (drops all sticks first — earlier version corrupted state by starving EATERS holding two sticks; tryPick fails on own stick) → deadlock formed w/ sticks [0,1,2,3,4], banner+counter ✓; click on Aristotle resolved ✓; 4× speed → 8 meals ✓; zero errors.

## issues
- Natural deadlocks are occasional by design (need overlapping hunger); __dp.starve() forces one for demos/tests.
- Sim fully freezes during deadlock (intended — the click IS the lesson); if chat wants auto-recovery, add a timeout option.

## todos
- Strategy toggle (resource ordering / waiter / Chandy-Misra) to show FIXES, per-philosopher meal bars, starvation highlighting.
