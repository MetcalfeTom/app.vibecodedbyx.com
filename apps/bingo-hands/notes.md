# Bingo Hands (for pushedbutton / "Pushed")

A 90-ball bingo caller for Pushed's workplace in Wigan (colleagues with a range of numeracy skills and some with other impairments). Big number, words, tens-and-ones picture, last 5, a 1-90 board, a spoken call, and a friendly SVG figure whose one big hand signs the number in BSL finger counting. Real tool for a real room: clarity and honesty about the signs come before flash.

## log
- 2026-10-15 19:35 v1.0 first version. Manual calling (Next number button, Space/Enter), Repeat, Undo, New game (in-page confirm dialog), auto-call opt-in in Settings (5-30 s, pause). Number huge + words + tens rods / ones dots (ten-frame rows of 5) + last 5 + board (called = yellow fill + bold + dark frame + screen-reader text). Full screen button. Speech (en-GB voice preferred) after a soft two-note chime; "say the digits first" option; slow/normal speed. Sounds panel: per-number sound (mic via MediaRecorder or file) and per-number sign video (camera or file), stored in IndexedDB only, play/remove/reset all (two-step). Settings: southern/London (default) or northern 6-9, right/left hand, skin tone, dark/light colours. Game state + settings in localStorage so a reload mid-game keeps the called numbers.
- 2026-10-15 19:57 v1.1 (Pushed 19:22-19:53):
  - Staff corner: the editor is behind a quiet "Staff" button in the top corner. Press and hold for 2 s while a ring fills (mouse, touch, or hold Space/Enter on it). A quick tap only shows a hint. Esc or Done closes it. Nothing on the calling screen can be edited.
  - One "Staff settings" dialog with tabs Settings / Sounds and videos / Move to another computer. Auto-call is opt-in in Settings; manual Next is the default.
  - Per-number sign VIDEO (file or camera) plays in the hand's place. Muted by default, and the call or your sound still plays. Tick "Play this video's own sound" and the video's sound replaces the call for that number. Remove per number. Caps: sounds 10 MB, videos 50 MB, with a friendly message.
  - Export: one .json file (settings + every sound + video as base64) with progress. Import restores everything on another computer and shows a friendly error for a wrong file. All local, no uploads.
  - London 6-9 redrawn (Pushed 19:41/19:43): hand turned sideways (back of the hand to the viewer, fingers pointing across the body), fist with the thumb UP and BENT at the joint. 6 = just that, 7 = + index, 8 = + index and middle, 9 = + index, middle and ring. 16-19 waggle that sideways hand. The thumb stays bent in 7-9 too (my reading of "like the 6 but with an additional finger"; ask). 10 is still the upright fist with a straight thumb up plus a small shake, so 6 and 10 now look clearly different. Northern 6-9 unchanged (upright, no thumb).
  - Digits font (viewer 19:42: the 5 looked like a 6/8): all digits 0-9 now come from Atkinson Hyperlegible Next (a font built to tell characters apart), embedded in the page as a 4 KB digits-only subset (SIL OFL), weight 800 for the big number. They look the same online, offline, or if Google Fonts is blocked at work. The 0 has a slash (part of the font's design).
  - Share picture re-rendered with the real fonts; the whole tens-and-ones strip now fits.
- Signing: 1-9 + 0 finger counting, 10 = fist with thumb up + small shake, 11-19 = the unit's hand shape waggled side to side (Pushed 19:32: "13 needs animating, it's 3 waggled side to side"), 20-90 digit by digit, each digit held ~1.65 s with the digit under the hand. prefers-reduced-motion: shapes switch with no motion, no wag/shake (the caption still says "waggled").

## issues
- FONTS, what the live page requests: Google Fonts css2 for Atkinson Hyperlegible 400/700 (all text) + Bricolage Grotesque 800 (the title and dialog headings only). Digits use the embedded "BH Digits" @font-face (Atkinson Hyperlegible Next subset, data: URI, unicode-range U+0030-0039). Stack: "BH Digits", "Atkinson Hyperlegible", Verdana, Tahoma, sans-serif. Before v1.1 the sandbox screenshots used DejaVu Sans because the harness maps Google Fonts away, so the digits looked "regular" (viewer 19:53). Run the harness with FONTS=1 to load the real web fonts. Checked with CDP CSS.getPlatformFontsForNode: #cur renders in "Atkinson Hyperlegible Next" with or without Google Fonts.
- London 6-9 geometry: #ori gets transform translate(120px,228px) rotate(90deg) scale(-.85,.85) via #sig.side. #slv (the sleeve) turns with it. Thumb code b = translate(16px,-30px) rotate(90deg) plus #thtip rotate(-50deg) around the joint (119,66). Palm creases (.pc) hide on the back of the hand. Shape codes have a 6th letter s = sideways.
- Pushed's workplace is in Wigan but they are taught the London way (Pushed 19:13): Southern (thumb-first 6-9) stays the default, Northern is the switch in Staff settings.
- 11-19 = the unit waggled side to side is how PUSHED'S WORKPLACE signs them (Pushed 19:32: "13 needs animating, it's 3 waggled side to side"). BSL SignBank was not checked; Pushed's answer took priority.
- Northern 9 (four fingers, no thumb) looks the same as 4 in this drawing. Check with Pushed whether northern signers turn the hand or move it for 6-9.
- The hand is drawn palm towards the viewer as asked. Many BSL signers show 1-5 with the back of the hand to the viewer; flip it if his colleagues expect that.
- 0 is drawn as a stylised O ring on the hand (palm-facing view can't show a real O handshape well). 40 = 4 then the O.
- 20, 30 ... 90 are signed digit by digit (2 then 0); BSL has its own signs for some tens in some regions. Ask before changing.
- Headless test notes: fonts/emoji are blocked in the sandbox, so screenshots show fallback fonts and tofu for the 🖐️ logo. Port 8973 was taken; tests used 8977 + debug port 9473.

## todos
- If Pushed corrects 7-9 (thumb straight vs bent, which way the fingers point), change SOUTH 7-9 and TH.b only.
- Maybe: traditional bingo call phrases as an option (ask first), 75-ball mode (ask first).

## questions for Pushed
- Counting style: answered 19:13, London/southern by default (Wigan workplace, taught the London way), northern available as a switch.
- How do your colleagues sign two-digit numbers? Teens answered 19:32 (unit waggled side to side). What about 20, 30 ... 90 and numbers like 47: digit by digit, or their own signs?
- 90-ball (1-90) or 75-ball?
- Do you want traditional bingo calls ("legs eleven", "two little ducks")? They can be hard for people with numeracy needs, so they'd be optional and off by default.
- Northern 9 vs 4: same shape here, is that right where you are?
- Palm to the viewer, or the back of the hand? (1-5 and 10 show the palm; London 6-9 show the back of the hand, fingers across the body.)
- London 7, 8, 9: does the thumb stay bent like the 6, or straighten? Do the fingers point across the body (towards the signer's other side), as drawn?
- The digits font has a slashed 0 (so 0 is never read as O). Fine for your colleagues, or would a plain 0 be easier?
