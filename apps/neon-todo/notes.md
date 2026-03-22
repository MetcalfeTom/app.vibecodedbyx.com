# Neon Todo

Sleek neon-themed task list with localStorage persistence.

## log
- 2026-03-22: Initial build. Add/complete/delete tasks, all/active/done filters, clear completed, task count. Slide-in animations, fade-out on delete. localStorage persistence. Lexend Deca + IBM Plex Mono typography, dark neon aesthetic with cyan/pink accents.

## issues
- None yet

## todos
- Drag to reorder
- Due dates
- Categories/tags

## notes
- No database — pure frontend, localStorage only
- Key: neon-todo-v1
- Tasks stored as [{id, text, done, created}]
- XSS-safe: escHtml on all user text
- Mobile-friendly: delete button always visible on small screens
