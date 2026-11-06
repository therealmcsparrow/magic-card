import path from 'node:path';
import os from 'node:os';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bundlePage, engines, startServers, type Browser, type Servers } from '../fixtures/forum-shot-font-server';

// Keyboard and screen-reader use (reach, sort, select, download; locked rows and reasons announced) and phone width (the table stays a table in a
// scrolling region, and the Status button opens its details) for the card table of <magic-card-forum-shot>, in a real browser. Pointer input is real (Input.dispatchMouseEvent
// at centres read from getBoundingClientRect), keys are real (Input.dispatchKeyEvent), the accessibility tree is the browser's own
// (Accessibility.getFullAXTree). Engines: current Chrome and the Chromium 85 floor. Safari and Firefox are not run.

const SHOTS = path.join(os.tmpdir(), 'mc-forum-shot-shots');

const plain = (name: string, design?: object) => ({
  type: 'custom:magic-card',
  name,
  rows: [{ id: `r-${name}`, columns: [{ id: `c-${name}`, modules: [{ id: `m-${name}`, type: 'text', text: name, ...(design ? { design } : {}) }] }] }],
});
const withModule = (name: string, module: object) => ({
  type: 'custom:magic-card',
  name,
  rows: [{ id: `r-${name}`, columns: [{ id: `c-${name}`, modules: [{ id: `m-${name}`, ...module }] }] }],
});

// dashboard order: Zebra, Alpha, Fonty (Google font, still available), Custom (locked: custom-card module), Outside (locked: outside address), Beta (second dashboard)
const MAIN = {
  views: [
    { title: 'Living room', cards: [plain('Zebra'), plain('Alpha'), plain('Fonty', { font_family: 'Lato' })] },
    { title: 'Kitchen', cards: [withModule('Custom', { type: 'custom-card' }), withModule('Outside', { type: 'image', src: 'https://cdn.example.org/a.png' })] },
  ],
};
const GARAGE = { views: [{ title: 'Shed', cards: [plain('Beta')] }] };
const DASHBOARD_ORDER = ['Zebra', 'Alpha', 'Fonty', 'Custom', 'Outside', 'Beta'];
const BY_CARD = ['Alpha', 'Beta', 'Custom', 'Fonty', 'Outside', 'Zebra'];
const OPEN = ['Zebra', 'Alpha', 'Fonty', 'Beta'];
const LOCKED = ['Custom', 'Outside'];

const HASS = `{
  states: {}, language: 'en', themes: { themes: {} }, user: { is_admin: true }, panels: { lovelace: { title: 'Home' } },
  connection: { subscribeMessage: async () => () => {} },
  callWS: async (msg) => {
    if (msg.type === 'lovelace/dashboards/list') return [{ url_path: 'garage', title: 'Garage', mode: 'storage' }];
    if (msg.type === 'lovelace/config') return msg.url_path === 'garage' ? ${JSON.stringify(GARAGE)} : ${JSON.stringify(MAIN)};
    throw new Error('unexpected ' + msg.type);
  },
}`;

const ROOT = `document.querySelector('magic-card-forum-shot').shadowRoot`;
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const mount = (b: Browser, narrow = false): Promise<boolean> =>
  b.eval<boolean>(`(async () => {
    document.body.innerHTML = '';
    const el = document.createElement('magic-card-forum-shot');
    el.hass = ${HASS};
    el.narrow = ${narrow};
    document.body.append(el);
    for (let i = 0; i < 100 && !el.shadowRoot.querySelector('tbody tr'); i++) await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return el.shadowRoot.querySelectorAll('tbody tr').length === ${DASHBOARD_ORDER.length};
  })()`);

const order = (b: Browser): Promise<string[]> => b.eval(`[...${ROOT}.querySelectorAll('tbody tr')].map((tr) => tr.querySelector('label').textContent.trim())`);
const sorts = (b: Browser): Promise<string[]> => b.eval(`[...${ROOT}.querySelectorAll('thead th')].map((th) => th.getAttribute('aria-sort'))`);
const headers = (b: Browser): Promise<string[]> => b.eval(`[...${ROOT}.querySelectorAll('thead button.sort')].map((x) => x.textContent.trim())`);
const checkedCard = (b: Browser): Promise<string | null> =>
  b.eval(`(() => { const r = ${ROOT}.querySelector('tbody input[type=radio]:checked'); return r ? ${ROOT}.querySelector('label[for=' + r.id + ']').textContent.trim() : null; })()`);
const active = (b: Browser): Promise<string> =>
  b.eval(`(() => {
    const root = ${ROOT}; const a = root.activeElement;
    if (!a) return '';
    if (a.matches('button.sort')) return 'sort:' + a.textContent.trim();
    if (a.matches('input[type=radio]')) { const l = root.querySelector('label[for=' + a.id + ']'); return 'radio:' + a.name + ':' + (l ? l.textContent.trim() : ''); }
    return a.tagName.toLowerCase() + '.' + a.className;
  })()`);

