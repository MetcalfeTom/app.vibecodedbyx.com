# CI4 Campfire — notes

## log
- 2026-09-10 v1.0 — built per chat ("CodeIgniter 4 learning website with searchable chapters, navigation, runnable examples, quizzes, and official reference links"). Eleven chapters (intro → install → routing → controllers → views → models → validation → helpers → spark/migrations → security → build-a-guestbook), each: prose sections, a code example with a ▶ run button revealing PRECOMPUTED output (honestly labelled — no PHP runs in the browser), a 3-question quiz with explanations + localStorage best-scores shown in the toc, and OFFICIAL REFERENCES AS NAMES ("CodeIgniter 4 User Guide → URI Routing" etc.) — the no-external-links house rule interpreted as named references with an explicit "Named, not linked, on purpose" note; a no-affiliation footer covers the trademark side. Two chapters carry genuinely interactive playgrounds: a ROUTING matcher and a VALIDATION rule-runner, both faithful JS re-implementations of CI4 semantics living in the pure engine (node-tested: (:num)/(:segment)/method matching; required/min_length/max_length/valid_email/alpha_numeric/is_natural_no_zero incl. the emptiness-is-required's-job rule). Search runs across titles+keywords+body with context snippets, title hits ranked first; hash-based navigation (#chapter), prev/next pager, aria-current toc. ENGINE 28/28 + browser 26/26 at 1200/390/320. Zilla Slab + Fira Code on parchment + CI-ember.

## issues
- Sequential regex syntax highlighting SELF-MANGLES (the keyword 'class' wrapped my own class="…" attributes — visible as text in the screenshot, missed by the first probes): use ONE alternation pass with a classifying replacer; probe now asserts pre textContent contains no 'class="'.
- 1fr grid + wide code lines = page overflow (minmax(auto,1fr)); main.page needs min-width:0.

## todos
- More chapters (Filters, Entities, Testing) if chat wants a season two.
- Per-chapter completion streaks.
