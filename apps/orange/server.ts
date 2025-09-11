import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const db = new Database('orange.db');

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    grid_size TEXT NOT NULL,
    moves INTEGER NOT NULL,
    time_taken INTEGER NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

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

// API: Get highscores
app.get('/api/highscores', (c) => {
  const scores = db.query(`
    SELECT player_name, grid_size, moves, time_taken, score
    FROM highscores 
    ORDER BY score DESC, moves ASC
    LIMIT 10
  `).all();
  return c.json(scores);
});

// API: Submit score
app.post('/api/score', async (c) => {
  const { player_name, grid_size, moves, time_taken } = await c.req.json();
  
  if (!player_name || !grid_size || typeof moves !== 'number' || typeof time_taken !== 'number') {
    return c.json({ error: 'Invalid data' }, 400);
  }
  
  // Calculate score based on grid size, moves, and time
  const basePoints = grid_size === '3x3' ? 1000 : grid_size === '4x4' ? 2500 : 5000;
  const movePenalty = moves * 10;
  const timePenalty = Math.floor(time_taken / 1000) * 5;
  const score = Math.max(100, basePoints - movePenalty - timePenalty);
  
  db.run(`
    INSERT INTO highscores (player_name, grid_size, moves, time_taken, score) 
    VALUES (?, ?, ?, ?, ?)
  `, [player_name, grid_size, moves, time_taken, score]);
  
  return c.json({ success: true, score });
});


const port = 3006;
console.log(`Orange app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};