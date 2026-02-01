# Sloppy Collab

Standalone real-time co-authoring text editor with live cursors and shared document state.

## log
- 2026-02-01: Initial creation
  - Create and browse public documents
  - Real-time content sync via Supabase broadcast channels (throttled 100ms)
  - Live remote cursor tracking: colored carets with username labels, position from line/col
  - Presence tracking: colored avatar dots showing active editors
  - Auto-save to database (debounced 1.5s, owner-persisted)
  - Save state indicator (saved/saving/unsaved)
  - Title editing (owner only) synced in real-time
  - Share link with ?doc=ID parameter for deep linking
  - Delete document (owner only)
  - Status bar: char count, line count, cursor position, active editor count
  - Tab key inserts 2 spaces
  - Smart cursor preservation on remote content updates
  - Self-exclusion on broadcasts ({ self: false })
  - Max content: 50,000 characters
  - New table: sloppygram_collab_documents (title, content, created_by, last_edited, is_public)
  - Space Grotesk + Source Code Pro typography
  - Indigo/green/dark code-editor aesthetic
  - Mobile responsive: full-screen sidebar with back button
  - Addresses Phase 2 Goal #3: Real-time co-authoring for manifestos

## data sources
- sloppygram_collab_documents (persistent document storage)
- sloppygram_profiles (username/avatar lookup)

## real-time architecture
- Broadcast channel per document: 'collab-doc-{id}'
- Events: content (full text + cursor), cursor (position), title (text)
- Presence: .track() with username + color
- Content broadcast throttled to 100ms to prevent flooding
- Remote cursors rendered at approximate positions using line/col + monospace math
- Cursor layer re-renders every 200ms to track scroll position
- Non-owners can edit live (via broadcast) but only owner persists to DB

## issues
- None yet
- Note: concurrent editing uses last-write-wins, not OT/CRDT — acceptable for small groups

## todos
- Could add operational transform or CRDT for conflict-free concurrent editing
- Could add version history / undo across saves
- Could add markdown preview pane
- Could add export to manifesto (publish to sloppygram_manifestos)
- Could add per-user edit permissions (invite-only documents)
- Could add syntax highlighting for markdown
- Could add commenting system (inline annotations)
- Could add word count and reading time in status bar
