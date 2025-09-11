import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

const app = new Hono();

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

const port = process.env.PORT || 3009;
console.log(`Grok app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};

