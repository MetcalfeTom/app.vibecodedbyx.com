# app-002 — Static Platformer (Nginx)

Static HTML/JS game served by Nginx.

## Run with Docker
```bash
docker build -t app-002 ./apps/app-002
docker run -d --restart always --name app-002 -p 3002:3000 app-002
```

Open: http://localhost:3002

## Notes
- No Node/npm required.
- Served by Nginx listening on port 3000 inside the container.

