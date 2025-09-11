import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const db = new Database('snake.db');

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
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
  const scores = db.query('SELECT player_name, score FROM highscores ORDER BY score DESC LIMIT 10').all();
  return c.json(scores);
});

// API: Submit score
app.post('/api/score', async (c) => {
  const { player_name, score } = await c.req.json();
  
  if (!player_name || typeof score !== 'number') {
    return c.json({ error: 'Invalid player_name or score' }, 400);
  }
  
  db.run('INSERT INTO highscores (player_name, score) VALUES (?, ?)', [player_name, score]);
  return c.json({ success: true });
});


const port = 3001;
console.log(`Snake app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};