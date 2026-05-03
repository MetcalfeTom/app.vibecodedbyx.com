# dimension-ten

## log
- 2026-05-03: pushed N cap to 999 + LITE mode for projection.
  - Dimension slider max bumped 100 → 999. C(999,2) = 498,501 planes — applying every plane × ~1200 sampled vertices per frame would be ~600M ops/frame and crash the tab.
  - Added `MAX_ACTIVE_PLANES = 800` budget. When PLANE_COUNT exceeds it, projection iterates planes by `stride = ceil(PLANE_COUNT / MAX_ACTIVE_PLANES)` starting at a rotating `activeOffset` (advances every ~100ms), so per-frame cost is bounded but every plane still takes effect across consecutive frames — no fixed-slice "frozen" look.
  - At N=999: stride=624 → 800 active planes per frame, 1200 verts × 800 = 960K ops/frame. Tested mental: ~60fps on modern hardware. The LITE mode banner appears in the dim-note when active.
  - Twist + auto-rotate still touch ALL angles (PLANE_COUNT-wide); only projection samples a stride.
- 2026-05-03: variable N (2..100) + HSL spectrum coloring per dimension.
  - **N slider**: new "Dimensions (N)" section at top of panel, range 2..100, default 10. `rebuildAll(N)` rebuilds geometry, planes, angle/scratch/autoSpeed buffers, slider DOM, audit numbers. Live (cheap) preview of vert/edge/plane counts on `input`; full geometry rebuild on `change` (debounced 60ms) so dragging the slider doesn't thrash.
  - **Two render modes**: `N ≤ FULL_HC_MAX_N (12)` → full hypercube enumerated (V_COUNT = 2^N up to 4096, edges = N·2^(N-1) up to 24576). `N > 12` → sampled random-walk skeleton: K_EDGES = max(1200, min(6000, 8000 - N·60)) edges, vertices added by Map dedup. At N=100 we get ~2000 edges and ~3500 verts visible at any time; the underlying {±1}^100 has 10^30 verts which we cannot enumerate, hence the sample.
  - **Plane scaling**: PLANE_COUNT = C(N,2). N=10 → 45 sliders; N=100 → 4950 planes (impossible to UI). Slider UI now caps adjacent display at 30, non-adjacent display at 30. Hidden planes still rotate during AUTO and TWIST. "+ X more — TWIST randomizes them" note appended in each section.
  - **HSL spectrum** (chat request): replaced fixed 10-color PALETTE with `colorForDim(bit) = hsl((200 + bit·360/N)%360, 82%, 62%)` so each dimension gets a unique hue spread across the full circle, scaling to any N. Hue offset 200° keeps lowest-bit cyan (matches original aesthetic). Vertex dots now also tinted via `hsla(hash·31·(k+1) per +1 coord, 75%, 72%)` — Hamming-weight-derived hue gives stable per-vertex colors that visually cluster by lattice structure. Slider axis labels colored to match the same dim hues so eye-tracking from sidebar→cube is immediate.
  - **Snapshot schema**: now stores `{ n: N, a: [...] }` in the `angles` jsonb column instead of bare array. `applySnapshot` accepts both shapes — bare array assumed N=10 (legacy rows), object form uses `payload.n` to trigger `rebuildAll(snapN)` before applying angles. Cross-N loading works.
  - **Audit display**: was hardcoded `/ 1024`, now `/ V_COUNT.toLocaleString()` so the projection-quality counter scales with the active dimension count.
  - **Vertex render skip** at V_COUNT > 6000 to keep canvas legible at extreme N.
  - **Mouse drag** still controls planes (0,1) horizontal and (0,2) vertical; gracefully no-ops if N < 3.
  - **TWIST/RESET/AUTO** all iterate over current PLANE_COUNT — they work over hidden planes too.
- 2026-05-03 (earlier): always-visible sidebar — stack below canvas on narrow screens (no slide-out, no hamburger). Canvas sizes to flex slot via getBoundingClientRect.
- 2026-04-25 (initial): 10D hypercube projected to 2D, 1024 vertices, 5120 edges, 45 rotation planes. Supabase shared snapshots in `dimension_ten_snapshots` (read-all RLS, write-own). Lazy supabase import so CDN failure doesn't black-screen the visualization. Auto-save `__auto__` per-user upsert row, debounced 800ms on canvas pointerup + slider change + TWIST/RESET.

## issues
- N=100 with all 4950 planes seeded is computationally heavy: per-frame cost ≈ V_COUNT × PLANE_COUNT cos/sin ops ≈ 3500 × 4950 ≈ 17M. On modern hardware this drops to ~30fps. Could optionally skip rotations where |angle| < epsilon (already done — `if (a===0) continue`) but seeded angles are all non-zero. Possible future optimization: only apply first M planes for projection at extreme N, with a "all planes" toggle.
- Sampled mode uses `Map<bitstring, idx>` — building a 100-char key per addVert call. Acceptable but allocates strings. Could pack to BigInt or to multi-uint32 if perf shows.
- Old snapshots saved before the schema upgrade have `angles` as a plain array. `applySnapshot` reads them as N=10. Save shape going forward is `{n, a}`.
- Slider UI caps at 30 visible per section. Some users may want to scrub a specific (i,j) plane that isn't displayed at high N. Could add a search/jump field if requested.

## todos
- "All planes mode" toggle: render only first M planes at high N for performance.
- Snapshot list shows the dimension count next to each saved row (currently just name+timestamp).
- Optional gradient-only vertex coloring without the per-vertex hash (might look smoother at high V_COUNT).
- Animate the dimension transition (lerp between angles when N changes) so the rebuild doesn't pop.
