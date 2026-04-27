# hello-forth

## log
- 2026-04-27: Created. **Minimal Forth hello-world** with **stack visualization**. Source: `: greet ." Hello, world!" cr ; greet`. **2-column layout** (collapses ≤680px): trace panel (left, larger) lists each token as it runs with one-line description coloured by kind (def/word/str/call); data stack panel (right) renders frames bottom-to-top with `↑ TOP` marker, push animation on each frame appearing. Frames pop on `;` and `"`. **Run/Step/Reset** controls. Stdout panel renders accumulated output in big amber phosphor with the Forth-canonical ` ok` suffix in green. Trace step interval = 620ms. **Aesthetic**: warm amber `#ffb340` palette over near-black `#0a0703`, Major Mono Display brand "hello,·forth" with amber glow, VT323 throughout, IM Fell English serif italic for descriptions/tagline, scanline overlay. Footer creed: "the compiler fits on a postcard. the language fills a lifetime." Pollinations OG.

## issues
- **Stack model is illustrative not strictly Forth-accurate**. Real Forth's `."` reads ahead until `"` at compile time and the string is embedded in the compiled definition, not pushed on the data stack. This demo pushes a `"…"` placeholder for visualization. The trace + stack are designed to teach intuition for the postfix/stack-based execution model rather than be a Forth interpreter.
