# tag-soup · notes

## log
- 2026-07-11: v1 (chat ask ×2: HTML tokenizer, single input, output each token w/ type/tag name/attrs/text/comment, pure JS no libraries). **Hand-written state-machine tokenizer** (~150 lines, no regex-parse-the-world): dispatch on `<` + next char → start-tag (letter) / end-tag (`/`+letter) / `<!--` comment / `<!doctype` (ci) / `<![CDATA[` / bogus-comment (`<!`,`<?`,`</`+non-letter) / else text. Tag reader: name until ws|/|>, attr loop (bare attrs, `=` unquoted/single/double-quoted values, quote char + dup flag recorded, `/` mid-tag ignored per spec, `/>` self-closing, EOF→error token). **Raw-text elements** (script/style/textarea/title): contents to next `</name` (ci) emitted as one raw-text token — `a<b`, `</i>` inside strings survive exactly like the real HTML tokenizer. Comment endings: `-->` normal, `--!>` accepted w/ warn, EOF → error. Names lowercased, values case-preserved. **Core invariant: tokens tile the input** — every char in exactly one token, `start/end` offsets contiguous [0,len) → proven in tests on 32 nasty inputs + 300 random fuzz strings. **UI**: live tokenize (180ms debounce), color-coded type chips (9 types), attr chips w/ quote style + ⚠dup, ↵/⇥ made visible in text snippets, per-type stat pills + ms timing, hide-whitespace-text toggle, 1500-row render cap, **click any token → selects its exact source range in the textarea** (scrolls via line estimate). Sample doc exercises every token type. Node-tested 30/30. Light editorial paper aesthetic — Fraunces italic + IBM Plex Mono. Hook `__ts {tokenize,retokenize,count}`.

## issues
- Entities intentionally NOT decoded (token layer; noted in footer). RCDATA (title/textarea) treated as pure raw-text — entity refs inside them aren't split out.
- Raw-text close detection accepts `</script` without checking the following char is ws|/|> (spec nit; real-world impact ≈0).
- Offsets are UTF-16 code units (JS string indexing) — fine for setSelectionRange, just don't call them "bytes".

## todos
- Tree-builder stage (nesting errors, implied end tags) as a second panel.
- Share input via URL hash.
- Token → spec-state trace mode for teaching.
