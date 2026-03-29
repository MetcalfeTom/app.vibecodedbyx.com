# Logic Gate Simulator

## log
- 2026-03-29: V1 — Interactive logic gate simulator. 7 gate types (AND, OR, NOT, NAND, NOR, XOR, XNOR) plus INPUT/OUTPUT nodes. Canvas-based rendering with neon glow effects. Drag gates from toolbar, wire outputs to inputs with bezier curves, animated signal pulses on active wires. Click INPUT to toggle 0/1. Right-click to delete. Auto-generated truth table for all input/output combinations. Subtle grid background. Touch support. Orbitron + Fira Code typography, green neon on dark aesthetic.

## features
- 7 logic gate types + INPUT/OUTPUT nodes
- Click toolbar to select, click canvas to place
- Drag gates to reposition
- Wire from output port to input port (bezier curves)
- Animated signal pulses on active (high) wires
- Neon glow on active gates and wires
- Click INPUT nodes to toggle 0/1
- Right-click any gate to delete (removes connected wires)
- Auto-generated truth table (all input combinations)
- Truth table panel toggleable
- Subtle grid background
- Touch support for mobile

## issues
- None currently

## todos
- Undo/redo support
- Save/load circuits to localStorage
- More gate types (buffer, tri-state)
- Wire deletion by clicking
- Gate labels/naming
- Preset circuits (half adder, full adder, SR latch)

## notes
- Propagation: iterative (max 20 passes) — handles feedback loops by converging
- Truth table: temporarily sets all input combos, evaluates, restores original state
- Wiring: one wire per input port (new wire replaces old)
- Max 8 inputs for truth table (256 rows), shows warning beyond that
