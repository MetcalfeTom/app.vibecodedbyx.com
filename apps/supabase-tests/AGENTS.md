# Supabase Test Agents

## Test Runner Agent
**File:** `test-runner.js`
**Purpose:** Pure Node.js Supabase connection and row consistency tests
**Run:** `node test-runner.js`

## Data Validation Agent
**File:** `data-validation-test.js`
**Purpose:** Sample data logging and RLS insert validation
**Run:** `node data-validation-test.js`

---

## Test Results (9/9 Passing)

```
═══════════════════════════════════════════════
  SUPABASE CONNECTION & ROW TESTS
═══════════════════════════════════════════════

Run Date: 2026-01-11T00:11:15.597Z

▸ Connection Tests
  ✓ Creates valid Supabase client
  ✓ Connects to Supabase (users table)
  ✓ Queries breakout_terminal_scores
  ✓ RLS allows reading all rows

▸ Row Consistency Tests
  ✓ Users table has required columns
  ✓ Leaderboard tables queryable
  ✓ App tables have user_id column

▸ Anonymous Auth Tests
  ✓ Allows anonymous sign-in
  ✓ Maintains session after sign-in

═══════════════════════════════════════════════
  SUMMARY
═══════════════════════════════════════════════
  Passed: 9
  Failed: 0
  Total:  9
═══════════════════════════════════════════════
```

## JSON Report

```json
{
  "timestamp": "2026-01-11T00:11:15.597Z",
  "summary": {
    "passed": 9,
    "failed": 0,
    "total": 9
  },
  "results": [
    { "name": "Creates valid Supabase client", "status": "PASS" },
    { "name": "Connects to Supabase (users table)", "status": "PASS" },
    { "name": "Queries breakout_terminal_scores", "status": "PASS" },
    { "name": "RLS allows reading all rows", "status": "PASS" },
    { "name": "Users table has required columns", "status": "PASS" },
    { "name": "Leaderboard tables queryable", "status": "PASS" },
    { "name": "App tables have user_id column", "status": "PASS" },
    { "name": "Allows anonymous sign-in", "status": "PASS" },
    { "name": "Maintains session after sign-in", "status": "PASS" }
  ]
}
```

---

## Environment
- **Runtime:** Node.js (pure JS, no native binaries)
- **Supabase:** `yjyxteqzhhmtrgcaekgz.supabase.co`
- **Auth:** Anonymous sign-in via Supabase Auth
- **RLS:** Row Level Security enforced on all tables
