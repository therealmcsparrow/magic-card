import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generate } from 'selfsigned';
import { build } from 'vite';
import i18nKeys from '../../tools/i18n/vite-plugin.mjs';
// @ts-expect-error plain JS driver
import { chromiumPath } from '../i18n-keys/browser/chromium85.mjs';

// Browser fixture of the forum shot passes (tests/browser/forum-shot-*.spec.ts). Three parts:
//  1. buildFont: a tiny TrueType font made here (every printable character is one solid block), so a drawn block proves the font file
//     was used and no licensed font file is committed.
//  2. startServers: a local https server that stands in for fonts.googleapis.com and fonts.gstatic.com (the browser maps both names to it,
//     every other name fails to resolve, so nothing leaves the machine) and logs what really arrived, plus a plain http server for the page.
//  3. launch: Chrome or the Chromium 85 floor driven over raw CDP (puppeteer 25 cannot launch 85), with mouse, keyboard, screenshots.

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const src = (p: string): string => path.join(ROOT, 'src', p).replace(/\\/g, '/');

// ---------------------------------------------------------------- the font
const u16 = (n: number): number[] => [(n >> 8) & 255, n & 255];
const i16 = (n: number): number[] => u16(n & 0xffff);
const u32 = (n: number): number[] => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const tag = (s: string): number[] => [...s].map((c) => c.charCodeAt(0));
const pad4 = (b: number[]): number[] => (b.length % 4 ? [...b, ...new Array(4 - (b.length % 4)).fill(0)] : b);
const sum = (b: number[]): number => {
  let s = 0;
  const p = pad4(b);
  for (let i = 0; i < p.length; i += 4) s = (s + (((p[i] << 24) | (p[i + 1] << 16) | (p[i + 2] << 8) | p[i + 3]) >>> 0)) >>> 0;
  return s;
};

export interface FontSpec {
  /** Family name written into the file. */
  name: string;
  /** Block width and height in font units (1000 per em); the advance is width + 100. */
  width: number;
  height: number;
  /** Code points the font covers (inclusive ranges). */
  ranges: Array<[number, number]>;
}

