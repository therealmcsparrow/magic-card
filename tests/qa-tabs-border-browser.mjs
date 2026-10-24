// By-hand browser QA (not vitest): active tab indicator and where the borders land. Own dashboard mc-tabs-border.
import { launch, ev, sleep, B } from './qa-tabs-dnd-lib.mjs';
const URL = 'mc-tabs-border';
const mk = (id, style, design) => ({ id, type: 'tabs', tab_style: style, ...(design ? { design } : {}), tabs: [{ label: 'One', modules: [{ id: id + 'a', type: 'text', text: 'a' }] }, { label: 'Two', modules: [{ id: id + 'b', type: 'text', text: 'b' }] }] });
const mods = [];
for (const s of ['default', 'pills', 'underline']) {
  mods.push(mk(`${s}-plain`, s));
  mods.push(mk(`${s}-tabborder`, s, { tab_border_width: '2px', tab_border_style: 'solid', tab_border_color: 'rgb(255,0,0)' }));
  mods.push(mk(`${s}-designborder`, s, { border_width: '3px', border_style: 'solid', border_color: 'rgb(0,0,255)' }));
  mods.push(mk(`${s}-activeborder`, s, { tab_active: { tab_border_width: '2px', tab_border_color: 'rgb(0,200,0)' } }));
}
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
const info = await ev(page, `const sr = deepFind(document, e => e.tagName === 'MAGIC-CARD').shadowRoot; const g = (e,p)=>getComputedStyle(e).getPropertyValue(p);
  const edge = (e)=>['top','right','bottom','left'].map(s=>{const w=g(e,'border-'+s+'-width'); const st=g(e,'border-'+s+'-style'); return st==='none'||w==='0px'?'-':w+' '+g(e,'border-'+s+'-color');}).join(' | ');
  return JSON.stringify([...sr.querySelectorAll('.mc-module-wrapper')].filter(w=>w.querySelector(':scope > .mc-tabs')).map(w => { const t = w.querySelector(':scope > .mc-tabs'); const a = t.querySelector('.mc-tab-button.active'); const o = t.querySelector('.mc-tab-button:not(.active)'); const h = t.querySelector('.mc-tabs-header');
    return { id: w.getAttribute('data-mc-id'), wrapper: edge(w), tabs: edge(t), bar: edge(h), active: edge(a), other: edge(o) }; }));`).then(JSON.parse);
info.forEach((i) => console.log(JSON.stringify(i)));
console.log('errors', errors);
process.exit(0);
