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

- 2026-10-03: monster fight is now the Grim Reaper (fannar22's pick); runaway-loop guard in lesson mode (sys.settrace line budget 20000 → friendly "your program never stopped" note), since the Reaper starter loops forever until you write hp = hp - hit. Tip from fannar22 in both final lessons: end with input("Press Enter to quit") so a real terminal window doesn't close at once.
- 2026-10-03: game lesson 4 Dracula's weakness (fannar22): lists, `in`, append — only garlic beats him. Game track is 7 lessons.
- 2026-10-03: game lesson 5 The splitting slime (fannar22: fire makes it split): list doubling, len(), ice empties the list. Game track is 8 lessons.
- 2026-10-03: game lesson 6 The Overlord Zombie (fannar22's boss + my healing twist): heals every 3rd turn (turn % 3), an if inside the loop finishes him with a holy strike below 30. Game track is 9 lessons.
- 2026-10-03: game lesson 7 The breakable sword (fannar22's weapon): counting down, `and` in a while. Game track is 10 lessons.
- 2026-10-03: game lesson 8 The Iron Forge (fannar22, from Ironforge): first function with return, bag.count, >=; bonus throwing daggers from 1 iron. Game track is 11 lessons.
- 2026-10-03: 🔊 read to me button (fannar22: "for people who can't read, or any kind of reading issue", "friendly sound voice"): speechSynthesis reads title, explanation, task and the last result; prefers a friendly English voice (Samantha/Aria/Jenny/Google…), rate 0.95; stops on lesson change. Hidden where speechSynthesis is missing. Volume slider next to it (fannar22), starts at 55 % for new students, saved in stp-read-vol, a change mid-reading restarts it. Code fonts have ligatures off so >= stays >=. Headless has no voices (utterances error at once), so test by wrapping speechSynthesis.speak.

- 2026-10-03: game lesson 1 starter rewritten as numbered notes with the exact lines (fannar22 didn't get "# Your turn: a = ..., b = ..."); p explains # comments. Rule: starter notes spell out the exact line to type, no "..." shorthand, and starter lines stay under ~30 characters so they fit a phone editor (no wrap).

- 2026-10-03: game lesson 1 suggests the general track first while fewer than 5 general lessons are done (fannar22 found general-first easier).
- 2026-10-03: game track starts from zero now (fannar22: "learning curve like General, but put a Game design twist"): 5 new opening lessons that mirror general 1-5: Title screen (print), Damage maths, Your hero's health (variables), Name your hero (input), The creaky door (if/else, an angry chicken). Dice moved to lesson 6; 16 game lessons. The general-first tip is gone. Saved game progress from before shifts by 5 (L.gv = 2 marks the new numbering).

- 2026-10-03: Name your hero: fannar22 typed "a sword", ran with only step 1 done and read the step-2 note as a failure. The note now starts "Step 1 worked: your hero has a sword!"; the task says any answer works and the questions in the quotes can be changed (they made theirs ask "#ofWeapon"). Rule: a check that is half passed says which half worked.

- 2026-10-03: game lesson 9 Boss bug hunt: the Bug King (fannar22 picked "find bugs" + "fight a boss"): the fight code has 3 planted bugs (missing quote, missing colon after while, King vs king) fixed one error at a time. After the Grim Reaper because it uses while. 17 game lessons. L.gv 3: saved game progress shifts (gv1 +5, then indexes >= 8 +1).
- 2026-10-03: ↺ start over on the lesson card (fannar22: "start a lesson over again which refresh what is in main.py"). Puts the lesson's starting code back; for 8 s the button turns into ↶ undo and brings the old code back. Moving to another lesson clears the undo.
- 2026-10-03: game lesson 10 "Be the Bug King" (fannar22 liked "break something on purpose"): break a working fight three ways, one run each (SyntaxError, NameError, IndentationError; tracked in the lesson's in-memory `seen` set, not saved), then fix it. Errors in this lesson set lres itself before the throw. L.gv 4 shifts saved game indexes >= 9 by one.
- 2026-10-06: C++ track (fannar22: "regardless if there is compiler or not just make C++ track", "teaches the basic first", "don't forget Module(-o)"). cpp.js = Sloppy's mini C++ compiler, no download: lex/parse → check (names + types, nothing runs if it doesn't compile) → tree-walk run. g++-style `main.cpp:N: error:` lines + a ↳ beginner help line, red gutter mark on the line, warnings (if (x = 5), ; after if, decimals cut off on int, missing return). Realism: 32-bit int wrap, 7/2 = 3, %g doubles, glibc rand() (1804289383 first without srand), cin token/fail/getline-newline gotcha, 400k step budget → "never stopped" note, stack overflow at depth 2500. Supports vector/array/string methods, references, prototypes, recursion, switch, do, range-for, casts, sort/reverse/count/find, to_string/stoi, <cmath>, toupper etc., system("pause"). No pointers/structs/classes/overloading (friendly errors). 12 lessons (CPPL): hello, maths, whole numbers + % (modulo), variables, mixing text, if/else if, vectors, for, while (starter loops forever), functions, times table, guessing game boss. Lesson checks use code with comments stripped. C++ runs without waiting for Pyodide (langSync hides the boot overlay). Tests: $SP/stp/t_run.js (56) + t_less.js (all starters compile, all solutions pass).
- 2026-10-06: 🎮 C++ game track (fannar22: "gaming twist as well in C++", "that teaches the basic first"), 18 lessons (CPPG), mirrors the Python game track: title screen, damage maths, splitting the loot (/ and % with gold), hero health, name your hero (cin >> reads one word), creaky door, dice (rand() % 6 + 1, srand(time(0))), coin flips (for + counter), Grim Reaper (starter loops forever), Bug King (3 compile errors in a chain: missing ", missing ;, King vs king), Dracula (vector bag + range-for search), splitting slime (*2), Overlord Zombie (turn % 3), breakable sword (&&, sword--), Iron Forge (function above main, 3 test calls checked line by line), rock paper scissors (beats() + picks[rand() % 3]), guess the number (CPPL's boss), text adventure (else if up). C++ ok() now gets (out, ins, code): ins = what was typed into cin boxes. Tests: $SP/stp/t_lessg.js (all starters + solutions + half-done messages).

## issues
- input() uses window.prompt (Pyodide setStdin). Cancelling the box raises EOFError, explained in the lesson result.
- Headless Chrome has no emoji font: emoji show as boxes in test screenshots only.

## todos
- fannar22: a throwing-daggers lesson, belt holds 6, every miss costs one (shrinking list, pop).
- C++ game track: a Be the Bug King lesson (cause each compile error on purpose), throwing daggers with a vector pop_back.
- fannar22 will review the wording of lessons: take their notes on explanations.
- Boss ideas from fannar22: (slime: DONE, lesson 5).
- Ideas: monster name and health chosen by the player; a lesson that draws with turtle-like ASCII.
