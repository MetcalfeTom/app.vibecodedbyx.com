# Tiny-C Lab

## log
- 2026-08-06 v1.0: new app per chat ("browser C compiler sandbox, Emscripten/TinyCC WASM"). **DECISION: did NOT pull a prebuilt TinyCC/clang WASM blob** — multi-MB unverifiable binary from an untrusted host violates the never-download-untrusted-libraries rule, and can't be tested in-sandbox. Instead wrote a **from-scratch C-subset interpreter in JS** (fully client-side, zero downloads, testable). UI is honest it's an interpreter, not GCC.
  - **Interpreter** (cc-core.js in scratchpad, embedded inline in index.html): preprocess (strip #include, apply `#define NAME literal` via token substitution) → lexer (ints/hex/floats/char/string w/ escapes, // and /* */ comments) → Pratt parser (10 binary precedence levels, ternary, assignment ops, pre/post ++/--, unary, call, index, cast, sizeof→4) → tree-walk evaluator. Values TAGGED `{v, f:isFloat}` so `7/2==3` but `7.0/2==3.5` and printf %d/%f behave. Scopes: global + per-call frame + block scopes (C semantics: functions see only globals). Control flow via RET/BRK/CONT signal objects. OP_CAP 8M ops → "infinite loop?" error. Output cap 200k.
  - **Supports**: int/char/float/double/long/void, functions + recursion, 1-D arrays + `{...}` init, if/else/while/for/do-while/break/continue/return, full operator set, printf (flags/width/.prec/length-mods, %d%i%u%c%s%f%e%g%x%X%o%p%%), putchar/puts, math.h (sqrt/sin/pow/floor/…), atoi/strlen/rand(unseeded). String literals as `{str}`, indexable.
  - **NOT supported** (documented for honesty): structs (parsed-ish, not usable), real pointers (& and * are identity/no-op minimal), scanf/stdin, multi-dim arrays, malloc, function pointers, typedef, switch. Add incrementally if chat asks.
  - **UI**: split editor/terminal (stacks on mobile), 6 examples (hello/fib/fizzbuzz/sieve/bubble/printf-art), Ctrl+Enter runs, Tab=4sp, `$ cc main.c && ./a.out` prompt, exit code + ms timing, compile errors with line numbers. JetBrains Mono + Space Grotesk.
  - **Tests**: cc-test.js — 36 checks (arith/float-div/printf-formatting/loops/recursion/arrays/bubble-sort/fizzbuzz/bitwise/ternary/define/scoping + error paths: no-main, div-zero, undef-var, infinite-loop, syntax). Embedded-core test re-runs a subset against the SHIPPED html (guards injection corruption). **BUGS caught**: (1) coerce() stripped `.str` off char* pointers; (2) declVars evaluated initializers with a single-scope env so `int t=a[0]` couldn't see the outer array — real scope bug, now uses full chain, regression-tested.

## issues
- Interpreter runs on the main thread with an 8M-op cap (no worker). A pathological program hits the cap in ~1-2s rather than hanging. If chat writes heavier loops, consider a Web Worker + kill timer (spiral-ide pattern) — but that complicates the inline-core testing story.
- printf %g is approximate; long double / %a not supported.

## todos
- switch/case; scanf via a stdin textarea; basic struct member access; 2-D arrays.
- Syntax highlighting overlay (keep textarea as source of truth).
- If a TRUSTED, verifiable tcc.wasm on jsdelivr/cdnjs ever appears, offer it as an opt-in "real compiler" mode behind a toggle.
