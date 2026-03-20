# Wiki Rabbit Hole

Fall down the Wikipedia rabbit hole. Follow links, track your journey, visualize how deep you go.

## log
- 2026-03-20: Initial build. Search Wikipedia via REST API, loads article summaries with extracted links. Autocomplete suggestions while typing. Breadcrumb trail of visited articles. Depth meter bar that changes color as you go deeper. Stats (depth, unique articles, time elapsed). Starter topic buttons for quick entry. Node graph visualization with force-directed layout showing journey path with directed edges and glow nodes. Clickable breadcrumbs to backtrack. Newsreader + IBM Plex Mono typography, purple/dark editorial aesthetic.

## issues
- None yet

## todos
- Share journey as image/link
- "Random article" button
- Side branches (visited but backtracked)
- Achievement system (10 deep, 20 deep, etc.)

## notes
- No database — pure frontend
- Uses Wikipedia REST API (en.wikipedia.org/api/rest_v1) for summaries
- Uses MediaWiki API for article links (plnamespace=0 for articles only)
- Links filtered: no namespace prefixes, not already visited, shuffled, max 15 shown
- Force-directed graph: repulsion between nodes, attraction along edges, center pull
- Graph rebuilds layout each time a new node is added (20 iterations)
