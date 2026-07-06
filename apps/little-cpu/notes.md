# Little CPU — notes

## log
- 2026-07-06: v1 — 8-bit processor simulator, single HTML (chat ask: registers, memory lines, ALU w/ basic ops, step-by-step). **Machine**: 64B memory, ACC/PC/IR + Z/N/C flags, 16-opcode ISA (NOP LDA STA LDI ADD SUB AND OR XOR SHL SHR JMP JZ JNZ OUT HLT), variable-length encoding (1B no-arg, 2B w/ operand). **Micro-stepping**: STEP = one PHASE (fetch → decode → execute) w/ lit phase pills, per-phase narration line ("FETCH: read opcode 01 (LDA) from mem[00] into IR…"), register flash on writes, PC-highlight + touched-cell highlight in the memory pane (hex + LIVE DISASSEMBLY per cell); FULL INSTR runs to phase 0; RUN at 1–30 Hz slider; RESET keeps memory. **ALU**: SVG trapezoid — A/B operands, op symbol, result, green edge-flash on use; carries/borrows set C, Z/N from result. **Assembler**: labels (X:), $hex or decimal, DB data, comments (;), 2-pass w/ per-line errors ("line 1: unknown op FOO"); ASSEMBLE ▸ MEM loads image + resets. **Demos** (dropdown, auto-assembled): count 1→5, fibonacci (halts when next term would pass 233 via SUB LIM + JZ), 6×7=42 by repeated addition. **Verified in-browser**: count prints 1,2,3,4,5; fib prints 1,1,2,3,5,8,13,21,34,55,89; mult prints 42; narration + DECODE pill after one step; assembler error path; zero page errors. PCB aesthetic: Michroma + IBM Plex Mono, silicon-green glow + copper silkscreen.

- 2026-07-06: v1.1 — DIV + divide-by-zero panic (chat asked 3×): DIV a = ACC ÷ mem[a] floor-div via the ALU; divisor 00 → **ALU PANIC**: err=1, machine faults mid-EXECUTE (halted, RUN stops), ALU trapezoid flashes red w/ '÷0!!' + operands, new ERR register chip pulses red (steps(2) animation, reduced-motion → static red), narration '⚠ ALU PANIC: DIVIDE BY ZERO… RESET to forgive it.' RESET clears err/panic classes. Demo 'divide by zero 💥' in the menu (12÷4=3 OUT first, then ÷0). disasm now guards on known-op (not op<16). Verified: panic state + flags + reset-clear + count demo regression, zero errors.

## issues
- Fib demo stops BEFORE printing 144/233 (its own JZ logic when A+B==233) — correct per program, just noting the sequence ends at 89.
- OUT prints decimal in the console but registers show hex — intentional (console = human, chips = machine).

- 2026-07-06: v1.2 — "add two numbers" demo (chat ask): LDA 25 → ADD 17 → STA RESULT → OUT → HLT, heavily commented, now the DEFAULT program (cleanest on-ramp). Verified: OUT 42, RESULT byte 0A holds 2A.
- Linear disassembler shows data bytes as bogus instructions (DB 12 renders as 'JZ 04' etc.) — classic von Neumann ambiguity, arguably a feature.

## todos
- Chat may want: breakpoints (click a memory cell), more registers (X + indexed addressing), stack + CALL/RET, save/share programs via URL hash or Supabase.
