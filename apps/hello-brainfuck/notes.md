# hello-brainfuck

## log
- 2026-04-27: Created. **Working Brainfuck interpreter** stepping through the canonical hello-world program `++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.`. **Live tape visualization**: 24-cell horizontal grid, each cell shows index + byte value (0–255) + ASCII character (or `·` for control bytes / `\\n` for 10). Active cell glows phosphor green with shadow + inset glow. Program text shows current PC (green highlight on the next op) and "done" (dim) for executed ops. **Bracket map** precomputed for O(1) jumps. **Run/Step/Reset** + speed slider (1–200, runs `speed/8` steps per frame with `220-speed` ms delay → buttery smooth from one-byte-at-a-time to near-instant). Stats show steps / output chars / state (idle/running/paused/done). Stdout panel renders accumulated output in big phosphor green with blinking `_` cursor + scanline overlay. **Aesthetic**: VT323 throughout, deep `#03080a` bg with green `#5fff8c` glow, amber accents on the brand and ASCII char hints. Newsreader italic footer creed: "simple grammar. cruel composition." Pollinations OG. Mobile @520px shrinks cells to 42×50px.

## issues
- **Wrap-around tape**: ptr wraps modulo 24 (not the standard 30K) for visualization. Hello-world only uses cells 0–6 so this doesn't affect correctness.
- **No input**: `,` is a no-op. The hello-world program doesn't use it.
- **Cell width = 8 bits unsigned** (Uint8Array). Wraps on overflow/underflow per spec.
