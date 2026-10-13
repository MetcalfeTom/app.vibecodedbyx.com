// The front page: a list of every app, newest first. From the Sloppy's Factory kit.
// usage: node scripts/index.mjs
// Reads apps/*/index.html (the <title> and the meta description) and the time of
// each folder's last git commit, then writes apps/index.html. Any static host that
// serves the apps/ folder then shows the list at / and each app at /<name>/.
// Run it at /ship after the app's commit, then commit apps/index.html too.
// It only overwrites an apps/index.html that it wrote itself (add --force to replace another one).
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const appsDir = join(root, 'apps');
const out = join(appsDir, 'index.html');
const MARK = '<meta name="generator" content="scripts/index.mjs">';
const SITE = 'Our apps'; // the heading on the page: change it to your stream's name

if (!existsSync(appsDir)) { console.log('No apps/ folder here. Run this from your factory.'); process.exit(1); }
if (existsSync(out) && !readFileSync(out, 'utf8').includes(MARK) && !process.argv.includes('--force')) {
  console.log('apps/index.html exists and was not made by this script, so it stays as it is. Add --force to replace it.');
  process.exit(1);
}

const unent = s => s.replace(/&(amp|lt|gt|quot|#39|apos);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" })[e]);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = s => unent(s.replace(/\s+/g, ' ').trim());
function lastCommit(name) {
  try {
    const t = execFileSync('git', ['log', '-1', '--format=%cI', '--', join('apps', name)], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (t) return t;
  } catch { /* not a git repository, or git is missing */ }
  return statSync(join(appsDir, name, 'index.html')).mtime.toISOString(); // not committed yet: the file's own time
}

const apps = readdirSync(appsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && !/^[._]/.test(d.name) && existsSync(join(appsDir, d.name, 'index.html')))
  .map(d => {
    const html = readFileSync(join(appsDir, d.name, 'index.html'), 'utf8');
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
    const metas = html.match(/<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) || []; // whole tags, even with > inside quotes
    const meta = metas.find(m => /\bname=["']?description["']?(\s|\/|>)/i.test(m)) || '';
    const desc = (meta.match(/\bcontent=(?:"([^"]*)"|'([^']*)')/i) || []).slice(1).find(x => x != null);
    return { name: d.name, title: title ? clean(title) : d.name, desc: desc ? clean(desc) : '', when: lastCommit(d.name) };
  })
  .sort((a, b) => Date.parse(b.when) - Date.parse(a.when));

const items = apps.map(a => `    <li>
      <a href="${esc(encodeURIComponent(a.name))}/">${esc(a.title)}</a>
      ${a.desc ? `<p>${esc(a.desc)}</p>\n      ` : ''}<time datetime="${esc(a.when)}">${esc(a.when.slice(0, 10))}</time>
    </li>`).join('\n');

writeFileSync(out, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${MARK}
<title>${esc(SITE)}</title>
<meta name="description" content="${esc(`${apps.length} small apps, built live from chat ideas. Newest first.`)}">
<style>
  :root { color-scheme: light dark; --bg: #f6f1e4; --ink: #1d1b16; --dim: #5a5446; --hi: #9c3412; }
  @media (prefers-color-scheme: dark) { :root { --bg: #17241f; --ink: #f1e9d6; --dim: #c9c1ad; --hi: #f5c518; } }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 1.05rem/1.5 Georgia, 'Iowan Old Style', serif; }
  main { max-width: 42rem; margin: 0 auto; padding: 2rem 1rem 4rem; }
  h1 { font-size: 2.4rem; line-height: 1.1; margin: 0 0 .3rem; }
  .sub { color: var(--dim); margin: 0 0 1.5rem; }
  ol { list-style: none; margin: 0; padding: 0; }
  li { padding: .9rem 0; border-top: 1px solid color-mix(in srgb, var(--ink) 20%, transparent); }
  a { color: var(--hi); font-weight: 700; font-size: 1.2rem; text-underline-offset: .2em; }
  a:focus-visible { outline: 3px solid var(--hi); outline-offset: 3px; }
  p { margin: .2rem 0; }
  time { color: var(--dim); font: .8rem ui-monospace, monospace; }
</style>
</head>
<body>
<main>
  <h1>${esc(SITE)}</h1>
  <p class="sub">${apps.length} app${apps.length === 1 ? '' : 's'}, newest first.</p>
  <ol>
${items}
  </ol>
</main>
</body>
</html>
`);
console.log(`apps/index.html: ${apps.length} app${apps.length === 1 ? '' : 's'}${apps[0] ? `, newest: ${apps[0].name}` : ''}`);
