// Runs the icon engine's 30-icon performance scenarios and prints each window.__perf.summary.
// Build the harness first: npm run build:harness. Usage: node dev/probe-icon-perf.mjs
// Expected: one probe per distinct icon name (3), none with a pack that has the icons, none without icon_fx.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { ICON_PERF_SCENARIOS } from './icon-perf-scenarios.mjs';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);
const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
let failed = false;
for (const [name, sc] of Object.entries(ICON_PERF_SCENARIOS)) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 920 });
  await page.goto(pathToFileURL(path.join(ROOT, 'dev/harness.html')).href + `?w=${sc.w}&theme=${sc.theme}`, { waitUntil: 'networkidle0' });
  for (const step of sc.steps) { await page.evaluate(step); await new Promise((r) => setTimeout(r, 250)); }
  const msg = await page.evaluate(sc.check);
  if (msg) failed = true;
  console.log(name, JSON.stringify(await page.evaluate(() => window.__perf.summary)), msg ? `FAIL ${msg}` : 'ok');
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
