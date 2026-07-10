# Crumbless — notes

## log
- 2026-07-10: v1. Built from public chat request: "to-do app with local storage persistence, a clean dark theme, and zero crumb-related dependencies." Single-file, zero deps. localStorage key `crumbless-v1`. Add / toggle / delete / filter (all·active·done) / "🧹 sweep done tasks" (staggered slide-out clear-completed). Dark ink theme (#0e0f12) with lime accent (#b8e34f), Newsreader italic display + Spline Sans Mono body. Footer runs the crumb joke ("crumb-related dependencies: 0"). WCAG basics: aria-pressed checks/filters, aria-live count, focus-visible, 44px targets, prefers-reduced-motion, rem sizing.

## issues
- None yet. localStorage save wrapped in try/catch (quota → status message).

## todos
- Inline edit (double-click / long-press a task label)
- Drag reorder
- Optional due dates — keep minimal unless chat asks
