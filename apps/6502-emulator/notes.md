# 6502 Emulator

## log
- 2026-01-05: Initial creation - full 6502 CPU emulator with visual memory map

## features
- Full 6502 CPU emulation with all major opcodes
- Live register tracking (A, X, Y, SP, PC)
- Status flag display (N, V, B, D, I, Z, C)
- Visual 64KB memory map with hex dump
- Built-in assembler with label support
- Step-through execution
- Run mode with variable speed
- Stack visualization
- Example programs included
- PC highlighting in memory view
- Changed memory highlighting

## supported opcodes
- Load/Store: LDA, LDX, LDY, STA, STX, STY
- Transfer: TAX, TAY, TXA, TYA, TSX, TXS
- Stack: PHA, PHP, PLA, PLP
- Arithmetic: ADC, SBC
- Logic: AND, ORA, EOR
- Shift: ASL, LSR, ROL, ROR
- Compare: CMP, CPX, CPY
- Inc/Dec: INC, DEC, INX, INY, DEX, DEY
- Branch: BPL, BMI, BVC, BVS, BCC, BCS, BNE, BEQ
- Jump: JMP, JSR, RTS, RTI
- Flags: CLC, SEC, CLI, SEI, CLV, CLD, SED
- Other: BIT, NOP, BRK

## addressing modes
- Immediate: #$nn
- Zero Page: $nn
- Zero Page,X: $nn,X
- Zero Page,Y: $nn,Y
- Absolute: $nnnn
- Absolute,X: $nnnn,X
- Absolute,Y: $nnnn,Y
- Indirect: ($nnnn)
- Indexed Indirect: ($nn,X)
- Indirect Indexed: ($nn),Y
- Relative: label (for branches)

## design
- JetBrains Mono + Space Grotesk fonts
- Dark theme with purple accents
- Three-panel layout (code, memory, registers)
- Real-time updates during execution

## example programs
- Counter Loop: Simple X register counting
- Fibonacci: Generate Fibonacci sequence
- Multiply: Multiply two numbers
- Flag Demo: Demonstrate status flags

## technical
- Pure JavaScript CPU emulation
- Two-pass assembler with label resolution
- 64KB addressable memory
- Cycle counting
- Memory change tracking

## issues
- None yet

## todos
- Add CRT/scanline visual effects
- Add disassembler view
- Add breakpoints
- Add memory watch points
- Add I/O memory mapping
- Add sound output via memory-mapped I/O
