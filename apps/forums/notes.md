# Forums - AdonisJS 6 Project

## Log
- 2025-11-11: Created AdonisJS 6 project with web kit
- Configured to run on 0.0.0.0:5173 for external access
- Database: SQLite
- Auth: Session-based authentication
- Dev server running with Hot Module Reload (HMR)

## About
Full-stack forum application built with AdonisJS 6 framework.

## Server Configuration
- **Host:** 0.0.0.0 (accessible from outside)
- **Port:** 3000
- **Environment:** Development
- **Watch Mode:** HMR enabled

## Access
- **Local:** http://localhost:3000
- **External:** http://[PUBLIC_IP]:3000 or http://sloppy.live:3000
- **Note:** This is a Node.js server, not static files like other apps
- **Important:** Port 3000 must be exposed by the container/hosting environment

## Development
Start the dev server:
```bash
cd /vibespace/apps/forums
npm run dev
```

Stop the server:
```bash
# Find the process ID
ps aux | grep "node ace serve"
# Kill it
kill [PID]
```

## Tech Stack
- **Framework:** AdonisJS 6
- **Database:** SQLite (file-based)
- **ORM:** Lucid
- **Auth:** Session guard with cookies
- **Template Engine:** Edge
- **Asset Bundler:** Vite

## Features Included
- User authentication (register/login)
- Session management
- Database migrations
- Hot module reload
- Security headers (CSRF, XSS protection)

## Directory Structure
```
forums/
├── app/              # Application code (controllers, models)
├── config/           # Configuration files
├── database/         # Migrations and seeders
├── resources/        # Views, CSS, JS
├── start/            # Bootstrap files and routes
├── public/           # Static assets
└── .env             # Environment variables
```

## Important Files
- `.env` - Environment configuration (PORT=5173, HOST=0.0.0.0)
- `start/routes.ts` - Route definitions
- `database/migrations/` - Database schema
- `resources/views/` - Edge templates

## Database
SQLite database file: `tmp/db.sqlite3`

Run migrations:
```bash
node ace migration:run
```

## Issues
- AdonisJS is a backend server, different from static apps
- Requires Node.js process to stay running
- Not compatible with static file serving used by other apps

## Todos
- Create forum models (categories, threads, posts)
- Build forum UI with Edge templates
- Add user authentication pages
- Create forum routes and controllers
- Set up database migrations for forum tables
- Add real-time features if needed
- Consider deployment strategy (PM2, Docker, etc.)
