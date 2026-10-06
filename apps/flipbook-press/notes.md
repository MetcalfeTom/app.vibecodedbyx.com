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

- v1.5 (2026-10-06): "Film a flick" for phones (last week: 8 visitors, all on phones, median visit 1 min; nobody prints A4 on a phone). Pushed was away; Sloppy's call.
  - `#filmBtn` (pink, in a dashed box under the preview; enabled when grab() finishes) opens `<dialog id="film">` and films `#filmCv` (720×720) live with captureStream(30) + MediaRecorder. Type: first of video/mp4, video/webm;codecs=vp9, video/webm that isTypeSupported (falls back to the browser default); bitrate min(2.5 Mbps, 8 MB×0.7 over the length), so ~1.2 MB for the ball.
  - `flickPlan()` snapshots the pages (cover if on, then every `pic(k)`, so zoom, ink and words/bubbles come along; calls process() first so a just-picked ink is used), the timing `segs` (hold .9 s, flick, hold .7, flip the bundle back .55, hold .4, flick, hold 1.1; one pass if it would run past ~13.5 s, sped up past 12 s) and the page size. Page turn time D = clamp(2/fps, .07, .2).
  - `drawFilm(g,pl,t)`: a teal cutting mat (`filmBg`, "Flipbook Press" in the corner), the stack bound at the left by pink tape with two staples, numbered tab (★ on the cover). Pages are drawn in 20 vertical strips (`pageGeo` cross-section + `fproj` oblique camera with mild perspective, `fstrip` affine per strip + light shading); pages in the air are curled (free edge leads: θ(u)=π·smooth(1.5p−.5(1−u))) and painted low-to-high by z. Backs show the picture faintly (8%). Flipped pages pile up on the left; the thumb (`drawThumb`) bends the free edge before a flick, jiggles per page, lifts for the flip back. Textures are LRU-cached (16).
  - Done: the clip loops in the dialog with "Save the video" (`<a download>`, name `<video>-flick.mp4/.webm`). On a coarse pointer with navigator.canShare({files}) a "Share it" button comes first: the share needs a fresh tap, the button tap that started filming has expired by the end (~9 s).
  - Errors in the dialog: no MediaRecorder/captureStream, recorder won't construct/start, onerror, empty blob, page hidden mid-film (visibilitychange cancels). Cancel/Close/Esc stop the recorder.
  - The empty dropzone's scissors line is now ✂ + a CSS dashed rule (repeating gradient) that fits any width; it used to wrap a lone dash at 390 px.
  - Probe hooks: `__FB.film()`, `__FB.F()` (last film: size, type, dur, pages, fps, passes), `__FB.draw(t)` (a still of the flick at t). Harness probes in the session scratchpad hm/fp1/probe3-8.js.
  - Tested headless at 390×844: ball 12 fps → video/mp4, 720×720, 9.15 s, 1.1–1.2 MB, plays straight through; colour ink + BOING! + thought bubble show; 60 fps and a 270×480 portrait source look right; MediaRecorder removed → the friendly error.

- v1.6 (2026-10-06): a shop window on the landing page (all visitors are on phones, 9 of them from WhatsApp shares, median visit 1 min: they saw a homework-like upload box first).
  - `<canvas id="demo">` (720×720, shown at min(100%, 300 px)) inside the empty `#drop`, above "Choose a short video": the bouncing ball as a finished flipbook, flicked on the cutting mat by the same `drawFilm()` as "Film a flick". `flickPlan()` now ends in `planFor(pages,pics,fps0,size)`, which the demo calls with 29 ball frames (400×225, 12 fps, Pocket size) and no cover.
  - `demoStart()` runs once the fonts are ready (or after 1.2 s), redraws at most every 30 ms, and stops for good when `#drop` hides (a video or the sample loads). prefers-reduced-motion gets one still at t = .75 s. Any error hides the canvas.

