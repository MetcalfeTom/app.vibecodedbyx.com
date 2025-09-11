import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { Database } from 'bun:sqlite';
import path from 'path';

const app = new Hono();
const port = process.env.PORT || 3013;

// Initialize SQLite database
const dbPath = path.join(__dirname, 'data', 'scores.db');
const db = new Database(dbPath);

// Create scores table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    slices INTEGER NOT NULL,
    accuracy REAL NOT NULL,
    combo_best INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Serve static files
app.use('/*', serveStatic({ root: './public' }));

// API endpoints
app.post('/api/score', async (c) => {
  try {
    const body = await c.req.json();
    const { player_name, score, slices, accuracy, combo_best } = body;
    
    if (!player_name || score === undefined) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const stmt = db.prepare(
      'INSERT INTO scores (player_name, score, slices, accuracy, combo_best) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(player_name, score, slices || 0, accuracy || 0, combo_best || 0);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving score:', error);
    return c.json({ error: 'Failed to save score' }, 500);
  }
});

app.get('/api/highscores', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const scores = db.prepare(
      'SELECT player_name, score, slices, accuracy, combo_best FROM scores ORDER BY score DESC LIMIT ?'
    ).all(limit);
    
    return c.json(scores);
  } catch (error) {
    console.error('Error fetching highscores:', error);
    return c.json({ error: 'Failed to fetch highscores' }, 500);
  }
});

app.get('/api/stats', async (c) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_games,
        MAX(score) as highest_score,
        AVG(score) as average_score,
        MAX(slices) as most_slices,
        MAX(accuracy) as best_accuracy,
        MAX(combo_best) as best_combo
      FROM scores
    `).get();
    
    return c.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

console.log(`🍉 Watermelon Slice server running on port ${port}`);

export default {
  port,
  fetch: app.fetch
};