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
- Fetches the /apps/ directory listing
- Parses HTML to extract folder names
- For each folder, fetches index.html and extracts:
  - `<title>` tag for project name
  - `meta[property="og:description"]` for description
  - `link[rel="icon"]` for emoji favicon (from emojicdn.elk.sh)
- Auto-categorizes based on keyword matching
- Client-side filtering and search with no backend needed
- Uses fetch API with Promise.all for parallel loading

## Categorization Logic
- **Game**: Keywords like "game", "play", "puzzle", "arcade", "adventure", "rpg", "battle", "catch", "quest"
- **Tool**: Keywords like "tool", "converter", "editor", "tracker", "generator", "calculator"
- **Art**: Keywords like "art", "draw", "paint", "creative", "design", "visual"
- **Other**: Everything else

## Issues
- Depends on nginx serving directory listings for /apps/
- Some projects may not have proper og:description tags
- Loading all projects can be slow with many apps (currently ~100+)

## Todos
- Consider caching projects list in localStorage
- Add sorting options (alphabetical, newest, category)
- Add "featured" or "recent" sections
- Consider pagination if project count grows significantly
- Add project thumbnails/screenshots if available
- Add last-updated dates from git commits
