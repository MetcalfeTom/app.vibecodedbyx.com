import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const db = new Database('strawberry.db');

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    level_reached INTEGER NOT NULL,
    time_played INTEGER NOT NULL,
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
    SELECT player_name, score, level_reached, time_played
    FROM highscores 
    ORDER BY score DESC, level_reached DESC
    LIMIT 10
  `).all();
  return c.json(scores);
});

// API: Submit score
app.post('/api/score', async (c) => {
  const { player_name, score, level_reached, time_played } = await c.req.json();
  
  if (!player_name || typeof score !== 'number' || typeof level_reached !== 'number' || typeof time_played !== 'number') {
    return c.json({ error: 'Invalid data' }, 400);
  }
  
  db.run(`
    INSERT INTO highscores (player_name, score, level_reached, time_played) 
    VALUES (?, ?, ?, ?)
  `, [player_name, score, level_reached, time_played]);
  
  return c.json({ success: true });
});


const port = 3008;
console.log(`Strawberry app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};