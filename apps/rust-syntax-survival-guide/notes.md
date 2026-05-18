# rust-syntax-survival-guide · notes

## log
- 2026-05-18: v1 — **pocket reference for Rust syntax** per chat ask "create a rust-syntax-survival-guide app with a clean terminal UI and interactive code snippets". Self-contained ~38KB single file.
  - **24 hand-written chapters** ordered from "hello world" through "survival cheat-sheet": let/mut/const, scalar types, ownership, references & borrowing, lifetimes, slices, structs, enums + Option/Result, pattern matching, iterators, closures (Fn/FnMut/FnOnce), traits, generics, error handling + ?, modules & use, cargo commands, collections (Vec/HashMap), smart pointers (Box/Rc/Arc/RefCell), threads + mpsc, async/await with tokio, macros, trait objects (dyn), and a final 3-rules + 4-common-errors + 2-reflexes cheat sheet.
  - **Each chapter** ships a tight lede (1-3 sentences, with inline `code`, _italic_, **bold**), one or more code snippets, and optionally a side-note box.
  - **Each snippet** is rendered with a tiny in-page Rust tokenizer (no external highlight.js) — keywords (orange-rust), types/capitalised (blue), strings (lime), numbers (peach), comments (italic dim), macros (purple), function calls (amber). Single-pass char-by-char scanner that's comment- and string-aware (won't trip on `//` inside a string, etc.) and correctly distinguishes char literals `'x'` from lifetime markers `'a`.
  - **Interactive controls per snippet**:
    - **▶ run** — reveals the expected stdout output (pre-baked, since we can't ship a Rust compiler in the browser)
    - **! error** — reveals the exact compiler error (pre-baked from real `rustc` output, complete with caret carets and error code) for "this won't compile" demonstrations
    - **↗ playground** — one-click hand-off to <https://play.rust-lang.org> with the snippet URL-encoded into the `code=` parameter, so users can actually run + tweak
  - **Chapter sidebar** (220px on desktop, full-width on ≤760px): numbered chapter list with `aria-current` highlighting on the active row, hover transitions, focus-visible rust-orange outline. Auto-scrolls the active chapter into view as you navigate.
  - **Header per chapter**: chapter number badge in rust-orange, h1 in Bricolage Grotesque 700, prev/next ◀ ▶ arrow buttons.
  - **Progress strip at the bottom**: CH 07/24 + gradient progress bar (rust → amber) + the current chapter title.
  - **Keyboard navigation**: `j`/`↓` next chapter, `k`/`↑` prev chapter, `r` reveal run-output, `e` reveal compiler error, `p` open in Playground.
  - **Persistence**: `localStorage['rust-survival-guide-v1']` remembers which chapter you were on across reloads.
  - **Aesthetic**: a sober GitHub-dark / catppuccin-flavoured terminal palette — bg `#0d0f12`, sidebar `#14181d`, code blocks `#14181d` with rust-orange left edge, body text cream-warm `#e4dcc8`, comments italic dim-grey. Bricolage Grotesque title pairs with JetBrains Mono everywhere else + Special Elite for the dateline label. Pure-text crab emoji as the brand mark. Faint scanline overlay at 1.2% alpha for "terminal" feel without being a heavy CRT.
  - **WCAG**: rem-everywhere, semantic main/aside/header/section, button elements with `aria-current` on the active chapter + `aria-label`s, focus-visible rust outlines (2px), `prefers-reduced-motion` kills transitions, ≥2.2rem hit targets on the sidebar buttons, 4.5+ contrast on every text colour against bg.
  - **Pollinations OG image** (no `referrer` per project notes).

## issues
- The tokeniser is deliberately conservative — it handles 95% of normal Rust code but doesn't try to be a full parser. Edge cases that intentionally render as plain identifier: nested raw strings (`r#"…"#`), tricky macro expansions, attribute-arguments with weird punctuation.
- We can't actually compile Rust in the browser (would need a WASM toolchain, ~10MB+). The "↗ playground" link hands off to the real Rust Playground for executable iteration — honest UX over fake compilation.
- The "error" panel shows pre-baked compiler messages — these track current `rustc` output as of the rust 1.7x series. If `rustc` rewrites a diagnostic the panel text would diverge.
- localStorage key holds only the chapter index; doesn't remember which snippet panels were expanded.

## todos
- Search box at the top of the sidebar (filter chapters by name or keyword)
- Per-snippet "copy code" button alongside run/error/playground
- Chapter-checkmark gutter — mark chapters as read across the sidebar (would need a small ui tick + localStorage)
- More chapters: lifetimes-elision-rules, traits-with-associated-types, derive-macro details, panic-hook customisation, common cargo features patterns
- Theme toggle: a softer "paper" mode for reading on bright screens
- Pollinations LLM hook: paste your own code → get an idiomatic-Rust suggestion (would need rate-limit handling)
- Link to https://doc.rust-lang.org permalinks for the deeper-dive references per chapter
