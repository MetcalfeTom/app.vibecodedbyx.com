# SQL Notes

## log
- 2026-04-22: Created. Notes app backed by a real SQLite database running entirely in the browser via **sql.js 1.10.3** (SQLite compiled to WASM). **Loader**: script tag `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js` + `initSqlJs({locateFile: f => '.../sql.js/1.10.3/' + f})` so the WASM module pulls from the same cdn path. **Persistence**: raw `Uint8Array` bytes from `db.export()` stored in **IndexedDB** (`sql-notes-db` / `snapshots` store / key `primary`). Tiny promise-wrapping helpers `idbGet()`/`idbPut()` avoid framework bloat. Every mutation → debounced 350ms `persistLater()` re-exports the whole db and overwrites the snapshot. **Schema**: `CREATE TABLE notes (id INTEGER PK AUTOINCREMENT, title TEXT, body TEXT, created_at INTEGER, updated_at INTEGER, pinned INTEGER DEFAULT 0)` with indexes on `updated_at DESC` and `(pinned, updated_at DESC)` for the default list order. Title & body editor is debounced 260ms and patches only the changed columns via `UPDATE notes SET col = ?, updated_at = ? WHERE id = ?`. List uses `ORDER BY pinned DESC, updated_at DESC`; search runs `WHERE title LIKE ? OR body LIKE ?` with `%term%` wildcards. **Helpers**: `queryAll`/`queryOne`/`runSingle` wrap `db.prepare()` + `stmt.bind()` + `stmt.step()` + `stmt.free()` so every path frees its prepared statements (no WASM leaks). **Import/Export**: export = `db.export()` → Blob (`application/vnd.sqlite3`) → download `notes-YYYY-MM-DD.db`. Import = read file → `new SQL.Database(bytes)` to validate → check for `notes` table via `sqlite_master` → adopt, call `ensureSchema()`, persist. Per-note Markdown export (`# title\n\n_saved timestamp_\n\nbody`) as `.md`. **UI**: 2-pane layout — left sidebar with search input + ＋ New + list (title + 2-line preview + relative time), right editor with id/created/saved meta strip + pin toggle + delete + export .md; empty state shows the real schema as ASCII art. 860px breakpoint collapses to stacked row-based layout. Title is borderless Newsreader 26–36px input; body is borderless Newsreader 17px textarea (flex-grow, min 260px). Relative time formatter (`just now` / `Nm ago` / `Nh ago` / `Nd ago` / `Mon D`); full timestamp in editor meta. **Status ribbon**: footer shows "all saved" (green pulse) / "typing…" / "saving…" text with idle opacity, plus import/export buttons. Header stats: notes count + db size in KB (computed from `db.export().byteLength`). **Keyboard**: Ctrl/Cmd+N new note, Ctrl/Cmd+K focus search, Esc clears search. **Boot**: overlay with amber spinner while WASM downloads + IDB opens; on first-ever run, seeds a single welcome note (pinned) explaining the schema and keys. **Aesthetic**: warm paper — `#f5efe3` / `#fbf6ea` with 9°/99° repeating-linear fiber grain at mix-blend multiply. Newsreader display + IBM Plex Sans UI + IBM Plex Mono for meta. Accent: amber `#b5791d` / `#7a4c08`, sage pulse `#4b6a3a`, rust `#a3391a` for delete. Green pulse dot on "in-browser db" status. Pollinations OG.

## features
- Real SQLite (sql.js 1.10.3) running in-browser via WebAssembly
- IndexedDB snapshots — data persists across reloads, survives closing the tab
- CRUD with debounced autosave (260ms edit debounce, 350ms persistence debounce)
- Search across title + body with SQL `LIKE`
- Pin ✦ notes to the top (sorted by pinned DESC, updated_at DESC)
- Export the whole database as a real `.db` file you can open in any SQLite tool
- Import a `.db` file (validates the `notes` table exists before adopting)
- Export a single note as Markdown
- Keyboard: Ctrl/Cmd+N new, Ctrl/Cmd+K search, Esc clears search
- Welcome seed note on first run explaining the schema
- DB stats in header: note count + size in KB
- Fully client-side — zero backend calls

## issues
- Full-db persistence on every change means the whole SQLite bytes are rewritten to IndexedDB each save. Fine for 100s–1000s of notes; a huge note db would thrash. Could switch to absurd-sql/offline-first pattern if it grows.
- `TEXTAREA` + `INPUT` swap when opening each note; caret restoration is automatic per element but re-rendering during typing only re-renders the list, not the editor (prevents caret loss).
- sql.js WASM is ~1.2 MB. First load isn't instant — boot overlay handles this gracefully with a clear spinner.
- LIKE search is not FTS — case-insensitive only for ASCII (SQLite `LIKE` default). Good enough for a notebook; could upgrade to FTS5 if sql.js build includes it (standard build does).
- Import rejects a .db without a `notes` table for safety. Acceptable trade-off; advanced users can still drag their own schema.

## todos
- FTS5 virtual table for proper full-text search with ranking
- Tags system (notes_tags join table) with tag filter chips
- Raw SQL console (read-only SELECT) for power users
- Markdown preview mode toggle
- Word count / char count / read time on active note
- Cloud sync option (opt-in) that pushes the bytes to a user-owned storage bucket
- Multiple databases / notebooks (switcher)
- Dark mode toggle (parchment ↔ terminal)
- Auto-title from first line if title is empty
