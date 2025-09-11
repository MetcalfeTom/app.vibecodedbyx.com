# app-001 — Hello Express

Minimal Express server exposing static files and a `/health` endpoint.

## Run with Docker (recommended)
```bash
docker build -t app-001 ./apps/app-001
docker run -d --restart always --name app-001 -p 3001:3000 app-001
```

Open: http://localhost:3001 (health: http://localhost:3001/health)

## Local Dev (Node 18+)
```bash
cd apps/app-001
npm install
npm start
```

Scripts:
- `npm start` — runs `node server.js`

## Environment
- Port: `PORT` (defaults to 3000 inside container)
- Node: 18+ (Dockerfile uses `node:18-alpine`)

## Troubleshooting
- Run npm inside `apps/app-001` (root has no `package.json`).
- No lockfile yet: prefer `npm install` over `npm ci`.
- If network issues occur, use the Docker flow above.

