# dark-vault · notes

## log
- 2026-05-18: v1 — **dark-mode notes vault with infinitely-nesting folders**. Standalone, no backend, single-file ~30KB. Built to be the redirect target for the crashing Notepad inside windows-11-recall-nightmare (per stacked chat ask: "create a Notepad that crashes and redirects to an Obsidian clone, plus a standalone Obsidian clone with dark mode and infinite nesting folders").
  - **Layout**: titlebar + 260px sidebar (file tree) + main work area (edit / split / preview modes) + status bar with word + char count + autosave indicator.
  - **Aesthetic**: Obsidian-flavoured dark theme — bg `#1e1e1e`, panel `#262626`, accent purple `#a277ff`, blue links `#7c95ff`, green presence `#6ee7b7`, amber callouts. Fonts: IBM Plex Sans for UI + sidebar, JetBrains Mono for the editor, IBM Plex Serif for the preview pane.
  - **Infinite nesting folders**: recursive `state.root` tree where folders can hold notes + sub-folders to any depth (verified at 4 levels deep in the seed vault: `Projects/2026 · Q2/sub-folder/deeper still/the bottom.md`). Each row shows a chevron + folder/note icon + name + hover-revealed action buttons (＋ note · ⊕ folder · ✎ rename · ✕ delete). Indent driven by a per-row `--depth` CSS custom property.
  - **Markdown editor**: textarea on the left with monospace font, live preview on the right (or solo edit / solo preview). Three-mode toggle in the top-right of the work area.
  - **Tiny in-browser markdown renderer**: 200-line implementation supporting H1-H3, `**bold**`, `*italic*`, `` `inline` ``, fenced ``` ``` ``` blocks, `>` blockquote, `---` divider, `-`/`*` unordered + `1.` ordered lists, `[text](url)` external links, `[[Wiki-style]]` internal links, and `#tags` rendered as purple pills. Internal `[[…]]` links click through to the matching note by name.
  - **Search**: live-filter the sidebar by note name + body substring as you type.
  - **Persistence**: full tree saved to `localStorage['dark-vault-v1']` with a 350ms debounce on edits. Status bar shows "saving…" → "all changes saved · ●". Wipe-vault button at the bottom of the sidebar (confirms).
  - **Seed vault**: first boot includes 8 notes across 5 nested folders: Welcome / Projects (Today + 2026 · Q2 / Synergy Velocity Deep-Dive + sub-folder / deeper still / the bottom) / Daily / How notes link. Demonstrates the depth + wiki-link mechanic immediately.
  - **Keyboard**: `Ctrl/Cmd+N` new note, `Ctrl/Cmd+Shift+N` new folder, `Ctrl/Cmd+S` force-save.
  - **WCAG**: rem-everywhere, semantic main/aside/header, `role="tree"` on the sidebar, label-for on the search input, focus-visible purple outline, ≥2.4rem hit areas on tree-rows, prefers-reduced-motion kills transitions. Mobile breakpoint at 720px stacks sidebar above + drops split mode.
  - **OG image**: Pollinations flux.

## issues
- The "drag to reorder" you'd expect from real Obsidian isn't implemented — folders/notes stay in insertion order. Add via reorder-arrows on the action row if asked.
- Backlinks ("which notes link to this one with [[…]]") aren't computed yet — could add a right panel showing them in v2.
- The markdown renderer is intentionally tiny; doesn't support tables, footnotes, callout boxes, embedded images, or rendered LaTeX. Real Obsidian users will notice.
- No vault export/import. State is wholly local; if a user clears site data, the vault is gone.
- The tag pill regex doesn't currently distinguish `#tag` mid-word from a heading-anchor in a code block. Acceptable for a notes app.

## todos
- Right-panel backlinks ("linked mentions" + "unlinked mentions")
- Vault export to a .zip of .md files via JSZip
- Vault import (drag-and-drop folder of .md files)
- Daily-note quick-create button → makes today's date as `YYYY-MM-DD.md` in `Daily/`
- Graph view (force-directed via canvas)
- Block-level editing handles for re-ordering paragraphs
- Editable code-block language hints + syntax highlight via a tiny tokenizer
- Theme picker (other dark variants · maybe a paper-light mode)
- Sync via Supabase if a logged-in chat asks
