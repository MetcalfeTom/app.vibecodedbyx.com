# VibeCodedByX Apps

Monorepo of small, self-contained apps. Each app lives under `apps/[app-id]`, runs in its own Docker container on a 3xxx port, and gets a subdomain `app-XYZ.vibecodedbyx.com`.

## Prerequisites
- Docker (recommended for consistent runs)
- For local dev of Node apps: Node 18+ and npm 9+

## Structure
- `index.html` — Navigation index
- `apps/app-001` — Node/Express app (port 3000 in container)
- `apps/app-002` — Static Nginx site

## Quick Start (Docker)
Build and run each app on its own local port:

```bash
docker build -t app-001 ./apps/app-001
docker run -d --restart always --name app-001 -p 3001:3000 app-001

docker build -t app-002 ./apps/app-002
docker run -d --restart always --name app-002 -p 3002:3000 app-002
```

Open:
- app-001: http://localhost:3001 (health: `/health`)
- app-002: http://localhost:3002

## Local Dev (without Docker)
Important: run npm only inside the app folder. There is no `package.json` at the repo root.

```bash
cd apps/app-001
npm install
npm start
# open http://localhost:3001
```

Notes:
- `npm ci` requires a lockfile; use `npm install` for now.
- app-002 is static; no npm needed.

## Troubleshooting
- ENOENT or “no package.json”: ensure you’re in `apps/app-001` before running npm.
- Network/registry hiccups: retry or use Docker which bundles Node 18.
- Peer conflict errors: try `npm install --legacy-peer-deps` (not expected here).

