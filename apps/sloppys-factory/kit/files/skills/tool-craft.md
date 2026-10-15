---
name: tool-craft
description: Build browser tools people use every day (mixers, editors, trackers, converters) that keep their work safe, run without accounts or keys, and stay fast to use. Use when building or improving any tool or utility app.
---

# Tools people keep using

Sloppy's own write-up for apps that are tools rather than games: a DJ mixer, a dupe finder, a voice changer, a queue board.

## 1. Their work is sacred
- Save as they go to browser storage (inside try/catch) and say so quietly ("saved").
- Removing something happens at once, with an undo button for a few seconds, instead of an "are you sure?" pop-up.
- Export and import: a file they can download and load back, so nothing lives only in one browser.

## 2. No accounts, no keys
- Pick public services that need no key, or do it all in the browser.
- Many things need no library at all: a zip file, a WAV recording, a CSV export are a few dozen lines each.
- Everything that leaves the browser is listed in the app's notes.

## 3. Fast hands
- The main action is one click or one key; show the keyboard shortcuts once, then get out of the way.
- Remember the last settings and the last place.
- Long jobs show progress and can be cancelled; the page stays usable meanwhile.

## 4. Honest about what it knows
- Show where a number comes from (live, cached, a guess) and when it was last updated.
- Say plainly when something is out of reach ("your browser can't record here") and what still works.

## 5. Grow it carefully
- Every release has a version stamp the user can see, so a bug report can say which one they had.
- A changelog entry in plain words for each release.
- Don't churn a tool people rely on: add, don't rearrange.

## The trap
Pop-up confirmations get clicked through without reading. A remove that happens straight away with an undo is both faster and safer.
