// Screenshots of every theme editor preset, for documentation/themes/examples/.
//
// For each preset of src/theme-editor/presets/library.ts this opens the dev harness theme editor
// (dev/theme-editor.html), makes a new theme from the preset through the create dialog (the same path
// a user takes), then captures the editor's preview in Light and in Dark and joins both into one
// image, 1200 px wide, with a caption over each half. The image is WebP, compressed to under 80 KB.
//
// Usage (from the repo root; it loads library.ts through tools/ui-kit-ts-hooks.mjs):
//   npm run build:harness                       the harness loads .harness-build/
//   node tools/theme-example-shots.mjs          all presets  -> documentation/themes/examples/images/<id>.webp
//   node tools/theme-example-shots.mjs nord ink only these ids
// Options: --out <dir>   write somewhere else      --max-kb <n>  size target (default 80)
// Environment: CHROME_PATH   Chrome or Chromium executable (default: the Windows install path)
//
// Needs puppeteer-core (a dev dependency). Output is not byte-identical between Chrome versions.
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { register } from 'node:module';

// library.ts imports the theme-presets namespace marker (m), which pulls in the i18n runtime: load the .ts files through the kit's hooks
register('./ui-kit-ts-hooks.mjs', import.meta.url);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const [, v] = args.splice(i, 2);
  return v;
};
const OUT = path.resolve(opt('--out', path.join(ROOT, 'documentation/themes/examples/images')));
const MAX_KB = Number(opt('--max-kb', 80));
const ids = args.filter((a) => !a.startsWith('--'));

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
// The harness is two panes from about 1000 px: at 1100 the preview stage is about 600 px wide, so two
// of them make a 1200 px image with no resizing. The height lets the whole sample dashboard show.
const VIEW = { width: 1100, height: 1500, deviceScaleFactor: 1 };
const HALF = 600;
const CAPTION = 32;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { THEME_PRESET_LIBRARY } = await import(pathToFileURL(path.join(ROOT, 'src/theme-editor/presets/library.ts')).href);
const presets = THEME_PRESET_LIBRARY.presets.filter((p) => !ids.length || ids.includes(p.id));
if (!presets.length) throw new Error(`No preset matches ${ids.join(', ')}`);
if (!fs.existsSync(path.join(ROOT, '.harness-build/magic-card-theme-presets.js'))) throw new Error('Run "npm run build:harness" first (.harness-build is missing the preset chunk).');
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const url = pathToFileURL(path.join(ROOT, 'dev/theme-editor.html')).href;

/** The preview stage element of the open editor, found through the shadow roots. */
const STAGE = () => {
  const ed = document.querySelector('magic-card-theme-editor')?.shadowRoot?.querySelector('mcte-editor-view');
  return ed?.shadowRoot?.querySelector('mcte-theme-preview')?.shadowRoot?.querySelector('.stage') ?? null;
};

async function shootMode(page, mode) {
  await page.evaluate((m) => {
    const ed = document.querySelector('magic-card-theme-editor').shadowRoot.querySelector('mcte-editor-view');
    const prev = ed.shadowRoot.querySelector('mcte-theme-preview');
    const btn = [...prev.shadowRoot.querySelectorAll('.seg button')].find((b) => b.textContent.trim().toLowerCase() === m);
    if (!btn) throw new Error('no preview mode switch for ' + m);
    btn.click();
  }, mode);
  await sleep(350);
  const handle = await page.evaluateHandle(STAGE);
  const el = handle.asElement();
  if (!el) throw new Error('no preview stage');
  // the stage scrolls inside the pane, so show all of it; end it after the Heading card (what follows is
  // a Magic Card sample that is empty in the harness, and the footnote)
  await page.evaluate((s) => {
    s.style.maxHeight = 'none';
    s.style.overflow = 'visible';
    const heading = [...s.querySelectorAll('ha-card')].find((c) => c.textContent.includes('Heading'));
    for (let n = heading?.nextElementSibling; n; n = n.nextElementSibling) n.style.display = 'none';
    const foot = s.querySelector('.foot');
    if (foot) foot.style.display = 'none';
  }, el);
  return el.screenshot({ type: 'png' });
}

async function shoot(preset) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewport(VIEW);
  await page.goto(`${url}?w=${VIEW.width}&theme=light`, { waitUntil: 'networkidle0' });
  await sleep(400);
  await page.evaluate(() => window.__teh.newTheme());
  // the preset chunk loads on the first open of the dialog
  await page.waitForFunction(() => window.__teh.start().shadowRoot.querySelectorAll('input[name=preset]').length > 0, { timeout: 8000 });
  await page.evaluate((id) => {
    const input = [...window.__teh.start().shadowRoot.querySelectorAll('input[name=preset]')].find((i) => i.value === id);
    if (!input) throw new Error('preset not in the dialog: ' + id);
    input.click();
  }, preset.id);
  await sleep(250);
  await page.evaluate(() => window.__teh.createNow());
  await page.waitForFunction(() => !!document.querySelector('magic-card-theme-editor')?.shadowRoot?.querySelector('mcte-editor-view'), { timeout: 8000 });
  await sleep(900);
  const light = await shootMode(page, 'light');
  const dark = await shootMode(page, 'dark');
  await page.close();
  if (errors.length) throw new Error(`${preset.id}: page errors: ${errors.join(' | ')}`);
  return { light, dark };
}

const b64 = (buf) => `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;

/** Both captures side by side with a caption over each, as one WebP under the size target. */
async function compose(preset, { light, dark }) {
  const page = await browser.newPage();
  const html = (n) => `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#fff;font:600 14px/${CAPTION}px Roboto,"Segoe UI",system-ui,sans-serif;color:#1f2933}
    .row{display:flex;width:${HALF * 2}px}
    .col{width:${HALF}px;overflow:hidden}
    .cap{height:${CAPTION}px;padding:0 14px;background:#eef0f3;border-bottom:1px solid #d5d9df;box-sizing:border-box}
    .col + .col .cap{border-left:1px solid #d5d9df}
    img{display:block;width:${HALF}px}
  </style><div class="row">
    <div class="col"><div class="cap">${preset.name}: Light</div><img src="${b64(light)}"></div>
    <div class="col"><div class="cap">${preset.name}: Dark</div><img src="${b64(dark)}"></div>
  </div>${n}`;
  await page.setViewport({ width: HALF * 2, height: 800, deviceScaleFactor: 1 });
  await page.setContent(html(''), { waitUntil: 'load' });
  await sleep(150);
  const height = await page.evaluate(() => Math.ceil(document.querySelector('.row').getBoundingClientRect().height));
  await page.setViewport({ width: HALF * 2, height, deviceScaleFactor: 1 });
  let out;
  let q = 86;
  for (; q >= 40; q -= 6) {
    out = await page.screenshot({ type: 'webp', quality: q, clip: { x: 0, y: 0, width: HALF * 2, height } });
    if (out.length <= MAX_KB * 1024) break;
  }
  await page.close();
  return { out, q, height };
}

let failed = 0;
for (const p of presets) {
  try {
    const shots = await shoot(p);
    const { out, q, height } = await compose(p, shots);
    fs.writeFileSync(path.join(OUT, `${p.id}.webp`), out);
    const kb = out.length / 1024;
    console.log(`${p.id.padEnd(15)} ${HALF * 2}x${height}  q${q}  ${kb.toFixed(1)} KB${kb > MAX_KB ? '  OVER TARGET' : ''}`);
    if (kb > MAX_KB) failed++;
  } catch (e) {
    failed++;
    console.error(`${p.id}: ${e.message}`);
  }
}
await browser.close();
if (failed) process.exitCode = 1;
