import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  BACKGROUND_RETRY_MS,
  CHUNK_TIMEOUT_MS,
  LAZY_CHUNK_FILES,
  LAZY_MODULE_CONTRACT,
  LAZY_MODULE_TYPES,
  SILENT_RETRY_MS,
  type LazyChunkModule,
} from '../src/contracts/lazy-module';
import {
  BUILD_VERSION,
  TIMING,
  __manifestForTests,
  failedChunkNames,
  lazyChunk,
  manifestUrl,
  onChunkChange,
  trackHost,
  untrackHost,
} from '../src/utils/lazy-chunk';
import { LAZY_FEATURES, prefetchLazy } from '../src/utils/lazy-features';
import { configHas } from '../src/utils/config-walk';
import { __setLazyImporterForTests, lazyChunks } from '../src/utils/lazy-chunks';
import { ANIMATION_PRESETS } from '../src/utils/animation-presets';
import '../src/index';

const mod = (over: Partial<LazyChunkModule> = {}): LazyChunkModule => ({ BUILD: BUILD_VERSION, install: vi.fn(), ...over });
const root = resolve(__dirname, '..');
const source = (f: string) => readFileSync(resolve(root, f), 'utf8');

// the webpack chunk URL function, as the production bundle has it: lazy-chunk.ts wraps it on the first retry
const webpack = { base: 'magic-card-x.abc12345.js' };
(globalThis as unknown as { __webpack_require__: { u: (id: unknown) => string } }).__webpack_require__ = { u: () => webpack.base };
const urlNow = () => (globalThis as unknown as { __webpack_require__: { u: (id: unknown) => string } }).__webpack_require__.u(7);

beforeEach(() => {
  // the contract numbers (tests/setup-lazy-chunks.ts shortens them for every other file)
  Object.assign(TIMING, { timeout: CHUNK_TIMEOUT_MS, silent: SILENT_RETRY_MS, background: BACKGROUND_RETRY_MS });
  webpack.base = 'magic-card-x.abc12345.js';
  vi.useFakeTimers();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  Object.assign(TIMING, { silent: 0, background: [] });
  __manifestForTests();
});

/** An importer that asks webpack for the URL like import() does, and records it. */
function recording(outcomes: Array<'fail' | 'ok' | 'stall'>) {
  const urls: string[] = [];
  let i = 0;
  const stalled = new Promise<LazyChunkModule>(() => {});
  const importer = vi.fn(() => {
    const how = outcomes[Math.min(i++, outcomes.length - 1)];
    if (how === 'stall') return stalled; // webpack hands the in-flight promise back: it never calls u()
    urls.push(urlNow());
    return how === 'ok' ? Promise.resolve(mod()) : Promise.reject(new Error('404'));
  });
  return { importer, urls };
}
const rNumber = (u: string) => Number(/[?&]r=(\d+)/.exec(u)?.[1]);

