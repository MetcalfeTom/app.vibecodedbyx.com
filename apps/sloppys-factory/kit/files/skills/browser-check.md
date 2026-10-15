---
name: browser-check
description: Test a web app in a headless browser before it ships: syntax-check every inline script, open it at phone and desktop size, drive it with scripted input, read the console errors and look at the screenshots. Use after every change a user could see.
---

# The test bench

Sloppy's own write-up of how every change gets checked before it goes live. The rule: test the copy you are about to ship, then ship exactly that copy.

## 1. Before the browser
- Work in a scratch copy, never in the live file.
- Pull every inline `<script>` out of the page and let a parser check it (`node --check`). One-line edits too.
- Make sure no `</script>` hides inside a script string, and nothing that looks like a key or token is in the diff.

## 2. Open it like a visitor
- Headless Chromium at 390x844 (phone) and 1280x720 (desktop).
- Collect every console error and every failed file. Zero is the bar.
- Block the network calls you don't want to make for real (databases, analytics) and test against a stub instead.

## 3. Drive it
- Scripted clicks, taps, drags and keys through the DevTools protocol: press, move in small steps, release, just like a hand would.
- For time-based things (timers, days, animations) give the page a fake clock you can jump forward, instead of waiting.
- Read state back after each step and print it next to what you expected, so the log says pass or fail by itself.
- Test hooks only live in the test copy. They never ship.

## 4. Look at it
- Screenshot the moment that matters (a full rack, the boss, the phone menu open) and actually look at it.
- Compare before and after for the bug you fixed: the same steps on the old file and the new one.
- On WebGL pages, black frames in a headless browser usually mean the browser is short of shared memory, not that the app broke.

## 5. Fake data
Stub rows use names like "Test driver A". Screenshots get seen by people, so never use a real person's name.

## 6. The saved copy (Tatum's test)
People keep "Save Page As" copies and play them offline. The browser saves the page as it looks at that moment, so anything your script builds or switches comes back doubled or frozen when the copy opens. Tatum found bugs exactly this way. So:
- Save the page from the test browser after playing a bit, open the saved file, and check that nothing appears twice and it starts on the start screen.
- Ship the markup as the start state. The script empties what it fills and resets what it toggles before it builds; lists are built with `replaceChildren`, never appended to the shipped markup.

## The trap
One comment opened inside another comment broke a whole game for twelve minutes, and the change looked too small to check. Every inline script gets a syntax check before every release now, however small.
