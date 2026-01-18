# Sloppy-Flow

## log
- 2026-01-18: Initial creation
  - Drag-and-drop node editor
  - Trello and Google integrations
  - Mock API logs with simulated responses
  - Visual flow execution

## features
- Visual drag-and-drop workflow builder
- Node-based automation editor
- Connection lines between nodes
- Simulated flow execution
- Mock API request/response logs

### Node Types:

**Triggers:**
- Webhook - HTTP endpoint trigger
- Schedule - Cron-based timing

**Trello:**
- New Card - Trigger on card creation
- Move Card - Move card to list
- Create Card - Add new card

**Google:**
- Sheets Read - Get spreadsheet data
- Sheets Write - Add row to sheet
- Gmail Send - Send email
- Drive Upload - Upload file

**Logic:**
- Filter - Conditional branching
- Transform - Data mapping

### API Logs:
- Method badges (GET/POST/PUT)
- Status codes (200/500)
- Response time
- JSON formatted responses
- Syntax highlighting

## design
- Inter + JetBrains Mono fonts
- Light/clean aesthetic
- Colored node headers by type
- Bezier curve connections
- Animated flow execution

## controls
- Drag nodes from sidebar
- Click to select
- Connect output to input
- Run Flow button
- Clear button
- Sample Flow button

## todos
- Add node deletion
- Add connection deletion
- Add undo/redo
- Add flow save/load
- Add more integrations (Slack, Discord)

## issues
- None yet
