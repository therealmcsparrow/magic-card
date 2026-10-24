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
for (const s of ['default', 'pills', 'underline']) {
  const t = (id, design, extra = {}) => ({ ...mk(`${s}-${id}`, s, design), ...extra });
  mods.push(t('hoverdesign', { border_width: '2px', border_style: 'solid', border_color: 'rgb(0,0,255)', hover: { border_width: '4px', border_style: 'dashed', border_color: 'rgb(255,0,255)' } }));
  mods.push(t('tabhover', { hover: { tab_border_width: '3px', tab_border_color: 'rgb(255,128,0)' } }));
  mods.push(t('disabled', { tab_disabled_tabs: [1], tab_disabled: { tab_border_width: '2px', tab_border_color: 'rgb(90,90,90)' } }));
  mods.push(t('sides', { border_width: '1px 0 3px 0', border_style: 'solid', border_color: 'rgb(1,2,3) rgb(4,5,6) rgb(7,8,9) rgb(10,11,12)' }));
  mods.push(t('bar0', { tab_bar_border_width: '0' }));
  mods.push(t('barnone', { tab_bar_border_style: 'none' }));
  mods.push(t('barsides', { tab_bar_border_width: '0 0 4px 0', tab_bar_border_style: 'none none dashed none', tab_bar_border_color: 'rgb(9,9,9)' }));
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
    return { id: w.getAttribute('data-mc-id'), wrapper: edge(w), tabs: edge(t), bar: edge(h), active: edge(a), other: edge(o), look: [a, o].map((x) => g(x, 'color') + ' ' + g(x, 'background-color') + ' ' + g(x, 'font-weight')).join(' || ') }; }));`).then(JSON.parse);
info.forEach((i) => console.log(JSON.stringify(i)));
const hovered = {};
for (const id of ['hoverdesign', 'tabhover']) for (const s of ['default', 'pills', 'underline']) {
  const probe = (which) => `const sr = deepFind(document, e => e.tagName === 'MAGIC-CARD').shadowRoot; const w = sr.querySelector('[data-mc-id="${s}-${id}"]'); const b = w.querySelectorAll('.mc-tab-button')[1]; const el = ('${which}'==='w'?w:b); el.scrollIntoView({block:'center'}); const r = el.getBoundingClientRect(); return JSON.stringify([r.x + r.width / 2, r.y + r.height / 2]);`;
  const [x, y] = JSON.parse(await ev(page, probe(id === 'hoverdesign' ? 'w' : 'b')));
  await page.mouse.move(x, y); await sleep(500);
  hovered[`${s}-${id}`] = await ev(page, `const sr = deepFind(document, e => e.tagName === 'MAGIC-CARD').shadowRoot; const b = sr.querySelector('[data-mc-id="${s}-${id}"]').querySelectorAll('.mc-tab-button')[${id === 'hoverdesign' ? 0 : 1}]; const g = (p)=>getComputedStyle(b).getPropertyValue(p); return ['top','bottom'].map(d=>g('border-'+d+'-width')+' '+g('border-'+d+'-style')+' '+g('border-'+d+'-color')).join(' | ');`);
}
console.log('hover', JSON.stringify(hovered, null, 1));
console.log('errors', errors);
process.exit(0);
