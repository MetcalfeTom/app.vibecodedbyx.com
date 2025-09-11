import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

const app = new Hono();

// Serve static files
app.use('/static/*', serveStatic({
  root: './',
  rewriteRequestPath: (path) => path.replace(/^\/static/, '/public')
}));

// Main page
app.get('/', async (c) => {
  const html = await Bun.file('./public/index.html').text();
  return c.html(html);
});

const port = 3015;
console.log(`PIRATE BATTLE running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};