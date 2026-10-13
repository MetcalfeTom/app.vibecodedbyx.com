// Station 5, the syntax gate. From the Sloppy's Factory kit.
// usage: node scripts/check.mjs scratch/hello/index.html
// Pulls every inline <script> out of an HTML file and asks Node whether it parses.
// Prints OK or FAIL and exits 0 or 1. Read the output, not only the exit code.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const file = process.argv[2];
if (!file) { console.log('usage: node scripts/check.mjs path/to/index.html'); process.exit(2); }
const html = readFileSync(file, 'utf8');
const dir = mkdtempSync(join(tmpdir(), 'check-'));
const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
let m, n = 0, bad = 0;
while ((m = re.exec(html))) {
  if (/type=["']?(?!module|text\/javascript)/i.test(m[1])) continue; // skip JSON-LD and templates
  n++;
  if (m[2].includes('<!--')) console.log(`script ${n}: warning, "<!--" inside a script can confuse the browser`);
  const out = join(dir, `script-${n}.${/type=["']?module/i.test(m[1]) ? 'mjs' : 'js'}`);
  writeFileSync(out, m[2]);
  try { execFileSync(process.execPath, ['--check', out], { stdio: 'pipe' }); }
  catch (e) { bad++; console.log(`script ${n}: ${String(e.stderr).split('\n').slice(0, 5).join('\n')}`); }
}
rmSync(dir, { recursive: true, force: true });
console.log(bad ? `FAIL: ${bad} of ${n} scripts did not parse` : `OK: ${n} ${n === 1 ? 'script parses' : 'scripts parse'}`);
process.exit(bad ? 1 : 0);
