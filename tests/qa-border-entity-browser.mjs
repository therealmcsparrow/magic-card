// By-hand browser QA (not vitest): active tab indicator and where the borders land. Own dashboard mc-border-entity.
import { launch, ev, sleep, B } from './qa-tabs-dnd-lib.mjs';
const URL = 'mc-border-entity';
const mods = [
  { id: 'linked', type: 'text', text: 'linked', entity: 'sun.sun', design: { border_width: '3px', border_style: 'solid', border_color: 'entity' } },
  { id: 'sides', type: 'text', text: 'sides', entity: 'sun.sun', design: { border_width: '3px', border_style: 'solid', border_color: 'entity red entity 40% blue' } },
  { id: 'plain', type: 'text', text: 'plain', entity: 'sun.sun', design: { border_width: '3px', border_style: 'solid', border_color: 'red' } },
];
const card = { type: 'custom:magic-card', rows: [{ id: 'r1', layout: '1', columns: [{ id: 'c1', modules: mods }] }] };
const { page, errors } = await launch();
await page.goto(`${B}/`, { waitUntil: 'domcontentloaded' }); await sleep(6000);
if (page.url().includes('/auth/authorize')) { await page.type('input[name=username]', 'spike'); await page.type('input[name=password]', 'spike-pass-123'); await page.keyboard.press('Enter'); await sleep(8000); }
for (let i = 0; i < 30; i++) { try { if (await page.evaluate('window.hassConnection ? window.hassConnection.then(c=>!!(c&&c.conn)) : false')) break; } catch {} await sleep(1000); }
await ev(page, `const { conn } = await window.hassConnection;
  const list = await conn.sendMessagePromise({ type: 'lovelace/dashboards/list' });
  if (!list.some((d) => d.url_path === '${URL}')) await conn.sendMessagePromise({ type: 'lovelace/dashboards/create', url_path: '${URL}', title: 'MC tabs border', icon: 'mdi:tab', show_in_sidebar: false, require_admin: false, mode: 'storage' });
  await conn.sendMessagePromise({ type: 'lovelace/config/save', url_path: '${URL}', config: { views: [{ title: 'T', cards: [${JSON.stringify(card)}] }] } });`);
await page.goto(`${B}/${URL}/0`, { waitUntil: 'domcontentloaded' }); await sleep(8000);
const info = await ev(page, `const sr = deepFind(document, e => e.tagName === 'MAGIC-CARD').shadowRoot;
  return JSON.stringify([...sr.querySelectorAll('.mc-module-wrapper')].map(w => { const g = (p) => getComputedStyle(w).getPropertyValue(p); return { id: w.getAttribute('data-mc-id'), entityVar: g('--mc-entity-color'), c: ['top','right','bottom','left'].map(s => g('border-' + s + '-color')) }; }));`).then(JSON.parse);
info.forEach((i) => console.log(JSON.stringify(i)));
console.log('errors', errors);
process.exit(0);
