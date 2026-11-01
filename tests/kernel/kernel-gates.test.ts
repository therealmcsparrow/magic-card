// Gates the kernel levers must keep while the main file shrinks. Everything here runs without a browser and without
// a rebuilt dist (the committed dist is rebuilt only at release, so no test here reads it):
//  - the entry caps only go down, never through an approved_raises entry of their own
//  - the plain-key allowlist, the classification of the 140 gallery fixtures and the needs table agree
//  - an allowlist-only card renders without asking for a chunk and without a notice, placeholder or status container
//  - the retry timing and the manifest URL stay as the loader documents them
//  - the DOM-diff and size tooling the levers are measured with still pass their own checks
// The browser side (empty cache, layout shift, version skew, retry, Chromium 85) is driven from Node by the local
// scripts in tests/kernel/browser/ and is not part of this file.
import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import * as jsYaml from 'js-yaml';
import '../../src/index';
import { __setLazyImporterForTests, lazyChunks, onDemandChunks } from '../../src/utils/lazy-chunks';
import { LAZY_FEATURES } from '../../src/utils/lazy-features';
import { manifestUrl } from '../../src/utils/lazy-chunk';
import { LAZY_CHUNK_FILES, LAZY_SHARED_CHUNK_FILES } from '../../src/contracts/lazy-module';
import { BACKGROUND_RETRY_MS, CHUNK_TIMEOUT_MS, SILENT_RETRY_MS } from '../../src/contracts/lazy-module.needs';
import type { HomeAssistant, MagicCardConfig } from '../../src/types';

const root = resolve(__dirname, '../..');
const fixtureDir = join(root, 'tools/fixtures/gallery');
const read = (rel: string) => readFileSync(join(root, rel), 'utf8');
// the commit the kernel run started from: its caps are the ceiling for every cap in the run
const BASE = '01540cd2';

interface Card {
  id: string;
  class: 'plain' | 'feature';
  chunks: string[];
}
const classification = JSON.parse(read('tools/fixtures/gallery/classification.json')) as { plain_keys_sha256: string; count: number; plain: number; cards: Card[] };
const fixture = (id: string): MagicCardConfig => jsYaml.load(read(`tools/fixtures/gallery/${id}.yaml`), { schema: jsYaml.JSON_SCHEMA }) as MagicCardConfig;
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

describe('entry caps', () => {
  interface Caps {
    entry: { current_stage: string; stages: Array<{ id: string; cap: number }>; br: { cap: number } };
    approved_raises: Array<{ id: string; field: string; from: number; to: number }>;
  }
  const now = JSON.parse(read('tools/size-caps.json')) as Caps;
  const base = JSON.parse(execFileSync('git', ['show', `${BASE}:tools/size-caps.json`], { cwd: root, encoding: 'utf8' })) as Caps;
  const stage = (c: Caps) => c.entry.stages.find((s) => s.id === c.entry.current_stage)!;

  it('the gzip and brotli caps of magic-card.js are not above the ones the run started with', () => {
    expect(stage(now).cap).toBeLessThanOrEqual(stage(base).cap);
    expect(now.entry.br.cap).toBeLessThanOrEqual(base.entry.br.cap);
  });

  it('the run adds no stage: the entry stays on the stage it started on', () => {
    expect(now.entry.current_stage).toBe(base.entry.current_stage);
    expect(now.entry.stages.map((s) => s.id)).toEqual(base.entry.stages.map((s) => s.id));
  });

  it('no approved_raises entry added since the start names a cap of the entry file', () => {
    const known = new Set(base.approved_raises.map((r) => r.id));
    const added = now.approved_raises.filter((r) => !known.has(r.id));
    // the only raises of the entry caps allowed, each recorded as approved once in .company/archive/size-caps/approvals.md:
    // stage-4 gzip cap 72,979 -> 72,994 -> 72,996 -> 73,006 -> 73,016 -> 73,017 -> 73,082, and brotli cap 62,469 -> 62,528, then 62,417 -> 62,474 -> 62,535
    const approved = [
      { id: 'entry-stage4-72979-to-72994', field: '/entry/stages/3/cap', from: 72979, to: 72994 },
      { id: 'entry-stage4-72994-to-72996', field: '/entry/stages/3/cap', from: 72994, to: 72996 },
      { id: 'entry-stage4-72996-to-73006', field: '/entry/stages/3/cap', from: 72996, to: 73006 },
      { id: 'entry-br-62469-to-62528', field: '/entry/br/cap', from: 62469, to: 62528 },
      { id: 'entry-stage4-73006-to-73016', field: '/entry/stages/3/cap', from: 73006, to: 73016 },
      { id: 'entry-stage4-73016-to-73017', field: '/entry/stages/3/cap', from: 73016, to: 73017 },
      { id: 'entry-br-62417-to-62474', field: '/entry/br/cap', from: 62417, to: 62474 },
      { id: 'entry-stage4-73017-to-73082', field: '/entry/stages/3/cap', from: 73017, to: 73082 },
      { id: 'entry-br-62474-to-62535', field: '/entry/br/cap', from: 62474, to: 62535 },
      { id: 'entry-stage4-73082-to-74225', field: '/entry/stages/3/cap', from: 73082, to: 74225 },
      { id: 'entry-br-62535-to-63336', field: '/entry/br/cap', from: 62535, to: 63336 },
      { id: 'entry-br-63336-to-63396', field: '/entry/br/cap', from: 63336, to: 63396 },
    ];
    expect(added.filter((r) => r.field.startsWith('/entry/')), 'entry raises').toEqual(approved);
    expect(stage(now).cap, 'the raised cap is still below the cap the run started with').toBeLessThan(stage(base).cap);
  });

  it('the raise check of the size tool accepts the caps file against the starting commit', () => {
    const r = spawnSync(process.execPath, ['tools/check-dist-size.mjs', '--caps-only', '--base-ref', BASE, '--require-base'], { cwd: root, encoding: 'utf8' });
    expect(r.status, r.stdout + r.stderr).toBe(0);
  });
});

