# Overview - Dynamic Project Browser

## Log
- 2025-11-10: Created dynamic overview page that automatically scans all apps
- Fetches project metadata from each app's index.html
- Extracts title, description, and favicon emoji from each project
- No manual updates needed - fully automatic!
- Live at https://app.vibecodedbyx.com/overview

## Features
- **Automatic Discovery**: Scans /apps/ directory for all projects
- **Metadata Extraction**: Pulls title, og:description, and favicon from each app
- **Automatic Categorization**: Classifies projects as Game, Tool, Art, or Other based on keywords
- **Search Functionality**: Real-time search across titles and descriptions
- **Category Filtering**: Filter by Games, Tools, Art, or All
- **Statistics**: Shows total projects, games count, and tools count
- **Responsive Grid**: Beautiful card layout that works on mobile and desktop
- **Direct Links**: Click any project card to visit that app
- **No Manual Updates**: Never needs to be manually updated when new apps are added!

## Technical Implementation
- Uses a pre-generated `projects.json` file
- Generation script `generate-projects.js` scans /apps/ directory
- For each folder, reads index.html and extracts:
  - `<title>` tag for project name
  - `meta[property="og:description"]` for description
  - `link[rel="icon"]` for emoji favicon (from emojicdn.elk.sh)
- Auto-categorizes based on keyword matching
- Client-side filtering and search with no backend needed
- Fast loading - single JSON fetch vs 100+ HTML fetches

## Regenerating Projects List
When new apps are added, regenerate the projects.json:
```bash
cd /vibespace/apps/overview
node generate-projects.js
```

This should be automated in the deployment process or run whenever a new app is committed.

## Categorization Logic
- **Game**: Keywords like "game", "play", "puzzle", "arcade", "adventure", "rpg", "battle", "catch", "quest"
- **Tool**: Keywords like "tool", "converter", "editor", "tracker", "generator", "calculator"
- **Art**: Keywords like "art", "draw", "paint", "creative", "design", "visual"
- **Other**: Everything else

## Issues
- Requires manual regeneration of projects.json when new apps are added
- Some projects may not have proper og:description tags
- Need to remember to run generate-projects.js after adding new apps

## Todos
- Consider caching projects list in localStorage
- Add sorting options (alphabetical, newest, category)
- Add "featured" or "recent" sections
- Consider pagination if project count grows significantly
- Add project thumbnails/screenshots if available
- Add last-updated dates from git commits
