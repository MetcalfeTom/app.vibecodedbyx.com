import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

const app = new Hono();

// Serve static assets from ./public via /static/*
app.use('/static/*', serveStatic({
  root: './',
  rewriteRequestPath: (path) => path.replace(/^\/static/, '/public'),
}));

// Main page
app.get('/', async (c) => {
  const html = await Bun.file('./views/index.html').text();
  return c.html(html);
});

const port = 3013;
console.log(`Business app running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};

