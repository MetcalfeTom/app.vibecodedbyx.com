#!/usr/bin/env node
// build-standalone.js — regenerate standalone.html from index.html.
//
// Unlike geo-bites (which has to inline suncalc + opening_hours), the
// story engine has no external JS dependencies — everything lives in the
// single index.html script tag. Generating the standalone variant is
// therefore mostly a courtesy:
//
//   1. Drop the "▼ standalone" header button (the user already has the
//      file; downloading it again from a downloaded file is silly and
//      would 404 because there's no nginx serving the asset).
//   2. Retitle <title> + masthead so the bundle is visually distinct
//      from the live site.
//   3. Strip any TODO-only comments that mention server-side build
//      paths (none currently — placeholder for future).
//
// Re-run after any index.html change:  node build-standalone.js
//
// Both files live next to each other in apps/neon-story-engine/.

const fs   = require('fs');
const path = require('path');

const here = __dirname;
const src  = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
let out = src;

// 1. drop the standalone download button (entire <a id="standaloneBtn"> line)
out = out.replace(
  /\s*<a class="pill" id="standaloneBtn"[\s\S]*?>\s*▼ standalone\s*<\/a>/,
  '',
);

// 2. retitle so users can tell the saved file from the live site at a glance
out = out.replace(
  /<title>neon story engine · multi-agent text adventures<\/title>/,
  '<title>neon story engine · standalone</title>',
);

// 3. stamp the masthead — use a small badge that fits the existing
//    Audiowide title without breaking the centred layout.
out = out.replace(
  /<h1>neon <span class="accent">story<\/span> engine<\/h1>/,
  '<h1>neon <span class="accent">story</span> engine <span style="font-family:\'IBM Plex Mono\',monospace;font-size:.55rem;letter-spacing:.32em;color:var(--gold);vertical-align:middle;text-shadow:none;border:1px solid var(--gold);padding:.18rem .42rem;border-radius:.18rem">STANDALONE</span></h1>',
);

fs.writeFileSync(path.join(here, 'standalone.html'), out);
console.log('wrote standalone.html · ' + out.length + ' chars · ' +
  (out.length / 1024).toFixed(1) + ' KB');
