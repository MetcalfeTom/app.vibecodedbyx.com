# Sloppy Teaches Programming

A beginner Python course in the browser (Pyodide 0.26.4), asked for by fannar22 on 2026-10-03:
"teach users how to program … a total beginner with zero experience", "keep classic Hello World",
"I think there should be General Programming and Game Programming … let start 2 tracks", "end game!".
Forked from py-playground (its editor, examples, input() via prompt, auto-indent), so the free-play
examples still work when the lesson card is hidden.

## log
- 2026-10-03 v1: two tracks in the lesson card header.
  - General programming: the 11 lessons from py-playground (Hello World → variables → input → if → loops → lists → functions → guessing game).
  - Game programming: dice roll, coin-flip streak, monster fight, rock paper scissors, guess the number (shared with general), final boss text adventure.
  - Each run gets a fresh namespace; lessons check output + variables (`ok(out, ns, code)`, optional `py` expression).
  - State in localStorage `stp-lessons-v1` {on, track, at:{general,game}, done:{general:[],game:[]}}; code in `stp-code-v1`.

## issues
- input() uses window.prompt (Pyodide setStdin). Cancelling the box raises EOFError, explained in the lesson result.
- Headless Chrome has no emoji font: emoji show as boxes in test screenshots only.

## todos
- fannar22 asked for a "General C++" track. Not in the browser yet (no compiler); Python first, maybe later as read-along lessons.
- fannar22 will review the wording of lessons: take their notes on explanations.
- Ideas: monster name and health chosen by the player; a lesson that draws with turtle-like ASCII.
