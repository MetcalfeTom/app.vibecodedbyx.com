# Bingo Hands (for pushedbutton / "Pushed")

A 90-ball bingo caller for Pushed's workplace in Wigan (colleagues with a range of numeracy skills and some with other impairments). Big number, words, tens-and-ones picture, last 5, a 1-90 board, a spoken call, and a friendly SVG figure whose one big hand signs the number in BSL finger counting. Real tool for a real room: clarity and honesty about the signs come before flash.

## log
- 2026-10-15 19:35 v1.0 first version. Manual calling (Next number button, Space/Enter), Repeat, Undo, New game (in-page confirm dialog), auto-call opt-in in Settings (5-30 s, pause). Number huge + words + tens rods / ones dots (ten-frame rows of 5) + last 5 + board (called = yellow fill + bold + dark frame + screen-reader text). Full screen button. Speech (en-GB voice preferred) after a soft two-note chime; "say the digits first" option; slow/normal speed. Sounds panel: per-number sound (mic via MediaRecorder or file) and per-number sign video (camera or file), stored in IndexedDB only, play/remove/reset all (two-step). Settings: southern/London (default) or northern 6-9, right/left hand, skin tone, dark/light colours. Game state + settings in localStorage so a reload mid-game keeps the called numbers.
- Signing: 1-9 + 0 finger counting, 10 = fist with thumb up + small shake, 11-19 = the unit's hand shape waggled side to side (Pushed 19:32: "13 needs animating, it's 3 waggled side to side"), 20-90 digit by digit, each digit held ~1.65 s with the digit under the hand. prefers-reduced-motion: shapes switch with no motion, no wag/shake (the caption still says "waggled").

## issues
- Pushed's workplace is in Wigan but they are taught the London way (Pushed 19:13): Southern (thumb-first 6-9) stays the default, Northern is the switch in Settings.
- Northern 9 (four fingers, no thumb) looks the same as 4 in this drawing. Check with Pushed whether northern signers turn the hand or move it for 6-9.
- The hand is drawn palm towards the viewer as asked. Many BSL signers show 1-5 with the back of the hand to the viewer; flip it if his colleagues expect that.
- 0 is drawn as a stylised O ring on the hand (palm-facing view can't show a real O handshape well). 40 = 4 then the O.
- 20, 30 ... 90 are signed digit by digit (2 then 0); BSL has its own signs for some tens in some regions. Ask before changing.
- Headless test notes: fonts/emoji are blocked in the sandbox, so screenshots show fallback fonts and tofu for the 🖐️ logo. Port 8973 was taken; tests used 8977 + debug port 9473.

## todos
- v1.1 (asked 19:22-19:25): editor behind a quiet "staff" corner button with a 2 s press-and-hold ring (Esc/close to leave), nothing editable on the calling screen; per-number video "play its own sound" option; Export / Import of settings + all sounds + videos as one file, with progress and a friendly wrong-file error.
- Maybe: traditional bingo call phrases as an option (ask first), 75-ball mode (ask first).

## questions for Pushed
- Counting style: answered 19:13, London/southern by default (Wigan workplace, taught the London way), northern available as a switch.
- How do your colleagues sign two-digit numbers? Teens answered 19:32 (unit waggled side to side). What about 20, 30 ... 90 and numbers like 47: digit by digit, or their own signs?
- 90-ball (1-90) or 75-ball?
- Do you want traditional bingo calls ("legs eleven", "two little ducks")? They can be hard for people with numeracy needs, so they'd be optional and off by default.
- Northern 9 vs 4: same shape here, is that right where you are?
- Palm to the viewer, or the back of the hand?
