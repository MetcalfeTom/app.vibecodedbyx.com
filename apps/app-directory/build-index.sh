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
import { execSync } from 'child_process';
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

// Bake creators per slug from one git log walk over apps/. For each
// commit, every apps/<slug>/ file touched bumps the (slug, author)
// counter; emit the top 5 authors per slug as {name, commits}.
function bakeCreators(){
  const raw = execSync(
    \"git -C /vibespace log --pretty=format:%H%x09%aN --name-only --since=180.days.ago -- apps/\",
    {encoding:'utf8', maxBuffer: 64*1024*1024}
  );
  const perSlug = new Map();   // slug -> Map<author, count>
  let curAuthor = null, curSeen = null;
  for (const line of raw.split('\n')){
    if (!line){ curAuthor = null; curSeen = null; continue; }
    if (line.includes('\\t')){
      const parts = line.split('\\t');
      if (parts.length === 2){ curAuthor = parts[1]; curSeen = new Set(); continue; }
    }
    if (!curAuthor) continue;
    if (!line.startsWith('apps/')) continue;
    const parts = line.split('/');
    if (parts.length < 2 || !parts[1]) continue;
    const slug = parts[1];
    // count each slug at most once per commit (so a commit touching 10
    // files in one app only adds 1 to that author's tally for that app).
    const key = slug + '\\x00' + curAuthor;
    if (curSeen.has(key)) continue;
    curSeen.add(key);
    if (!perSlug.has(slug)) perSlug.set(slug, new Map());
    const m = perSlug.get(slug);
    m.set(curAuthor, (m.get(curAuthor) || 0) + 1);
  }
  const out = {};
  for (const [slug, m] of perSlug.entries()){
    const ranked = [...m.entries()].sort((a,b) => b[1]-a[1]).slice(0, 5);
    out[slug] = ranked.map(([name, commits]) => ({name, commits}));
  }
  return out;
}

let CREATORS = {};
try { CREATORS = bakeCreators(); }
catch(e){ console.error('creator bake failed:', e.message); }

// The git-author tally is dominated by 'sloppy' (the bot makes 99% of
// commits) so it's not useful for 'find apps by user X'. The real chat
// attribution lives in sloppy-ops/data.json under chat_credits_by_app,
// baked from regex over commit subjects ('per X', 'X's request',
// '(handle)', etc). Merge it in so the directory can filter by chat
// handle.
let CHAT_BY_APP = {};
try {
  const d = JSON.parse(fs.readFileSync('/vibespace/apps/sloppy-ops/data.json','utf8'));
  CHAT_BY_APP = d.chat_credits_by_app || {};
} catch(e){ console.error('chat-credits load failed:', e.message); }

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
  // 'creators' on each entry merges both signals: chat handles
  // (real attribution from commit subjects, prioritised) followed by
  // any non-bot git authors. Each entry: {name, commits, kind:'chat'|'git'}.
  const merged = [];
  const seen = new Set();
  for (const c of (CHAT_BY_APP[slug] || [])){
    const name = c.username;
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    merged.push({name, commits: c.mentions, kind: 'chat'});
  }
  for (const c of (CREATORS[slug] || [])){
    const name = c.name;
    if (!name || /^(sloppy|root|bot|system|github|noreply)$/i.test(name)) continue;
    if (seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    merged.push({name, commits: c.commits, kind: 'git'});
  }
  out.push({slug, mtime, title, desc, keywords: '', creators: merged.slice(0, 6)});
}
out.sort((a,b) => a.slug.localeCompare(b.slug));
fs.writeFileSync('$TMP', JSON.stringify(out));
const withCreators = out.filter(a => a.creators && a.creators.length).length;
console.error('indexed', out.length, 'apps ·', withCreators, 'with creator data');
"

mv "$TMP" "$OUT"
chmod 644 "$OUT"
echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
