// The factory doctor. From the Sloppy's Factory kit.
// usage: node scripts/doctor.mjs
// Walks the floor plan (kit/00-setup.md) and prints one line per item:
//   ✔ in place   ✘ missing (fix it before you go live)   ! worth a look
// Exits 1 if anything is ✘. It only looks at file names and git's own lists:
// it never opens .env or any other secret file, and it never uses the network.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url)); // the folder above scripts/
const at = (...p) => join(root, ...p);
const has = (...p) => existsSync(at(...p));
let fails = 0, warns = 0;
function line(mark, text, fix) {
  if (mark === '✘') fails++;
  if (mark === '!') warns++;
  console.log(`${mark} ${text}`);
  if (fix && mark !== '✔') console.log(`    fix: ${fix}`);
}
function git(...args) {
  try { return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
  catch { return null; }
}

console.log('Factory doctor: checking the floor plan\n');

// 1. A machine of its own
if (typeof process.getuid === 'function' && process.getuid() === 0)
  line('✘', '1. machine: running as root', 'make a separate, ordinary user for the factory and run everything as that user');
else line('✔', '1. machine: not running as root');

// 2. The tools
const major = Number(process.versions.node.split('.')[0]);
if (major < 18) line('✘', `2. tools: Node ${process.versions.node} is too old`, 'install the current LTS version of Node.js');
else if (major < 22) line('!', `2. tools: Node ${process.versions.node} works, but the chat bot needs Node 22 or newer`, 'install the current LTS version of Node.js');
else line('✔', `2. tools: Node ${process.versions.node}`);
const gitVersion = git('--version');
if (gitVersion) line('✔', `2. tools: ${gitVersion}`);
else line('✘', '2. tools: git is not installed', 'install git, then run the doctor again');
let playwright = null;
try { playwright = await import('playwright'); } catch { /* not installed */ }
if (!playwright) line('!', '2. tools: Playwright is not installed, so scripts/shot.mjs cannot run', 'npm i -D playwright && npx playwright install chromium');
else {
  let browserOk = false;
  try { browserOk = existsSync(playwright.chromium.executablePath()); } catch { /* no browser */ }
  if (browserOk) line('✔', '2. tools: Playwright with Chromium');
  else line('!', '2. tools: Playwright is installed, but its Chromium is not', 'npx playwright install chromium');
}

// 3. The agent's permissions
if (!has('.claude', 'settings.json')) line('!', '3. permissions: no .claude/settings.json', 'save kit/files/settings.json as .claude/settings.json, then adjust it');
else {
  let p = null;
  try { p = JSON.parse(readFileSync(at('.claude', 'settings.json'), 'utf8')).permissions; } catch { p = undefined; }
  if (p === undefined) line('✘', '3. permissions: .claude/settings.json is not valid JSON', 'compare it with kit/files/settings.json');
  else if (!p || !Array.isArray(p.deny) || !p.deny.some(r => r.includes('.env')))
    line('!', '3. permissions: settings.json has no deny rule for .env', 'add "Read(./.env)" and "Read(./.env.*)" to permissions.deny');
  else line('✔', `3. permissions: ${(p.allow || []).length} allow, ${(p.ask || []).length} ask, ${p.deny.length} deny rules`);
}

// 4. The repository
const inRepo = gitVersion && git('rev-parse', '--is-inside-work-tree') === 'true';
if (!inRepo) line('✘', '4. repository: this folder is not a git repository', 'git init, then add a remote');
else {
  const remotes = (git('remote') || '').split('\n').filter(Boolean); // names only, never the address
  if (remotes.length) line('✔', `4. repository: git, with ${remotes.length} remote${remotes.length > 1 ? 's' : ''}`);
  else line('✘', '4. repository: git, but no remote to push to', 'git remote add origin <your repository address>');
}
const mustIgnore = { '.env': '.env', '.env.local': '.env.*', 'chat/inbox.jsonl': 'chat/', 'tickets/now.md': 'tickets/', 'screenshots/hello-phone.png': 'screenshots/' };
if (!has('.gitignore')) line('✘', '4. repository: no .gitignore', 'save kit/files/gitignore.txt as .gitignore before the first commit');
else {
  let missing;
  if (inRepo) missing = Object.keys(mustIgnore).filter(f => git('check-ignore', '-q', '--no-index', f) === null);
  else {
    const rules = readFileSync(at('.gitignore'), 'utf8').split(/\r?\n/).map(s => s.trim());
    missing = Object.keys(mustIgnore).filter(f => !rules.some(r => r && !r.startsWith('#') && (r === mustIgnore[f] || r === mustIgnore[f].replace(/\/$/, '') || r === mustIgnore[f] + '*')));
  }
  if (missing.length) line('✘', `4. repository: .gitignore does not cover ${[...new Set(missing.map(f => mustIgnore[f]))].join(', ')}`, 'compare it with kit/files/gitignore.txt');
  else line('✔', '4. repository: .gitignore covers .env, chat/, tickets/ and screenshots/');
}
// 5. The host
if (!has('apps')) line('✘', '5. host: no apps/ folder', 'mkdir apps, add apps/hello/index.html, push it and open /hello/ on your phone');
else {
  const apps = readdirSync(at('apps')).filter(d => !d.startsWith('.') && !d.startsWith('_') && existsSync(at('apps', d, 'index.html')));
  if (!apps.length) line('!', '5. host: apps/ has no app yet', 'add apps/hello/index.html with one line of text and open /hello/ on your phone');
  else line('✔', `5. host: apps/ has ${apps.length} app${apps.length > 1 ? 's' : ''} (open one on your phone to check the host)`);
  if (!has('apps', 'index.html')) line('!', '5. host: no apps/index.html front page yet', 'node scripts/index.mjs');
  else line('✔', '5. host: apps/index.html lists your apps');
}

// 6. The folder layout
for (const d of ['tickets', 'scratch']) {
  if (has(d) && statSync(at(d)).isDirectory()) line('✔', `6. layout: ${d}/`);
  else line('!', `6. layout: no ${d}/ folder`, `mkdir ${d}`);
}

// 7. The instructions file
const instr = ['CLAUDE.md', 'AGENTS.md'].filter(f => has(f));
if (instr.length) line('✔', `7. instructions: ${instr.join(' and ')}`);
else line('✘', '7. instructions: no CLAUDE.md or AGENTS.md', 'copy starter.md from Sloppy\'s Factory into CLAUDE.md and fill in the blanks');

// 8. The station commands
const stations = ['intake', 'notes', 'plan', 'build', 'gate', 'test', 'ship', 'tell', 'rescue'];
const noCmd = stations.filter(s => !has('.claude', 'commands', s + '.md'));
if (!noCmd.length) line('✔', '8. stations: all nine station commands in .claude/commands/');
else line('✘', `8. stations: missing ${noCmd.map(s => '/' + s).join(' ')}`, 'copy the files from kit/commands/ into .claude/commands/');

// 9. The scripts
for (const s of ['check.mjs', 'shot.mjs', 'index.mjs']) {
  if (has('scripts', s)) line('✔', `9. scripts: scripts/${s}`);
  else line(s === 'index.mjs' ? '!' : '✘', `9. scripts: no scripts/${s}`, `save kit/files/scripts/${s} as scripts/${s}`);
}

// 10. Chat in
if (!has('chat', 'inbox.jsonl')) line('✘', '10. chat: no chat/inbox.jsonl', 'start the bot, or type one test line in by hand: {"t":"2026-01-01T12:00:00Z","user":"me","text":"a page where a frog jumps when you tap it"}');
else {
  const rows = readFileSync(at('chat', 'inbox.jsonl'), 'utf8').split('\n').filter(s => s.trim());
  const broken = rows.filter(s => { try { JSON.parse(s); return false; } catch { return true; } }).length;
  if (broken) line('!', `10. chat: chat/inbox.jsonl has ${broken} line${broken > 1 ? 's' : ''} that are not JSON`, 'one JSON object per line, nothing else');
  else line('✔', `10. chat: chat/inbox.jsonl (${rows.length} line${rows.length === 1 ? '' : 's'})`);
}

// 11. Secrets
if (inRepo) {
  const tracked = (git('ls-files') || '').split('\n').filter(f => /(^|\/)\.env(\.[^/]*)?$/.test(f));
  if (tracked.length) line('✘', `11. secrets: git tracks ${tracked.join(', ')}`, 'git rm --cached <file>, commit, and replace every key that was in it: it is in the history now');
  else line('✔', '11. secrets: no .env file is tracked by git');
}
if (has('.env')) line('!', '11. secrets: a .env file sits inside the project', 'keep keys outside the project if you can; if it stays, keep it ignored and denied');

console.log('');
if (fails) console.log(`Not ready: ${fails} thing${fails > 1 ? 's' : ''} to fix${warns ? `, ${warns} to look at` : ''}. Fix the ✘ lines and run the doctor again.`);
else if (warns) console.log(`Ready, with ${warns} thing${warns > 1 ? 's' : ''} to look at. Next: the dry run.`);
else console.log('Ready. Next: the dry run.');
process.exit(fails ? 1 : 0);
