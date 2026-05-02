# vans-blog

## log
- 2026-05-02: Created. **High-end minimalist brutalist personal-blog scaffold.** Single-file vanilla HTML. Aesthetic: cream paper bg `#f1ede4` + horizontal hairline rule lines (28px repeating-linear-gradient at 2.5% opacity = subtle line-paper texture), heavy black ink `#0c0a08`, single red accent `#ff3737` + yellow highlight `#fff152` for hover/selection. Sharp 90° corners everywhere — no rounded radii. Two display fonts: **Fraunces** (variable serif, opsz 9-144, used at 800/500/300 weights for the giant hero `Vans *Log*.` headline + post titles + pull quotes) and **JetBrains Mono** (UI labels, GitHub-style tags, top bar, footer). **Sections** rendered top-down: heavy black topbar with monogram dot + currently-shipping label + theme toggle button → big serif hero `Vans Log.` (clamp 72-178px, italic red `Log`) with right-aligned vol/posts/repos meta + live pill → italic Fraunces tagline → **section rules** (2px black line + uppercase mono `01 · ABOUT` label sitting on a paper-bg notch) → two-column row: **Bio** (numbered first-line drop-style intro + factrow grid: BASED IN / WRITING / WORKING ON / OPEN TO / NOT INTERESTED IN) and **Recent · GitHub** (six placeholder repo cards: static-first / paper-terminal / orbit-notes / lo-fi-build / corner-blog / ink-printer with star counts + italic descriptions + uppercase tag chips with sharp borders. Each card hovers up-and-left 3px with 5px black shadow + yellow highlight bg) → another section rule `02 · POSTS` → 6 post rows with mono date / 28px Fraunces title (italic emphasis on key words) / mono read-time, hover-shifts-right effect that flips title to red. **Footer**: 6px black top rule + `© mmxxvi · vans` + Fraunces italic "Built by hand. Fed by curiosity." signoff + elsewhere links (github / are.na / rss / mail). **Floating monogram badge** bottom-right: black square with yellow `V` and red 5px shadow offset (hidden on mobile). **Dark mode**: theme button in topbar toggles `body.dark`; CSS variables flip — same paper texture, just inverted. Persists in localStorage; honors `prefers-color-scheme: dark` on first visit. **Mobile**: post rows collapse to single column at 680px; bio + projects stack at 880px; topbar tightens at 760px. Pollinations OG, ▪️ favicon. Placeholder-only — chat populates the bio, projects, posts.

## issues
- All content is placeholder text; chat needs to substitute real bio, projects, posts.
- GitHub project cards are static — could fetch real repos via the GitHub API given a username, but that adds rate-limiting complexity for an unauthenticated client.
- No RSS feed actually generated — the footer link is decorative.
- Theme toggle is body-class based; some custom-property paths in canvas/SVG (none here yet) wouldn't update without a redraw.

## todos
- Fetch real GitHub repos from `https://api.github.com/users/USERNAME/repos?sort=updated&per_page=6`.
- Add a per-post detail view (hash-routed) or markdown-driven post list.
- RSS generation (could be a tiny build step writing `feed.xml`).
- Reading-progress bar at the top while scrolling.
- Tag-based filter on posts.
- Web Mentions support for cross-blog discussions.
- Print stylesheet — make any post print A5-clean.
