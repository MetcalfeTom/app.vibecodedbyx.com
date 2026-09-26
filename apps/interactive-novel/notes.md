# Crossroads (interactive-novel)

Branching story: Alex at a crossroads, city vs countryside. 90 scenes, 52 endings (scenes with `choices: []`). All in the `story` object; every scene has an Unsplash image.

## log
- 2025-09: original build (story, images, typography).
- 2026-09-26: Storybook pass + endings collection.
  - Look: cream paper page on a dark desk, IM Fell English (SC) headings + choices, Libre Baskerville body, red drop cap on the first passage, sepia photos; old passages fade (`.past`), the newest inks in.
  - Choices are `<button>`s with roman numerals; keys 1–5 pick, Backspace steps back. Focus moves to the new passage (aria-live on the text).
  - Endings: THE END card with the ending's name (from its key, `endingTitle()`), "ending n of 52 found" + NEW badge, Begin again / Step back / Your endings. Shelf `<dialog>` lists all 52 (locked = · · ·).
  - localStorage: `crossroads_path` (resume where you left off), `crossroads_endings` (found keys).
  - Images: `loading=lazy`, removed on error.
  - New og.png, sharper description.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.

## issues
- Endings used to be dead ends (no restart). Fixed.
- Some images don't match their scene (e.g. Golden Gate on a countryside scene) — content, not code.
- Ending names come from scene keys; a few read oddly ("Countryside Elara Approach"). Could add an explicit `title` per ending.

## todos
- Proper titles for the 52 endings
- A small map of the path you took at an ending
- Hint on the shelf: which first choice leads to the most unfound endings

## notes
- Headless probe: `scratchpad/gaunt/novprobe.js` walks the shortest route to an ending (BFS over `story`).
