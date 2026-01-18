# DP Pathfinder Tutorial

## log
- 2026-01-18: Initial creation
  - 5-lesson interactive tutorial
  - Vector-based pathfinding
  - Step-by-step DP visualization
  - Interactive grid with obstacles
  - Quiz with explanations

## features
- Lesson 1: Introduction to DP and pathfinding
- Lesson 2: Vector calculations for positions/movement
- Lesson 3: DP formula and table construction
- Lesson 4: Interactive pathfinding with obstacles
- Lesson 5: Quiz with scoring

### Interactive elements:
- Click to add/remove obstacles
- Step-through DP computation
- Auto-run with speed control
- Visual path highlighting
- Real-time calculation log

### Key formulas taught:
- dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
- Position vectors: [row, col]
- Movement vectors: right=[0,1], down=[1,0]
- Vector addition for movement

## design
- JetBrains Mono + Space Grotesk fonts
- Dark blue/cyan/purple palette
- Grid-based visualizations
- Animated cell highlighting

## todos
- Add diagonal movement option
- Add weighted edges visualization
- Add more quiz questions
- Add downloadable code snippets

## issues
- None yet
