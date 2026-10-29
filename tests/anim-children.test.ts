import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import '../src/index';
import { __setLazyImporterForTests, lazyChunks, onDemandChunks } from '../src/utils/lazy-chunks';
import { failedChunkNames, TIMING } from '../src/utils/lazy-chunk';
import { loadRuntime, __resetRuntimeLoaderForTests } from '../src/utils/anim-runtime-loader';
import { loadParticles, __resetParticlesLoaderForTests } from '../src/utils/particles-loader';
import { __setEditorImportForTests, loadEditor } from '../src/utils/editor-loader';
import { svgIconApi } from '../src/utils/svg-icon-loader';
import { MagicCard } from '../src/card/magic-card';
import { host } from '../src/editor/components/icon-animator/loader';
import type { MagicCardConfig } from '../src/types';

/*
 * anim-runtime, particles and the editor are children of `anim` (their import()s sit in src/anim-studio/anim-chunk.ts);
 * the icon source has one copy, read through svgIconApi(). Chunk graph facts (no module copies) are checked on the build by
 * tools/check-chunk-stats in the clean archive; these are the behaviours.
 */

const ROOT = path.resolve(__dirname, '..');
const src = (f: string) => readFileSync(path.join(ROOT, f), 'utf8');
const real = async () => ({ anim: await import('../src/anim-studio/anim-chunk'), icons: await import('../src/icons/chunk') });

// the webpack chunk URL function, as the production bundle has it; lazy-chunk.ts wraps it on the first retry
const g = globalThis as unknown as { __webpack_require__: { u: (id: unknown) => string } };
g.__webpack_require__ = { u: () => 'magic-card-x.js' };
const urlNow = () => g.__webpack_require__.u(1);

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(async () => {
  vi.restoreAllMocks();
  for (const n of ['anim', 'svg-icon', 'anim-runtime', 'particles'] as const) __setLazyImporterForTests(n, undefined);
  __resetRuntimeLoaderForTests();
  __resetParticlesLoaderForTests();
  __setEditorImportForTests(undefined);
  await lazyChunks.anim.load();
  await lazyChunks['svg-icon'].load();
});

describe('the children wait on anim', () => {
  it('load of the runtime and particles chunks loads anim first; a failing anim requests no child and shows no child notice', async () => {
    const r = await real();
    const importRuntime = vi.fn(r.anim.importRuntime);
    const importParticles = vi.fn(r.anim.importParticles);
    __setLazyImporterForTests('anim', (() => Promise.reject(new Error('404'))) as never);
    __resetRuntimeLoaderForTests();
    __resetParticlesLoaderForTests();
    expect(await loadRuntime()).toBeUndefined();
    expect(await loadParticles()).toBeUndefined();
    expect(importRuntime).not.toHaveBeenCalled();
    expect(importParticles).not.toHaveBeenCalled();
    expect(onDemandChunks['anim-runtime'].failed()).toBe(false);
    expect(onDemandChunks.particles.failed()).toBe(false);
    expect([...failedChunkNames()]).toContain('anim');
    expect([...failedChunkNames()]).not.toContain('anim-runtime');
    expect([...failedChunkNames()]).not.toContain('particles');
  });

  it('with anim installed the children load through its importRuntime and importParticles', async () => {
    const r = await real();
    const importRuntime = vi.fn(r.anim.importRuntime);
    const importParticles = vi.fn(r.anim.importParticles);
    __setLazyImporterForTests('anim', (async () => ({ ...r.anim, importRuntime, importParticles })) as never);
    __resetRuntimeLoaderForTests();
    __resetParticlesLoaderForTests();
    expect(await loadRuntime()).toBeDefined();
    expect(await loadParticles()).toBeDefined();
    expect(importRuntime).toHaveBeenCalledTimes(1);
    expect(importParticles).toHaveBeenCalledTimes(1);
  });

  it('the table importer calls importRuntime() synchronously and returns its promise, so a retry r= is the real request', async () => {
    const r = await real();
    const runtime = await import('../src/anim-runtime');
    const seen: string[] = [];
    // like webpack's import(): asks for the chunk URL in the same synchronous call
    const importRuntime = vi
      .fn(() => (seen.push(urlNow()), Promise.resolve(runtime)))
      .mockImplementationOnce(() => (seen.push(urlNow()), Promise.reject(new Error('404'))));
    __setLazyImporterForTests('anim', (async () => ({ ...r.anim, importRuntime })) as never);
    __resetRuntimeLoaderForTests();
    // a failed first attempt, then the silent retry (0 ms in tests): its URL carries r=
    expect(await loadRuntime()).toBeDefined();
    expect(seen).toHaveLength(2);
    expect(seen[0]).toBe('magic-card-x.js');
    expect(seen[1]).toMatch(/^magic-card-x\.js\?r=\d+$/);
    expect(TIMING.silent).toBe(0);
  });

  it('a plain card renders the same with both children installed', async () => {
    const cfg = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'hello' }] }] }] } as unknown as MagicCardConfig;
    const html = async () => {
      const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: unknown): void; updateComplete: Promise<boolean> };
      el.setConfig(cfg);
      document.body.appendChild(el);
      await el.updateComplete;
      const out = el.shadowRoot!.innerHTML;
      el.remove();
      return out;
    };
    const before = await html();
    expect(await loadRuntime()).toBeDefined();
    expect(await loadParticles()).toBeDefined();
    expect(await html()).toBe(before);
  });
});

