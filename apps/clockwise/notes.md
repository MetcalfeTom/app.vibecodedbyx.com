# clockwise

## log
- 2026-05-10: **stripped to bone** (chat ask: "remove the instructions, the red indicator, and the timer"). Three deletions:
  1. **Instructions section gone** — the entire `<section class="rules">` block ("HOW TO READ A CROOKED CLOCK" etc) removed from the markup, plus the inline default-feedback hint that pointed at the red ▲. Only the tagline above the title and the per-round verdict line remain.
  2. **Red ▲ indicator gone** — removed the painted red triangle at the 12 position inside `render()`, plus its companion caption "▲ = 12 (face rotated 217°)". The dial now ships with **zero orientation cue**: 12 hour ticks + 60 minute pips, all rotationally symmetric. The puzzle becomes intentionally ambiguous — the player has to make their best read of the hand-relative-angle and trust the rotation feel. The reveal still spins the dial back to upright + shows `actual: 04:43`, so each round still validates against a normal-orientation reference.
  3. **Timer gone** — removed `ROUND_TIME`, `state.timer`, the per-second tick (`sfxTick`), the time-up auto-fail path, the CLOCK hud pill, and the `hudTime` element. Hud grid collapsed from 4 to 3 columns (Round / Score / Streak). Players take as long as they want per round; pacing is purely social.
- 2026-05-10: shipped (chat ask: "create an analog clock game with a randomly rotated face and no numbers, where users must guess the time"). Minimalist Bauhaus-flavored guessing game. 10 rounds, 30s timer per round, scored by minutes-off.
  - **The puzzle**: every round picks a random hour (1–12) + minute (0–59) and a random face rotation. The clock has 12 long hour ticks + 60 minute pips but **no numerals**. The single orientation cue is a **red triangle ▲** painted at the 12 position — the player has to find the ▲, mentally re-orient, and read the hour (short hand) + minute (long hand) hands.
  - **Hands rotate WITH the face**: critical detail — when the dial is rotated by θ, both ticks AND hands are rotated by the same θ inside one `ctx.save()/translate/rotate`. The hands keep their correct relative angle to the 12-marker so you can still read the time, you just have to re-orient yourself first.
  - **Reveal animation**: on submit / skip / timeout, the rotation eases back to 0 over ~35 frames (cubic ease-out) so the dial spins back to "normal" orientation, validating your guess against the upright clock. Caption underneath flips from `▲ = 12 (rotated 217°)` to `actual: 04:43`.
  - **Scoring** (12-hour ring distance, min(d, 720-d) so 11:55 vs 12:05 is 10 min apart, not 710):
    - **±2 min** → exact, 100 pts
    - **±5 min** → close, 50 pts
    - **±15 min** → ballpark, 20 pts
    - else → 0 pts
  - **Streak**: any answer ≥50 pts continues a streak counter (resets on misses). Visible in HUD.
  - **Round flow**: 30s countdown ticking once a second. Submit / Skip / time-up all enter a 1.7s reveal hold before the next round. After round 10 a finale card grades the player: 700+ = CHRONOMETER, 400+ = CLOCKSMITH, 200+ = APPRENTICE, else WAYWARD.
  - **Input**: 1–12 hour stepper + 0–59 minute stepper (5-min jumps via the +/− buttons, finer via arrow keys: ←/→ for hour, ↑/↓ for minute). Type any number directly; clamped on submit. Enter submits.
  - **Aesthetic**: cream/black/red Swiss minimalism. Bricolage Grotesque 800 italic-red title ("CLOCK*wise*"), Newsreader italic body, JetBrains Mono HUD/labels. 6px ink-shadow chunky inputs. Dashed border rules block. Black "GUESS" button with red drop-shadow; on click the shadow shrinks and shifts. Final card is inverted (ink bg, paper text) with a red shadow.
  - **Audio**: 1100Hz square tick once per second of countdown, 4-note triangle arpeggio on exact, 3-note swell on close, single sawtooth note on miss.
  - **Accessibility**: rem units throughout, semantic main/header/section, role="application" + control aria-label on canvas, aria-live on HUD + feedback, focus-visible outlines, 2.75rem min interactive targets, prefers-reduced-motion preserves the rotate-back as instant snap.

## issues
- Rotation can occasionally land near 0° or 90° which makes the puzzle trivial — there's a small guard against multiples of 30°, but ~5° tolerance, so 0° / 90° / 180° / 270° won't appear, but 6°/12° still can. Acceptable.
- Time pressure is fixed at 30s — no difficulty curve. Could ramp to 20s by round 7.
- Skip button gives no penalty — could add a minor streak-break (currently it does break streak via score=0 path).
- Mobile: number inputs stay readable but the +/− buttons are 2.4rem wide which is below the iOS 44pt minimum on the smallest devices. The arrow-key fallback covers desktop; mobile users should still be able to tap them but it's snug.

## todos
- Difficulty modes: Easy (no rotation), Medium (current), Hard (no minute pips between hour ticks), Cruel (random hand colors so you have to deduce which hand is which from length alone).
- Streak bonus: +25 pts at every 3-streak.
- Localstorage best score + Supabase realtime "today's leaderboard".
- Random clock styles: Roman numerals (then unrotated obviously), railway, cuckoo, melted-Dali skin.
- Daily seed: `?seed=YYYY-MM-DD` deterministic round set.
- Touch-and-drag answer: drag the hour and minute hands into position instead of typing.

## design-notes
The game's core trick is mental rotation. Real-world watch-reading skill drops sharply when the dial isn't upright (cf. mirror clocks, upside-down test in clock-drawing dementia screening) — this is just a fun version of that test. The red ▲ is non-negotiable: without it, the puzzle is unsolvable (the hour-hand + minute-hand relative angle alone gives no orientation info). With it, the puzzle becomes a 1-step coordinate transform — find ▲, rotate your reading frame, count ticks.

Hands draw inside the same rotation transform as the face deliberately. An earlier sketch had the hands draw separately at hour/minute angle and the face rotated independently, but that visually decoupled them and made the puzzle nonsensical — the player would see hands at "real" positions but tick spacings rotated, which is impossible (hands only move relative to the face).

±2 / ±5 / ±15 score brackets are tuned for the typical 30-tick + 60-pip layout: ±2 means you hit the exact pip (one tick is 6° = 1 minute), ±5 means you got the right 5-min sub-band, ±15 means you got the right quarter-hour. Anything wider is reading the wrong hour entirely.
