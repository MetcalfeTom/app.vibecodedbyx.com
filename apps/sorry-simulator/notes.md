# sorry-simulator · notes

## log
- 2026-05-17: v1 — **two people block a doorway and aggressively apologise until one snaps and storms through** per chat ask: "build a sorry-simulator where two players aggressively apologize while blocking a doorway." Single file ~28KB. Default vs-AI mode, toggleable hot-seat for 2-player local.
  - **Core conceit (the British politeness war)**: each player has two meters — **politeness** (climbs with apologies, gold→coral gradient bar) and **patience** (drops with absorbed apologies, teal→green bar that flips red+pulse below 25). When either player's patience hits 0, they SNAP — storm through the doorway. The OTHER player WINS because they were too polite to even resist. Aggressive politeness is the winning strategy.
  - **4 actions** per turn:
    - 🙏 **SORRY!** — picks from 12 hand-written `PHRASES.sorry` ("Sorry!", "Oh sorry sorry!", "Cheers, sorry.", "Sorry — my fault.", "Pardon me, sorry!", "Oh god, sorry.", ...). +6 your politeness, -4 their patience.
    - 👉 **after you** — picks from 11 `PHRASES.insist` ("No, no, after you.", "I insist, go on.", "I couldn't possibly.", "Couldn't, wouldn't. After you.", ...). +12 your politeness, -8 their patience. Triggers a `gesturing` class on the character (raised arm waving them through).
    - ⬅️ **step left** / ➡️ **step right** — character physically shifts to that side via CSS `left/right` transition (0.35s cubic-bezier overshoot). 7 `PHRASES.step` lines. Pass-through resolution:
      - If both stepped the SAME direction (left-left or right-right) → MIRROR ("they mirror each other (the dance)"), both lose 2 patience for the awkwardness, characters reset to centre in 700ms
      - If you stepped OPPOSITE directions → one of you passes through → game ends ("X nips through · Y wins the politeness war")
  - **vs-AI behaviour**: AI picks its response with a hand-tuned weighted strategy:
    - 60%: MIRROR the player's action (the awkward dance — if player apologised, AI apologises back; if player stepped left, AI also steps left because of course)
    - 25%: just apologise back
    - 10%: escalate to "after you"
    - 5%: bold step in a random direction (might cause a pass-through)
    - If AI's patience drops below 30, 40% chance it just steps boldly (impatient AI gives up apologising and tries to escape)
  - **Hot-seat toggle**: "vs AI" → "hot-seat" button flips it. In hot-seat, both control panels are visible + active (P1 left, P2 right, each clicks their own buttons). Mode resets the game.
  - **Visual scene** (CSS-only, no canvas):
    - Doorway: 36% wide centered rectangle with rounded top, gold→amber→dark-amber vertical gradient, ink border, inset white shadow, radial-gradient light beam shining through (the iconic "warm pub interior" light)
    - Ground: dark linear-gradient strip at the bottom
    - Background gradient: brown wood → warm tan, with a radial "doorway light" overlay
    - 2 characters made from CSS primitives:
      - **Body**: large pill-shape (~5rem × 8rem) in green (P1) or pink (P2) with inset bottom shadow
      - **Head**: skin-tone circle on top with inset highlight
      - **Eyes**: 2 dark dots that... just look forward (no tracking, awkward)
      - **Mouth**: small dark dot that morphs to an oval when `.talking`
      - **Arms**: 2 colored ovals on sides, rotate to point/gesture when `.gesturing` (the "after you" wave)
    - **Speech bubbles**: cream rounded rectangles in Caveat (handwritten) with coral text. Pop-in via `cubic-bezier(.5,1.3,.5,1)` overshoot. Tail anchored to the character. Auto-clear after 1.5s.
    - **Step animation**: characters slide left/right via CSS `left/right` transitions with overshoot timing — feels chunky and physical
    - **Pass-through animation**: when a player passes, they slide off-screen (left = `left: -25%`, right = `right: -25%`) over 0.7s ease-in. Doorway feels earned.
    - **Snap animation**: `snapShake` keyframe (3 iterations of ±4px translate + ±3° rotate) before storming through
  - **Log card** (Fraunces italic on cream): rolling chronological log of every line spoken + meta annotations ("they mirror each other (the dance)", "X nips through · Y wins..."). Auto-scrolls. Last 12 entries visible. Each line tagged with `.p1` (green) or `.p2` (pink) "who" label in Bungee.
  - **Audio** (lazy `ensureAudio()` on first action):
    - `sndSorry` — 520-600Hz triangle + 380Hz sine descending pair
    - `sndInsist` — 660/880/990Hz arpeggio (escalating gesture)
    - `sndStep` — 220Hz square click
    - `sndSnap` — 180→140→90Hz sawtooth descent (the "GIVING UP" sigh)
    - `sndEnd` — 523/659/784Hz major triad
  - **End overlay**: brown-tinted backdrop with cream panel. Title: "X wins the doorway". Flavor varies by reason — "the other one snapped and stormed through. Aggressive politeness is a real strategy." OR "the other one bolted through the gap. You were too polite to even resist." Stats: politeness gap, total apologies, longest sorry-chain, turns taken. Restart button.
  - **Input lockout**: 750ms after each action so the AI animation can play out without spam-clicking. Hot-seat respects the same throttle so the response feels deliberate.
  - **Aesthetic**: warm British pub interior palette — cream (#f4ecd8 → #ebd9b3 gradient) bg with 3 radial accent glows (coral + teal + plum). Title in Bungee with 3-layer drop shadow (coral offset + black ambient). Fraunces italic for the tagline. Bungee for headers/buttons, Fredoka for body, Caveat handwritten for speech bubbles. Chunky 4px hard-offset shadows on every panel.
  - **Mobile** (≤36rem): controls collapse to single column; in vs-AI mode the P2 panel hides. Stage shrinks to 14rem height; characters scale proportionally.
  - **WCAG**: rem units, semantic main/header/section/h1, `role="log" aria-live="polite"` on the conversation log, `role="status" aria-live="polite"` on meters (via implicit), `role="dialog" aria-modal="true" aria-labelledby` on end overlay, `aria-pressed` on mode toggle, `:focus-visible` 3px gold outline 3px offset, ≥44px (2.75rem) min-height on all buttons, `prefers-reduced-motion` kills all transitions + step + bubble + snap animations.
  - **OG image**: Pollinations flux seed 51515.

## issues
- AI is deliberately "too" mirror-y (60% chance) to drive the awkward-dance comedy — but this means the dance never seems to escalate naturally. Could add a difficulty slider that adjusts mirror chance.
- Stepping is the only way to actually end the game via a pass; apologising alone just drains patience. A confused first-time player might spam apologise without realising they need to STEP at some point to gracefully end it (or wait for someone to snap).
- The "mirror" detection compares `state[other].pos` which is reset to 0 after 700ms — so if AI responds at 750ms after player's step, the player's position has already reset, meaning the AI's step looks like a fresh attempt. Slightly forgiving but means you have to step on YOUR turn AND have the AI also step on its turn for a mirror to register. Acceptable but a more lenient model could match steps within a wider window.
- No move history visible to the player ahead of time — strategy is opaque. Could add a "tendency" hint after a few moves ("the stranger seems impatient").
- Hot-seat mode shares one keyboard but currently uses only mouse/touch on the on-screen buttons. Could bind keys (Q/W/E/R for P1, U/I/O/P for P2) for true 2-player keyboard combat.
- The patience-50 → patience-0 drop happens fast at default rates — most games end in 8-12 turns. Could be tuned for longer rounds.

## todos
- Difficulty slider: AI mirror % (60 default), AI snap-threshold (30 default)
- Keyboard bindings for hot-seat (Q/W/E/R and U/I/O/P)
- More phrase variety: "Manchester mode" / "Toronto mode" / "Tokyo mode" with culturally-distinct apology pools
- A 3rd action: "tut" / "huff" — sigh visibly, restores +5 your patience but +3 their politeness (passive-aggressive recovery)
- Achievement system: "First Snap" / "12-Sorry Chain" / "Won Without Stepping"
- Tournament mode: best-of-5 doorways with cumulative score
- Multiplayer over Supabase Realtime: real 2-player remote
- Background ambient: pub chatter + occasional cough loop
- Optional "umbrella" prop blocking the doorway — player must furl it during one of the apology turns
- Streamer mode: chat votes the next action via Twitch IRC