interface Box { x: number; y: number; w: number; h: number }
const boxOf = async (b: Browser, expr: string): Promise<Box> => {
  const r = await b.eval<Box | null>(`(() => {
    const root = ${ROOT};
    const e = ${expr};
    if (!e) return null;
    e.scrollIntoView({ block: 'center' });
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
  })()`);
  expect(r, `no element for ${expr}`).not.toBeNull();
  return r!;
};
const rowOf = (name: string): string => `[...root.querySelectorAll('tbody tr')].find((t) => t.querySelector('label').textContent.trim() === ${JSON.stringify(name)})`;
const cellBox = (b: Browser, name: string, cell: number): Promise<Box> => boxOf(b, `(${rowOf(name)}).children[${cell}]`);
const sortBox = (b: Browser, n: number): Promise<Box> => boxOf(b, `root.querySelectorAll('thead button.sort')[${n}]`);
const tap = async (b: Browser, box: Box): Promise<void> => {
  await b.click(box.x, box.y);
  await sleep(60);
};

// AX nodes as {role, name, description, disabled} for the nodes that are not ignored
interface AxNode { role: string; name: string; description: string; disabled: boolean }
const axTree = async (b: Browser): Promise<AxNode[]> => {
  await b.send('Accessibility.enable');
  const r = await b.send('Accessibility.getFullAXTree');
  return (r.nodes as Array<any>)
    .filter((n) => !n.ignored)
    .map((n) => ({
      role: String(n.role?.value ?? ''),
      name: String(n.name?.value ?? ''),
      description: String(n.description?.value ?? ''),
      disabled: (n.properties ?? []).some((p: any) => p.name === 'disabled' && p.value?.value === true),
    }));
};

let servers: Servers;
beforeAll(async () => {
  servers = await startServers(await bundlePage());
});
afterAll(async () => {
  await servers.close();
});

