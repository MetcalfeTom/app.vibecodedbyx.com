# git-griped · notes

## log
- 2026-05-19: v3 — **GitHub-skinned git simulator with interactive branching, cherry-pick, merge-conflict resolver, contribution graph, rebase warning, submodule nightmare, hint button, show-command button, and achievement system**. Burnout index + issue log REMOVED per chat ask "remove the burnout index and log from git-griped and implement a full GitHub dark mode UI with interactive branch switching and cherry-picking features". 97KB single file, localStorage persistence, zero deps.
  - **Full GitHub dark UI** · canonical palette (`#0d1117` / `#161b22` / `#21262d` / `#30363d` / `#c9d1d9` / `#58a6ff` / `#238636` etc.), Octicon-style SVG glyphs throughout, the global black top nav with breadcrumb + search + bell + create + avatar, repo header with Watch/Star/Fork pill-counters, 7 tabs (Code active, Issues/PRs/Actions/Projects/Wiki/Insights) with the signature orange underline on active.
  - **Contribution graph** · 13×7 grid of 11px squares with the canonical 5-tier green ramp (`#161b22`/`#0e4429`/`#006d32`/`#26a641`/`#39d353`). Each commit lights up the corresponding day; ≥3=l2, ≥6=l3, ≥10=l4. Header reads "N contributions in the last 12 weeks · K/9 achievements". Hover-tooltips show day + count.
  - **Branching** · GitHub-style branch picker dropdown — click to open, type to filter, type a name no branch matches and the "Create branch from <current>" panel appears. Three branches seeded by default (`main` / `feature/passive-aggression` / `hotfix/standup`). Creating a branch copies existing commits as the base. Branch switch updates the whole UI (commit history, file viewer, commit-target label, branch-tag chip on editor).
  - **Commits** · Editor section reveals on "Edit RAGE.md" click. Commit message + body textarea, 5 quick-rage chips (deploy/PR/standup/scope/3am-page), live rage meter, "Commit to <branch>" green button. Translator engine ports forward from v1 (~25 PHRASE_SWAPS + ~30 WORD_SWAPS + softener + closer). Each commit gets a 7-char hex sha, becomes a hidden commit history row that shows: avatar / commit title / "@you committed Xm ago · rage N/100" / @hr-bot translation preview / cherry-pick button / sha pill.
  - **Cherry-pick** · per-commit cherry button opens modal "Apply commit abc1234 from <src> onto: [target dropdown]". Confirm re-translates fresh, creates new commit on target branch with `(cherry-pick)` suffix + `cherryFrom` SHA reference. Auto-switches to target branch.
  - **Compare & merge** · button opens merge attempt. Synthesizes a conflict between latest commit on current branch + latest on main. Three-pane modal: classic `<<<<<<<` / `=======` / `>>>>>>>` diff block at top + two side panels with "Use this version" buttons + custom resolution textarea. Resolution becomes a real merge commit ("Merge branch 'X' into main").
  - **Rebase (with dramatic warning)** · red Rebase button opens modal with red header, 5-bullet bullet list of risks (rewritten SHAs, force-push, lost-work risk, reflog-only undo, teammates already based on old history), green "✓ Safer alternative: use merge" callout, "every staff engineer eventually" quote. Two foot buttons: green "Use merge instead (recommended)" (closes warning + opens merge UI, unlocks `used_merge_instead`) vs red "I understand · rebase anyway" (re-shas every commit on current branch, sets status to red "force-push required", unlocks `first_rebase`).
  - **Submodule nightmare** · "Submodules" button triggers a full-screen black overlay with: shaking red-bordered frame, pulsing red "⚠ DETACHED HEAD · @ 0000000" banner top-centre, 7 nested mock submodule windows scaled+rotated in fractal layout, streaming green terminal log that starts normal then loops "Submodule 'X-prime-ultra-meta' registered for path…" then escalates to "warning: cycle detected: rage-translator → engine → core → prime → ultra → meta → self → rage-translator" then "fatal: maximum recursion depth exceeded". Auto-shows the abort card with `git submodule deinit --force --all` recovery command. Manual Esc / Abort button also closes. Unlocks `submodule_nightmare` achievement.
  - **Hint button** · 💡 modal pulling a random hint from 15-entry HINTS array (status, pull-before-push, stash-before-switch, amend, detached HEAD, log graph, bisect, reflog, diff branch, force-push-with-lease, cherry-pick range, undo merge, squash, secrets, gitignore_global). "Another hint" button reshuffles, anti-repeat guard on lastHintIdx.
  - **Show command button** · 📺 modal showing a pre-formatted reference of every action's command-line equivalent, with comments mapping UI labels to git invocations (switch, switch -c, add+commit, log --oneline --graph, cherry-pick, merge, rebase, push --force-with-lease, reset --soft, reflog). "Copy all" puts it on the clipboard.
  - **Achievement system** · 9 achievements (`first_commit` 🎉, `first_branch` 🌿, `first_cherry` 🍒, `first_merge` 🪢, `first_rebase` ⚠️, `used_merge_instead` ✅, `submodule_nightmare` 🕳️, `ten_commits` ⛏️, `high_rage` 🔥). Top-right green-bordered toast slides in for 4.2s with icon + "ACHIEVEMENT UNLOCKED" label + title + sub. Counter in contribution graph header ("K/9 achievements"). Persistence via `state.achievements` array.
  - **Persistence** · `localStorage['git-griped-v3']` holds branches, currentBranch, commits, achievements, nextSha. Seed commit on first load: "Initial commit · welcome to the repo" by @hr-bot on main.
  - **Keyboard** · Cmd/Ctrl+Enter to commit from the editor. Esc closes any open modal AND the submodule nightmare.
  - **Responsive** · breakpoints at 900px (sidebar would collapse if present) and 720px (search hidden, file table simplified, padding reduced).
  - **WCAG basics** · semantic markup (`<nav>`/`<header>`/`<section>`), role="dialog"/aria-modal on overlays, role="status" + aria-live on the status pill + achievement toast, role="menuitem" + tabindex on dropdown items, focus-visible blue outline 2px, ≥44px target heights on primary buttons.

