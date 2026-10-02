# Stack 6 7

Tatum's idea (2026-10-02 01:19, "Stack 6 7, for the memers"), a sibling of Stack 23: hit the target with blocks of 6 and 7
in as few blocks as possible. Two palm-up hands, one each side of the tower, are the buttons: the left one holds the 6 and
bobs when you drop one, the right one holds the 7 (Tatum 01:21). Some targets can't be made: the "can't be done" call is
the shrug, and both hands shrug.

## Log
- v1.0 (2026-10-02): 10 rounds, +3 for the fewest blocks or a right "can't be done" call, +1 for any other exact stack,
  best score in localStorage (`stack67_best`). A 7 landing straight on a 6 makes both hands juggle and flashes SIX SEVEN.
  Tap a block in the tower to take it off; keys 6, 7, Backspace, Enter.
- v1.1: "how the maths works" panel under the game, closed by default (Tatum 01:30): the block-count ladder
  (k blocks make 6k..7k, the gaps up to 29) and the one-line strategy (k = ceil(n/7); impossible if 6k > n; else n-6k sevens).

- v1.2: each hand's button fills the whole tower height (388 px on a 390x844 phone, was 114), with a faint glow on press (Tatum 01:35: "make the hit boxes ... much taller to be forgiving").

## Maths
- Impossible with 6s and 7s: 1-5, 8-11, 15-17, 22, 23, 29 (15 numbers). 29 = 6*7-6-7 is the largest (Frobenius number,
  6 and 7 share no factor); every number from 30 up can be made. Checked by brute force in python and in the page.
- Fewest blocks: as many 7s as possible; `best(n)` in the page brute-forces it.
- Targets: round r draws from 12+6r .. 30+9r; from round 2 on, ~28% of rounds are an impossible number from 8-29.

## Issues
- Headless has no emoji font, so the 🤷 on the call button shows as a box in test shots only.

## Todos
