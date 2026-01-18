# Git Branch Simulator

## log
- 2026-01-18: Initial creation
  - Terminal interface with git commands
  - Visual tree graph with colored branches
  - Support for commits, branches, checkout, merge

## features
- Split-panel layout (terminal + graph)
- Simulated git commands:
  - git init
  - git commit -m "message"
  - git branch / git branch <name>
  - git checkout <branch>
  - git checkout -b <name>
  - git merge <branch>
  - git log
- Visual commit graph with:
  - Colored nodes per branch
  - Branch labels/tags
  - HEAD indicator
  - Merge lines
- Status bar showing commits/branches/HEAD

## design
- JetBrains Mono + Space Grotesk fonts
- GitHub dark theme inspired colors
- Terminal aesthetic with syntax highlighting
- Animated node rendering

## controls
- Type commands in terminal
- help - show all commands
- clear - clear terminal
- reset - reset repository

## todos
- Add git rebase simulation
- Add git stash
- Add animated transitions
- Add commit details popup

## issues
- None yet