## issues
- The synthesized merge conflict always takes the latest commit on each side; if either side has zero commits, the conflict text reads "No prior content." Could be smarter about choosing the diff target.
- Rebase re-shas every commit on the current branch, but the cherry-pick lineage (`cherryFrom`) doesn't update. Mostly cosmetic since SHAs are display-only.
- Submodule nightmare assumes a desktop viewport; on very small phones the 7 nested windows can overflow the visible area.
- Hint modal hints reference real CLI commands; if chat tries them in a real repo without context, some (like `git filter-repo`) require non-default tools.
- The contribution graph is technically "12 weeks" but renders 13 columns to fit cleanly. Header says "12 weeks" — close enough for vibes.
- No actual co-commit by @hr-bot in commit history; the bot's translation is attached to your commit (`c.corp` field) rather than being a separate commit by a second author. Could split if chat asks.

## todos
- "Revert" button per commit (creates an inverse commit instead of removing).
- Stash UI (`git stash list` / pop).
- Tags tab in the branch dropdown (currently "Tags" is a tooltip-only dead label).
- A "Pull Requests" view with actual PR-style diff (current title vs current corp).
- Squash + force-push combo as a separate dangerous action.
- A "git bisect" mini-game where you binary-search to find the commit that introduced the most rage.
- "@hr-bot" should occasionally Pollinations-refine a particularly spicy commit.
- More achievements: "Octopus Merge" (merge 3+ branches), "Reflog Survivor" (recover after rebase), "Conflict Resolver" (resolve 5 conflicts), "Cherry Bowl" (cherry-pick 5 commits).

## design notes
- The full GitHub palette + Octicon SVGs are inlined; no external dep beyond JetBrains Mono via Google Fonts.
- The "fake" recursive submodule nightmare uses 7 nested `<div>`s with `transform: scale() rotate() translate()` rather than recursive iframes, which would be heavy and trigger same-origin loops. Achieves the visual recursion without the perf cliff.
- All modals share `.modal-back` / `.modal` styles with size overrides per use. The conflict-modal uses a custom 760px width to fit two side-panes + diff.
- `transform-box: fill-box` was AVOIDED throughout — animations use SMIL-free CSS keyframes on elements that don't need bbox-relative origin (translateX, opacity, hue-rotate). Lesson carried over from the windows-11-recall-nightmare animation debugging session.
