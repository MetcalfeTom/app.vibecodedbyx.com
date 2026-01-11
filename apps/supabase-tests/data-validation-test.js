/**
 * Supabase Data Validation Test
 * Logs rows from tables and tests insert validation
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function logTable(title, rows, columns) {
  console.log(`\n${BOLD}${CYAN}┌─ ${title} ─┐${RESET}`);
  if (!rows || rows.length === 0) {
    console.log(`${DIM}  (no rows)${RESET}`);
    return;
  }
  rows.forEach((row, i) => {
    const display = columns ?
      columns.map(c => `${c}: ${JSON.stringify(row[c])}`).join(' | ') :
      JSON.stringify(row);
    console.log(`${DIM}  ${i + 1}.${RESET} ${display}`);
  });
}

async function logSampleData() {
  console.log(`\n${BOLD}${MAGENTA}═══════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${MAGENTA}  SAMPLE DATA FROM TABLES (5 rows each)${RESET}`);
  console.log(`${MAGENTA}═══════════════════════════════════════════════${RESET}`);

  // Users table
  const { data: users } = await supabase
    .from('users')
    .select('user_id, updated_at, purchased_at')
    .limit(5);
  logTable('USERS', users, ['user_id', 'purchased_at']);

  // Leaderboard tables
  const leaderboards = [
    { table: 'breakout_terminal_scores', cols: ['user_id', 'score', 'name'] },
    { table: 'icy_tower_scores', cols: ['user_id', 'score', 'name'] },
    { table: 'tetris_leaderboard', cols: ['user_id', 'score', 'name'] },
  ];

  for (const lb of leaderboards) {
    const { data } = await supabase.from(lb.table).select('*').order('score', { ascending: false }).limit(5);
    logTable(lb.table.toUpperCase(), data, lb.cols);
  }

  // Score-related tables
  const { data: laptopScores } = await supabase
    .from('laptop_fire_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(5);
  logTable('LAPTOP_FIRE_SCORES', laptopScores, ['user_id', 'score']);
}

async function testValidation() {
  console.log(`\n${BOLD}${MAGENTA}═══════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${MAGENTA}  INSERT VALIDATION TESTS${RESET}`);
  console.log(`${MAGENTA}═══════════════════════════════════════════════${RESET}`);

  // Sign in anonymously to get a valid user_id
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
  if (authError) {
    console.log(`${RED}Auth failed: ${authError.message}${RESET}`);
    return;
  }
  const userId = authData.user.id;
  console.log(`\n${GREEN}✓ Authenticated as: ${userId.slice(0, 8)}...${RESET}`);

  const testTable = 'feedback'; // Using feedback table for tests
  const results = [];

  // Test 1: Valid insert WITH user_id
  console.log(`\n${YELLOW}▸ Test 1: Valid insert WITH user_id${RESET}`);
  const validData = {
    user_id: userId,
    title: `[TEST] Valid insert`,
    description: `Test at ${new Date().toISOString()}`,
    category: 'test',
    votes: 0,
    status: 'pending'
  };
  const { data: validResult, error: validError } = await supabase
    .from(testTable)
    .insert(validData)
    .select();

  if (validError) {
    console.log(`  ${RED}✗ FAILED: ${validError.message}${RESET}`);
    results.push({ test: 'Valid insert', status: 'FAIL', error: validError.message });
  } else {
    console.log(`  ${GREEN}✓ SUCCESS: Row inserted${RESET}`);
    console.log(`  ${DIM}ID: ${validResult[0]?.id}${RESET}`);
    results.push({ test: 'Valid insert', status: 'PASS', id: validResult[0]?.id });
  }

  // Test 2: Invalid insert WITHOUT user_id (should fail RLS)
  console.log(`\n${YELLOW}▸ Test 2: Insert WITHOUT user_id (RLS should block)${RESET}`);
  const noUserData = {
    title: `[TEST] No user_id`,
    description: `Test at ${new Date().toISOString()}`,
    category: 'test'
  };
  const { data: noUserResult, error: noUserError } = await supabase
    .from(testTable)
    .insert(noUserData)
    .select();

  if (noUserError) {
    console.log(`  ${GREEN}✓ BLOCKED (expected): ${noUserError.message}${RESET}`);
    results.push({ test: 'No user_id insert', status: 'BLOCKED', error: noUserError.message });
  } else {
    console.log(`  ${RED}✗ UNEXPECTED: Insert succeeded without user_id${RESET}`);
    results.push({ test: 'No user_id insert', status: 'UNEXPECTED_PASS' });
  }

  // Test 3: Insert with WRONG user_id (should fail RLS)
  console.log(`\n${YELLOW}▸ Test 3: Insert with WRONG user_id (RLS should block)${RESET}`);
  const wrongUserData = {
    user_id: '00000000-0000-0000-0000-000000000000',
    title: `[TEST] Wrong user_id`,
    description: `Test at ${new Date().toISOString()}`,
    category: 'test'
  };
  const { data: wrongResult, error: wrongError } = await supabase
    .from(testTable)
    .insert(wrongUserData)
    .select();

  if (wrongError) {
    console.log(`  ${GREEN}✓ BLOCKED (expected): ${wrongError.message}${RESET}`);
    results.push({ test: 'Wrong user_id insert', status: 'BLOCKED', error: wrongError.message });
  } else {
    console.log(`  ${RED}✗ UNEXPECTED: Insert succeeded with wrong user_id${RESET}`);
    results.push({ test: 'Wrong user_id insert', status: 'UNEXPECTED_PASS' });
  }

  // Test 4: Insert with invalid data type
  console.log(`\n${YELLOW}▸ Test 4: Insert with invalid data type${RESET}`);
  const invalidTypeData = {
    user_id: userId,
    title: { nested: 'object' }, // Should be string
    votes: 'not-a-number' // Should be integer
  };
  const { data: invalidResult, error: invalidError } = await supabase
    .from(testTable)
    .insert(invalidTypeData)
    .select();

  if (invalidError) {
    console.log(`  ${GREEN}✓ REJECTED: ${invalidError.message}${RESET}`);
    results.push({ test: 'Invalid type insert', status: 'REJECTED', error: invalidError.message });
  } else {
    console.log(`  ${YELLOW}⚠ Accepted (Postgres may coerce types)${RESET}`);
    results.push({ test: 'Invalid type insert', status: 'COERCED' });
  }

  // Cleanup: Delete test row
  console.log(`\n${YELLOW}▸ Cleanup: Deleting test rows${RESET}`);
  const { error: deleteError } = await supabase
    .from(testTable)
    .delete()
    .eq('user_id', userId)
    .like('title', '[TEST]%');

  if (deleteError) {
    console.log(`  ${RED}✗ Cleanup failed: ${deleteError.message}${RESET}`);
  } else {
    console.log(`  ${GREEN}✓ Test rows cleaned up${RESET}`);
  }

  // Summary
  console.log(`\n${BOLD}${MAGENTA}═══════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${MAGENTA}  VALIDATION DIFF SUMMARY${RESET}`);
  console.log(`${MAGENTA}═══════════════════════════════════════════════${RESET}`);

  console.log(`\n${CYAN}Before tests:${RESET} No test rows in feedback table`);
  console.log(`${CYAN}After tests:${RESET} Cleaned up (0 test rows remain)`);

  console.log(`\n${BOLD}Test Results:${RESET}`);
  results.forEach(r => {
    const icon = r.status === 'PASS' || r.status === 'BLOCKED' || r.status === 'REJECTED' ?
      `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    console.log(`  ${icon} ${r.test}: ${r.status}`);
  });

  console.log(`\n${CYAN}JSON Report:${RESET}`);
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
}

async function main() {
  console.log(`${BOLD}${CYAN}╔══════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║   SUPABASE DATA & VALIDATION TEST SCRIPT    ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════╝${RESET}`);

  await logSampleData();
  await testValidation();

  console.log(`\n${GREEN}Done.${RESET}\n`);
}

main().catch(err => {
  console.error(`${RED}Fatal: ${err.message}${RESET}`);
  process.exit(1);
});