- v1.7 (2026-10-06): a landing you can act on, and the pages straight after the preview on phones (WhatsApp visitors, 9 in a week, 29 min total).
  - Found at 390×844 (v1.6): the call to action was plain text ("Choose a short video", the label itself), the sample was a 21 px underlined link at the bottom, and after the sample tap Print and the sheets sat ~1550 px down, under two cards of settings. The auto preview (screenshots/flipbook-press.jpg) caught `#drop` mid opacity fade.
  - Landing: `#drop` is a flex row on desktop (demo left, `.cta` right) and a column on phones. `.pickBtn` (a pink Shrikhand span after `#pick` inside the label; `#pick:focus-visible+.pickBtn` shows the focus ring, `#pick` has aria-label "Pick a video") and `#sampleBtn` as a full-width .btn ("Or try a bouncing ball"). "or drop a video here" only for `(hover:hover) and (pointer:fine)`. `#demo` is min(300px, 40vh) on phones with the mat colour behind it; the drop rises with a transform-only `lift` (no opacity fade). `showDropErr` appends to `#dropCta`.
  - The demo starts at once (it waited up to 1.2 s for fonts); `document.fonts.ready` rebuilds its mat (`pl.bg=filmBg()`) and clears the page textures.
  - Work area: cards got ids `#cFlick` `#cPrint` `#cPages`, the left column is `.colA`. Phones (≤820 px): `#work` is a flex column, `.colA{display:contents}`, order flick → pages → print settings. The Film a flick row moved into `#cPages` under Print/Save (all the endings in one place). Trim, zoom and fps sit in `<details id="tuneBox">` with a summary `#tuneSum` (`syncTune()`); open on desktop, closed on phones unless the clip is longer than 3.5 s. Phones scroll `#work` to the top after start. `#sheets` uses auto-fit on phones, so a single sheet is full width.
  - Smaller: `#frameNo` is just "5 / 30" (fps is in the summary), `#dragHint` hides after the first drag, the grab status says "of the 4.5s clip. Slide Start and End to pick the moment." when there's more clip.
  - Result at 390×844: buttons at y 537/607 on the landing; after the sample tap Print is at y≈600 (was 1602), sheets ready in ~1.1 s. Probes hm/fp1/p.js (landing), p1.js (sample geometry), p2.js (words + 24 fps + colour + film from the new spot: mp4 8.7 s), p3.js (recorded 4.5 s webm).

- v1.8 (2026-10-06): one PDF instead of a burst of JPG downloads ("Save pages" fired one `<a download>` per sheet on a 350 ms timer; phones, iOS above all, keep only the first).
  - `pdfOf(blobs)`: a hand-written PDF 1.4, one A4 page (595.28×841.89 pt) per sheet, each sheet's JPEG as a DCTDecode XObject filling the page (objects: 1 catalog, 2 pages, then page/content/image per sheet; xref entries 20 bytes). `buildSheets` keeps `sheetBlobs` and calls `readyPdf(tok)` when the last sheet is in; `pdf={blob,file,name,url}`, dropped (URL revoked) on every rebuild. `#saveBtn` "Save PDF" downloads `<video>-flipbook.pdf`.
  - `#sendBtn` "Send" (coarse pointer + navigator.canShare({files:[pdf]})): the share sheet with the PDF, made before the tap so the share keeps the tap's activation. The JPGs are still there: `#picsBtn` "Save the sheets as pictures" in `#picsLine` under the sheets.
  - `#pageMsg` (role=status) in the pages card for save/send/print messages, so they show next to the buttons, not up in the Flick card.
  - Tested headless (p4.js): 2 sheets → 317 KB, `file` says "PDF document, version 1.4, 2 pages", every xref offset lands on its `N 0 obj`, both image streams start FFD8 and end FFD9 right before `endstream`. Not rendered: there's no PDF renderer in the sandbox (no poppler/mutool/pdf.js), so a real-device open is still to do. p5.js stubs matchMedia coarse + canShare/share: Send shows, shares 1 file application/pdf named after the video, title = cover title.

## issues
- Headless can't pick a real file; the `rec` probe records a canvas to webm instead. H.264 MP4 isn't testable in the headless shell.
- iOS Safari sometimes draws a blank first frame from an unplayed video; `videoSource` does a muted play()/pause() after loading.
- Headless Chromium records video/mp4 (fragmented: ftyp, moov, moof/mdat) and plays it straight through, but seeking past ~3 s in it gives a decode error there; test recordings by playing, not seeking.
- navigator.share needs a fresh user tap; don't call it straight after filming.

## todos
- Real-device check of print scaling (some print dialogs default to "fit to page", the page says print at 100%).
- Maybe: reverse order option (flick from the back); low value, the numbered tabs already let you stack either way.
- Open the Save PDF file on a real phone/computer and print it once (size check: a Tiny picture should measure 30 mm wide).
- Film a flick: check on a real iPhone and Android (mp4 type, share sheet, save link). Ideas if chat likes it: a paper riffle sound in the clip, a portrait 4:5 frame, a "film again" button, tell Pushed.
