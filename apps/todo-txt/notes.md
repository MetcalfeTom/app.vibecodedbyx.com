# Todo

## log
- 2026-03-29: V1 — Clean minimal todo list. Add items via text input, check/uncheck, delete on hover. Filter by all/active/done. Clear done button. Item count with remaining/done stats. Saves to localStorage. Shows current day and date. Literata serif + JetBrains Mono typography, warm cream/white aesthetic — intentionally non-neon.

## features
- Add todos via text input (Enter or add button)
- Check/uncheck with circular checkbox
- Delete button appears on hover
- Filter: all / active / done
- Clear done button
- Remaining and done count
- Saves to localStorage
- Current date display
- New items added to top

## issues
- None currently

## todos
- Drag to reorder
- Edit inline on double-click
- Due dates
- Categories/tags

## notes
- localStorage key: todo_txt_items
- Items stored as array of {id, text, done}
- ID is Date.now() timestamp
- Intentionally light/cream aesthetic as contrast to neon apps
