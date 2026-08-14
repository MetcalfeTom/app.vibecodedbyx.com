# hopcroft-karp (Matchmaker — Hopcroft–Karp, visibly)

## log
- 2026-08-14: v1 per chat ("visible Hopcroft–Karp visualizer: bipartite graph editing, BFS layers, augmenting paths, step controls, autoplay, reset, matching statistics"). Single file, Kalam chalk + IBM Plex Sans, chalkboard-in-wooden-frame.
  - **The real algorithm, instrumented**: honest HK (layered BFS from free left vertices → vertex-disjoint shortest-path DFS per phase) emitting an EVENT LOG — start / bfs (layers, dist, free set, found) / augment (source, path edges, dfs trail) / stuck (dead-end trails) / phase-end (paths count) / done — with a FULL MATCHING SNAPSHOT attached to every event, so replay is index-addressed and step-BACK is exact, not reversed-op approximate.
  - **Editing**: click uₖ then vⱼ toggles an edge; click an edge to erase; ±left/±right nodes (1..8 each, edges clamped); classic-demo + random presets; clear edges. Any edit invalidates the run (max becomes '?', run lazily recomputed).
  - **Viz vocabulary**: matched edges gold-thick; BFS events tint left nodes by layer (4 depth shades) + cyan layered edges + chalk L0/L1… set-notation labels; augmenting paths march in green dashes with on-path nodes tinted; dfs dead-ends show pink probe edges; free vertices dashed green rings.
  - **Controls**: reset / back / step / autoplay (speed slider 120–1400ms, stops at end) / to-the-end; Kalam narration per event ("by Berge's lemma, the matching is maximum"); stats grid (|M| / maximum / phase / free left), per-phase log ("phase 1: 3 augmenting paths → |M| = 3"), König's theorem line at done.
  - **Verified 25/25**, the crown being CORRECTNESS: HK's final size equals a reference Kuhn's algorithm implemented independently in the probe across 40 random graphs (≤7×7, p=.4). Plus: event invariants (size monotone, augment = exactly +1), classic demo reaches its perfect matching of 4, step-back determinism (SVG at index k identical on re-visit), stats/König/phase-log at end, matched/layer/aug-path render classes, edge toggle via node clicks + invalidation + toggle-off, node add/del, autoplay advances + jump-end stops it, reset, keyboard node activation (Enter).

## issues
- Trail highlighting caps at 40 dfs edges per event (dense-graph noise control) — fine at n≤8.
- Layout is two fixed columns; 8×8 dense graphs get visually busy (that's bipartite life).

## todos
- Hover an edge → tooltip "in layered graph? matched? tried this phase?".
- Export the run as an animated series (product-vault doc style).
- Min-vertex-cover overlay at done (König constructively, from the BFS reachability).
