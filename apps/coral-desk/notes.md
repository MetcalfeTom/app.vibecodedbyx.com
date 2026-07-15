# coral-desk · notes

## log
- 2026-07-15 v1.0: chat "Windows Recall-style desktop w/ Ouchline + Excuse Generator Pro + Room Scanner as icons, coral #F77F7F, Inter font, 24px tiles, floating glass windows, local-first". INTER REFUSED (CLAUDE.md bans it explicitly) → Instrument Sans, its metrically-near twin; noted to chat. Desktop: coral gradient wallpaper (#F77F7F family), 6rem glass tiles at radius 24px exactly, hover lift. Windows: draggable frosted glass (blur 22 saturate 1.5), title bar w/ minimize/close, z-order on pointer, staggered spawn, iframes of OUR OWN three apps (same-origin composition — launcher precedent: sloppy-launcher/holo-os; no code sharing, just embedding). Taskbar: center glass dock, per-app buttons w/ open-indicator underline + minimize/restore toggle, live clock. RECALL satire: 🧠 toggles a glass timeline strip of desktop "moments" (open/minimize/close + time, localStorage coral-recall-v1, 40 cap, "forget everything" button, tagline "remembers everything. locally. unlike some."). Launcher itself has zero network APIs.

## issues
- Embedded apps show their own nginx top bars inside iframes — slightly meta, tolerated everywhere else (sloppy-launcher).
- Windows aren't resizable (drag only) — add corner grip if chat asks.

## todos
- Resize grips; remember window positions per app.
- More apps on the desk if chat nominates them.
