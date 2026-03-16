# Solitaire

Classic Klondike Solitaire with green felt and drag-and-drop.

## log
- 2026-03-16: Initial build. Full Klondike Solitaire on canvas. Green felt radial gradient background with subtle dot texture. 52-card deck with 4 suits, proper card rendering (rank top-left/bottom-right, large center suit, shadow, rounded corners). Card backs: dark blue with dot pattern and inner border. 7 tableau columns with face-down stacking, 4 foundation piles, stock pile with draw-1, waste pile showing up to 3 cards fanned. Drag and drop: mouse and touch, pick up single or multi-card runs from tableau, drop on valid foundation or tableau targets. Click to auto-send to foundation, double-click also works. Stock click to draw, click empty stock to recycle waste (-100 points). Undo system (up to 50 states). Scoring: +10 foundation, +5 waste-to-tableau, +3 tableau-to-tableau, -15 foundation-to-tableau, -100 recycle. Move counter, timer, score display. Win detection when all 4 foundations have 13 cards. Win overlay with stats. Responsive card sizing. Crimson Pro + DM Mono typography.

## issues
- None yet

## todos
- Draw-3 mode option
- Auto-complete when all cards face up
- Card movement animation (lerp to target position)
- Win celebration particles
- Vegas scoring mode
- Statistics tracking in localStorage

## notes
- No database — pure frontend
- Cards: 72x100px base, scales down on narrow screens
- Tableau gap: 20px face-up, 12px face-down between stacked cards
- Foundation rules: same suit, ascending A→K
- Tableau rules: alternating color, descending K→A
- Empty tableau only accepts Kings
- Undo: saves full game state as JSON, max 50 deep
- Hit detection: checks waste → foundations → tableau (bottom-up for overlap) → stock
- Drop detection: foundations (single card only) → tableau columns with padding
