# sedbox · notes

## log
- 2026-07-11: v1 (chat ask: smart string editor — regex template patterns to replace filenames/paths/identifiers in code examples, single-page). **Pure engine (node-tested, `__sedbox`)**: `applyRule(text,rule)` → {text,hits}; rule = {enabled,find,repl,regex,i,m,word,xform}. `buildRe` escapes regex metachars in literal mode (so `a.old.js` doesn't wildcard-match `axoldxjs` — tested), wraps `\b…\b` for whole-word (parenthesizes regex src first). Replacement supports `$1`/`$2`/`$&` group substitution. **Identifier-case transform** (`xform` ∈ camelCase/PascalCase/snake_case/SCREAMING_SNAKE/kebab-case): `splitWords` breaks any convention (camel/HTTP-runs/snake/kebab/dot) into lowercase parts, `toCase` reassembles. When a rule has xform: transforms the whole match, OR just capture-group-1 if the pattern has one (keeps surrounding text — e.g. `function (\w+)` → renames only the fn name). `runPipeline` chains rules top-to-bottom, each output feeds the next (order matters — tested src/legacy→src/core THEN *.old.js→*.js). **UI**: draggable reorderable rule cards w/ per-rule toggle chips (on/regex/case-insensitive/whole-word/multiline) + →case/↩repl mode swap, live per-rule hit badges, total-fired counter, bad-regex marks the card red + shows the error (pipeline still renders up to the break). **Live word-level diff** (LCS over whitespace-split tokens → ins/del highlight, toggle diff/plain). Source→result split, copy/download output, named rule sets in localStorage. Ships with a working example (legacy-path + .old.js-strip + snake→camel). Space Grotesk + JetBrains Mono, dark amber/cyan. Pollinations OG (flux seed 3751). **10/10 engine tests pass**: 5 case modes, literal-dot escape, capture $1, word boundary, xform-on-matches, xform-on-group1, pipeline order, disabled-skip, bad-regex-throws, diff ins/del.

## issues
- Diff is whitespace-token LCS (O(n·m)) — fine for code examples; huge files (>~5k tokens) would be slow. Add a length guard → plain output if it ever matters.
- xform picks group 1 if present else whole match — if someone writes a pattern with an incidental group they may be surprised; documented via the →case label.

## todos
- Named capture support ($<name>).
- Rule-set export/import JSON (sets are localStorage-only now).
- Preset library (common framework migrations).
