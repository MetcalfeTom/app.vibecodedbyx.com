
const fs = require('fs');
const path = require('path');

const appsDir = './apps';

function inject(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      inject(fullPath);
    } else if (file === 'index.html') {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('vibelib-extended.js')) {
        if (content.includes('</body>')) {
          content = content.replace('</body>', '<script src="/vibelib-extended.js"></script>\n</body>');
          fs.writeFileSync(fullPath, content);
          console.log(`Injected into ${fullPath}`);
        } else {
            // Some files might not have body tag, append to end
            content += '\n<script src="/vibelib-extended.js"></script>';
            fs.writeFileSync(fullPath, content);
            console.log(`Appended to ${fullPath}`);
        }
      }
    }
  }
}

inject(appsDir);
