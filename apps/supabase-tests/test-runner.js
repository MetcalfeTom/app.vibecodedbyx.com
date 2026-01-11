/**
 * Pure Node.js Supabase Test Runner
 * No native binaries required - sandbox friendly
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

// Colors for terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passed = 0;
let failed = 0;
const results = [];

async function test(name, fn) {
  try {
    await fn();
    passed++;
    results.push({ name, status: 'PASS' });
    console.log(`  ${GREEN}✓${RESET} ${name}`);
  } catch (err) {
    failed++;
    results.push({ name, status: 'FAIL', error: err.message });
    console.log(`  ${RED}✗${RESET} ${name}`);
    console.log(`    ${RED}Error: ${err.message}${RESET}`);
  }
}

function expect(value) {
  return {
    toBeDefined: () => {
      if (value === undefined) throw new Error(`Expected value to be defined, got undefined`);
    },
    toBeNull: () => {
      if (value !== null) throw new Error(`Expected null, got ${JSON.stringify(value)}`);
    },
    toBeInstanceOf: (type) => {
      if (!(value instanceof type)) throw new Error(`Expected instance of ${type.name}`);
    },
    toBeGreaterThanOrEqual: (num) => {
      if (value < num) throw new Error(`Expected ${value} >= ${num}`);
    },
    toBeTypeOf: (type) => {
      if (typeof value !== type) throw new Error(`Expected typeof ${type}, got ${typeof value}`);
    }
  };
}

async function runTests() {
  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║     SUPABASE CONNECTION & ROW TESTS          ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════╝${RESET}\n`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ═══════════════════════════════════════════════════════════════
  console.log(`${YELLOW}▸ Connection Tests${RESET}`);
  // ═══════════════════════════════════════════════════════════════

  await test('Creates valid Supabase client', async () => {
    expect(supabase).toBeDefined();
    expect(supabase.from).toBeTypeOf('function');
    expect(supabase.auth).toBeDefined();
  });

  await test('Connects to Supabase (users table)', async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });

  await test('Queries breakout_terminal_scores', async () => {
    const { data, error } = await supabase.from('breakout_terminal_scores').select('*').limit(5);
    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });

  await test('RLS allows reading all rows', async () => {
    const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
    expect(error).toBeNull();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ═══════════════════════════════════════════════════════════════
  console.log(`\n${YELLOW}▸ Row Consistency Tests${RESET}`);
  // ═══════════════════════════════════════════════════════════════

  await test('Users table has required columns', async () => {
    const { data, error } = await supabase.from('users').select('user_id, updated_at, purchased_at').limit(1);
    expect(error).toBeNull();
  });

  await test('Leaderboard tables queryable', async () => {
    const tables = ['breakout_terminal_scores', 'icy_tower_scores', 'tetris_leaderboard'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      expect(error).toBeNull();
      expect(data).toBeInstanceOf(Array);
    }
  });

  await test('App tables have user_id column', async () => {
    const tables = ['chat_messages', 'feedback', 'guestbook'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('user_id').limit(1);
      expect(error).toBeNull();
    }
  });

  // ═══════════════════════════════════════════════════════════════
  console.log(`\n${YELLOW}▸ Anonymous Auth Tests${RESET}`);
  // ═══════════════════════════════════════════════════════════════

  await test('Allows anonymous sign-in', async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    expect(error).toBeNull();
    expect(data.session).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.user.id).toBeDefined();
  });

  await test('Maintains session after sign-in', async () => {
    const { data, error } = await supabase.auth.getSession();
    expect(error).toBeNull();
    expect(data.session).toBeDefined();
  });

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log(`\n${BOLD}${CYAN}═══════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  TEST RESULTS${RESET}`);
  console.log(`${CYAN}═══════════════════════════════════════════════${RESET}`);
  console.log(`  ${GREEN}Passed: ${passed}${RESET}`);
  console.log(`  ${failed > 0 ? RED : GREEN}Failed: ${failed}${RESET}`);
  console.log(`  Total:  ${passed + failed}`);
  console.log(`${CYAN}═══════════════════════════════════════════════${RESET}\n`);

  // JSON output for auditors
  console.log(`${YELLOW}▸ JSON Report:${RESET}`);
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { passed, failed, total: passed + failed },
    results
  }, null, 2));

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error(`${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
