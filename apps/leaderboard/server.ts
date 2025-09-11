import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();

// Create a unified leaderboard database
const db = new Database('leaderboard.db');

// Initialize database with global scores table
db.run(`
  CREATE TABLE IF NOT EXISTS global_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    game TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create index for faster queries
db.run(`CREATE INDEX IF NOT EXISTS idx_score ON global_scores(score DESC)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_game ON global_scores(game)`);

// Serve static files
app.use('/static/*', serveStatic({
  root: './',
  rewriteRequestPath: (path) => path.replace(/^\/static/, '/public')
}));

// Main page
app.get('/', async (c) => {
  const html = await Bun.file('./views/index.html').text();
  return c.html(html);
});

// API: Get all-time top scores across all games
app.get('/api/global-top', (c) => {
  const scores = db.query(`
    SELECT player_name, game, score, created_at
    FROM global_scores 
    ORDER BY score DESC
    LIMIT 50
  `).all();
  return c.json(scores);
});

// API: Get top scores by game
app.get('/api/by-game', (c) => {
  const scores = db.query(`
    WITH RankedScores AS (
      SELECT 
        player_name,
        game,
        score,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY game ORDER BY score DESC) as rank
      FROM global_scores
    )
    SELECT player_name, game, score, created_at
    FROM RankedScores
    WHERE rank <= 5
    ORDER BY game, rank
  `).all();
  
  // Group by game
  const grouped = scores.reduce((acc, score) => {
    if (!acc[score.game]) acc[score.game] = [];
    acc[score.game].push(score);
    return acc;
  }, {});
  
  return c.json(grouped);
});

// API: Get recent scores
app.get('/api/recent', (c) => {
  const scores = db.query(`
    SELECT player_name, game, score, created_at
    FROM global_scores 
    ORDER BY created_at DESC
    LIMIT 20
  `).all();
  return c.json(scores);
});

// API: Submit score (called by individual games)
app.post('/api/submit', async (c) => {
  const { player_name, game, score } = await c.req.json();
  
  if (!player_name || !game || typeof score !== 'number') {
    return c.json({ error: 'Invalid data' }, 400);
  }
  
  db.run(`
    INSERT INTO global_scores (player_name, game, score) 
    VALUES (?, ?, ?)
  `, [player_name, game, score]);
  
  return c.json({ success: true });
});

// API: Get stats
app.get('/api/stats', (c) => {
  const stats = db.query(`
    SELECT 
      COUNT(DISTINCT player_name) as total_players,
      COUNT(*) as total_scores,
      COUNT(DISTINCT game) as total_games,
      MAX(score) as highest_score,
      (SELECT game FROM global_scores ORDER BY score DESC LIMIT 1) as highest_score_game
    FROM global_scores
  `).get();
  
  return c.json(stats);
});

const port = 3003;
console.log(`Global Leaderboard running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};