describe('plain cards and the needs table', () => {
  const keysText = read('tools/plain-keys.json');
  const feature = classification.cards.filter((c) => c.class === 'feature');
  const plain = classification.cards.filter((c) => c.class === 'plain');

  it('the gallery has 140 fixtures and the committed classification was made from the current allowlist', () => {
    expect(classification.cards).toHaveLength(140);
    expect(classification.count).toBe(140);
    expect(classification.plain_keys_sha256).toBe(sha256(keysText));
    expect(plain.length).toBe(classification.plain);
  });

  it('classifying every fixture again gives the committed class and chunk list', async () => {
    // @ts-expect-error plain JavaScript tool without declarations
    const { classifyConfig } = (await import('../../tools/classify-gallery.mjs')) as { classifyConfig: (c: unknown, keys: unknown) => { class: string; chunks: string[] } };
    const keys = JSON.parse(keysText);
    const odd = classification.cards.filter((c) => {
      const r = classifyConfig(fixture(c.id), keys);
      return r.class !== c.class || JSON.stringify(r.chunks) !== JSON.stringify(c.chunks);
    });
    expect(odd.map((c) => c.id)).toEqual([]);
  });

  it('no allowlist-only card has a chunk whose needs() says yes', () => {
    const asked = plain.map((c) => [c.id, Object.values(LAZY_FEATURES).filter((f) => f.needs(fixture(c.id))).map((f) => f.chunk)] as const).filter(([, l]) => l.length);
    expect(asked).toEqual([]);
  });

  it('a chunk the needs table asks for is one the classification names, or a look and shape chunk that rides with one it names', () => {
    // the classification names the chunk of the feature; decor (flow shapes), flow-look and slider-look load inside flows, controls and slider
    const rides = new Set(['decor', 'flow-look', 'slider-look']);
    const outside = feature
      .map((c) => [c.id, Object.values(LAZY_FEATURES).filter((f) => f.needs(fixture(c.id)) && !c.chunks.includes(f.chunk) && !rides.has(f.chunk)).map((f) => f.chunk)] as const)
      .filter(([, l]) => l.length);
    expect(outside).toEqual([]);
  });

  it('every chunk file name in the contract belongs to a chunk the loader knows or to a shared chunk', () => {
    const known = new Set([...Object.keys(lazyChunks), ...Object.keys(onDemandChunks), ...Object.keys(LAZY_SHARED_CHUNK_FILES)]);
    const missing = Object.keys(LAZY_CHUNK_FILES).filter((n) => !known.has(n));
    expect(missing).toEqual([]);
  });
});