describe('loadEditor loads its parents first', () => {
  it('loads anim and svg-icon, then calls the importEditor of anim', async () => {
    const r = await real();
    const importEditor = vi.fn(async () => ({ EDITOR_VERSION: (await import('../src/version')).VERSION, labelsReady: async () => true }));
    __setLazyImporterForTests('anim', (async () => ({ ...r.anim, importEditor })) as never);
    const svgImporter = vi.fn(async () => r.icons);
    __setLazyImporterForTests('svg-icon', svgImporter as never);
    expect(await loadEditor()).toBe(true);
    expect(importEditor).toHaveBeenCalledTimes(1);
    expect(svgImporter).toHaveBeenCalledTimes(1);
    expect(lazyChunks.anim.ready() && lazyChunks['svg-icon'].ready()).toBe(true);
  });

  for (const parent of ['anim', 'svg-icon'] as const) {
    it(`a failing ${parent} is an editor load failure (false, getConfigElement rejects) and the next call tries again`, async () => {
      const r = await real();
      const importEditor = vi.fn(async () => ({ EDITOR_VERSION: (await import('../src/version')).VERSION, labelsReady: async () => true }));
      let fail = true;
      const good = parent === 'anim' ? { ...r.anim, importEditor } : r.icons;
      const failing = () => (fail ? Promise.reject(new Error('404')) : Promise.resolve(good));
      if (parent === 'anim') {
        __setLazyImporterForTests('anim', failing as never);
      } else {
        __setLazyImporterForTests('anim', (async () => ({ ...r.anim, importEditor })) as never);
        __setLazyImporterForTests('svg-icon', failing as never);
      }
      expect(await loadEditor()).toBe(false);
      await expect(MagicCard.getConfigElement()).rejects.toThrow();
      expect(importEditor).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      fail = false;
      expect(await loadEditor()).toBe(true);
      expect(importEditor).toHaveBeenCalledTimes(1);
    });
  }
});

describe('one icon-source state', () => {
  it('the icon animator host goes through the svg-icon chunk api, the one the card preview reads', async () => {
    const r = await real();
    const api = { ...r.icons.api, setIconGeometry: vi.fn(), resolveIconGeometry: vi.fn(async () => undefined), onIconGeometry: vi.fn(() => () => {}) };
    __setLazyImporterForTests('svg-icon', (async () => ({ ...r.icons, api })) as never);
    await lazyChunks['svg-icon'].load();
    expect(svgIconApi()).toBe(api);
    host.setIcon('mdi:i1-test', { paths: ['M0 0'], viewBox: '0 0 24 24' });
    expect(api.setIconGeometry).toHaveBeenCalledWith('mdi:i1-test', { paths: ['M0 0'], viewBox: '0 0 24 24' });
    await host.resolveIcon('mdi:i1-test');
    expect(api.resolveIconGeometry).toHaveBeenCalledWith('mdi:i1-test');
  });

  it('geometry set through the icon animator is seen by an <mc-svg-icon> in the card preview', async () => {
    host.setIcon('mdi:i1-seen', { paths: ['M2 2h4v4z'], viewBox: '0 0 24 24' });
    const el = document.createElement('mc-svg-icon') as HTMLElement & { icon?: string; updateComplete: Promise<unknown> };
    el.icon = 'mdi:i1-seen';
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    expect(el.shadowRoot!.innerHTML).toContain('M2 2h4v4z');
    el.remove();
  });

  it('no module of the card editor or the SVG editor takes a value from icons/icon-source', () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(path.join(ROOT, dir))) {
        const rel = `${dir}/${f}`;
        if (statSync(path.join(ROOT, rel)).isDirectory()) walk(rel);
        else if (rel.endsWith('.ts') && /^\s*import\s+(?!type\b)[^;]*icons\/icon-source'/m.test(src(rel))) hits.push(rel);
      }
    };
    walk('src/editor');
    walk('src/svg-editor');
    expect(hits).toEqual([]);
  });
});

describe('sources', () => {
  it('the three import()s of the children sit in anim-chunk.ts; the chunk table and editor-loader hold none of them', () => {
    const chunk = src('src/anim-studio/anim-chunk.ts');
    for (const n of ['anim-runtime', 'particles', 'editor']) expect(chunk).toContain(`webpackChunkName: "${n}"`);
    for (const f of ['src/utils/lazy-chunks.ts', 'src/utils/editor-loader.ts']) {
      expect(src(f)).not.toMatch(/webpackChunkName: "(anim-runtime|particles|editor)"/);
    }
  });

  it('the chunk entry exports api, and metChunk is typed to the chunk names', () => {
    expect(src('src/icons/chunk.ts')).toContain('export const api = { resolveIconGeometry, onIconGeometry, setIconGeometry, peekIconGeometry, registerSvgGeometry }');
    expect(src('src/services/render-context.ts')).toContain('metChunk?(name: LazyChunkName | OnDemandChunkName): void;');
  });

  it('the card forgets the chunks it met when the config changes', async () => {
    const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: unknown): void; _met: Set<string> };
    const cfg = { type: 'custom:magic-card', rows: [] };
    el.setConfig(cfg);
    el._met.add('svg-icon');
    el.setConfig(cfg);
    expect(el._met.size).toBe(0);
  });

  it('the contract numbers', async () => {
    expect((await import('../src/contracts/lazy-module')).LAZY_MODULE_CONTRACT_REVISION).toBe(24);
    expect((await import('../src/contracts/module-editor')).MODULE_EDITOR_CONTRACT_REVISION).toBe(3);
  });
});
