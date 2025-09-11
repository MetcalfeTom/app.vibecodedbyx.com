import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { Database } from 'bun:sqlite';

const app = new Hono();
const port = 3015;

// Initialize SQLite database for pirate adventure scores
const dbPath = './pirate_adventure.db';
const db = new Database(dbPath);

// Create high scores table
db.run(`
  CREATE TABLE IF NOT EXISTS pirate_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pirate_name TEXT NOT NULL,
    gold_collected INTEGER NOT NULL,
    battles_won INTEGER NOT NULL,
    ships_sunk INTEGER NOT NULL,
    total_score INTEGER NOT NULL,
    adventure_time INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Serve static files
app.use('/*', serveStatic({ root: './public' }));

// API to save pirate adventure score
app.post('/api/adventure-score', async (c) => {
  try {
    const body = await c.req.json();
    const { pirate_name, gold_collected, battles_won, ships_sunk, total_score, adventure_time } = body;
    
    if (!pirate_name || total_score === undefined) {
      return c.json({ error: 'Missing required fields, ye scurvy dog!' }, 400);
    }
    
    const stmt = db.prepare(
      'INSERT INTO pirate_scores (pirate_name, gold_collected, battles_won, ships_sunk, total_score, adventure_time) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(pirate_name, gold_collected || 0, battles_won || 0, ships_sunk || 0, total_score, adventure_time || 0);
    
    return c.json({ success: true, message: 'Score saved, ye legendary pirate!' });
  } catch (error) {
    console.error('Error saving adventure score:', error);
    return c.json({ error: 'Failed to save score to Davy Jones locker!' }, 500);
  }
});

// API to get pirate leaderboard
app.get('/api/pirate-leaderboard', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const scores = db.prepare(
      'SELECT pirate_name, gold_collected, battles_won, ships_sunk, total_score, adventure_time FROM pirate_scores ORDER BY total_score DESC LIMIT ?'
    ).all(limit);
    
    return c.json(scores);
  } catch (error) {
    console.error('Error fetching pirate leaderboard:', error);
    return c.json({ error: 'Failed to fetch the legendary pirates!' }, 500);
  }
});

// API to get pirate adventure stats
app.get('/api/pirate-stats', async (c) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_adventures,
        MAX(total_score) as highest_score,
        AVG(total_score) as average_score,
        SUM(gold_collected) as total_gold_collected,
        SUM(battles_won) as total_battles_won,
        SUM(ships_sunk) as total_ships_sunk
      FROM pirate_scores
    `).get();
    
    return c.json(stats);
  } catch (error) {
    console.error('Error fetching pirate stats:', error);
    return c.json({ error: 'Failed to fetch adventure statistics!' }, 500);
  }
});

console.log(`🏴‍☠️ AHOY! PIRATE ADVENTURE server running on port ${port} - ARRR!`);

export default {
  port,
  fetch: app.fetch
};