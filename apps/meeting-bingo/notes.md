# meeting-bingo (Meeting Bingo)

## log
- 2026-06-28: shipped (chat ask: "corporate meeting bingo soundboard — random buzzwords with a bingo card that auto-highlights when words are clicked"). Self-contained, zero deps.
  - **5×5 card** of corporate jargon randomly drawn from a 56-phrase `BUZZ` pool (Synergy, Circle Back, Low-Hanging Fruit, You're on Mute, Per My Last Email…); center is a pre-marked FREE square. B-I-N-G-O colored header row.
  - **Click to daub**: cells are `<button>`s (aria-pressed); clicking marks/unmarks with a highlighter-yellow blob daub (`::before`, random rotation per cell via `--rot/--rot2`, multiply blend) + slight tilt.
  - **Soundboard**: each mark plays a Web Audio "stamp" (square sweep + noise burst) AND speaks the buzzword via SpeechSynthesis (en voice, lower pitch/rate). Unmark = soft blip. `📢 Call a buzzword` button announces a random card word (bingo-caller flavor) into a Permanent-Marker caller line.
  - **Auto bingo detection**: 12 `WIN_LINES` (5 rows + 5 cols + 2 diagonals); on each toggle, newly-completed lines glow (`.win` pop), increment the bingo counter, and trigger a slam-in "BINGO!" banner + 5-note triangle fanfare + "Bingo!" TTS + Web-Animations confetti (90 pieces, skipped under reduced-motion). `wonLines` map prevents re-celebrating the same line.
  - **Controls**: New card (reshuffle), mute toggle (aria-pressed, gates both synth + TTS), marked/bingo counters.
  - **Aesthetic**: whiteboard — light grid bg, white board with hard offset shadow, Bricolage Grotesque buzzwords + Permanent Marker accents + Space Mono HUD, navy/teal/coral palette, highlighter-yellow daubs.
  - **WCAG**: role=grid/gridcell buttons, aria-pressed marks, role=status aria-live on caller + assertive on BINGO, focus-visible teal, mute aria-pressed, prefers-reduced-motion kills anim/confetti, rem units.
  - Verified: syntax OK; win-line logic unit-tested (12 lines; row + diagonal detection correct).

## issues
- TTS depends on the browser exposing voices; if none, speech silently no-ops (synth stamp still plays). Fine.
- Buzzwords are generic office jargon (no copyrighted content).

## todos
- Local "fastest bingo" timer / best score in localStorage.
- Multiplayer shared card via Supabase (everyone in the same meeting, same card).
- A few special per-word sounds (You're on Mute → muffled, Hard Stop → buzzer).
- Theme packs (standup bingo, sales-call bingo, all-hands bingo).
