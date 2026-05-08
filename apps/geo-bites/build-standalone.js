// Regenerate `standalone.html` from `index.html` with suncalc + opening_hours inlined.
// Run with: node apps/geo-bites/build-standalone.js
//
// Requires the two libs to be fetched once:
//   curl -fsSL -o /tmp/suncalc.min.js         https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js
//   curl -fsSL -o /tmp/opening_hours.min.js   https://cdn.jsdelivr.net/npm/opening_hours@3.8.0/build/opening_hours.min.js
//
// The download button on the live site links at this generated file.
// The generated file itself drops that button (you already have it).

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname);
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const sun = fs.readFileSync('/tmp/suncalc.min.js', 'utf8');
const oh  = fs.readFileSync('/tmp/opening_hours.min.js', 'utf8');

let out = html;
out = out.replace(
  /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/suncalc[^"]+"><\/script>/,
  '<!-- suncalc.min.js inlined for standalone use -->\n<script>\n' + sun + '\n<\/script>'
);
out = out.replace(
  /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/opening_hours[^"]+"><\/script>/,
  '<!-- opening_hours.min.js inlined for standalone use -->\n<script>\n' + oh + '\n<\/script>'
);
out = out.replace(
  '<title>geo-bites · find an open spot nearby</title>',
  '<title>geo-bites · standalone bundle</title>'
);
out = out.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Standalone single-file build of geo-bites — opening_hours.js + SunCalc inlined. Save to disk and open anywhere.">'
);
// drop the live download button — user already has the file
out = out.replace(
  /\s*<a class="btn ghost" id="downloadBtn"[\s\S]*?<\/a>/,
  ''
);
// stamp the masthead so the standalone is recognisable
out = out.replace('<span>vol. I</span>', '<span>vol. I · standalone</span>');

fs.writeFileSync(path.join(dir, 'standalone.html'), out);
console.log('wrote standalone.html · ' + out.length + ' bytes');
