# App Taxonomist

A terminal-style catalog of 450+ apps in the sloppy.live ecosystem.

## Log
- 2026-01-28: Added fuzzy search and sorting modes
  - Terminal-style search bar with neon green aesthetic
  - Real-time fuzzy matching with match highlighting
  - Sort modes: By Category, A→Z, Z→A, Newest
  - Scoring algorithm: exact > consecutive > start-of-word
  - JetBrains Mono font, neon glow effects
- 2026-01-27: Initial creation
  - 446 apps cataloged
  - 9 categories: Games, Tools, Art, Social, Finance, Retro, Simulation, Music, Misc
  - Search and filter functionality

## Features
- Complete catalog of all apps in the directory
- Terminal-style fuzzy search with match highlighting
- Multiple sort modes: Category, A-Z, Z-A, Newest
- Keyword-based automatic categorization
- Category filters with counts
- Real-time UI updates as user types
- Stats display (total apps, categories, matching)
- Responsive grid layout
- Direct links to each app

## Categories
- **Games** (🎮): Clickers, shooters, platformers, puzzles, arcade
- **Tools** (🔧): Calculators, trackers, managers, utilities
- **Art** (🎨): Fractals, particles, visualizers, generative
- **Social** (💬): Chat, community, walls, guestbooks
- **Finance** (💰): Crypto, trading, coins, trackers
- **Retro** (📺): Terminal, DOS, Windows 95, CRT, emulators
- **Simulation** (🌍): Sandboxes, physics, world builders
- **Music** (🎵): Synths, drums, soundboards, audio tools
- **Misc** (📦): Everything else

## Fuzzy Search Algorithm
- Exact substring match: highest score (100 - position)
- Sequential character match with scoring:
  - Consecutive matches: +5 points
  - Non-consecutive: +1 point
  - Start of word bonus: +3 points
- Gap penalty: -0.5 per gap character
- Results sorted by score, highlighted in green

## Completed
- ✓ Add sorting options (alphabetical, recent, popular)

## Todos
- Add app descriptions from notes.md files
- Add last modified dates from git
- Consider fetching actual app metadata

## Issues
- None yet
