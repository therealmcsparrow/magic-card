// usage: node shoot.mjs <tag>  (before|after). Needs .harness-build/transfer-ui built.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
const ROOT = 'Z:/projects/hass/magic-card';
const tag = process.argv[2] || 'after';
const OUT = process.env.SHOTS_DIR || path.join(ROOT, '.harness-build/shots');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const V = `window.__view.shadowRoot`;
const click = (sel, text) => `[...${V}.querySelectorAll('${sel}')].find(b=>(b.getAttribute('aria-label')||b.textContent).trim().startsWith('${text}')).click()`;
const S = {
  'list-light': { theme: 'light', steps: [] },
  'list-dark': { theme: 'dark', steps: [] },
  'list-selected-rename': { theme: 'light', steps: [click('input,button', 'Select Fan'), click('button', 'Rename Kettle')] },
  'list-delete-confirm': { theme: 'light', steps: [click('button', 'Delete Door')] },
  'import-light': { theme: 'light', steps: [click('button', 'Import')] },
  'import-result-dark': { theme: 'dark', steps: [click('button', 'Import'), 'window.__paste(window.__view)'] },
  'export-light': { theme: 'light', steps: [click('button', 'Export all')] },
  'phone-import': { theme: 'light', vp: [390, 800], steps: [click('button', 'Import')] },
  'empty-shapes': { theme: 'light', steps: [click('button', 'Shapes'), click('button', 'This card')] },
};
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
let failed = false;
for (const [name, sc] of Object.entries(S)) {
  const page = await browser.newPage();
  const [w, h] = sc.vp || [1000, 800];
  await page.setViewport({ width: w, height: h });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/materialdesignicons|favicon|ERR_INTERNET|net::/.test(m.text())) errors.push(m.text()); });
  await page.goto(pathToFileURL(path.join(ROOT, 'dev/transfer-ui.html')).href + `?theme=${sc.theme}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  for (const step of sc.steps) { try { await page.evaluate(step); } catch (e) { errors.push('step: ' + e.message.split('\n')[0]); } await new Promise((r) => setTimeout(r, 350)); }
  await page.screenshot({ path: path.join(OUT, `${name}.${tag}.png`) });
  if (errors.length) { failed = true; console.error(`FAIL ${name}\n  ` + errors.join('\n  ')); } else console.log(`ok   ${name}`);
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
