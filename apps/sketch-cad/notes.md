# SketchCAD

Parametric 2D sketcher with feature history, inspired by Onshape.

## log
- 2026-03-17: Initial build. Canvas-based 2D CAD sketcher. Tools: select, line, rectangle, circle, arc (3-click: center, radius, sweep angle). Grid with major/minor lines, configurable snap (10 units). Pan (alt+drag or drag empty space), zoom (scroll wheel), pinch-zoom on mobile. Feature history sidebar with type icons and dimension summaries. Properties panel with editable numeric fields for all parameters. Parametric dimensions: editing length/width/height/radius rescales geometry. Inline dimension labels on all features. Dimension editor overlay (D tool or double-click history item). Hit testing for selection with handle-based editing (line endpoints, rect corners, circle/arc centers). Drag to move features or resize via handles. Undo/redo stack. Delete with Delete/Backspace. SVG export. Keyboard shortcuts: V=select, L=line, R=rect, C=circle, A=arc, D=dimension, Ctrl+Z/Y undo/redo. Touch support with pinch-zoom. IBM Plex Sans + IBM Plex Mono typography, dark IDE-style aesthetic with blue accent.

- 2026-03-17: Added trim tool and geometric constraints. Trim: click on a line near intersections to remove the clicked segment, keeping the rest. Finds line-line and line-circle intersections, splits at all intersection t-parameters, removes segment under cursor. Visual preview: hovered line highlights orange, intersection dots shown. Constraints: Horizontal (H), Vertical (V) for single lines; Perpendicular, Parallel for line pairs. Two-step picking for pair constraints. Constraint indicators drawn on canvas (H/V labels, dashed connector lines with symbols). Constraints sidebar section with delete buttons. Constraints re-applied after drag. Keyboard: T=trim, H=horiz.

## issues
- None yet

## todos
- Constraint solver for over/under-constrained detection
- Mirror/pattern tools
- Fillet/chamfer on rectangle corners
- Construction lines (reference geometry)
- Snap to endpoints/midpoints of other features
- Layer system
- DXF export

## notes
- No database — pure frontend
- Canvas with camera transform (pan/zoom)
- All geometry stored in world coordinates
- Feature IDs are monotonically increasing
- Undo stack stores action type + before/after state
- Dimensions are auto-calculated from geometry (recalcDims)
- Parametric edits: changing a dimension modifies the underlying geometry
