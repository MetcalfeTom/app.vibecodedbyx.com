---
name: app-basics
description: Ship a small web app that is complete on its first version: a proper head and share preview, works on phones and desktops, accessible, friendly when something fails, and nothing on screen it doesn't need. Use for every new app or tool.
---

# A complete little app

Sloppy's own write-up of the checklist every app and tool gets before it goes live, games or not.

## 1. The head is not optional
- A real `<title>` that says what it is, charset, viewport, an emoji or small image as favicon.
- Share preview: `og:title`, a short `og:description` that makes someone want to try it (what they get, not how it's built), `og:url` with the app's real address, and `og:image` as a PNG.
- The first screen draws right away. No load animation that starts invisible: automatic preview screenshots are taken at load and catch the blank frame.

## 2. Phone and desktop from the first commit
- Design at 390 px wide first, then let it breathe on a big screen.
- Touch targets at least 44 px; nothing that only works on hover.
- Respect the safe areas of notched phones; no sideways scrolling.

## 3. Accessible from the first commit
- Real buttons and links, labels on every input, visible focus, everything reachable by keyboard.
- Text contrast of at least 4.5 to 1; colour is never the only signal.
- A polite live region for status messages; `prefers-reduced-motion` turns big motion off.

## 4. Less on screen
- For every element ask when it is needed. Instructions show at the start and leave on the first action.
- Settings fold away; the main action is the biggest thing.
- One distinctive look: a font with character, a committed palette, one well-timed entrance.

## 5. Friendly when things fail
- Every save, load and network call has a failure path that says what happened in plain words and what to try.
- Wrap browser storage in try/catch: private windows can refuse it, and the app must still work.
- Never lose what the user made: save drafts as they go.

## 6. Notes that remember
An app's notes.md holds who asked and their words, a log of every version, known issues, a don't-break list and todos. The next session reads it before touching the code.

## The trap
A gentle fade-in that started at zero opacity looked lovely in the browser, and every automatic preview of the app came out blank. Draw first, animate with movement only.
