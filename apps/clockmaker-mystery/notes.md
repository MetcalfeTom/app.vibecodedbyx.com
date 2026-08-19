# The Clockmaker's Question — a three-witness mystery

## log
- 2026-08-19: v1.0 — built per chat. The great regulator stopped in the night (escapement eased loose, seeded time among three); THREE WITNESSES (Odile the apprentice 🔧, Bram the baker 🥖, Petra the night watch 🏮), seeded culprit via mulberry32. Case structure is SOLVABLE BY CONSTRUCTION and probe-enforced over 40 seeds: exactly one lie (culprit's "I never left... Not once." alibi), one physical trace at the doorway keyed to the culprit (clock oil on the attic ladder / rye flour / lantern wax), and one honest sighting from witness (culprit+1)%3 ("I saw X crossing the square"). INTERROGATION: pick witness 1-3, ask A/B/C (whereabouts / noticed / motive) — innocents give real alibis and the chime ambience; the culprit is quiet and defensive. EVIDENCE: search bench/door/square (keys 4/5/6) → stopped face, the trace, the still night. ACCUSATION (X): pick person then proof; wrong person = kind rebuttal + apology counter; right person with wrong proof = "a stopped clock accuses no one"; right person + trace = whimsical confession (each culprit has a forgivable motive) and "everyone has tea", ranked by hasty fingers. R = fresh case, Esc backs out of accusing. Local-only (clockwitness-v1), resumes mid-case. Zero external assets. Probe 19/19 (one fix: no-undefined check self-matched the probe script via body.textContent → scoped to main — banked lesson, again).

## issues
- probe self-match struck again (body.textContent includes appended probe script text) — ALWAYS scope text sweeps to main.

## todos
- a fourth "hard mode" witness who genuinely saw nothing, if chat asks; shareable case seeds.
