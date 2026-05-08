# prime-pulse

## log
- 2026-05-08: shipped — Miller-Rabin primality visualizer with witness-by-witness step animation (chat ask: "build an app called prime-pulse that uses the Miller-Rabin algorithm to test massive numbers, and include a step-by-step visualizer for each witness check"). Native JS BigInt all the way — no library dependency. Verified on Mersenne primes M61 (`2305843009213693951`) and M127 (`170141183460469231731687303715884105727`), and the composite M61+2.
  - **Algorithm**: write `n−1 = 2^r · d` (d odd) via `decompose(n-1)`. For each witness a in [2, n−2]:
    1. compute `x = a^d mod n` via square-and-multiply (`powMod`) — both BigInt operations, O(log d) iterations × O(log² n) per multiply.
    2. if `x == 1` or `x == n−1` → **probably prime** for this round.
    3. otherwise repeat r−1 times: `x = x² mod n`. If `x == n−1` → probably prime; if `x == 1` → composite (non-trivial sqrt of 1).
    4. If we never hit n−1 across all squarings → composite.
  - **Witness selection** (chat asked for "step-by-step visualizer for each witness check"): three modes via dropdown.
    1. **auto** (default): if `n < 3,317,044,064,679,887,385,961,981` (OEIS A014233 threshold), use the deterministic small-prime set `{2,3,5,7,11,13,17,19,23,29,31,37}`. This is provably correct — primes pass, composites fail with one of those witnesses. For n above the threshold, fall back to k random witnesses.
    2. **primes** force the small-prime set regardless.
    3. **random** k rounds (k slider 1-40), uses `crypto.getRandomValues` to roll uniformly distributed witnesses in [2, n−2].
  - **Step generator**: `runWitness(n, a, idx)` is a generator. Each `yield` emits a `{step}` payload that the animation loop appends to the log:
    - `init` step: shows `a`, `d`, computed `x₀ = a^d mod n` with formatted BigInt value.
    - `square` steps: each squaring `x_{i+1} = x_i² mod n` rendered with subscripted variable names + intermediate value.
    - `pass` step: probably-prime round verdict with reasoning ("hit n−1" or "x₀ ∈ {1, n−1}").
    - `fail` / `fail-sqrt` step: composite verdict with reasoning (non-trivial sqrt or never hitting n−1).
  - **Animation loop**: async/await with `setTimeout`-based delay (slider 0–800ms per step). Pause/Resume toggle, single-step button (advances generator one yield), reset wipes state and re-renders meta.
  - **Witness wheel**: horizontal flex of `.witness` chips, one per planned witness. Each chip shows the witness value (truncated for huge random numbers) + a status badge that animates idle → running (cyan glow + pulsing border) → pass (acid green) or fail (crimson). Long random witnesses have a `huge` class that switches to a smaller wrapping font so they fit within their 4rem chip.
  - **Step log**: scrollable max-22rem area below the witness wheel. Each step has a kind-prefix badge (init/square/pass/fail) in Press Start 2P micro-caps, then the equation body with semantic syntax-coloring: `<span class="var">` cyan for variables (a, x₀, x₁), `<span class="op">` violet for operators (=, mod), `<span class="num">` gold for BigInt values, italic Cormorant Garamond for the human annotation line. The currently-active step gets a soft cyan background.
  - **Big-number formatting**: `formatBig(n)` returns the full decimal string if ≤60 chars; otherwise truncates to "first 26 chars … last 26 chars (N digits)" so the equation log stays readable on 1024-bit numbers without horizontal scrolling.
  - **Meta panel**: shows N (formatted), digit count, r (powers of 2 in n−1), and d (odd part of n−1). Updates live as the user types in the textarea (200ms debounce).
  - **Generators** (chat: "test massive numbers"): one-click random N-digit candidates at 16 / 32 / 64 / 128 / 256 digits. Uses `crypto.getRandomValues` over `ceil(bits/8)` bytes, masks excess top bits, rejection-samples until in range, forces oddness. Plus a "next probable prime" button that increments the current N by 2 until the small-prime witness set passes (capped at 250 attempts).
  - **Edge cases**: n<2 → not prime; n=2 or n=3 → trivial prime; n even → composite (no MR pageantry); n<10⁶ → trial division shortcut (verifies the answer cheaply without animating MR).
  - **Verdict banner**: glowing acid-green "PROBABLY PRIME" with error-bound annotation ("error probability < 1/4^k") OR crimson "COMPOSITE" with the catching witness pinned. Animated entry, `aria-live="polite"`.
  - **Aesthetic**: deep purple radial bg → black, Audiowide title "prime · pulse" with cyan dot + magenta italic Cormorant Garamond accent on `pulse`, JetBrains Mono everywhere for math, italic Cormorant Garamond for annotations, Press Start 2P for tiny labels. Equation rendering uses semantic span coloring (cyan vars, violet ops, gold values).
  - **Accessibility**: rem units, semantic `<main>`/`<header>`/`<section>`, `<label>`-d controls, descriptive `aria-label`s, `role="log" aria-live="polite"` on the step log, `aria-pressed` on pause toggle, `:focus-visible` outlines, 2.75rem (44px) min interactive targets. `prefers-reduced-motion` removes toast + witness chip transitions and disables smooth-scroll on the step log.
  - **Boot**: pre-loads M61 (`2305843009213693951`) so chat lands on a verified prime to play with.

## issues
- For very-large random numbers (256+ digits) `powMod` can take noticeable time per witness — well within ms on modern hardware but the UI freezes briefly during compute. Could push compute into a Web Worker for true background processing.
- "Random" witness mode never picks a witness > the smallest 13-prime by default (from the small-prime set). It's actually random in [2, n−2]. UI label could clarify the distinction.
- The "next probable prime" search uses only the deterministic-set witnesses with no UI feedback during the 250-iteration sweep. For very large seeds this can be a few seconds. Could add a progress bar.
- Witness wheel is flat horizontal — for 12+ witnesses it wraps fine but doesn't visually convey "wheel". Could be a literal SVG circle for ≤12 witnesses, fall back to grid for more.

## todos
- Web Worker for compute so the UI never freezes on 1024-bit inputs.
- Plot the chain of x_i values as a heat-strip: gold dots per squaring, glowing differently when they hit 1 / n−1.
- Toggle to display values in different bases (binary / hex) — interesting for cryptography-flavored demos.
- Shareable URL (?n=…&mode=…) so chat can paste an interesting number for everyone to inspect.
- "Adversarial input" preset: known Carmichael numbers (561, 41041, 825265, …) to demonstrate why Miller-Rabin beats Fermat.
- Side-by-side mode: run two algorithms (Fermat vs MR) on the same n to show MR's strictness.

## design-notes
- The step generator yields each operation *individually* (one yield per init / per squaring / per verdict) so the animation loop can interleave delay between them. This is way nicer than a synchronous `runWitness` that returns the whole list — generator semantics map perfectly onto a "play / step / pause" UX.
- The deterministic witness threshold (3.317 × 10²⁴) was chosen so that for "small" numbers (anything within reach of casual exploration) the visualizer is *guaranteed* to give a correct answer. For genuinely cryptographic-scale numbers we fall back to probabilistic with k rounds + `1/4^k` error bound.
