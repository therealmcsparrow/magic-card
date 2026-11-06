import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as jsYaml from 'js-yaml';
import { describe, expect, it } from 'vitest';
import { cardKeyLists } from '../src/editor/transfer-loader';
import { createShareKit } from '../src/share-kit/chunk';
import { shareKitHelpers } from '../src/transfer/share-kit-loader';

// Every card of documentation/gallery goes through the real share-kit reader: a shared ordinary card must not be refused.
const kit = createShareKit(shareKitHelpers);
const lists = cardKeyLists();
const GALLERY = join(__dirname, '..', 'documentation', 'gallery');
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

type Sample = { file: string; name: string; data: unknown };
const samples: Sample[] = [];
for (const f of readdirSync(join(GALLERY, 'cards')).filter((n) => n.endsWith('.yaml')).sort()) {
  samples.push({ file: `cards/${f}`, name: f, data: jsYaml.load(readFileSync(join(GALLERY, 'cards', f), 'utf8')) });
}
const found: Sample[] = [];
const collect = (v: unknown, file: string): void => {
  if (Array.isArray(v)) v.forEach((e) => collect(e, file));
  else if (isObj(v)) {
    if (v.type === 'custom:magic-card') found.push({ file, name: `${file}#${found.length}`, data: v });
    else Object.values(v).forEach((e) => collect(e, file));
  }
};
for (const d of readdirSync(join(GALLERY, 'dashboards'), { withFileTypes: true }).filter((e) => e.isDirectory())) {
  collect(jsYaml.load(readFileSync(join(GALLERY, 'dashboards', d.name, 'dashboard.yaml'), 'utf8')), `dashboards/${d.name}/dashboard.yaml`);
}

const run = (list: Sample[]) => list.map((s) => ({ s, r: kit.readCard(0, s.data, lists) }));

describe('gallery cards through readCard', () => {
  it('finds the gallery files', () => {
    expect(samples.length).toBeGreaterThan(100);
  });
  const results = run(samples);
  it('refuses no card file', () => {
    const refused = results.filter((x) => !x.r.ok).map((x) => `${x.s.file}: ${JSON.stringify((x.r as { refusal?: unknown }).refusal)}`);
    expect(refused).toEqual([]);
  });
  const dash = run(found);
  it('refuses no card inside a gallery dashboard', () => {
    const refused = dash.filter((x) => !x.r.ok).map((x) => `${x.s.file}: ${JSON.stringify((x.r as { refusal?: unknown }).refusal)}`);
    expect(refused).toEqual([]);
  });
  if (process.env.GALLERY_STATS) {
    it('writes stats', () => {
      writeFileSync(process.env.GALLERY_STATS as string, JSON.stringify({ cards: results.map((x) => ({ file: x.s.file, ok: x.r.ok, refusal: (x.r as { refusal?: unknown }).refusal, notes: x.r.notes.map((n) => ({ code: n.code, path: n.path })), data: x.r.ok ? x.r.data : undefined, input: x.s.data })), dash: dash.map((x) => ({ file: x.s.file, ok: x.r.ok, refusal: (x.r as { refusal?: unknown }).refusal, notes: x.r.notes.map((n) => ({ code: n.code, path: n.path })), data: x.r.ok ? x.r.data : undefined, input: x.s.data })) }));
    });
  }
});