/** A valid TrueType file: .notdef, one solid block glyph for every covered code point, and an empty space. */
export function buildFont(spec: FontSpec): Buffer {
  const w = spec.width;
  const adv = w + 100;
  const glyph = [...i16(1), ...i16(50), ...i16(0), ...i16(50 + w), ...i16(spec.height), ...u16(3), ...u16(0), 1, 1, 1, 1, ...i16(50), ...i16(0), ...i16(w), ...i16(0), ...i16(0), ...i16(spec.height), ...i16(0), ...i16(-spec.height)];
  const glyf = pad4(glyph);
  const loca = [...u32(0), ...u32(0), ...u32(glyf.length), ...u32(glyf.length)];
  const ranges = spec.ranges.filter(([a, b]) => b >= a && a > 0x20).sort((a, b) => a[0] - b[0]);
  const segs: Array<[number, number, number]> = [[0x20, 0x20, 2], ...ranges.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i): [number, number, number] => [a + i, a + i, 1])), [0xffff, 0xffff, 0]];
  const n = segs.length;
  let es = 0;
  while (1 << (es + 1) <= n) es++;
  const sr = 2 * (1 << es);
  const sub = [...u16(4), ...u16(16 + n * 8), ...u16(0), ...u16(n * 2), ...u16(sr), ...u16(es), ...u16(n * 2 - sr), ...segs.flatMap(([, e]) => u16(e)), ...u16(0), ...segs.flatMap(([s]) => u16(s)), ...segs.flatMap(([s, , g]) => u16(g === 0 ? 1 : (g - s) & 0xffff)), ...segs.flatMap(() => u16(0))];
  const cmap = [...u16(0), ...u16(1), ...u16(3), ...u16(1), ...u32(12), ...sub];
  const names = [`${spec.name}`, 'Regular', `${spec.name} Regular`, spec.name.replace(/\s/g, '')];
  const ids = [1, 2, 4, 6];
  const enc = names.map((s) => [...s].flatMap((c) => u16(c.charCodeAt(0))));
  let off = 0;
  const recs = enc.flatMap((e, i) => {
    const r = [...u16(3), ...u16(1), ...u16(0x409), ...u16(ids[i]), ...u16(e.length), ...u16(off)];
    off += e.length;
    return r;
  });
  const name = [...u16(0), ...u16(4), ...u16(6 + 12 * 4), ...recs, ...enc.flat()];
  const first = Math.min(...ranges.map((r) => r[0]));
  const last = Math.max(...ranges.map((r) => r[1]));
  const os2 = [...u16(4), ...i16(adv), ...u16(400), ...u16(5), ...u16(0), ...new Array(10).fill(0).flatMap(() => i16(0)), ...i16(0), ...new Array(10).fill(0), ...u32(1), ...u32(0), ...u32(0), ...u32(0), ...tag('NONE'), ...u16(0x40), ...u16(Math.min(first, 0xffff)), ...u16(Math.min(last, 0xffff)), ...i16(800), ...i16(-200), ...i16(0), ...u16(800), ...u16(200), ...u32(1), ...u32(0), ...i16(500), ...i16(700), ...u16(0), ...u16(0x20), ...u16(1)];
  const maxp = [...u32(0x00010000), ...u16(3), ...u16(4), ...u16(1), ...u16(0), ...u16(0), ...u16(2), ...new Array(16).fill(0)];
  const hhea = [...u32(0x00010000), ...i16(800), ...i16(-200), ...i16(0), ...u16(adv), ...i16(50), ...i16(50), ...i16(50 + w), ...i16(1), ...i16(0), ...i16(0), ...new Array(8).fill(0), ...i16(0), ...u16(3)];
  const hmtx = [...u16(0), ...i16(0), ...u16(adv), ...i16(50), ...u16(300), ...i16(0)];
  const head = (adj: number): number[] => [...u32(0x00010000), ...u32(0x00010000), ...u32(adj), ...u32(0x5f0f3cf5), ...u16(3), ...u16(1000), ...new Array(16).fill(0), ...i16(0), ...i16(0), ...i16(50 + w), ...i16(spec.height), ...u16(0), ...u16(8), ...i16(2), ...i16(1), ...i16(0)];
  const post = [...u32(0x00030000), ...u32(0), ...i16(-100), ...i16(50), ...u32(0), ...u32(0), ...u32(0), ...u32(0), ...u32(0)];
  const tables: Array<[string, number[]]> = [['OS/2', os2], ['cmap', cmap], ['glyf', glyf], ['head', head(0)], ['hhea', hhea], ['hmtx', hmtx], ['loca', loca], ['maxp', maxp], ['name', name], ['post', post]];
  const count = tables.length;
  let sel = 0;
  while (1 << (sel + 1) <= count) sel++;
  const searchRange = 16 * (1 << sel);
  const dirLen = 12 + 16 * count;
  const place = (t: Array<[string, number[]]>): number[] => {
    let at = dirLen;
    const dir = t.flatMap(([k, b]) => {
      const e = [...tag(k), ...u32(sum(b)), ...u32(at), ...u32(b.length)];
      at += pad4(b).length;
      return e;
    });
    return [...u32(0x00010000), ...u16(count), ...u16(searchRange), ...u16(sel), ...u16(count * 16 - searchRange), ...dir, ...t.flatMap(([, b]) => pad4(b))];
  };
  const whole = place(tables);
  const adj = (0xb1b0afba - sum(whole)) >>> 0;
  return Buffer.from(place(tables.map(([k, b]): [string, number[]] => (k === 'head' ? [k, head(adj)] : [k, b]))));
}

/** A wide font (A to M) and a tall narrow font (N to Z), both under the card's family name. */
export const WIDE: FontSpec = { name: 'Fixture Sans', width: 700, height: 700, ranges: [[0x41, 0x4d], [0x61, 0x6d], [0x30, 0x39]] };
export const TALL: FontSpec = { name: 'Fixture Sans', width: 200, height: 1000, ranges: [[0x4e, 0x5a], [0x6e, 0x7a]] };

