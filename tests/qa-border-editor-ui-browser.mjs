// By-hand browser QA (not vitest): click through Design > Border four-side fields, entity colour and the colour popup.
import { launch, ev, sleep, kill, openEditor, saveConfig, B, URLP } from './qa-tabs-dnd-lib.mjs';
const card = { type: 'custom:magic-card', rows: [{ id: 'r1', layout: '1', columns: [{ id: 'c1', modules: [
  { id: 'tx1', type: 'text', text: 'hello', entity: 'sun.sun' },
  { id: 'tb1', type: 'tabs', tabs: [{ label: 'One', modules: [{ id: 'ta', type: 'text', text: 'a' }] }, { label: 'Two', modules: [{ id: 'tb', type: 'text', text: 'b' }] }] }] }] }] };
const { br, page, pid, errors } = await launch();
const out = (l, v) => console.log(l, typeof v === 'string' ? v : JSON.stringify(v));
try {
  await page.goto(`${B}/`, { waitUntil: 'domcontentloaded' }); await sleep(7000);
  await saveConfig(page, card);
  await openEditor(page);
  await page.screenshot({ path: 'Z:/projects/hass/magic-card/.results/qa-ed0.png' });
  await page.mouse.click(391, process.argv[2] === 'tabs' ? 736 : 682); await sleep(2500);
  await page.screenshot({ path: 'Z:/projects/hass/magic-card/.results/qa-ed1.png' });
  await page.mouse.click(667, 974); await sleep(2000);
  out('panel', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); if(!d) return 'no panel'; return [...d.shadowRoot.querySelectorAll('button,summary')].map(b=>b.textContent.trim().replace(/\s+/g,' ')).filter(Boolean).join(' | ');`));
  out('open', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); const b=[...d.shadowRoot.querySelectorAll('button')].find(b=>/Border/.test(b.textContent)); b.click(); await new Promise(r=>setTimeout(r,800)); b.scrollIntoView({block:'start'}); const bf=[...d.shadowRoot.querySelectorAll('mc-box-field')]; return bf.length+' box fields: '+bf.map(f=>(f.label||'')+'/'+(f.value||'')).join(' ; ')+' || other: '+[...d.shadowRoot.querySelectorAll('mc-color-picker,mc-unit-field')].length;`));
  await sleep(800); await page.screenshot({ path: 'Z:/projects/hass/magic-card/.results/qa-ed2.png' });
  if (process.argv[2] === 'tabs') {
    out('title', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); return (d.getRootNode().host?.parentElement||document.body).innerText?.slice(0,0) + (deepAll(document,e=>/Tabs ·|Tabs$/.test((e.textContent||'').trim())&&e.children.length===0).length)`));
    out('sections', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); return [...d.shadowRoot.querySelectorAll('button')].map(b=>b.textContent.trim().replace(/\s+/g,' ')).join(' | ');`));
    await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); [...d.shadowRoot.querySelectorAll('button')].find(b=>/Tab bar/.test(b.textContent)).click(); await new Promise(r=>setTimeout(r,900));`);
    out('all boxes', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); const bs=[...d.shadowRoot.querySelectorAll('mc-box-field')]; return JSON.stringify(bs.map(f=>[f.label,f.value,!!f.entity]));`));
    await page.screenshot({ path: 'Z:/projects/hass/magic-card/.results/qa-ed7.png' });
    throw new Error('tabs mode done');
  }
  await page.mouse.click(460, 432); await page.keyboard.type('3'); await sleep(600);
  await page.mouse.click(560, 558); await sleep(500);
  out('style', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); const s=[...d.shadowRoot.querySelectorAll('mc-box-field')].find(f=>f.label==='Border style'); const sel=s.shadowRoot.querySelector('select'); sel.value='solid'; sel.dispatchEvent(new Event('change',{bubbles:true})); return sel.value+' opts '+[...sel.options].map(o=>o.value).join(',');`));
  await sleep(500); await page.mouse.click(691, 720); await sleep(800);
  await page.screenshot({ path: 'Z:/projects/hass/magic-card/.results/qa-ed3.png' });
  await page.mouse.click(349, 842); await sleep(800);
  await page.screenshot({ path: 'Z:/projects/hass/magic-card/.results/qa-ed4.png' });
  out('vals', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); const bs=[...d.shadowRoot.querySelectorAll('mc-box-field')]; return JSON.stringify(bs.map(f=>[f.label,f.value,!!f.entity]));`));
  await page.mouse.click(691, 886); await sleep(700);
  await page.mouse.click(495, 886); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('red'); await page.keyboard.press('Tab'); await sleep(700);
  await page.mouse.click(450, 818, { clickCount: 3 }); await page.keyboard.type('40'); await page.keyboard.press('Tab'); await sleep(700);
  await page.screenshot({ path: 'Z:/projects/hass/magic-card/.results/qa-ed5.png' });
  out('vals2', await ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); const bs=[...d.shadowRoot.querySelectorAll('mc-box-field')]; return JSON.stringify(bs.map(f=>[f.label,f.value]));`));
  out('computed', await ev(page, `const all=[]; const col=(r)=>{for(const e of r.querySelectorAll('*')){ if(e.tagName==='MAGIC-CARD') all.push(e); if(e.shadowRoot) col(e.shadowRoot);}}; col(document); const sr=all[all.length-1]; const w=[...sr.shadowRoot.querySelectorAll('.mc-module-wrapper')][0]; const g=(s)=>getComputedStyle(w).getPropertyValue('border-'+s+'-color'); return ['top','right','bottom','left'].map(g).join(' | ');`));
  const val = () => ev(page, `const d=deepFind(document,e=>e.tagName==='MC-DESIGN-PANEL'); return [...d.shadowRoot.querySelectorAll('mc-box-field')].find(f=>f.label==='Border color').value;`);
  const rowInputs = `return deepAll(document,e=>e.tagName==='INPUT'&&e.closest&&e.closest('.mc-input-row')).map(i=>i.value).join(' ; ')`;
  for (const f of ['HEXA', 'RGBA', 'HSLA', 'OKLCH']) {
    await page.mouse.click(299, 886); await sleep(900);
    const pos = await ev(page, `const b=deepAll(document,e=>e.tagName==='BUTTON'&&e.textContent.trim()==='${f}')[0]; if(!b) return ''; const r=b.getBoundingClientRect(); return JSON.stringify({x:r.x+r.width/2,y:r.y+r.height/2});`);
    if (!pos) { out(f, 'no button'); continue; }
    const q = JSON.parse(pos); await page.mouse.click(q.x, q.y); await sleep(400);
    const fields = await ev(page, rowInputs);
    await page.mouse.click(912, 523); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('50'); await page.keyboard.press('Tab'); await sleep(400);
    const fields2 = await ev(page, rowInputs);
    const sv = await ev(page, `const b=deepAll(document,e=>e.tagName==='BUTTON'&&e.textContent.trim()==='Save'&&e.closest('.mc-picker-footer'))[0]; if(!b) return 'no save'; b.click(); return 'saved'`);
    await sleep(600);
    out(f, { fields, fields2, sv, value: await val() });
  }
  await page.evaluate(`window.EyeDropper = class { open() { return Promise.resolve({ sRGBHex: '#12ab34' }); } }`);
  await page.mouse.click(299, 886); await sleep(900);
  await page.mouse.click(924, 575); await sleep(600);
  out('pipette fields', await ev(page, rowInputs));
  await ev(page, `const b=deepAll(document,e=>e.tagName==='BUTTON'&&e.textContent.trim()==='Save'&&e.closest('.mc-picker-footer'))[0]; b.click();`); await sleep(500);
  out('pipette value', await val());
  await page.evaluate(`window.EyeDropper = class { open() { const e = new Error('x'); e.name = 'AbortError'; return Promise.reject(e); } }`);
  await page.mouse.click(299, 886); await sleep(900);
  await page.mouse.click(924, 575); await sleep(600);
  out('abort fields', await ev(page, rowInputs));
  out('eyedropper', await page.evaluate('typeof window.EyeDropper'));
} catch (e) { console.log('SCRIPT ERROR', e); } finally { console.log('errors', errors); await kill(br, pid); }
