// Station 6, the test bench. From the Sloppy's Factory kit.
// usage: node scripts/shot.mjs scratch/hello/index.html hello
//        node scripts/shot.mjs https://your-host/hello/ hello-live
// Opens the page at phone and desktop size, saves a screenshot of each in
// screenshots/ and prints every console error. Exits 1 if there were errors.
// Needs Playwright: npm i -D playwright && npx playwright install chromium
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

const [target, name] = process.argv.slice(2);
if (!target || !name) { console.log('usage: node scripts/shot.mjs <file or address> <name>'); process.exit(2); }
const url = /^https?:\/\//.test(target) ? target : pathToFileURL(target).href;
const sizes = { phone: [390, 844], desktop: [1280, 800] };
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch();
let errors = 0;
for (const [label, [width, height]] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', e => { errors++; console.log(`[${label}] page error: ${e.message}`); });
  page.on('console', m => { if (m.type() === 'error') { errors++; console.log(`[${label}] console: ${m.text()}`); } });
  try { await page.goto(url, { waitUntil: 'load', timeout: 20000 }); }
  catch (e) { errors++; console.log(`[${label}] could not open the page: ${e.message.split('\n')[0]}`); }
  await page.waitForTimeout(1500);
  const path = `screenshots/${name}-${label}.png`;
  await page.screenshot({ path });
  console.log(`[${label}] ${path}`);
  await page.close();
}
await browser.close();
console.log(errors ? `FAIL: ${errors} errors` : 'OK: no errors. Now look at both pictures.');
process.exit(errors ? 1 : 0);
