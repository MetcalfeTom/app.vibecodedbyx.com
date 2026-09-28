# Flipbook Press

Pick a short video (or the bouncing-ball sample), get A4 sheets of tiny numbered frames with dashed cut lines, print, cut, staple, flick. Idea and specs from pushedbutton (2026-09-27): A4 only, "so tiny", a grumpy IT manager who hates ink use, cut lines, 12 / 24 / 60 fps choice.

## log
- v1.0 (2026-09-27): first version.
  - Sources: `<video>` from a file (never uploaded) or `ballSource()` (procedural squash-and-stretch ball, 2.4 s). A source is `{name,dur,w,h,drawAt(ctx,t,w,h)}`; grabbing seeks `vid` frame by frame (`seek()` waits for `seeked`, 3 s fallback).
  - `knownLength()`: browser-recorded webm has `duration=Infinity`; seeking to 1e7 makes Chrome work the length out (verified with a MediaRecorder clip in headless).
  - Frame count = trimmed length × fps (12 thrifty / 24 film / 60 premium) + 1, capped at 240. Stored frames are 480 px on the long side, 340 px above 72 frames (memory on phones).
  - Ink looks: outline (Sobel on a light blur, the top 10% of gradients drawn grey), pale (default; gamma'd and capped at 140/255 darkness), grey, colour. `levels()` sets one black and white point for the whole clip (1st / 96th percentile), so paper prints as no ink and frames don't flicker.
  - Sheets are canvas-rendered at 200 dpi (1654×2339) → JPEG blob URLs; the same images serve the preview, print (`#print` imgs at 210×297 mm, `@page` margin 0) and Save pages (`<a download>`). Sizes: Tiny 30 mm, Pocket 44, Card 68 picture width + 13 mm numbered tab; tall videos are capped at 1.25× the width. Dashed cut lines stop where the last frame ends.
  - Ink meter: mean darkness of each sheet → "% ink per sheet", compared with a 5% page of plain text, plus the IT manager's mood.
  - Preview canvas flicks at the chosen fps; drag across it to flick by hand, arrow keys step. Tap a sheet for a close-up `<dialog>`.
  - Probe: scratchpad flip/mkprobe.py → gaunt/sw/fb/index.html, modes ball, ink<name>, fps60, card, rec (MediaRecorder webm → loadFile), bad, sheet<size>, og.
- v1.1 (2026-09-27): a title cover and held ends.
  - `sequence()` builds the page order: -1 = cover, then frame 0 twice more, every frame, then the last frame 3 more times (hold is on by default and only kicks in from 6 frames). Held copies get their own tab numbers so the staple order stays obvious.
  - `drawCover()`: a bordered card with the title (Shrikhand, auto-fit to the cell) and "flick me →"; its tab shows ★. Title defaults to the file name (placeholder), editable in `#coverTxt` (40 chars). `document.fonts.load('40px Shrikhand')` re-renders the sheets once the font arrives.
  - Checkboxes `#holdChk` / `#coverChk` in the options; the cover text row hides with the cover off.

- v1.2 (2026-09-27): sound words (pushedbutton: "I'll have to do the sound myself" for Otis's squeaky ball).
  - `words=[{t,at,i}]`: a word is stamped at a source time (not a frame index), so trim and fps changes keep it on the right moment; `span={a,b,n}` records the times the current frames were pulled at, `wordFrames(w)` maps a word to frames (half a second, at least 3 frames).
  - `pic(k)` returns looks[k] or a cached copy with the word drawn in (`drawWord`: a 13-spike comic burst in a top corner, alternating right/left per word; pops in at 0.62×, 1.14× on its second frame, then wobbles; white burst + dark text, yellow burst + pink text in colour ink). Preview and sheets both draw `pic()`.
  - UI in a `<details>` under the preview: text (14 chars, upper-cased, placeholder SQUEAK!) + "Stamp it here" (stamps at the current preview frame, pauses); chips with × to remove, "(trimmed out)" when outside the trim.
  - Cover: the title now wraps onto 1–3 lines, whichever is biggest (tall phone videos get narrow covers), and "flick me →" shrinks to fit (pushedbutton spotted the F running into the staple tab on portrait videos).
  - Probe modes word / wsheet / wcol (stamps BOING! at frame 10 and SQUEAK! at frame 23) and portrait (a 270×480 source named "Otis in the garden").

- v1.2.1: stamping a word gives a rubber-stamp thunk (the preview dips, a short low sine knock; no motion with reduced motion).

- v1.3 (2026-09-27): speech and thought bubbles next to the sound burst (the voice's idea). A kind picker (`wkind`: burst / say / think) above the text box; words now carry `k`. Bubbles use Courier Prime, keep the case, up to 24 characters, wrap to 2 lines, and stay 1.2 s (bursts 0.5 s). `drawBubble`: 'say' is a rounded box with a tail toward the middle, 'think' a bumpy cloud (quadratic bumps) with two trailing dots. Chips show 💥/💬/💭. Cover wrap only when it makes the title 15% bigger and the block stays under 46% of the height (the 2-line landscape title crowded "flick me"). Probe modes bubble / bubsheet.

- v1.4 (2026-09-28): zoom in on the subject. `#zoomAmt` slider (1–3×, step 0.25; NOT `#zoom`, that id is the sheet close-up dialog) under the trim, always shown. Frames are pulled already zoomed (grab() scales the grab canvas around `focus` before `src.drawAt`), so they stay sharp at Card size. A tap on the preview (moved < 6 px, < 500 ms) aims the zoom at that spot (`flickBox` = where drawFlick put the picture; new focus = old + (tap − 0.5)/zoom, clamped by `aim()` so the frame stays covered); Shift + arrows nudge it; drag still flicks. start() resets the focus to the middle. Probe modes zoom / zsheet.

## issues
- Headless can't pick a real file; the `rec` probe records a canvas to webm instead. H.264 MP4 isn't testable in the headless shell.
- iOS Safari sometimes draws a blank first frame from an unplayed video; `videoSource` does a muted play()/pause() after loading.

## todos
- Real-device check of print scaling (some print dialogs default to "fit to page", the page says print at 100%).
- Maybe: reverse order option (flick from the back); low value, the numbered tabs already let you stack either way.
