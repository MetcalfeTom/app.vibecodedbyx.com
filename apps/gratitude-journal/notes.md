# Gratitude Journal

## Log
- 2025-10-21: Initial creation
  - Created gratitude journal app with Supabase backend
  - Users can add, view, and delete gratitude entries
  - Anonymous authentication for easy access
  - Filter entries by All, Today, or This Week
  - Purple gradient design with clean UI
  - Mobile and desktop responsive
  - Real-time date formatting (Today, Yesterday, specific dates)
  - Entries stored per user in Supabase
- 2025-10-21: Fixed module imports
  - Converted to ES modules to use supabase-config.js
  - Uses supabaseSession() for auth handling
  - Exposed functions to window for onclick handlers

## Issues
- None yet

## Todos
- Could add search functionality
- Could add tags/categories for entries
- Could add export to PDF or text file
- Could add statistics (total entries, streak tracking)
- Could add reminders/notifications
- Could add ability to edit existing entries
- Could add mood tracking alongside gratitude
- Could add inspirational quotes

## Technical Notes
- Using Supabase for database and auth
- Table: gratitude_entries (entry_text, entry_date, user_id)
- Anonymous authentication for easy onboarding
- RLS policies ensure users only see their own entries
- Entries sorted by date descending (newest first)
- Filter logic on client side for performance
- Ctrl+Enter keyboard shortcut to submit
- HTML escape for XSS prevention
- Auto-hides error messages after 5 seconds
