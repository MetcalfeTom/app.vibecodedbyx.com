# Vibe Coded Apps Template

Ultra-simple template for crowd-sourced AI coding experiments. Each app is independent - if one breaks, others keep running.

## Structure

```
/apps/
  /index/         # Landing page listing all apps
    server.ts     # Main server file
    package.json
  /tetris/        # Tetris game with highscores
    server.ts     # Server with routes & API
    /views/       # HTML templates
      index.html
    /public/      # Static files
      style.css
      game.js
    tetris.db     # SQLite database (auto-created)
    package.json
  /snake/         # Snake game with highscores  
    server.ts
    /views/
      index.html
    /public/
      style.css
      game.js
    snake.db
    package.json
/nginx/
  apps.conf       # Routes to apps (/, /tetris/, /snake/)
/scripts/
  run-local.sh    # Test locally
  startup-hetzner.sh  # Deploy on Hetzner
```

## Local Development

```bash
# Install Bun first: https://bun.sh
curl -fsSL https://bun.sh/install | bash

# Run all apps locally
cd sloppy_template
./scripts/run-local.sh

# Visit:
# http://localhost:3000 - Index (start here!)
# http://localhost:3001 - Snake
# http://localhost:3002 - Tetris
```

## Deploy to Hetzner

```bash
# SSH into your Hetzner server
ssh root@your-server-ip

# Clone and run
git clone [your-repo]
cd [your-repo]/sloppy_template
./scripts/startup-hetzner.sh

# Apps will be available at:
# http://your-server-ip/tetris/
# http://your-server-ip/snake/
```

## Adding New Apps

1. Create folder: `apps/newapp/`
2. Create the structure:
```
apps/newapp/
  server.ts       # Main server file
  package.json    # Dependencies (hono)
  /views/         # HTML files
    index.html
  /public/        # Static files
    style.css
    game.js (or app.js)
```
3. Basic `server.ts`:
```typescript
import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const db = new Database('newapp.db');

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }));

// Main page
app.get('/', async (c) => {
  const html = await Bun.file('./views/index.html').text();
  return c.html(html);
});

export default { 
  port: 3003,  // Next available port
  fetch: app.fetch 
};
```
4. Update nginx config to add route
5. Restart: `./scripts/startup-hetzner.sh`

## AI Coding Tips

- Server logic in `server.ts`, HTML in `views/`, JS/CSS in `public/`
- Database is automatic: just use `new Database('name.db')`
- Static files served from `/static/*` route
- If app crashes, systemd restarts it
- Keep it simple - no build steps, no complex dependencies
- Each app is isolated - can't break other apps

## Monitoring

```bash
# Check app status
sudo systemctl status vibe-tetris
sudo systemctl status vibe-snake

# View logs
sudo journalctl -u vibe-tetris -f
sudo journalctl -u vibe-snake -f

# Restart an app
sudo systemctl restart vibe-tetris
```

## Database Access

Each app has its own SQLite database:
```bash
# View highscores directly
sqlite3 apps/tetris/tetris.db "SELECT * FROM highscores;"
```

## Why This Structure?

- **Simple**: No build steps, minimal config
- **Isolated**: Each app is independent
- **AI-friendly**: Everything in one file, easy to understand
- **Resilient**: SystemD auto-restarts crashed apps
- **Fast**: Bun is fast, SQLite is fast, nginx is fast