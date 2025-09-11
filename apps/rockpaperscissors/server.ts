import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const db = new Database('rockpaperscissors.db');

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    ties INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Serve static files (CSS, JS)
app.use('/static/*', serveStatic({ 
  root: './',
  rewriteRequestPath: (path) => path.replace(/^\/static/, '/public')
}));

// Main page - serve HTML file
app.get('/', async (c) => {
  const html = await Bun.file('./views/index.html').text();
  return c.html(html);
});

// API: Get highscores
app.get('/api/highscores', (c) => {
  const scores = db.query(`
    SELECT player_name, wins, losses, ties, 
           (wins * 3 + ties) as score
    FROM highscores 
    ORDER BY score DESC, wins DESC 
    LIMIT 10
  `).all();
  return c.json(scores);
});

// API: Submit game result
app.post('/api/result', async (c) => {
  const { player_name, wins, losses, ties } = await c.req.json();
  
  if (!player_name || typeof wins !== 'number' || typeof losses !== 'number' || typeof ties !== 'number') {
    return c.json({ error: 'Invalid data' }, 400);
  }
  
  // Check if player exists, if so update their stats
  const existing = db.query('SELECT * FROM highscores WHERE player_name = ?').get(player_name);
  
  if (existing) {
    db.run(`
      UPDATE highscores 
      SET wins = wins + ?, losses = losses + ?, ties = ties + ? 
      WHERE player_name = ?
    `, [wins, losses, ties, player_name]);
  } else {
    db.run('INSERT INTO highscores (player_name, wins, losses, ties) VALUES (?, ?, ?, ?)', 
           [player_name, wins, losses, ties]);
  }
  
  return c.json({ success: true });
});


const port = process.env.PORT || 3003;
console.log(`Rock Paper Scissors app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};