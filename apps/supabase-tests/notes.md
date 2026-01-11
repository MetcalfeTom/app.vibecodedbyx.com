# Supabase Tests

## Log
- 2026-01-11: Initial creation
  - Pure Node.js test runner (no native binaries - sandbox friendly)
  - Tests Supabase connection, RLS, row consistency, anon auth
  - JSON report output for auditors
  - Run with: `node test-runner.js`

## Tests Included
1. **Connection Tests**
   - Creates valid Supabase client
   - Connects to users table
   - Queries breakout_terminal_scores
   - RLS allows reading all rows

2. **Row Consistency Tests**
   - Users table has required columns (user_id, updated_at, purchased_at)
   - Leaderboard tables queryable
   - App tables have user_id column

3. **Anonymous Auth Tests**
   - Allows anonymous sign-in
   - Maintains session after sign-in

## Notes
- Vitest doesn't work in sandbox due to esbuild permission errors
- Custom test-runner.js uses pure Node.js with no native dependencies
- Tests run against live Supabase instance

## Todos
- Add write permission tests (requires test user)
- Add RLS enforcement tests
- Add premium user detection tests
