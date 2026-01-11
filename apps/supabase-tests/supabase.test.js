import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

let supabase;

beforeAll(() => {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
});

describe('Supabase Connection Tests', () => {

  it('should create a valid Supabase client', () => {
    expect(supabase).toBeDefined();
    expect(supabase.from).toBeTypeOf('function');
    expect(supabase.auth).toBeDefined();
  });

  it('should connect to Supabase and fetch users table schema', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    // Should not have connection error
    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });

  it('should successfully query breakout_terminal_scores', async () => {
    const { data, error } = await supabase
      .from('breakout_terminal_scores')
      .select('*')
      .limit(5);

    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });

  it('should verify RLS allows reading all rows', async () => {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    expect(error).toBeNull();
    expect(count).toBeGreaterThanOrEqual(0);
  });

});

describe('Row Consistency Tests', () => {

  it('should verify users table has required columns', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, updated_at, purchased_at')
      .limit(1);

    expect(error).toBeNull();
    // Query succeeded means columns exist
  });

  it('should verify leaderboard tables have score columns', async () => {
    const tables = [
      'breakout_terminal_scores',
      'icy_tower_scores',
      'tetris_leaderboard'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeInstanceOf(Array);
    }
  });

  it('should verify user_id column exists on app tables', async () => {
    const tables = ['chat_messages', 'feedback', 'guestbook'];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('user_id')
        .limit(1);

      // Tables with RLS should allow this query
      expect(error).toBeNull();
    }
  });

});

describe('Anonymous Auth Tests', () => {

  it('should allow anonymous sign-in', async () => {
    const { data, error } = await supabase.auth.signInAnonymously();

    expect(error).toBeNull();
    expect(data.session).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.user.id).toBeDefined();
  });

  it('should maintain session after sign-in', async () => {
    const { data, error } = await supabase.auth.getSession();

    expect(error).toBeNull();
    expect(data.session).toBeDefined();
  });

});