describe('contract: version, numbers and wording (lazy-module 1.6.0)', () => {
  it('LAZY_MODULE_CONTRACT is 1.10.0', () => expect(LAZY_MODULE_CONTRACT).toBe('1.10.0'));

  it('the entry gets its numbers from lazy-module.needs.ts and the contract re-exports them', () => {
    expect([CHUNK_TIMEOUT_MS, SILENT_RETRY_MS, BACKGROUND_RETRY_MS]).toEqual([10_000, 2_000, [30_000, 90_000, 300_000]]);
    expect(source('src/utils/lazy-chunk.ts')).toContain("from '../contracts/lazy-module.needs'");
    // magic-card.js may import only types from the contract itself
    expect(source('src/utils/lazy-chunk.ts')).not.toMatch(/^import (?!type).*contracts\/lazy-module'/m);
    expect(source('src/contracts/lazy-module.ts')).toContain("from './lazy-module.needs'");
  });

  it('states the adoption and failure wording in "Styles in the same frame" and "Failure"', () => {
    const text = source('src/contracts/lazy-module.ts').replace(/\n \*\s+/g, ' ');
    expect(text).toContain(
      'Adoption assigns a new array (`root.adoptedStyleSheets = [...root.adoptedStyleSheets, ...sheets]`), never push (frozen on Chromium 85); connectedCallback adds sheets a card missed while disconnected. Same-frame adoption is verified on Chromium 85, Chrome and Firefox ESR; Safari 16.4 must be confirmed on a device, otherwise Core inserts a `<style>` element in the same task.',
    );
    expect(text).toContain(
      'While a slot of the card shows a notice, the host carries the `mc-fail` attribute; in that state ha-card is the scroll box and the layout-shift rule does not apply.',
    );
  });

  it('a request that joins an in-flight one is waiting, not a retry', () => {
    expect(source('src/contracts/lazy-module.ts').replace(/\n \*\s+/g, ' ')).toContain('that is waiting, not a retry');
  });

  it('the three moved loaders are no longer registered import() sites', () => {
    const lint = source('eslint.config.mjs');
    for (const f of ['anim-runtime-loader', 'particles-loader', 'shape-custom-loader']) {
      expect(lint).not.toContain(`src/utils/${f}.ts`);
      const code = source(`src/utils/${f}.ts`)
        .split('\n')
        .filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l));
      expect(code.join('\n')).not.toMatch(/(?<!typeof\s)import\(/);
    }
    expect(source('src/utils/lazy-chunks.ts')).toContain('webpackChunkName: "shape-custom"');
    // the card table is not imported by the loaders (the studio bundle would pull every card chunk entry in)
    for (const f of ['anim-runtime-loader', 'particles-loader', 'shape-custom-loader']) expect(source(`src/utils/${f}.ts`)).not.toContain("from './lazy-chunks'");
  });
});

