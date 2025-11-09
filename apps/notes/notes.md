# Notes App

## Log
- Initial creation: Clean, simple note-taking app
- Features:
  - Create, edit, delete notes
  - Real-time auto-save (1 second delay)
  - Search functionality
  - Sidebar with note list
  - Clean, minimal editor
  - Timestamps with relative dates
  - Cloud sync via Supabase
  - Real-time updates across devices
- Mobile responsive design

## Issues
- Need to create notes table in Supabase

## Todos
- Create notes table with columns: id, title, content, user_id, created_at, updated_at
- Could add tags/categories
- Could add rich text formatting
- Could add note sharing
- Could add folders/organization

## Notes
- Auto-saves after 1 second of inactivity
- Shows relative timestamps (e.g., "2 min ago")
- Search works across title and content
- Real-time sync between devices
- Works for both anonymous and authenticated users
