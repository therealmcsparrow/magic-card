import path from 'node:path';
import os from 'node:os';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bundlePage, engines, startServers, type Servers } from '../fixtures/forum-shot-font-server';

// AC1, AC2, AC11, AC12 (and AC19 for the notice) in a real browser: a card with an outside Google font is drawn with the fetched font file,
// the wire holds only the two allowed hosts and carries no cookie and no referrer, and a face with unicode-range draws inside the SVG
// foreignObject on a canvas. Both Google host names resolve to a local https server; every other name fails to resolve, so nothing leaves
// the machine. Engines: current Chrome and the Chromium 85 floor (tests/i18n-keys/browser/chromium85.mjs). Safari and Firefox are not run.

const SHOTS = path.join(os.tmpdir(), 'mc-forum-shot-shots');
const HASS = `{ states: {}, language: 'en', themes: { themes: {} }, connection: { subscribeMessage: async (cb, msg) => { if (msg.type === 'render_template') queueMicrotask(() => cb({ result: window.__tpl ?? '' })); return () => {}; } } }`;

const card = (family: string, text = 'AAAA NNNN') => ({
  type: 'custom:magic-card',
  rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text, design: { font_family: family, font_size: 48 } }] }] }],
});

// a card whose Open Sans text is tiny and whose second text module shows a template result (a result holding markup is blanked by the hass copy, so results here are plain text)
const tplCard = () => ({
  type: 'custom:magic-card',
  rows: [{ id: 'r', columns: [{ id: 'c', modules: [
    { id: 'a', type: 'text', text: '.', design: { font_family: 'Open Sans', font_size: 8 } },
    { id: 'b', type: 'text', text: '{{ shown }}', use_template: true, design: { font_size: 48 } },
  ] }] }],
});

// runs one sheet and reports the code (or 'ok'), the PNG as a data URL and the count of dark pixels
const run = (config: unknown, tpl = ''): string => `(async () => {
  window.__tpl = ${JSON.stringify(tpl)};
  try {
    const s = await F.renderSheet(${HASS}, { config: ${JSON.stringify(config)}, modes: ['light'], looks: ['as-configured'] }, { settleMs: 200 });
    const url = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(s.blob); });
    const img = new Image(); img.src = url; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let dark = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] < 90 && d[i + 1] < 90 && d[i + 2] < 90 && d[i + 3] > 200) dark++;
    return { code: 'ok', url, dark, width: img.width, notices: s.notices, head: document.head.innerHTML.length, links: document.querySelectorAll('link[data-mc-font], style[data-mc-shot-font]').length };
  } catch (e) { return { code: e.code || String(e), url: '', dark: 0, notices: [], links: document.querySelectorAll('link[data-mc-font], style[data-mc-shot-font]').length }; }
})()`;

interface Out { code: string; url: string; dark: number; notices: string[]; links: number }
const show = (url: string): string => `(() => { document.body.innerHTML = ''; const i = new Image(); i.src = ${JSON.stringify(url)}; i.style.cssText = 'display:block;background:#ccc'; document.body.append(i); return i.decode().then(() => true); })()`;

let servers: Servers;
beforeAll(async () => {
  servers = await startServers(await bundlePage());
});
afterAll(async () => {
  await servers.close();
});