for (const engine of engines()) {
  describe(`forum shot table on ${engine.name}`, () => {
    it('a click on a header sorts ascending, a second click descending, and the selection stays', async () => {
      await engine.run(servers, async (b) => {
        expect(await mount(b)).toBe(true);
        expect(await order(b)).toEqual(DASHBOARD_ORDER);
        expect(await sorts(b)).toEqual(['none', 'none', 'none', 'none']);
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('thead button.sort').length`)).toBe(4);

        // pick Beta first with a real click on its card cell, so a sort has a selection to keep
        await tap(b, await cellBox(b, 'Beta', 0));
        expect(await checkedCard(b)).toBe('Beta');

        await tap(b, await sortBox(b, 0)); // Card
        expect(await sorts(b)).toEqual(['ascending', 'none', 'none', 'none']);
        expect(await order(b)).toEqual(BY_CARD);
        expect(await checkedCard(b)).toBe('Beta');

        await tap(b, await sortBox(b, 0));
        expect(await sorts(b)).toEqual(['descending', 'none', 'none', 'none']);
        expect(await order(b)).toEqual([...BY_CARD].reverse());
        expect(await checkedCard(b)).toBe('Beta');

        // another column takes the sort, the Card column goes back to none
        await tap(b, await sortBox(b, 3)); // Status: open cards first in dashboard order, then locked by reason
        expect(await sorts(b)).toEqual(['none', 'none', 'none', 'ascending']);
        expect(await order(b)).toEqual([...OPEN, ...LOCKED]);
        await tap(b, await sortBox(b, 3));
        expect(await sorts(b)).toEqual(['none', 'none', 'none', 'descending']);
        expect(await order(b)).toEqual([...LOCKED].reverse().concat(OPEN));

        await tap(b, await sortBox(b, 1)); // Dashboard: "Garage" before "Home" (the default dashboard's title)
        expect(await sorts(b)).toEqual(['none', 'ascending', 'none', 'none']);
        expect((await order(b))[0]).toBe('Beta');
        expect(await checkedCard(b)).toBe('Beta');
        expect(b.errors).toEqual([]);
      });
    });

    it('Tab reaches each sort button and the radio; Enter and Space sort; the focus ring shows', async () => {
      await engine.run(servers, async (b) => {
        expect(await mount(b)).toBe(true);
        const names = await headers(b);
        expect(names).toHaveLength(4);
        await b.tab();
        expect(await active(b)).toBe('input.'); // the search field is the first stop
        await b.tab();
        expect(await active(b)).toBe('div.scroll'); // then the labelled region
        for (const n of names) {
          await b.tab();
          expect(await active(b)).toBe(`sort:${n}`);
        }
        // the focused sort button has a visible ring (computed outline) that differs from the unfocused picture
        const ring = await b.eval<{ style: string; width: number; colour: string }>(`(() => { const s = getComputedStyle(${ROOT}.activeElement); return { style: s.outlineStyle, width: parseFloat(s.outlineWidth), colour: s.outlineColor }; })()`);
        // Chromium 85 has no :focus-visible (it arrived in 86), so the browser's own ring ('auto') shows there; the picture check below proves it is drawn
        expect(['solid', 'auto']).toContain(ring.style);
        if (ring.style === 'solid') expect(ring.width).toBeGreaterThanOrEqual(2);
        expect(ring.colour).not.toMatch(/rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\s*\)|transparent/);
        const clip = await boxOf(b, `root.activeElement`);
        const grab = async (): Promise<string> => (await b.send('Page.captureScreenshot', { format: 'png', clip: { x: clip.x - clip.w / 2 - 10, y: clip.y - clip.h / 2 - 10, width: clip.w + 20, height: clip.h + 20, scale: 1 } })).data;
        const focused = await grab();
        await b.eval(`${ROOT}.activeElement.blur()`);
        const blurred = await grab();
        expect(focused === blurred, 'the focus ring changes what is drawn').toBe(false);

        // back to the Card button: Enter sorts ascending, Space descending, focus stays on the button
        await b.eval(`${ROOT}.querySelectorAll('thead button.sort')[0].focus()`);
        await b.key('Enter', 'Enter', 13);
        await sleep(60);
        expect(await sorts(b)).toEqual(['ascending', 'none', 'none', 'none']);
        expect(await order(b)).toEqual(BY_CARD);
        expect(await active(b)).toBe(`sort:${names[0]}`);
        await b.key(' ', 'Space', 32);
        await sleep(60);
        expect(await sorts(b)).toEqual(['descending', 'none', 'none', 'none']);
        expect(await order(b)).toEqual([...BY_CARD].reverse());
        expect(await active(b)).toBe(`sort:${names[0]}`);
        expect(b.errors).toEqual([]);
      });
    });

    it('Space and the arrow keys select a row, locked rows are skipped, Download works from the keyboard', async () => {
      await engine.run(servers, async (b) => {
        await b.send('Browser.setDownloadBehavior', { behavior: 'deny' }).catch(() => undefined);
        expect(await mount(b)).toBe(true);
        expect(await b.eval<string>(`${ROOT}.querySelector('button.download').getAttribute('aria-disabled')`)).toBe('true');
        for (let i = 0; i < 6; i++) await b.tab(); // search field, region, then the four sort buttons
        await b.tab();
        expect(await active(b)).toBe('radio:card:Zebra'); // the first enabled radio of the group
        expect(await checkedCard(b)).toBeNull();
        await b.key(' ', 'Space', 32);
        await sleep(60);
        expect(await checkedCard(b)).toBe('Zebra');
        const seen: string[] = [];
        for (let i = 0; i < 4; i++) {
          await b.key('ArrowDown', 'ArrowDown', 40);
          await sleep(60);
          seen.push((await checkedCard(b)) ?? '');
        }
        expect(seen).toEqual(['Alpha', 'Fonty', 'Beta', 'Zebra']); // Custom and Outside are skipped, the group wraps
        expect(await b.eval<boolean[]>(`[...${ROOT}.querySelectorAll('tbody input[type=radio]:disabled')].map((r) => r.checked)`)).toEqual([false, false]);
        await b.key('ArrowUp', 'ArrowUp', 38);
        await sleep(60);
        expect(await checkedCard(b)).toBe('Beta');
        await b.key('ArrowUp', 'ArrowUp', 38);
        await b.key('ArrowUp', 'ArrowUp', 38);
        await b.key('ArrowUp', 'ArrowUp', 38);
        await sleep(60);
        expect(await checkedCard(b)).toBe('Zebra');
        expect(await b.eval<string>(`${ROOT}.querySelector('button.download').getAttribute('aria-disabled')`)).toBe('false');

        // on to Download by Tab only, then Enter makes the picture without a pointer
        let on = await active(b);
        for (let i = 0; i < 30 && on !== 'button.download'; i++) {
          await b.tab();
          on = await active(b);
        }
        expect(on).toBe('button.download');
        await b.key('Enter', 'Enter', 13);
        let made = false;
        for (let i = 0; i < 200 && !made; i++) {
          await sleep(100);
          made = await b.eval<boolean>(`!!${ROOT}.querySelector('img.preview')`);
        }
        expect(made, `the picture was made (error: ${await b.eval<string>(`${ROOT}.querySelector('.error')?.textContent ?? ''`)})`).toBe(true);
        expect(await b.eval<boolean>(`!!${ROOT}.querySelector('.done')`)).toBe(true);
        const outside = b.requests.filter((r) => !r.url.startsWith(servers.pageUrl.split('/page.html')[0])).map((r) => r.url);
        expect(outside, 'a card without outside fonts contacts nobody').toEqual([]);
        expect(b.errors).toEqual([]);
      });
    });

    it('a click on a row cell selects its radio, a locked row does nothing', async () => {
      await engine.run(servers, async (b) => {
        expect(await mount(b)).toBe(true);
        for (const [name, cell] of [['Alpha', 0], ['Fonty', 1], ['Beta', 1]] as const) {
          await tap(b, await cellBox(b, name, cell));
          expect(await checkedCard(b)).toBe(name);
          expect(await b.eval<string>(`${ROOT}.querySelector('tbody tr.picked label').textContent.trim()`)).toBe(name);
        }
        // a click on the label of an open row works through the native radio
        await tap(b, await boxOf(b, `(${rowOf('Zebra')}).querySelector('label')`));
        expect(await checkedCard(b)).toBe('Zebra');
        for (const name of LOCKED) {
          for (const cell of [0, 2]) {
            await tap(b, await cellBox(b, name, cell));
            expect(await checkedCard(b), `${name} cell ${cell} must not select`).toBe('Zebra');
          }
          await tap(b, await boxOf(b, `(${rowOf(name)}).querySelector('input')`));
          expect(await checkedCard(b)).toBe('Zebra');
        }
        expect(b.errors).toEqual([]);
      });
    });

    it('the accessibility tree has the table, the sort state, and each locked row with its reason', async () => {
      await engine.run(servers, async (b) => {
        expect(await mount(b)).toBe(true);
        const reasons = await b.eval<Record<string, string>>(`(() => {
          const root = ${ROOT}; const out = {};
          for (const tr of root.querySelectorAll('tbody tr')) {
            const name = tr.querySelector('label').textContent.trim();
            const radio = tr.querySelector('input'); const ids = radio.getAttribute('aria-describedby');
            out[name] = ids ? root.getElementById(ids).textContent.trim() : '';
          }
          return out;
        })()`);
        for (const n of OPEN) expect(reasons[n], `${n} has no reason`).toBe('');
        for (const n of LOCKED) expect(reasons[n].length, `${n} has a reason`).toBeGreaterThan(3);
        expect(reasons.Custom).not.toBe(reasons.Outside);

        const nodes = await axTree(b);
        // Chromium 85 reports an ARIA cell as 'gridcell'
        const count = (role: string): number => nodes.filter((n) => n.role === role || (role === 'cell' && n.role === 'gridcell')).length;
        expect(count('table')).toBe(1);
        expect(count('columnheader')).toBe(4);
        expect(count('row')).toBe(1 + DASHBOARD_ORDER.length);
        expect(count('cell')).toBe(4 * DASHBOARD_ORDER.length);
        const radios = nodes.filter((n) => n.role === 'radio');
        for (const n of OPEN) {
          const r = radios.find((x) => x.name === n);
          expect(r, `${n} radio in the tree`).toBeDefined();
          expect(r!.disabled, `${n} is enabled`).toBe(false);
        }
        for (const n of LOCKED) {
          const r = radios.find((x) => x.name === n);
          expect(r, `${n} radio in the tree`).toBeDefined();
          expect(r!.disabled, `${n} is disabled`).toBe(true);
          expect(r!.description, `${n} announces its reason`).toContain(reasons[n]);
        }
        expect(await b.eval<boolean>(`${ROOT}.querySelector('table').getAttribute('role') === 'table' && ${ROOT}.querySelector('.scroll').getAttribute('role') === 'region' && !!${ROOT}.querySelector('.scroll').getAttribute('aria-label')`)).toBe(true);

        // the sort state is on the column header in the DOM and the sort button keeps its name in the tree
        await tap(b, await sortBox(b, 2));
        expect(await sorts(b)).toEqual(['none', 'none', 'ascending', 'none']);
        const after = await axTree(b);
        const headerNames = await headers(b);
        for (const h of headerNames) expect(after.some((n) => n.role === 'button' && n.name.startsWith(h)), `button ${h}`).toBe(true);
        expect(b.errors).toEqual([]);
      });
    });

    it('the sorted column shows an arrow glyph, not stray characters', async () => {
      await engine.run(servers, async (b) => {
        expect(await mount(b)).toBe(true);
        const after = (): Promise<string> => b.eval(`getComputedStyle(${ROOT}.querySelectorAll('thead button.sort')[2], '::after').content`);
        expect(await after()).toBe('none');
        await tap(b, await sortBox(b, 2));
        const up = await after();
        await tap(b, await sortBox(b, 2));
        const down = await after();
        const codes = (s: string): number[] => [...s].map((c) => c.charCodeAt(0));
        expect(codes(up).some((c) => c === 0x25b2 || c === 0x25b4 || c === 0x2191), `ascending arrow, got ${up}`).toBe(true);
        expect(codes(down).some((c) => c === 0x25bc || c === 0x25be || c === 0x2193), `descending arrow, got ${down}`).toBe(true);
        // a mangled escape reads back as a control character or as a backslash sequence
        expect(codes(up + down).filter((c) => c < 32 || c === 92), 'no control character or escape text in the arrow').toEqual([]);
      });
    });

    it('sort buttons and radio rows are at least 44 px', async () => {
      await engine.run(servers, async (b) => {
        expect(await mount(b)).toBe(true);
        const sizes = await b.eval<{ buttons: number[][]; rows: number[][]; choices: number[][]; radios: number[][] }>(`(() => {
          const root = ${ROOT}; const box = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]; };
          return {
            buttons: [...root.querySelectorAll('thead button.sort')].map(box),
            rows: [...root.querySelectorAll('tbody tr')].map(box),
            choices: [...root.querySelectorAll('tbody .choice')].map(box),
            radios: [...root.querySelectorAll('tbody input[type=radio]')].map(box),
          };
        })()`);
        for (const [w, h] of sizes.buttons) {
          expect(w).toBeGreaterThanOrEqual(44);
          expect(h).toBeGreaterThanOrEqual(44);
        }
        for (const [w, h] of sizes.rows) {
          expect(w).toBeGreaterThanOrEqual(44);
          expect(h).toBeGreaterThanOrEqual(44);
        }
        for (const [w, h] of sizes.choices) {
          expect(w).toBeGreaterThanOrEqual(44);
          expect(h).toBeGreaterThanOrEqual(44);
        }
        // the radio itself is 24 px (WCAG 2.2 minimum) and sits in a 44 px row
        for (const [w, h] of sizes.radios) {
          expect(w).toBeGreaterThanOrEqual(24);
          expect(h).toBeGreaterThanOrEqual(24);
        }
        // a pointer at the edge of the 44 px choice area, outside the label and the 24 px radio, still selects
        const edge = await b.eval<{ x: number; y: number } | null>(`(() => {
          const root = ${ROOT}; const tr = ${rowOf('Alpha')}; const c = tr.querySelector('.choice'); c.scrollIntoView({ block: 'center' });
          const r = c.getBoundingClientRect(); const radio = tr.querySelector('input').getBoundingClientRect();
          return { x: r.right - 3, y: radio.bottom + (r.bottom - radio.bottom) / 2 };
        })()`);
        expect(edge).not.toBeNull();
        await b.click(edge!.x, edge!.y);
        await sleep(60);
        expect(await checkedCard(b)).toBe('Alpha');
        expect(b.errors).toEqual([]);
      });
    });

    const geometry = (b: Browser) =>
      b.eval<any>(`(() => {
        const root = ${ROOT}; const d = (e) => getComputedStyle(e).display;
        const wrap = root.querySelector('.scroll'); const table = root.querySelector('table');
        return {
          table: d(table), tr: [...root.querySelectorAll('tbody tr')].map(d), td: [...root.querySelectorAll('tbody td')].map(d),
          roles: [table.getAttribute('role'), root.querySelector('tbody tr').getAttribute('role'), root.querySelector('tbody td').getAttribute('role')],
          labels: root.querySelectorAll('[data-label]').length,
          scrollW: document.documentElement.scrollWidth, wrapScrolls: wrap.scrollWidth > wrap.clientWidth,
          tips: [...root.querySelectorAll('button.tip')].map((x) => { const r = x.getBoundingClientRect(); return [r.width, r.height]; }),
        };
      })()`);
    const openTip = async (b: Browser, name: string): Promise<void> => {
      const r = await b.eval<Box>(`(() => { const root = ${ROOT}; const e = (${rowOf(name)}).querySelector('button.tip'); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; })()`);
      await b.click(r.x, r.y);
      await sleep(80);
    };
    const popRect = (b: Browser) =>
      b.eval<any>(`(() => {
        const root = ${ROOT}; const p = root.querySelector('.pop'); if (!p) return null;
        const r = p.getBoundingClientRect(); const s = root.querySelector('section').getBoundingClientRect();
        const t = root.querySelector('button.tip[aria-expanded=true]').getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, secLeft: s.left, secRight: s.right, tipTop: t.top, tipBottom: t.bottom, vh: innerHeight, vw: document.documentElement.clientWidth, focus: root.activeElement && root.activeElement.textContent.trim() };
      })()`);

    for (const [width, narrow] of [[375, false], [768, false], [1000, true]] as const) {
      it(`at ${width} px${narrow ? ' with narrow' : ''} the table stays a table, the page does not scroll sideways, the Status buttons are 44 px`, async () => {
        await engine.run(servers, async (b) => {
          await b.viewport(width, 800);
          expect(await mount(b, narrow)).toBe(true);
          await sleep(150);
          const g = await geometry(b);
          expect(g.table).toBe('table');
          expect(new Set(g.tr)).toEqual(new Set(['table-row']));
          expect(new Set(g.td)).toEqual(new Set(['table-cell']));
          expect(g.roles).toEqual(['table', 'row', 'cell']);
          expect(g.labels).toBe(0);
          expect(g.scrollW).toBeLessThanOrEqual(width);
          if (width === 375) expect(g.wrapScrolls, 'the region scrolls instead of the page').toBe(true);
          expect(g.tips).toHaveLength(DASHBOARD_ORDER.length);
          for (const [w, h] of g.tips) {
            expect(w).toBeGreaterThanOrEqual(44);
            expect(h).toBeGreaterThanOrEqual(44);
          }
          const nodes = await axTree(b);
          expect(nodes.filter((n) => n.role === 'table')).toHaveLength(1);
          expect(nodes.filter((n) => n.role === 'row')).toHaveLength(1 + DASHBOARD_ORDER.length);
          expect(nodes.filter((n) => n.role === 'button' && /show details$/.test(n.name))).toHaveLength(DASHBOARD_ORDER.length);
          await b.shot(path.join(SHOTS, `table-${width}${narrow ? '-narrow' : ''}-${engine.name}.png`));

          // rows stay selectable by a real tap, locked rows do not; a sort works by tap
          await tap(b, await cellBox(b, 'Beta', 1));
          expect(await checkedCard(b)).toBe('Beta');
          await tap(b, await cellBox(b, 'Custom', 0));
          expect(await checkedCard(b)).toBe('Beta');
          await tap(b, await sortBox(b, 0));
          expect(await order(b)).toEqual(BY_CARD);
          expect(b.errors).toEqual([]);
        });
      });
    }

    for (const width of [320, 768, 1280]) {
      for (const narrow of [false, true]) {
        it(`at ${width} px narrow ${narrow ? 'on' : 'off'} the table is a table, Status holds only an icon, and the popup stays on screen while the table is scrolled sideways`, async () => {
          await engine.run(servers, async (b) => {
            await b.viewport(width, 800);
            expect(await mount(b, narrow)).toBe(true);
            await sleep(150);
            const g = await geometry(b);
            expect(g.table).toBe('table');
            expect(new Set(g.tr)).toEqual(new Set(['table-row']));
            expect(g.labels).toBe(0);
            expect(g.scrollW, 'the page does not scroll sideways').toBeLessThanOrEqual(width);
            const head = await b.eval<string[]>(`[...${ROOT}.querySelectorAll('thead th')].map((t) => t.textContent.replace(/[^\\p{L}]/gu, ''))`);
            expect(head).toEqual(['Card', 'Dashboard', 'View', 'Status']);
            // the Status cell holds one button with the icon and the word
            const cells = await b.eval<string[]>(`[...${ROOT}.querySelectorAll('tbody tr')].map((tr) => { const c = tr.lastElementChild; return c.querySelectorAll('button').length + ':' + [...c.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('') + ':' + c.querySelectorAll('svg').length; })`);
            expect(new Set(cells)).toEqual(new Set(['1::1']));
            for (const [w, h] of g.tips) {
              expect(w).toBeGreaterThanOrEqual(24);
              expect(h).toBeGreaterThanOrEqual(44);
            }
            // scrolled fully sideways, then a popup on the first and the last row
            await b.eval(`${ROOT}.querySelector('.scroll').scrollLeft = 9999`);
            await sleep(80);
            for (const name of ['Zebra', 'Outside']) {
              await openTip(b, name);
              const r = await popRect(b);
              expect(r, `popup for ${name}`).not.toBeNull();
              expect(r.left).toBeGreaterThanOrEqual(0 - 0.5);
              expect(r.right).toBeLessThanOrEqual(r.vw + 0.5);
              expect(r.left).toBeGreaterThanOrEqual(r.secLeft - 0.5);
              expect(r.right).toBeLessThanOrEqual(r.secRight + 0.5);
              expect(r.top >= r.tipBottom - 0.5 || r.bottom <= r.tipTop + 0.5, 'popup does not cover its icon').toBe(true);
              expect(r.focus).toBe('Close');
              await b.eval(`${ROOT}.querySelector('.pop button').click()`);
              await sleep(60);
            }
            expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(0);
            expect(b.errors).toEqual([]);
          });
        });
      }
    }

    it('sorted by Status the order matches beta.15 and a popup shows its own row in the browser', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(1280, 800);
        expect(await mount(b)).toBe(true);
        await sleep(100);
        await tap(b, await sortBox(b, 3));
        expect(await order(b)).toEqual(['Zebra', 'Alpha', 'Fonty', 'Beta', 'Custom', 'Outside']);
        await openTip(b, 'Custom');
        const t = await b.eval<string>(`${ROOT}.querySelector('.pop').closest('tr').querySelector('label').textContent.trim() + '|' + ${ROOT}.querySelector('.pop').textContent`);
        expect(t.startsWith('Custom|')).toBe(true);
        expect(t).toContain('custom-card');
        expect(b.errors).toEqual([]);
      });
    });

    it('the Status button is named for its state, and a locked radio is still described without opening the popup', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(1280, 800);
        expect(await mount(b)).toBe(true);
        await sleep(100);
        const nodes = await axTree(b);
        const names = nodes.filter((n) => n.role === 'button' && /show details$/.test(n.name)).map((n) => n.name);
        expect(names.filter((n) => n === 'Available, show details')).toHaveLength(OPEN.length);
        expect(names.filter((n) => n === 'Locked, show details')).toHaveLength(LOCKED.length);
        const locked = nodes.filter((n) => n.role === 'radio' && n.disabled);
        expect(locked).toHaveLength(LOCKED.length);
        for (const n of locked) expect(n.description.length).toBeGreaterThan(0);
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(0);
      });
    });

    it('real mouse clicks: popup text keeps the popup open, the same button and a second tap on a locked row close it', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(1280, 800);
        expect(await mount(b)).toBe(true);
        await sleep(100);
        const pops = () => b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`);
        await openTip(b, 'Custom');
        expect(await pops()).toBe(1);
        const text = await boxOf(b, `root.querySelector('.pop p')`);
        await b.click(text.x, text.y);
        await sleep(100);
        expect(await pops()).toBe(1);
        await openTip(b, 'Custom');
        expect(await pops()).toBe(0);
        await tap(b, await cellBox(b, 'Custom', 0));
        expect(await pops()).toBe(1);
        await tap(b, await cellBox(b, 'Custom', 0));
        expect(await pops()).toBe(0);
        await openTip(b, 'Custom');
        const out = await boxOf(b, `root.querySelector('h1, p, section')`);
        await b.click(out.x, 2);
        await sleep(100);
        expect(await pops()).toBe(0);
        expect(b.errors).toEqual([]);
      });
    });

    it('a click on a cell of an available row closes the open popup and selects the row', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(1280, 800);
        expect(await mount(b)).toBe(true);
        await sleep(100);
        await openTip(b, 'Custom');
        await tap(b, await cellBox(b, 'Alpha', 1));
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(0);
        expect(await b.eval<boolean>(`(() => { const root = ${ROOT}; return (${rowOf('Alpha')}).querySelector('input').checked; })()`)).toBe(true);
        expect(b.errors).toEqual([]);
      });
    });

    it('a click on a cell of the open available row closes its popup and picks that row', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(1280, 800);
        expect(await mount(b)).toBe(true);
        await sleep(100);
        await openTip(b, 'Alpha');
        await tap(b, await cellBox(b, 'Alpha', 1));
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(0);
        expect(await b.eval<boolean>(`(() => { const root = ${ROOT}; return (${rowOf('Alpha')}).querySelector('input').checked; })()`)).toBe(true);
        expect(b.errors).toEqual([]);
      });
    });

    it('Tab from Close closes the popup and lands on the Status button of the next row', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(1280, 800);
        expect(await mount(b)).toBe(true);
        await sleep(100);
        // with a card picked the other radios leave the tab order, so Tab from Close reaches the next row's Status button
        await tap(b, await cellBox(b, 'Zebra', 1));
        expect(await checkedCard(b)).toBe('Zebra');
        await openTip(b, 'Alpha');
        expect(await b.eval<string>(`${ROOT}.activeElement.textContent.trim()`)).toBe('Close');
        await b.tab();
        await sleep(80);
        expect(await b.eval<boolean>(`(() => { const root = ${ROOT}; return root.activeElement === (${rowOf('Fonty')}).querySelector('button.tip'); })()`)).toBe(true);
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(0);
        expect(b.errors).toEqual([]);
      });
    });

    it('at 200% zoom Tab reaches each Status button in row order with a visible outline inside the scroll region', async () => {
      await engine.run(servers, async (b) => {
        await b.send('Emulation.setDeviceMetricsOverride', { width: 640, height: 400, deviceScaleFactor: 2, mobile: false });
        expect(await mount(b)).toBe(true);
        await sleep(100);
        const seen: string[] = [];
        await b.eval(`${ROOT}.querySelector('.scroll').focus()`);
        for (let i = 0; i < 40 && seen.length < DASHBOARD_ORDER.length; i++) {
          await b.tab();
          const hit = await b.eval<{ name: string; style: string; width: number; inside: boolean } | null>(`(() => {
            const root = ${ROOT}; const a = root.activeElement;
            if (!a || !a.matches('button.tip')) return null;
            const s = getComputedStyle(a); const r = a.getBoundingClientRect(); const w = root.querySelector('.scroll').getBoundingClientRect();
            const o = parseFloat(s.outlineWidth) + parseFloat(s.outlineOffset || '0');
            return { name: a.closest('tr').querySelector('label').textContent.trim(), style: s.outlineStyle, width: parseFloat(s.outlineWidth),
              inside: r.top - o >= w.top && r.bottom + o <= w.bottom && r.left - o >= w.left - 1 };
          })()`);
          if (!hit) continue;
          seen.push(hit.name);
          expect(['solid', 'auto']).toContain(hit.style);
          expect(hit.width).toBeGreaterThan(0);
          expect(hit.inside, `${hit.name} outline inside the scroll region`).toBe(true);
        }
        expect(seen).toEqual(DASHBOARD_ORDER);
        expect(b.errors).toEqual([]);
      });
    });

    it('Escape, a click outside and Close close the popup and focus returns to the icon', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(1280, 800);
        expect(await mount(b)).toBe(true);
        await sleep(100);
        const focusOnTip = (name: string) => b.eval<boolean>(`(() => { const root = ${ROOT}; return root.activeElement === (${rowOf(name)}).querySelector('button.tip'); })()`);
        const pops = () => b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`);
        await openTip(b, 'Alpha');
        await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await sleep(80);
        expect(await pops()).toBe(0);
        expect(await focusOnTip('Alpha')).toBe(true);
        await openTip(b, 'Alpha');
        await b.eval(`${ROOT}.querySelector('.pop button').click()`);
        await sleep(80);
        expect(await pops()).toBe(0);
        expect(await focusOnTip('Alpha')).toBe(true);
        expect(b.errors).toEqual([]);
      });
    });

    it('the Status button opens details inside the screen, flips above on the last row, and one click on another button switches', async () => {
      await engine.run(servers, async (b) => {
        await b.viewport(375, 900);
        expect(await mount(b)).toBe(true);
        await sleep(150);
        await b.eval(`${ROOT}.querySelector('.scroll').scrollLeft = 9999`);
        await sleep(80);
        await openTip(b, 'Outside');
        let r = await popRect(b);
        expect(r).not.toBeNull();
        expect(r.left).toBeGreaterThanOrEqual(r.secLeft - 0.5);
        expect(r.right).toBeLessThanOrEqual(r.secRight + 0.5);
        expect(r.top).toBeGreaterThanOrEqual(r.tipBottom);
        expect(r.focus).toBe('Close');
        expect(await b.eval<string>(`${ROOT}.querySelector('.pop').textContent`)).toContain('outside Home Assistant');
        await b.shot(path.join(SHOTS, `status-open-${engine.name}.png`));

        // a click on another Status button closes this one and opens that one in the same click
        await openTip(b, 'Custom');
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(1);
        expect(await b.eval<string>(`${ROOT}.querySelector('.pop').textContent`)).toContain('custom-card');

        await b.eval(`${ROOT}.querySelector('.pop button').click()`); // the open details cover the rows below
        // the last row near the bottom of the screen: the details sit above the button
        await b.eval(`window.scrollTo(0, document.documentElement.scrollHeight)`);
        await b.viewport(375, 420);
        await sleep(120);
        await b.eval(`(() => { const root = ${ROOT}; (${rowOf('Beta')}).querySelector('button.tip').scrollIntoView({ block: 'end' }); })()`);
        await sleep(80);
        await openTip(b, 'Beta');
        r = await popRect(b);
        expect(r.bottom).toBeLessThanOrEqual(r.tipTop + 0.5);
        expect(r.top).toBeGreaterThanOrEqual(0);

        // Escape closes and returns focus to the button; an outside tap closes too
        await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await sleep(80);
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(0);
        expect(await b.eval<boolean>(`(() => { const root = ${ROOT}; return root.activeElement === (${rowOf('Beta')}).querySelector('button.tip'); })()`)).toBe(true);
        await openTip(b, 'Beta');
        await b.click(5, 5);
        await sleep(80);
        expect(await b.eval<number>(`${ROOT}.querySelectorAll('.pop').length`)).toBe(0);
        expect(b.errors).toEqual([]);
      });
    });
  });
}
