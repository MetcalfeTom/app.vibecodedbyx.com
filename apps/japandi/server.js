const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=UTF-8'
};

function send(res, code, data, headers = {}) {
  res.writeHead(code, {
    'Cache-Control': 'public, max-age=3600',
    ...headers
  });
  res.end(data);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(publicDir, urlPath);

  // Prevent path traversal
  if (!filePath.startsWith(publicDir)) {
    return send(res, 400, 'Bad Request');
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        // Fallback to SPA index.html for unknown routes
        const fallback = path.join(publicDir, 'index.html');
        fs.readFile(fallback, (fallbackErr, fallbackData) => {
          if (fallbackErr) return send(res, 404, 'Not Found');
          return send(res, 200, fallbackData, { 'Content-Type': 'text/html; charset=UTF-8' });
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mimeTypes[ext] || 'application/octet-stream';
      send(res, 200, data, { 'Content-Type': type });
    });
  });
});

server.listen(port, () => {
  console.log(`JAPANDI APP LISTENING ON PORT ${port}`);
});