// ----------------------------------------------------------- the servers
export interface Wire {
  host: string;
  method: string;
  url: string;
  /** The Origin header as received (undefined when the browser sent none). */
  origin: string | undefined;
  headers: http.IncomingHttpHeaders;
}
export interface Servers {
  pageUrl: string;
  /** The page's origin (scheme, host, port), the value every cross-origin font request should carry as Origin. */
  pageOrigin: string;
  wire: Wire[];
  /** Replaces what the stylesheet host answers for a family; default is two faces with unicode-range. */
  css: (family: string) => string;
  setCss(fn: (family: string) => string): void;
  httpsPort: number;
  close(): Promise<void>;
}

const FONT_HOST = 'fonts.gstatic.com';
const SHEET_HOST = 'fonts.googleapis.com';

export const defaultCss = (family: string): string =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:400;src:url(https://${FONT_HOST}/s/wide.ttf) format('truetype');unicode-range:U+0030-0039,U+0041-004D,U+0061-006D;}\n` +
  `@font-face{font-family:'${family}';font-style:normal;font-weight:400;src:url(https://${FONT_HOST}/s/tall.ttf) format('truetype');unicode-range:U+004E-005A,U+006E-007A;}\n`;

export async function startServers(pageDir: string): Promise<Servers> {
  const wire: Wire[] = [];
  const state = { css: defaultCss };
  const pems = await generate([{ name: 'commonName', value: SHEET_HOST }], { days: 2, keySize: 2048, algorithm: 'sha256', extensions: [{ name: 'subjectAltName', altNames: [{ type: 2, value: SHEET_HOST }, { type: 2, value: FONT_HOST }] }] });
  const secure = https.createServer({ key: pems.private, cert: pems.cert }, (req, res) => {
    const host = String(req.headers.host ?? '').split(':')[0];
    wire.push({ host, method: req.method ?? '', url: req.url ?? '', origin: req.headers.origin, headers: { ...req.headers } });
    const cors = { 'access-control-allow-origin': '*', 'cache-control': 'no-store' };
    const url = new URL(req.url ?? '/', 'https://x');
    if (host === SHEET_HOST && url.pathname === '/css2') {
      res.writeHead(200, { ...cors, 'content-type': 'text/css; charset=utf-8' });
      res.end(state.css(url.searchParams.get('family')?.split(':')[0] ?? 'Unknown'));
    } else if (host === FONT_HOST && url.pathname === '/s/wide.ttf') {
      res.writeHead(200, { ...cors, 'content-type': 'font/ttf' });
      res.end(buildFont(WIDE));
    } else if (host === FONT_HOST && url.pathname === '/s/tall.ttf') {
      res.writeHead(200, { ...cors, 'content-type': 'font/ttf' });
      res.end(buildFont(TALL));
    } else {
      res.writeHead(404, cors);
      res.end('no');
    }
  });
  const plain = http.createServer((req, res) => {
    const file = path.join(pageDir, (req.url ?? '/').split('?')[0].replace(/^\//, ''));
    if (!file.startsWith(pageDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'content-type': file.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8' });
    res.end(fs.readFileSync(file));
  });
  await Promise.all([new Promise<void>((r) => secure.listen(0, '127.0.0.1', r)), new Promise<void>((r) => plain.listen(0, '127.0.0.1', r))]);
  const httpsPort = (secure.address() as AddressInfo).port;
  const plainPort = (plain.address() as AddressInfo).port;
  return {
    pageUrl: `http://127.0.0.1:${plainPort}/page.html?secret=1`,
    pageOrigin: `http://127.0.0.1:${plainPort}`,
    wire,
    get css() {
      return state.css;
    },
    setCss(fn) {
      state.css = fn;
    },
    httpsPort,
    close: () => new Promise<void>((r) => secure.close(() => plain.close(() => r()))),
  } as Servers;
}

// ------------------------------------------------------------ the bundle
const ENTRY = `
import '${src('card/magic-card')}';
import '${src('modules')}';
import '${src('forum-shot/index')}';
import { renderSheet } from '${src('forum-shot/sheet')}';
import { prepareFonts, defaultSeams } from '${src('forum-shot/font-fetch')}';
import { settleCard } from '${src('forum-shot/settle')}';
import { scrubHass } from '${src('forum-shot/remote')}';
window.F = { renderSheet, prepareFonts, defaultSeams, settleCard, scrubHass };
window.__ready = true;
`;

let bundled: Promise<string> | undefined;
/** Builds the card, the forum shot element and the sheet once for Chromium 85; returns the directory holding page.html. */
export function bundlePage(): Promise<string> {
  bundled ??= (async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-forum-shot-'));
    const entry = path.join(dir, 'entry.ts');
    fs.writeFileSync(entry, ENTRY);
    await build({
      root: ROOT,
      configFile: false,
      logLevel: 'silent',
      plugins: [i18nKeys()],
      oxc: { decorator: { legacy: true }, assumptions: { setPublicClassFields: true }, typescript: { removeClassFieldsWithoutInitializer: true } },
      define: { __webpack_public_path__: 'globalThis.__mcPublicPath', 'import.meta.url': 'globalThis.__mcUrl' },
      build: { target: 'chrome85', minify: false, outDir: path.join(dir, 'out'), emptyOutDir: true, lib: { entry, formats: ['iife'], name: 'MCForumShot', fileName: () => 'h.js' } },
    } as never);
    fs.writeFileSync(path.join(dir, 'out', 'page.html'), '<!doctype html><meta charset="utf-8"><body style="margin:0"><script>globalThis.__mcUrl=location.origin+"/h.js"</script><script src="h.js"></script></body>');
    return path.join(dir, 'out');
  })();
  return bundled;
}

// ------------------------------------------------------------- the browser
export interface Req {
  url: string;
  headers: Record<string, string>;
}
export interface Browser {
  eval<T = unknown>(expression: string): Promise<T>;
  /** Every request the page started, with the headers the renderer set (Referer shows here). */
  requests: Req[];
  /** Requests that failed (an unresolved name, a refused address). */
  failed: string[];
  /** Uncaught page errors. */
  errors: string[];
  /** Browser log lines (font parser messages show here). */
  logs: string[];
  send(method: string, params?: object): Promise<any>;
  /** PNG of the viewport. */
  shot(file: string): Promise<void>;
  viewport(width: number, height: number): Promise<void>;
  click(x: number, y: number): Promise<void>;
  key(key: string, code: string, vk: number, mods?: number): Promise<void>;
  tab(shift?: boolean): Promise<void>;
}
export interface Engine {
  name: string;
  version: string;
  run<T>(servers: Servers, fn: (b: Browser) => Promise<T>): Promise<T>;
}

const chromeExe = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function drive(exe: string, servers: Servers, fn: (b: Browser) => Promise<unknown>, onVersion: (v: string) => void): Promise<unknown> {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-forum-shot-profile-'));
  const port = 19800 + Math.floor(Math.random() * 900);
  const rules = `MAP ${SHEET_HOST} 127.0.0.1:${servers.httpsPort},MAP ${FONT_HOST} 127.0.0.1:${servers.httpsPort},MAP * ~NOTFOUND,EXCLUDE 127.0.0.1`;
  const child: ChildProcess = spawn(exe, ['--headless', '--disable-gpu', '--no-sandbox', '--no-first-run', '--ignore-certificate-errors', `--host-resolver-rules=${rules}`, `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  try {
    let version: { Browser: string } | undefined;
    for (let i = 0; i < 80 && !version; i++) {
      await sleep(250);
      try {
        version = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()) as { Browser: string };
      } catch {
        // not up yet
      }
    }
    if (!version) throw new Error('the browser did not open its debugging port');
    onVersion(version.Browser);
    const target = (await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()) as { webSocketDebuggerUrl: string };
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res);
      ws.addEventListener('error', rej);
    });
    let id = 0;
    const pending = new Map<number, { res: (v: unknown) => void; rej: (e: Error) => void }>();
    const requests: Req[] = [];
    const failed: string[] = [];
    const errors: string[] = [];
    const logs: string[] = [];
    const byId = new Map<string, string>();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(String(e.data));
      if (m.id && pending.has(m.id)) {
        const p = pending.get(m.id)!;
        pending.delete(m.id);
        m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
      } else if (m.method === 'Network.requestWillBeSent' && !/^(data|blob|about):/.test(m.params.request.url)) {
        requests.push({ url: m.params.request.url, headers: m.params.request.headers });
        byId.set(m.params.requestId, `${m.params.request.url} [${m.params.type ?? '?'} from ${m.params.initiator?.type ?? '?'}]`);
      } else if (m.method === 'Runtime.exceptionThrown') errors.push(String(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).slice(0, 900));
      else if (m.method === 'Log.entryAdded') logs.push(String(m.params.entry.text).slice(0, 300));
      else if (m.method === 'Network.loadingFailed') failed.push(`${byId.get(m.params.requestId) ?? '?'} ${m.params.errorText}`);
    });
    const send = (method: string, params: object = {}): Promise<any> => {
      const n = ++id;
      ws.send(JSON.stringify({ id: n, method, params }));
      return new Promise((res, rej) => pending.set(n, { res, rej }));
    };
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Log.enable');
    // a cookie for each font host and one for the page, so a request that carried cookies would show them
    for (const domain of [SHEET_HOST, FONT_HOST]) await send('Network.setCookie', { name: 'sid', value: 'secret', domain, path: '/', secure: true, sameSite: 'None' });
    await send('Network.setCookie', { name: 'sid', value: 'secret', url: servers.pageUrl });
    const loaded = new Promise<void>((res) => {
      const l = (e: MessageEvent): void => {
        if (JSON.parse(String(e.data)).method === 'Page.loadEventFired') {
          ws.removeEventListener('message', l);
          res();
        }
      };
      ws.addEventListener('message', l);
    });
    await send('Page.navigate', { url: servers.pageUrl });
    await loaded;
    const b: Browser = {
      requests,
      failed,
      errors,
      logs,
      send,
      async eval<T>(expression: string) {
        const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
        return r.result.value as T;
      },
      async shot(file) {
        const r = await send('Page.captureScreenshot', { format: 'png' });
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
      },
      async viewport(width, height) {
        await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      },
      async click(x, y) {
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
      },
      async key(key, code, vk, mods = 0) {
        const text = key.length === 1 ? key : key === 'Enter' ? '\r' : '';
        await send('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers: mods, text });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers: mods });
      },
      async tab(shift = false) {
        await b.key('Tab', 'Tab', 9, shift ? 8 : 0);
      },
    };
    for (let i = 0; i < 100 && !(await b.eval<boolean>('window.__ready === true')); i++) await sleep(100);
    if (!(await b.eval<boolean>('window.__ready === true'))) throw new Error(`the page did not load: ${errors.join(' | ')}`);
    return await fn(b);
  } finally {
    child.kill();
    if (process.platform === 'win32' && child.pid) spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    await sleep(300);
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

const chrome: Engine = {
  name: 'chrome',
  version: '',
  async run(servers, fn) {
    return (await drive(chromeExe, servers, fn as never, (v) => (this.version = v))) as never;
  },
};
const chromium85: Engine & { available(): boolean } = {
  name: 'chromium85',
  version: '85',
  available() {
    try {
      return !!chromiumPath();
    } catch {
      return false;
    }
  },
  async run(servers, fn) {
    return (await drive(chromiumPath(), servers, fn as never, (v) => (this.version = v))) as never;
  },
};

/** The engines this machine can drive: current Chrome and, when its portable build is installed, the Chromium 85 floor. */
export const engines = (): Engine[] => [...(fs.existsSync(chromeExe) ? [chrome] : []), ...(chromium85.available() ? [chromium85] : [])];
export { pathToFileURL };
