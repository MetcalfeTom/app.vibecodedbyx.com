# blueprint-vault · notes

## log
- 2026-05-19: v1.1 — **visual node-graph previewer for BP-pseudo snippets**. Chat: "add a visual node previewer for animation nodes to the blueprint-vault". When a snippet's code contains `[NodeName]` blocks (i.e. BP-pseudo format), each card now offers a `◇ text` / `◇ nodes` tab switcher. The Nodes view renders an SVG mock of the UE5 AnimGraph: rounded node boxes with type-tinted header bars (cyan for Pose, purple for Anim, teal for Blend/Layered, orange for IK/Bone, pink for State/Transition), top/bottom pose pins, and bezier wires with arrowheads between consecutive nodes.
  - **Parser** · `parseBPGraph(code)` walks lines: `[Name]` → start node; `key : value` (with optional leading tree glyphs `├└─`) → push prop on current node; flow glyphs `▼│├└─` only / comments / blank → skip. Verified against the seeds: Two Bone IK → 3 nodes [Input Pose(0), Two Bone IK(3), Output Pose(0)]; C++ snippets → 0 nodes so the tab toggle hides entirely.
  - **Renderer** · `renderNodeGraph(code)` lays nodes vertically (280px wide, ~28px header + 18px per prop row + 12px padding), 56px gap between. Inline SVG with `<defs>` of 5 linear gradients. Wires are cubic beziers with `~0.45 * Δy` control offset for a soft curve; arrowhead is a small triangle at the input pin. First node skips its input pin and last node skips its output pin so the chain terminates cleanly. Property key/value rows are JetBrains Mono 10px with key on the left (`#a8b4c4`) and value on the right amber (`#ffb84e` — UE5 default-value tint). Long keys/values truncate with `…` at 28/24 chars.
  - **Toggle UI** · two-button tab strip above the code block, `◇ text` (default) / `◇ nodes`. Active tab gets a cyan border + subtle fill. Per-card state — uses `data-view` attribute on the `.snippet-views` wrapper so the CSS visibility toggle is one selector.
  - **Container** · `.node-graph-view` scrolls if the graph is taller than 28rem (tall graphs with 5+ nodes), `image-rendering: pixelated`-style scrollbar styling. SVG centered horizontally so narrow nodes don't drift left.
- 2026-05-18: v1 — **Blueprint Vault** per chat ask "create a tool called Blueprint Vault for Unreal Engine animation nodes, where users can save and categorize code snippets". Self-contained ~40KB, localStorage persistence, zero deps.
  - **Layout** · header (brand + total-snippets pill + ＋ new button) on top, 19rem sidebar (search + categories + export/import) on left, masonry card grid (auto-fill minmax 28rem) on right. Mobile (≤880px) stacks sidebar over grid.
  - **9 categories**, each with its own accent colour: State Machines (orange), Blend Spaces (blue), Anim Notifies (amber), Bone Transforms (violet), IK (pink), Montages (cyan), Root Motion (green), Layered Blend (lavender), Curves (yellow). Active category sets a 3px left-border on each matching card and the sidebar entry.
  - **10 seeded snippets** covering every category — State Transition Rule, Footstep Notify, Two Bone IK, Layered Blend Per Bone, Play Montage with End Callback, Root Motion Checklist, Anim Notify State Hit Window, Read Animation Curve, BlendSpace 1D Speed Locomotion, Modify Bone Head Look-At. Half C++, half BP Pseudo (with `[Node]` brackets + `▼│├└` flow glyphs).
  - **CRUD** via a `<dialog>` modal with native browser backdrop · title, category, language (C++/BP Pseudo/Python/INI), tags (comma list), 2-line description, code textarea. Save/cancel buttons. Click backdrop or Esc to close.
  - **Inline syntax highlighter** · custom 60-line regex tokenizer. Stashes comments + strings on RAW source as single Private-Use-Area chars (0xE100..0xE1FF, non-word, not in HTML-escape set) BEFORE escaping the rest. That way the keyword/type/number passes only run on real code, never re-tokenise comment/string content, and `\b` boundaries don't accidentally match across placeholders. UE-specific keyword set includes UCLASS/UFUNCTION/UPROPERTY/GENERATED_BODY + 30+ types like FVector/UAnimInstance/UAnimMontage/USkeletalMeshComponent. Three smoke tests pass: comment with embedded number stays grey, string with embedded number stays green, free-standing numbers/keywords/types get coloured.
  - **Search** · 100ms debounced live filter across title + code + description + tags. `/` keyboard shortcut focuses it.
  - **Export/import** · JSON dump of the entire vault, plus a file-input importer that merges incoming snippets ahead of the existing ones (confirms count first).
  - **Copy** · clipboard API with a textarea+execCommand fallback for older browsers. Toast confirms.
  - **Keyboard** · `/` focus search, Cmd/Ctrl+N opens new-snippet editor.
  - **Aesthetic** · Unreal Engine 5 dark navy palette (#0a0e1a / #10172b / #161d33), UE-blue #3eaeff primary action, UE-orange #ff7a3d secondary. Bricolage Grotesque 800 for the title (with `Vault` in 300-weight blue italic), IBM Plex Sans body, JetBrains Mono for all code + metadata. Faint 40px blueprint grid in the background.
  - **OG image** via Pollinations flux (no `referrer` per project notes).

## issues
- Snippet code blocks max-height 18rem with overflow-x scroll — longer snippets aren't fully visible without scrolling inside the card. Could add a click-to-expand later.
- No drag-to-reorder; snippets always sort by updatedAt desc. Pinned/favourite snippets would be a useful follow-up.
- The Private-Use-Area placeholder limits to 256 stashes per snippet (combined comments + strings). Should never hit this on real animation code, but bail-to-literal fallback prevents truncation if it ever does.
- No syntax highlighting for INI yet (it's accepted in the language selector but renders plain). Tiny additional regex pass would do it.

## todos
- Star/favourite + pinned snippets section above the rest.
- Click-to-expand for long snippets (max-height removal toggle per card).
- Multi-tag filter chips (currently only categories filter).
- Per-snippet "language" auto-detect on paste (`UCLASS` → C++, `[` start → BP Pseudo).
- Shared vault: optional Supabase sync so chat can share snippets across users (would need rate limits + RLS).
- Markdown rendering in the description field.
- INI / GLSL / HLSL syntax classes (for material editor snippets).
