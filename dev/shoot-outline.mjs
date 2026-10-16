// Dev-only: screenshots dev/outline.html (build first:
//   npx webpack --mode development --entry ./dev/outline-entry.js --output-path .harness-build/outline --output-filename outline.js)
// Usage: node dev/shoot-outline.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = path.join(ROOT, '.harness-shots');
mkdirSync(OUT, { recursive: true });

const outline = (sel) => `document.querySelector('${sel} mc-structure-outline').shadowRoot`;
const SCENARIOS = {
  'outline-light': { theme: 'light', steps: [] },
  'outline-dark': { theme: 'dark', steps: [] },
  'outline-row-menu-light': { theme: 'light', steps: [
    `${outline('#layers')}.querySelector('.row .more').click()`,
  ] },
  'outline-col-menu-dark': { theme: 'dark', steps: [
    `${outline('#pane')}.querySelectorAll('.col .more')[3].click()`,
  ] },
  'outline-collapsed-focus-light': { theme: 'light', steps: [
    `${outline('#layers')}.querySelector('.caret').click()`,
    `${outline('#layers')}.querySelector('[data-key="r1"]').focus()`,
  ] },
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
let failed = false;
for (const [name, sc] of Object.entries(SCENARIOS)) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1180, height: 860 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/materialdesignicons|favicon|ERR_INTERNET|net::/.test(m.text())) errors.push(m.text()); });
  await page.goto(pathToFileURL(path.join(ROOT, 'dev/outline.html')).href + `?theme=${sc.theme}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  for (const step of sc.steps) { await page.evaluate(step); await new Promise((r) => setTimeout(r, 250)); }
  if (name.includes('focus')) await page.keyboard.press('ArrowDown');
  await new Promise((r) => setTimeout(r, 150));
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  if (errors.length) { failed = true; console.error(`FAIL ${name}\n  ` + errors.join('\n  ')); } else console.log(`ok   ${name}`);
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