describe('failure, retry and timeout', () => {
  it('a load error is retried once, silently, after 2 s; no failed state before that', async () => {
    const { importer } = recording(['fail', 'ok']);
    const chunk = lazyChunk('markdown', importer);
    const p = chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS - 1);
    expect(importer).toHaveBeenCalledTimes(1);
    expect(chunk.failed()).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await p).toBe(true);
    expect(importer).toHaveBeenCalledTimes(2);
    expect(chunk.failure()).toBeUndefined();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('the silent retry and every later retry ask for a URL not requested before (?r=<n>)', async () => {
    const { importer, urls } = recording(['fail']);
    const chunk = lazyChunk('markdown', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(chunk.failed()).toBe(true);
    expect(chunk.failure()).toBe('load');
    for (const ms of BACKGROUND_RETRY_MS) await vi.advanceTimersByTimeAsync(ms);
    expect(importer).toHaveBeenCalledTimes(1 + 1 + 3);
    expect(urls[0]).toBe('magic-card-x.abc12345.js');
    expect(urls.slice(1).every((u) => /^magic-card-x\.abc12345\.js\?r=\d+$/.test(u))).toBe(true);
    const numbers = urls.slice(1).map(rNumber);
    expect(new Set(numbers).size).toBe(4);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(new Set(urls).size).toBe(urls.length);
    // nothing more after the third background attempt
    await vi.advanceTimersByTimeAsync(3_600_000);
    expect(importer).toHaveBeenCalledTimes(5);
  });

  it('background retries come 30 s, 90 s and 5 min after the failure before them, per chunk', async () => {
    const { importer } = recording(['fail']);
    const chunk = lazyChunk('layers', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(importer).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(29_999);
    expect(importer).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(importer).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(89_999);
    expect(importer).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(1);
    expect(importer).toHaveBeenCalledTimes(4);
    await vi.advanceTimersByTimeAsync(299_999);
    expect(importer).toHaveBeenCalledTimes(4);
    await vi.advanceTimersByTimeAsync(1);
    expect(importer).toHaveBeenCalledTimes(5);
  });

  it('a background success clears the failure, runs the callbacks kept through it and tells the listeners', async () => {
    const { importer } = recording(['fail', 'fail', 'ok']);
    const chunk = lazyChunk('markdown', importer);
    const cb = vi.fn();
    const seen = vi.fn(() => `${chunk.failed()}/${chunk.ready()}`);
    const off = onChunkChange(seen);
    chunk.whenReady(cb);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(chunk.failed()).toBe(true);
    expect(failedChunkNames().has('markdown')).toBe(true);
    expect(cb).not.toHaveBeenCalled();
    expect(seen).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(chunk.ready()).toBe(true);
    expect(chunk.failure()).toBeUndefined();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(seen).toHaveBeenCalledTimes(2);
    expect(await chunk.load()).toBe(true);
    // no timer is left: nothing more is requested
    await vi.advanceTimersByTimeAsync(3_600_000);
    expect(importer).toHaveBeenCalledTimes(3);
    off();
  });

  it('a first-time success tells no listener (nothing to clear)', async () => {
    const seen = vi.fn();
    const off = onChunkChange(seen);
    await lazyChunk('slider', async () => mod()).load();
    expect(seen).not.toHaveBeenCalled();
    off();
  });

  it('an attempt that does not finish in 10 s fails; the silent retry joins the stalled request and sends no new URL', async () => {
    const { importer, urls } = recording(['stall']);
    const chunk = lazyChunk('seasonal', importer);
    const p = chunk.load();
    await vi.advanceTimersByTimeAsync(CHUNK_TIMEOUT_MS + SILENT_RETRY_MS);
    expect(importer).toHaveBeenCalledTimes(2); // the second attempt got webpack's in-flight promise
    expect(urls).toEqual([]); // no request left, so no r= number was taken
    expect(chunk.failed()).toBe(false);
    // the notice about 22 s after load (two stalls)
    await vi.advanceTimersByTimeAsync(CHUNK_TIMEOUT_MS);
    expect(chunk.failed()).toBe(true);
    expect(chunk.failure()).toBe('load');
    expect(await p).toBe(false);
  });

  it('a late success after a timeout installs and clears the notice', async () => {
    let finish!: (m: LazyChunkModule) => void;
    const slow = new Promise<LazyChunkModule>((r) => (finish = r));
    const importer = vi.fn(() => slow);
    const chunk = lazyChunk('seasonal', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(CHUNK_TIMEOUT_MS + SILENT_RETRY_MS + CHUNK_TIMEOUT_MS);
    expect(chunk.failed()).toBe(true);
    const m = mod();
    finish(m);
    await vi.advanceTimersByTimeAsync(0);
    expect(chunk.ready()).toBe(true);
    expect(m.install).toHaveBeenCalledTimes(1);
    expect(chunk.failure()).toBeUndefined();
  });

  it('after a stalled request has failed, the next attempt sends a fresh URL', async () => {
    let fail!: () => void;
    const stalled = new Promise<LazyChunkModule>((_, no) => (fail = () => no(new Error('reset'))));
    const urls: string[] = [];
    let n = 0;
    const importer = vi.fn(() => {
      if (n++ < 2) return stalled; // attempt 1 started it, attempt 2 joined it
      urls.push(urlNow());
      return Promise.resolve(mod());
    });
    const chunk = lazyChunk('modules-extra', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(CHUNK_TIMEOUT_MS + SILENT_RETRY_MS + CHUNK_TIMEOUT_MS);
    expect(chunk.failed()).toBe(true);
    fail();
    await vi.advanceTimersByTimeAsync(BACKGROUND_RETRY_MS[0]);
    expect(chunk.ready()).toBe(true);
    expect(urls).toHaveLength(1);
    expect(urls[0]).toMatch(/^magic-card-x\.abc12345\.js\?r=\d+$/);
  });

  it('retry() is one extra attempt under a new URL; it does not use up or reset the background count', async () => {
    const { importer, urls } = recording(['fail']);
    const chunk = lazyChunk('layers', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(importer).toHaveBeenCalledTimes(2);
    const [a, b] = [chunk.retry(), chunk.retry()];
    expect(await a).toBe(false);
    expect(await b).toBe(false);
    expect(importer).toHaveBeenCalledTimes(3); // two presses at once make one attempt
    expect(rNumber(urls[2])).toBeGreaterThan(rNumber(urls[1]));
    // the three background attempts still come
    for (const ms of BACKGROUND_RETRY_MS) await vi.advanceTimersByTimeAsync(ms);
    expect(importer).toHaveBeenCalledTimes(6);
    await vi.advanceTimersByTimeAsync(3_600_000);
    expect(importer).toHaveBeenCalledTimes(6);
  });

  it('retry() that succeeds installs, resolves true and stops the background timer', async () => {
    const { importer } = recording(['fail', 'fail', 'ok']);
    const chunk = lazyChunk('layers', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(await chunk.retry()).toBe(true);
    expect(chunk.ready()).toBe(true);
    await vi.advanceTimersByTimeAsync(3_600_000);
    expect(importer).toHaveBeenCalledTimes(3);
  });

  it('a BUILD mismatch is never retried: failure "mismatch", one warning, retry() does nothing', async () => {
    const m = mod({ BUILD: 'other-release' });
    const importer = vi.fn(async () => m);
    const chunk = lazyChunk('seasonal', importer);
    expect(await chunk.load()).toBe(false);
    expect(chunk.failure()).toBe('mismatch');
    expect(m.install).not.toHaveBeenCalled();
    expect(await chunk.retry()).toBe(false);
    await vi.advanceTimersByTimeAsync(3_600_000);
    expect(importer).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(String(vi.mocked(console.warn).mock.calls[0][0])).toContain('Magic Card was updated, reload the page');
  });

  it('one warning with the chunk name when the notice comes, not one per attempt', async () => {
    const { importer } = recording(['fail']);
    const chunk = lazyChunk('slider-look', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    for (const ms of BACKGROUND_RETRY_MS) await vi.advanceTimersByTimeAsync(ms);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(String(vi.mocked(console.warn).mock.calls[0][0])).toContain('magic-card-slider-look.js did not load');
  });

  it('an install() that throws is a load failure and is retried', async () => {
    let calls = 0;
    const chunk = lazyChunk('markdown', async () =>
      mod({
        install: () => {
          if (calls++ === 0) throw new Error('boom');
        },
      }),
    );
    const p = chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(await p).toBe(true);
  });
});

describe('manifest check (off until a build writes the manifest)', () => {
  it('the URL is the fixed name next to this entry with ?r=<page id>: never ?v=, never hashed', () => {
    const u = new URL(manifestUrl());
    expect(u.pathname.endsWith('/magic-card-manifest.js')).toBe(true);
    expect(u.search).toMatch(/^\?r=[a-z0-9]+$/);
    expect(u.href).not.toContain('v=');
    expect(manifestUrl()).toBe(manifestUrl());
    expect(new URL(manifestUrl('xyz')).search).toBe('?r=xyz');
  });

  it('switched off, a failing chunk requests no manifest', async () => {
    const fn = vi.fn();
    __manifestForTests(false, fn);
    const { importer } = recording(['fail']);
    const chunk = lazyChunk('markdown', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(fn).not.toHaveBeenCalled();
    expect(chunk.failure()).toBe('load');
  });

  it('another build in the manifest: "mismatch" at once, no silent retry; one manifest import per page for all chunks', async () => {
    const fn = vi.fn(async () => ({ default: { build: 'some-other-release' } }));
    __manifestForTests(true, fn);
    const a = recording(['fail']);
    const b = recording(['fail']);
    const [ca, cb] = [lazyChunk('markdown', a.importer), lazyChunk('slider', b.importer)];
    const [pa, pb] = [ca.load(), cb.load()];
    expect(await pa).toBe(false);
    expect(await pb).toBe(false);
    expect(ca.failure()).toBe('mismatch');
    expect(cb.failure()).toBe('mismatch');
    expect(a.importer).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(3_600_000);
    expect(a.importer).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0]).toMatch(/magic-card-manifest\.js\?r=[a-z0-9]+$/);
  });

  it('the same build, or no manifest, stays a load failure with its retries', async () => {
    __manifestForTests(true, async () => ({ default: { build: BUILD_VERSION } }));
    const same = recording(['fail', 'ok']);
    const c1 = lazyChunk('markdown', same.importer);
    void c1.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(c1.ready()).toBe(true);
    __manifestForTests(true, () => Promise.reject(new Error('404')));
    const gone = recording(['fail']);
    const c2 = lazyChunk('slider', gone.importer);
    void c2.load();
    await vi.advanceTimersByTimeAsync(SILENT_RETRY_MS);
    expect(c2.failure()).toBe('load');
  });

  it('a manifest that never answers does not hold the retries for more than the timeout', async () => {
    __manifestForTests(true, () => new Promise(() => {}));
    const { importer } = recording(['fail', 'ok']);
    const chunk = lazyChunk('markdown', importer);
    void chunk.load();
    await vi.advanceTimersByTimeAsync(CHUNK_TIMEOUT_MS + SILENT_RETRY_MS);
    expect(chunk.ready()).toBe(true);
  });
});

describe('config-walk and the needs table', () => {
  it('walks rows, columns, modules and nested children, hover and every conditional[].design', () => {
    const hit = (n: Record<string, unknown>) => n.marker === 1;
    expect(configHas({ rows: [{ columns: [{ modules: [{ marker: 1 }] }] }] }, hit)).toBe(true);
    expect(configHas({ rows: [{ columns: [{ modules: [{ type: 'tabs', modules: [{ modules: [{ marker: 1 }] }] }] }] }] }, hit)).toBe(true);
    expect(configHas({ hover: { marker: 1 } }, hit)).toBe(true);
    expect(configHas({ conditional: [{ id: 'a', design: {} }, { id: 'b', design: { marker: 1 } }] }, hit)).toBe(true);
    expect(configHas({ rows: [{ design: { hover: { marker: 1 } } }] }, hit)).toBe(true);
    expect(configHas({ rows: [] }, hit)).toBe(false);
  });

  it('skips card_config, reads only the first 32 conditional_appearance rules, survives cycles and junk', () => {
    const hit = (n: Record<string, unknown>) => n.marker === 1;
    expect(configHas({ modules: [{ type: 'custom-card', card_config: { marker: 1 } }] }, hit)).toBe(false);
    const rules = Array.from({ length: 33 }, (_, i) => ({ overrides: i === 32 ? { marker: 1 } : {} }));
    expect(configHas({ conditional_appearance: rules }, hit)).toBe(false);
    expect(configHas({ conditional_appearance: rules.slice(0, 32).map((r, i) => (i === 31 ? { overrides: { marker: 1 } } : r)) }, hit)).toBe(true);
    const cyc: Record<string, unknown> = { rows: [] };
    (cyc.rows as unknown[]).push(cyc);
    expect(configHas(cyc, hit)).toBe(false);
    for (const junk of [undefined, null, 4, 'rows', () => 1]) expect(configHas(junk, hit)).toBe(false);
    expect(configHas({ a: 1 }, () => { throw new Error('x'); })).toBe(false);
    let deep: Record<string, unknown> = { marker: 1 };
    for (let i = 0; i < 20_000; i++) deep = { child: deep };
    expect(() => configHas(deep, hit)).not.toThrow();
  });

  it('LAZY_FEATURES has one total row per LazyChunkName', () => {
    expect(Object.keys(LAZY_FEATURES).sort()).toEqual(Object.keys(LAZY_CHUNK_FILES).sort());
    for (const [name, f] of Object.entries(LAZY_FEATURES)) {
      expect(f.chunk).toBe(name);
      for (const junk of [undefined, null, 0, 'x', [], {}, { rows: 5 }, { rows: [null, { columns: 3 }] }, new Proxy({}, { get: () => { throw new Error('hostile'); }, ownKeys: () => { throw new Error('hostile'); } })]) {
        expect(f.needs(junk), name).toBe(false);
      }
    }
  });

  it('the module rows list the module types of the contract (drift test)', () => {
    for (const [chunk, types] of Object.entries(LAZY_MODULE_TYPES)) {
      for (const type of types) {
        expect(LAZY_FEATURES[chunk as keyof typeof LAZY_FEATURES].needs({ rows: [{ columns: [{ modules: [{ type }] }] }] }), `${chunk}/${type}`).toBe(true);
      }
      expect(LAZY_FEATURES[chunk as keyof typeof LAZY_FEATURES].needs({ rows: [{ columns: [{ modules: [{ type: 'text' }] }] }] })).toBe(false);
    }
  });

  it('seasonal, look and layer rows read the config only, also from hover and conditional designs', () => {
    const seasonalId = ANIMATION_PRESETS.find((p) => p.seasonal)!.id;
    expect(seasonalId).toBeTruthy();
    const anim = { animations: [{ id: 'a', preset: seasonalId }] };
    expect(LAZY_FEATURES.seasonal.needs({ rows: [], seasonal: 'winter' })).toBe(true);
    expect(LAZY_FEATURES.seasonal.needs({ rows: [], design: anim })).toBe(true);
    expect(LAZY_FEATURES.seasonal.needs({ rows: [], hover: anim })).toBe(true);
    expect(LAZY_FEATURES.seasonal.needs({ rows: [], conditional: [{ id: 'c', design: anim }] })).toBe(true);
    expect(LAZY_FEATURES.seasonal.needs({ rows: [], design: { animations: [{ id: 'a', preset: 'pulse' }] } })).toBe(false);
    expect(LAZY_FEATURES['flow-look'].needs({ flows: [{ from: 'a', to: 'b', line_style: 'neon' }] })).toBe(true);
    expect(LAZY_FEATURES['flow-look'].needs({ flows: [{ from: 'a', to: 'b' }] })).toBe(false);
    expect(LAZY_FEATURES['slider-look'].needs({ rows: [{ columns: [{ modules: [{ type: 'slider', track_style: 'glass' }] }] }] })).toBe(true);
    expect(LAZY_FEATURES['slider-look'].needs({ rows: [{ columns: [{ modules: [{ type: 'slider' }] }] }] })).toBe(false);
    expect(LAZY_FEATURES.layers.needs({ background_layers: [{ type: 'image', image: '/a.jpg', pan_zoom: {} }] })).toBe(true);
    expect(LAZY_FEATURES.layers.needs({ background_layers: [{ type: 'color', color: 'red' }] })).toBe(false);
    expect(LAZY_FEATURES.layers.needs({ rows: [] })).toBe(false);
  });

  it('prefetchLazy loads every needed chunk in parallel and a plain config makes no request', () => {
    const importers = Object.fromEntries(Object.keys(LAZY_FEATURES).map((n) => [n, vi.fn(async () => mod())]));
    for (const [n, fn] of Object.entries(importers)) __setLazyImporterForTests(n as never, fn as never);
    try {
      prefetchLazy({ type: 'custom:magic-card', rows: [{ columns: [{ modules: [{ type: 'text', text: 'hi' }] }] }] });
      for (const fn of Object.values(importers)) expect(fn).not.toHaveBeenCalled();
      prefetchLazy({ rows: [{ columns: [{ modules: [{ type: 'markdown' }, { type: 'slider-layout' }] }] }], seasonal: 'winter', background_layers: [{ type: 'image', entity: 'camera.door' }] });
      expect(importers.markdown).toHaveBeenCalledTimes(1);
      expect(importers.slider).toHaveBeenCalledTimes(1);
      expect(importers.seasonal).toHaveBeenCalledTimes(1);
      expect(importers.layers).toHaveBeenCalledTimes(1);
      expect(importers['flow-look']).not.toHaveBeenCalled();
    } finally {
      for (const n of Object.keys(importers)) __setLazyImporterForTests(n as never, undefined);
      // the shared table is installed again for the files that follow in this worker
      for (const c of Object.values(lazyChunks)) void c.load();
    }
  });
});

describe('styles adoption: the same frame', () => {
  /** Chromium 85: adoptedStyleSheets is a frozen array and only assignment works. */
  function frozenRoots() {
    const proto = ShadowRoot.prototype as unknown as { adoptedStyleSheets?: CSSStyleSheet[] };
    const store = new WeakMap<object, CSSStyleSheet[]>();
    const writes: Array<{ root: object; array: CSSStyleSheet[] }> = [];
    Object.defineProperty(proto, 'adoptedStyleSheets', {
      configurable: true,
      get() {
        return store.get(this) ?? Object.freeze([]);
      },
      set(v: CSSStyleSheet[]) {
        writes.push({ root: this, array: v });
        store.set(this, Object.freeze([...v]) as CSSStyleSheet[]);
      },
    });
    return { writes, restore: () => void delete proto.adoptedStyleSheets };
  }

  @customElement('mc-test-host')
  class Host extends LitElement {
    static styles = css`:host{display:block}`;
    feature = false;
    render() {
      return html`<div class="base"></div>${this.feature ? html`<div class="feature"></div>` : ''}`;
    }
    connectedCallback() {
      super.connectedCallback();
      trackHost(this);
    }
    disconnectedCallback() {
      untrackHost(this);
      super.disconnectedCallback();
    }
  }

  const sheetsOf = (el: Host) => ((el.renderRoot as ShadowRoot).adoptedStyleSheets as CSSStyleSheet[]).length;
  let frozen: ReturnType<typeof frozenRoots>;
  beforeEach(() => {
    vi.useRealTimers();
    frozen = frozenRoots();
    Host.elementStyles = [...Host.elementStyles];
  });
  afterEach(() => frozen.restore());

  it('adopts into every live card before the whenReady callbacks run, with a new array (never push)', async () => {
    const a = document.body.appendChild(new Host());
    const b = document.body.appendChild(new Host());
    await a.updateComplete;
    await b.updateComplete;
    const before = sheetsOf(a);
    const order: string[] = [];
    const feature = css`.feature{color:red}`;
    const chunk = lazyChunk('markdown', async () => mod({ styles: feature }));
    chunk.whenReady(() => {
      order.push(`callback sees ${sheetsOf(a)}/${sheetsOf(b)}`);
      a.feature = b.feature = true; // the feature DOM, in the same task
      a.requestUpdate();
      b.requestUpdate();
    });
    await chunk.load();
    expect(order).toEqual([`callback sees ${before + 1}/${before + 1}`]);
    // assignments, each a different array than before (a push would have thrown on the frozen array)
    const mine = frozen.writes.filter((w) => w.root === a.renderRoot);
    expect(mine.length).toBeGreaterThan(0);
    expect(Object.isFrozen((a.renderRoot as ShadowRoot).adoptedStyleSheets)).toBe(true);
    await a.updateComplete;
    expect(a.renderRoot.querySelector('.feature')).not.toBeNull();
    a.remove();
    b.remove();
  });

  it('a card created after the adoption has the sheets in its first render', async () => {
    const feature = css`.feature{color:blue}`;
    await lazyChunk('markdown', async () => mod({ styles: feature })).load();
    const late = document.body.appendChild(new Host());
    // connectedCallback ran: the sheets are on the shadow root before its first update
    expect(late.hasUpdated).toBe(false);
    expect(Host.elementStyles).toContain(feature);
    const names = ((late.renderRoot as ShadowRoot).adoptedStyleSheets as CSSStyleSheet[]).length;
    expect(names).toBeGreaterThanOrEqual(2);
    await late.updateComplete;
    late.remove();
  });

  it('a card reconnected after the adoption catches up in connectedCallback, once', async () => {
    const card = document.body.appendChild(new Host());
    await card.updateComplete;
    card.remove(); // away while the chunk loads
    const feature = css`.feature{color:green}`;
    await lazyChunk('markdown', async () => mod({ styles: feature })).load();
    const rootBefore = card.renderRoot as ShadowRoot;
    const had = rootBefore.adoptedStyleSheets.length;
    document.body.appendChild(card);
    expect(rootBefore.adoptedStyleSheets.length).toBe(had + 1);
    card.remove();
    document.body.appendChild(card);
    expect(rootBefore.adoptedStyleSheets.length).toBe(had + 1); // not twice
    card.remove();
  });

  it('a chunk without styles changes nothing', async () => {
    const card = document.body.appendChild(new Host());
    await card.updateComplete;
    const had = sheetsOf(card);
    const writes = frozen.writes.length;
    await lazyChunk('markdown', async () => mod()).load();
    expect(sheetsOf(card)).toBe(had);
    expect(frozen.writes.length).toBe(writes);
    card.remove();
  });

  it('the real card is tracked: a chunk with styles lands on a connected magic-card', async () => {
    const card = document.createElement('magic-card') as HTMLElement & { setConfig(c: unknown): void; updateComplete: Promise<boolean>; renderRoot: ShadowRoot };
    card.setConfig({ type: 'custom:magic-card', rows: [] });
    document.body.appendChild(card);
    await card.updateComplete;
    const had = card.renderRoot.adoptedStyleSheets.length;
    await lazyChunk('markdown', async () => mod({ styles: css`.mc-x{color:red}` })).load();
    expect(card.renderRoot.adoptedStyleSheets.length).toBe(had + 1);
    card.remove();
  });
});
