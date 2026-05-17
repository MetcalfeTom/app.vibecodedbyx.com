#!/usr/bin/env bash
# Builds index.json for the app-directory app by scanning every
# subdirectory of /vibespace/apps/ and extracting title + og:description
# from each app's index.html. Run from cron to keep the directory fresh.
# The official /_bar/apps-index.json is updated externally and lags
# behind, so we self-serve a complete list from disk.

set -euo pipefail
ROOT="/vibespace/apps"
OUT="/vibespace/apps/app-directory/index.json"
TMP="$(mktemp)"

node --input-type=module -e "
import fs from 'fs';
import path from 'path';
const root = '$ROOT';
const dirs = fs.readdirSync(root, {withFileTypes:true})
  .filter(d => d.isDirectory())
  .map(d => d.name);

function pick(html, regex){
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}
function decode(s){
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/&quot;/g,'\"').replace(/&#39;/g,\"'\").replace(/&nbsp;/g,' ');
}

const out = [];
for (const slug of dirs){
  const f = path.join(root, slug, 'index.html');
  let title='', desc='', mtime=0;
  try { mtime = Math.floor(fs.statSync(f).mtimeMs / 1000); }
  catch(e){ continue; }   // skip dirs with no index.html
  let html = '';
  try { html = fs.readFileSync(f, 'utf8').slice(0, 8192); }   // head section is plenty
  catch(e){ continue; }
  title = decode(
    pick(html, /<meta\s+property=[\"']og:title[\"']\s+content=[\"']([^\"']+)[\"']/i) ||
    pick(html, /<title>([^<]+)<\/title>/i)
  );
  desc = decode(
    pick(html, /<meta\s+property=[\"']og:description[\"']\s+content=[\"']([^\"']+)[\"']/i) ||
    pick(html, /<meta\s+name=[\"']description[\"']\s+content=[\"']([^\"']+)[\"']/i)
  );
  out.push({slug, mtime, title, desc, keywords: ''});
}
out.sort((a,b) => a.slug.localeCompare(b.slug));
fs.writeFileSync('$TMP', JSON.stringify(out));
console.error('indexed', out.length, 'apps');
"

mv "$TMP" "$OUT"
chmod 644 "$OUT"
echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
