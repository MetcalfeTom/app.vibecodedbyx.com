# beige-spreadsheet

## log
- 2026-05-07: shipped — minimalist spreadsheet for tracking shades of beige. Editable name + hex + RGB + 1-10 boredom + notes per row. Lives entirely in localStorage.
  - **Aesthetic**: paper bg `#f1e9d8` with 11° fiber-grain noise, ink `#3a2e1a`, sage `#5a6240` and coffee `#9a6432` accents. Header in IBM Plex Mono with an italic Cormorant Garamond word swap (`BEIGE · archive`). Spreadsheet rendered as a real `<table>` with sticky header on a slightly creamier `#fbf6e8` body and a coffee-tinted hover state. Even-rows get a faint ink tint for tabular legibility. Every cell is an inline editable `<input>` that gains a paper-white bg on focus.
  - **Pre-seeded library of 20 hand-curated shades**: Putty, Oatmeal, Tea Stain, Mushroom, Manila, Camel Coat, Old Linen, Bone, Toasted Almond, Khaki, Clay, Sandstone, Wheat, Bisque, Greige, Café au Lait, Vellum, Hessian, Champagne, Putty (Damp). Each carries a one-line italic note ("expensive boredom" / "committee-approved compromise" / "soup-adjacent. dusty.").
  - **Boredom rating** is a `<input type="range" min=1 max=10>` with `accent-color: var(--warm)` so the slider track is a coffee tone. Each rating maps to a 10-rung label scale: `1 subtly alive → 2 mildly engaging → 3 passes the day → 4 wallpaper grade → 5 neutral by design → 6 office plant → 7 vague tan → 8 tax form → 9 windowless conference room → 10 actively undoing`. Cell shows `7 · vague tan`. A 2px sage→amber→coffee gradient bar at the bottom of each boredom cell visualises the value as a heatmap (10% per rung).
  - **Live computed columns**: hex change → swatch chip + RGB cell update inline (no row re-render needed). RGB is decimal `r,g,b`. Hex inputs accept `#rgb`, `#rrggbb`, or bare without `#`; invalid values turn the cell red and revert on blur.
  - **Sortable columns**: click any header (except the swatch + actions) to sort; click again to flip direction. Header arrow flips ↕ → ↓/↑ in coffee. Sort persists in localStorage. Boredom + RGB default to descending on first sort, names + notes default to ascending.
  - **Header stats**: rows count, **median boredom** (with its own label), and **most yawned** (the highest-boredom row's name). All update live as you slide.
  - **Toolbar**: `+ new shade` (prepends a new "New Beige" row + auto-focuses the name field), `↓ export csv` (downloads `beige-archive-YYYY-MM-DD.csv` with name/hex/rgb/boredom/boredom_label/notes), `↻ reseed library` (with confirm — resets to the curated 20).
  - **Persistence** in `localStorage['beige-spreadsheet-v1']` — saves rows + sort state + nextId, debounced 250ms with a "saving…" → "all saved" toast in the toolbar's right corner.
  - **Keyboard**: Ctrl/Cmd+Enter adds a new row from anywhere outside an input.
  - **Responsive**: notes column collapses below 760px, RGB column below 600px so the table stays readable on phones without horizontal scroll.
  - **Footer line**: italic Cormorant *"the colour of a wall in a room you cannot remember."*
  - **Accessibility**: rem units, semantic `<table>` with `aria-sort` on every column header, `aria-label`s on every input, role="status" on the save indicator, focus-visible coffee outlines on buttons + an outline on focused cells, ≥2.45rem button targets, skip link to the spreadsheet.

## issues
- The boredom slider is a native `<input type=range>` — across browsers the track styling is OS-defaulted aside from the `accent-color`. Custom track gradient + thumb would tighten the visual, but the default is functional + doesn't fight the page palette.
- The hex input accepts shorthand `#rgb` but always normalises to `#rrggbb` on blur — that loses the user's preferred form. Trade-off for consistent storage.
- "Most yawned" only shows the first highest-boredom row when there are ties. Could show a tie indicator.
- No undo on row delete (just confirm). A small toast with an undo could soften it.

## todos
- A "shuffle" toolbar button that re-orders rows by random — useful when you want to look at them with fresh eyes.
- A "compare two" pop-out that lets you put two beiges side by side at any size.
- An "import CSV" mirror of the export, with column-mapping confirmation.
- Per-row "swatched on" location field (e.g., "lounge wall · north light · 2pm") so beiges become spatially-tagged.
- Optional Pollinations one-line "what this beige is hiding" generator on each row, with a refresh dice-icon.
- A taupe sibling tab. (Or a greige tab. Or an ecru tab. Or all three.)
