# Gladius

## log
- 2026-07-31 v1: chat asked (3 messages, evolving): "The Red Door — R&D validation app, checklist forcing critical questions before code" → "clean dashboard, serious gatekeeper, submit locked until answered" → "rename to Gladius". Merged all three: app is **Gladius — the R&D validation tool**, the gatekeeper is a CSS red door with 7 brass bolts; each of 7 hard questions (problem / exact user / status quo cost / riskiest assumption / no-code test / kill metric / the oath) has a Seal Answer button. Validation refuses gestures: min word counts per question, distinct-word check ("that is one word wearing a coat"), and the oath must be typed word-for-word ("I will validate before I build.", normalized for case/punct). Each seal draws a bolt (brass slide anim + Web Audio clunk); refusals get a thud + stern verdict line. Submit ("Request Entry") stays disabled until 7/7, then becomes "Open the Door" → 3D door swing + creak chord + glowing "PERMISSION TO BUILD" + Certificate of Validation listing all answers, copyable as markdown for a README. Editing a sealed answer unseals it and re-locks the door. localStorage `gladius-v1` persists answers/seals/opened. Cinzel (Roman caps — fits the gladius) + Spectral + Fragment Mono; charcoal/crimson/brass. Roman-numeral question counters. WCAG basics: aria-live gatecount+announce, role=status verdicts, focus-visible brass, ≥44px, reduced-motion kills door/bolt anims. 11/11 stub checks green (boot, refusals, oath normalization, full seal→open cycle, reboot restore, edit-unseals-door) + syntax + id cross-check.

## issues
- Folder is `gladius` (renamed from red-door mid-build per chat, before first commit — no redirect needed).
- The word-count gate is intentionally crude (min words + distinct words); it can be gamed by determined nonsense, but the point is friction + ritual, not NLP policing. Resist making it an AI judge unless chat asks.

## todos
- Optional Pollinations text-API "sparring partner" that challenges the riskiest-assumption answer.
- Share card (canvas-render the certificate as PNG).
- Per-question help examples behind a details toggle.
