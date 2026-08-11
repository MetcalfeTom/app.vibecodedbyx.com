# reverse-snake (Reverse Snake)

## log
- 2026-08-11: v1 per chat ("clean playable snake with reverse-growth: tail shrinks when eating, grows when hitting walls"). Chat first said "reset index.html" with no app named, then clarified "new file" — the EXISTING apps/snake was deliberately left untouched; hosting convention means the new game lives at reverse-snake/index.html.
  - **The inversion**: start LONG (12 segments). Food = net −2 tail (floor 3) + score. Wall = wrap through + 3-segment toll (net +4 with the kept head; duplicated tail cells unfold as you move) + amber border flash. Only self-collision kills. Shorter = faster (60+len·7 ms/tick, floor 70) so eating is both goal and speed-up — the whole strategy loop is "diet without dying".
  - No instant-reversal guard, P pause, R restart, ▶/tap starts, swipe steering on touch, WebAudio blips (eat chirp, wall buzz, death slide), best-eaten in localStorage.
  - Minimal aesthetic: Jersey 15 + Chivo Mono, mint snake with gradient tail, coral food, dark board grid.
  - Verified: syntax + id cross-check; 9-check mechanics probe (start length, eat-shrink net −2 — first probe run asserted −3 by miscounting the head advance, assertion fixed not the code — wall wrap + growth, min floor, shorter-is-faster, self-kill, restart, food placement). 0 errors.

## issues
- Wall toll is net +4 (head survives + 3 toll). If chat wants exactly +3 net, drop one duplicate.

## todos
- Combo: 3 foods without a wall touch → bonus shrink.
- Daily seed mode with shared food sequence.
