import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const db = new Database('banana.db');

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    bananas_collected INTEGER NOT NULL,
    time_played INTEGER NOT NULL,
    bananas_per_second REAL NOT NULL,
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
    SELECT player_name, bananas_collected, time_played, bananas_per_second
    FROM highscores 
    ORDER BY bananas_collected DESC, bananas_per_second DESC
    LIMIT 10
  `).all();
  return c.json(scores);
});

// API: Submit score
app.post('/api/score', async (c) => {
  const { player_name, bananas_collected, time_played } = await c.req.json();
  
  if (!player_name || typeof bananas_collected !== 'number' || typeof time_played !== 'number') {
    return c.json({ error: 'Invalid data' }, 400);
  }
  
  const bananas_per_second = time_played > 0 ? bananas_collected / (time_played / 1000) : 0;
  
  db.run(`
    INSERT INTO highscores (player_name, bananas_collected, time_played, bananas_per_second) 
    VALUES (?, ?, ?, ?)
  `, [player_name, bananas_collected, time_played, bananas_per_second]);
  
  return c.json({ success: true });
});


const port = process.env.PORT || 3004;
console.log(`Banana app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};