describe('an allowlist-only card in the DOM', () => {
  const names = [...Object.keys(lazyChunks), ...Object.keys(onDemandChunks)];
  afterEach(() => {
    document.body.innerHTML = '';
    for (const n of names) __setLazyImporterForTests(n as never, undefined);
  });
  const mk = (id: string) => ({
    entity_id: id,
    state: id.startsWith('climate.') ? 'heat' : '21',
    last_changed: '2026-01-01T00:00:00Z',
    last_updated: '2026-01-01T00:00:00Z',
    context: {},
    attributes: { friendly_name: id, unit_of_measurement: '', current_temperature: 21, temperature: 21 },
  });
  const hass = (): HomeAssistant => {
    const states = new Proxy({} as Record<string, unknown>, { get: (t, k) => (typeof k === 'string' ? (t[k] ??= mk(k)) : undefined), has: () => true });
    return { states, language: 'en', locale: { language: 'en', number_format: 'language', time_format: '24' }, themes: { themes: {} }, config: { unit_system: { temperature: '°C' }, time_zone: 'UTC' }, callWS: () => Promise.resolve({}), callService: () => undefined, connection: { subscribeMessage: () => Promise.resolve(() => undefined), subscribeEvents: () => Promise.resolve(() => undefined) } } as unknown as HomeAssistant;
  };

  it('renders its text with no chunk requested, no script or link added and no status container, notice or busy marker', async () => {
    const plain = classification.cards.filter((c) => c.class === 'plain');
    expect(plain.length).toBe(13);
    for (const c of plain) {
      const asked: string[] = [];
      for (const n of names) __setLazyImporterForTests(n as never, (() => (asked.push(n), Promise.reject(new Error('a plain card must not load ' + n)))) as never);
      const scripts = document.querySelectorAll('script, link').length;
      const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: unknown): void; hass: unknown; updateComplete: Promise<unknown> };
      el.setConfig(fixture(c.id));
      el.hass = hass();
      document.body.appendChild(el);
      await el.updateComplete;
      for (let i = 0; i < 6; i++) await new Promise((r) => setTimeout(r, 0));
      const sr = el.shadowRoot!;
      expect(asked, `fixture ${c.id} chunks`).toEqual([]);
      expect(sr.querySelector('ha-card'), `fixture ${c.id} card`).not.toBeNull();
      expect((sr.querySelector('ha-card')!.textContent ?? '').trim().length, `fixture ${c.id} text`).toBeGreaterThan(0);
      expect(sr.querySelector('[role=status], [aria-busy], .mc-n, .mc-v'), `fixture ${c.id} status or notice`).toBeNull();
      expect(document.querySelectorAll('script, link').length, `fixture ${c.id} script or link`).toBe(scripts);
      el.remove();
    }
  });

  it('the same check fails for a card that does need a chunk (the gate can fail)', async () => {
    const asked: string[] = [];
    for (const n of names) __setLazyImporterForTests(n as never, (() => (asked.push(n), new Promise(() => undefined))) as never);
    const feature = classification.cards.find((c) => c.class === 'feature' && c.chunks.includes('controls'))!;
    const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: unknown): void; hass: unknown; updateComplete: Promise<unknown> };
    el.setConfig(fixture(feature.id));
    el.hass = hass();
    document.body.appendChild(el);
    await el.updateComplete;
    expect(asked).toContain('controls');
  });
});

describe('failure and retry timing the loader documents', () => {
  it('an attempt waits 10 s, the silent retry follows at 2 s, then 30 s, 90 s and 5 min', () => {
    // the loader's TIMING object is shortened by the test setup, so the contract constants are read
    expect(CHUNK_TIMEOUT_MS).toBe(10_000);
    expect(SILENT_RETRY_MS).toBe(2_000);
    expect([...BACKGROUND_RETRY_MS]).toEqual([30_000, 90_000, 300_000]);
  });

  it('the manifest is asked for under its fixed name next to the entry with a query unique to the page load', () => {
    const a = new URL(manifestUrl('one'));
    const b = new URL(manifestUrl('two'));
    expect(a.pathname.split('/').pop()).toBe('magic-card-manifest.js');
    expect(a.search).toBe('?r=one');
    expect(b.search).toBe('?r=two');
    expect(manifestUrl()).toMatch(/magic-card-manifest\.js\?r=[a-z0-9]+$/);
    expect(manifestUrl()).not.toMatch(/\?v=/);
  });
});

describe('measuring tools', () => {
  it('the DOM-diff comparison keeps its own normalisation rules', () => {
    const r = spawnSync(process.execPath, ['tools/dom-diff.mjs', '--selftest'], { cwd: root, encoding: 'utf8' });
    expect(r.status, r.stdout + r.stderr).toBe(0);
  });

  it('the size tool still rejects a raise it should reject', () => {
    const r = spawnSync(process.execPath, ['tools/size-caps-selftest.mjs'], { cwd: root, encoding: 'utf8' });
    expect(r.status, r.stdout + r.stderr).toBe(0);
  }, 180_000);
});