for (const engine of engines()) {
  describe(`forum shot fonts on ${engine.name}`, () => {
    it('real font and only allowed requests', async () => {
      servers.wire.length = 0;
      await engine.run(servers, async (b) => {
        const real = await b.eval<Out>(run(card('Open Sans')));
        const control = await b.eval<Out>(run(card('sans-serif')));
        expect(real.code, 'AC1 the run finishes').toBe('ok');
        expect(control.code).toBe('ok');
        // AC1 the picture holds the fetched font: it differs from the fallback and its blocks are solid ink
        expect(real.url).not.toBe(control.url);
        expect(real.dark, 'solid blocks of the fetched font').toBeGreaterThan(control.dark * 2);
        await b.eval(show(real.url));
        await b.shot(path.join(SHOTS, `${engine.name}-real-font.png`));
        // AC11 the card's own font link and the shot's face style are gone after the run
        expect(real.links).toBe(0);
        // AC2 the wire: only the two hosts, one stylesheet and the font files, no cookie, no referrer
        const hosts = new Set(servers.wire.map((w) => w.host));
        expect([...hosts].sort()).toEqual(['fonts.googleapis.com', 'fonts.gstatic.com']);
        expect(servers.wire.filter((w) => w.host === 'fonts.googleapis.com')).toHaveLength(1);
        for (const w of servers.wire) {
          expect(w.method).toBe('GET');
          expect(w.headers.cookie, `${w.url} cookie`).toBeUndefined();
          expect(w.headers.referer, `${w.url} referer`).toBeUndefined();
        }
        // the browser's own view: nothing but the page, its script and the two hosts was asked for, and nothing failed
        const outside = b.requests.map((r) => new URL(r.url)).filter((u) => u.hostname !== '127.0.0.1');
        expect([...new Set(outside.map((u) => u.hostname))].sort()).toEqual(['fonts.googleapis.com', 'fonts.gstatic.com']);
        expect(b.failed, 'no failed request').toEqual([]);
        expect(b.errors).toEqual([]);
      });
    });

    it('a family that no host can supply stops the run and leaves nothing behind', async () => {
      const prev = servers.css;
      servers.setCss((f) => (f === 'Open Sans' ? prev(f) : '@font-face{font-family:Broken;src:url(https://fonts.gstatic.com/missing.ttf) format("truetype");}'));
      try {
        await engine.run(servers, async (b) => {
          const r = await b.eval<Out>(run(card('Lato')));
          expect(r.code).toBe('font_unavailable');
          expect(r.url).toBe('');
          expect(r.links).toBe(0);
        });
      } finally {
        servers.setCss(prev);
      }
    });

    it('a face with unicode-range as data: draws inside the SVG foreignObject on a canvas', async () => {
      await engine.run(servers, async (b) => {
        const r = await b.eval<{ a: number[]; n: number[] }>(`(async () => {
          const b64 = async (u) => { const buf = new Uint8Array(await (await fetch(u, { credentials: 'omit', referrerPolicy: 'no-referrer', mode: 'cors' })).arrayBuffer()); let s = ''; for (const c of buf) s += String.fromCharCode(c); return btoa(s); };
          const wide = await b64('https://fonts.gstatic.com/s/wide.ttf'), tall = await b64('https://fonts.gstatic.com/s/tall.ttf');
          const css = "@font-face{font-family:'Probe';src:url(data:font/ttf;base64," + wide + ") format('truetype');unicode-range:U+0041-004D;}@font-face{font-family:'Probe';src:url(data:font/ttf;base64," + tall + ") format('truetype');unicode-range:U+004E-005A;}";
          const box = async (ch) => {
            const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><foreignObject width="200" height="200"><div xmlns="http://www.w3.org/1999/xhtml" style="font:100px/1 Probe, serif;color:#000;padding:20px"><style>' + css + '</style>' + ch + '</div></foreignObject></svg>';
            const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
            const c = document.createElement('canvas'); c.width = 200; c.height = 200; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
            const d = x.getImageData(0, 0, 200, 200).data; let x0 = 999, x1 = -1, y0 = 999, y1 = -1;
            for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128 && d[i] < 100) { const p = i / 4, px = p % 200, py = (p / 200) | 0; x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); }
            return [x1 - x0 + 1, y1 - y0 + 1];
          };
          return { a: await box('A'), n: await box('N') };
        })()`);
        // A sits in the wide face (a 70 x 70 block at 100 px) and N in the tall face (20 x 100): each range picked its own file
        expect(r.a[0]).toBeGreaterThan(60);
        expect(r.a[0]).toBeLessThan(80);
        expect(r.a[1]).toBeLessThan(80);
        expect(r.n[0]).toBeLessThan(30);
        expect(r.n[1]).toBeGreaterThan(90);
      });
    });

    it('defaultSeams.loadFace accepts a real font and refuses other bytes', async () => {
      await engine.run(servers, async (b) => {
        const r = await b.eval<{ good: boolean; bad: boolean }>(`(async () => {
          const bytes = new Uint8Array(await (await fetch('https://fonts.gstatic.com/s/wide.ttf', { credentials: 'omit', referrerPolicy: 'no-referrer', mode: 'cors' })).arrayBuffer());
          return { good: await F.defaultSeams.loadFace({ family: 'Probe', unicodeRange: 'U+0041-004D', bytes }), bad: await F.defaultSeams.loadFace({ family: 'Probe', bytes: new Uint8Array([0x77, 0x4f, 0x46, 0x32, 1, 2, 3, 4]) }) };
        })()`);
        expect(r).toEqual({ good: true, bad: false });
      });
    });

    it('a template result naming the prepared family finishes; one naming another family stops the run', async () => {
      await engine.run(servers, async (b) => {
        const cfg = tplCard();
        const named = await b.eval<Out>(run(cfg, `font-family: 'Open Sans'`));
        expect(named.code, 'the prepared family in a template result is aliased, not refused').toBe('ok');
        expect(named.links).toBe(0);
        await b.eval(show(named.url));
        await b.shot(path.join(SHOTS, `${engine.name}-template-family.png`));
        const other = await b.eval<Out>(run(cfg, `font-family: Lato`));
        expect(other.code, 'AC12 a family with no prepared face never falls back').toBe('font_unavailable');
        expect(other.url).toBe('');
        expect(other.links).toBe(0);
        // a result without a font-family declaration is not a font request
        const none = await b.eval<Out>(run(cfg, 'plain words'));
        expect(none.code).toBe('ok');
      });
    });
  });
}
