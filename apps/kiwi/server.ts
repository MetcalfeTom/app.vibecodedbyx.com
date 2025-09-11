import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const db = new Database('kiwi.db');

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    time_taken INTEGER NOT NULL,
    moves_made INTEGER NOT NULL,
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
  const scores = db.query(`
    SELECT player_name, difficulty, time_taken, moves_made, score
    FROM highscores 
    ORDER BY score DESC, time_taken ASC
    LIMIT 10
  `).all();
  return c.json(scores);
});

// API: Submit score
app.post('/api/score', async (c) => {
  const { player_name, difficulty, time_taken, moves_made } = await c.req.json();
  
  if (!player_name || !difficulty || typeof time_taken !== 'number' || typeof moves_made !== 'number') {
    return c.json({ error: 'Invalid data' }, 400);
  }
  
  // Calculate score: base points minus time penalty and move penalty
  const basePoints = difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 2000 : 3000;
  const timePenalty = Math.floor(time_taken / 1000) * 2; // 2 points per second
  const movePenalty = moves_made * 5; // 5 points per move
  const score = Math.max(100, basePoints - timePenalty - movePenalty);
  
  db.run(`
    INSERT INTO highscores (player_name, difficulty, time_taken, moves_made, score) 
    VALUES (?, ?, ?, ?, ?)
  `, [player_name, difficulty, time_taken, moves_made, score]);
  
  return c.json({ success: true, score });
});


const port = process.env.PORT || 3005;
console.log(`Kiwi app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};