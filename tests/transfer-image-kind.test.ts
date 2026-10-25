import { describe, it, expect } from 'vitest';
import { parseTransfer, serialiseTransfer } from '../src/transfer/envelope';
import { checkFileSize, safeParse } from '../src/transfer/safe-parse';
import { sanitizeImage } from '../src/svg-image/sanitize';
import { HOST_KINDS, TRANSFER_CHUNK_CEILING } from '../src/contracts/preset-transfer';
import { IMAGE_MAX_BYTES } from '../src/contracts/mcu-library-images';
import { MAX_IMAGE_IMPORT_BYTES } from '../src/contracts/image-editor';

const images = { sanitizeImage };
const SVG = '<svg viewBox="0 0 100 50"><path id="roof" data-name="Roof" d="M0 0H10V10Z" fill="var(--mc-image-main)"/><circle id="lamp" cx="5" cy="5" r="2" fill="#ff0"/></svg>';
const env = (items: unknown[], kind = 'image') => JSON.stringify({ magic_card_export: '1.0', kind, items });
const item = (data: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({ id: 'house', name: 'House', data: { svg: SVG, view_box: '0 0 100 50', ...data }, ...extra });
const read = (text: string, opts: Record<string, unknown> = {}) => parseTransfer(text, { accept: ['image'], images, ...opts } as never);
const ok = (r: ReturnType<typeof read>) => {
  if (!r.ok) throw new Error(r.message);
  return r;
};

describe('image kind: contract constants', () => {
  it('mcu-panel accepts images, other hosts do not', () => {
    expect(HOST_KINDS['mcu-panel']).toContain('image');
    expect(HOST_KINDS['svg-editor']).not.toContain('image');
    expect(TRANSFER_CHUNK_CEILING).toBe(66560);
  });
});

describe('image kind: reading', () => {
  it('round trips an image with keywords, author, description and bindings', () => {
    const bindings = [{ target: 'lamp', entity: 'light.kitchen', set: 'fill', rules: [{ state: 'on', value: 'accent' }, { above: 5, value: '#00ff00' }], default: '#888888' }];
    const items = [item({ bindings }, { author: 'Alex', description: 'A house', keywords: ['home', 'roof'] })];
    const out = ok(read(env(items)));
    expect(out.kind).toBe('image');
    expect(out.notes).toEqual([]);
    const again = ok(read(serialiseTransfer('image', out.items as never, 'json')));
    expect(again.items).toEqual(out.items);
    expect(out.items[0]).toMatchObject({ id: 'house', name: 'House', author: 'Alex', description: 'A house', keywords: ['home', 'roof'] });
    expect((out.items[0].data as { bindings: unknown[] }).bindings).toEqual(bindings);
  });

  it('takes the view box from the sanitised drawing, not from the file', () => {
    const out = ok(read(env([item({ view_box: '0 0 1 1' })])));
    expect((out.items[0].data as { view_box: string }).view_box).toBe('0 0 100 50');
  });

  it('strips hostile markup and lists what was removed', () => {
    const bad = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" onload="alert(1)"><script>alert(1)</script><path id="p" d="M0 0L5 5L5 0Z" onclick="x" fill="#f00" stroke="url(http://evil/x)"/><foreignObject/></svg>';
    const out = ok(read(env([item({ svg: bad })])));
    const svg = (out.items[0].data as { svg: string }).svg;
    for (const w of ['script', 'onload', 'onclick', 'http://evil', 'foreignobject']) expect(svg.toLowerCase()).not.toContain(w);
    const removed = out.notes.filter((n) => n.code === 'svg_removed');
    expect(removed.length).toBeGreaterThanOrEqual(3);
    expect(removed.every((n) => n.item === 0 && n.path === 'data.svg')).toBe(true);
    expect(removed.map((n) => n.message).join(' ')).toMatch(/script/);
    expect(removed.map((n) => n.message).join(' ')).toMatch(/onclick/);
  });

  it('refuses an item whose markup is unsafe to read at all, and lists it', () => {
    const doctype = '<!DOCTYPE svg [<!ENTITY a "b">]><svg viewBox="0 0 10 10"><path d="M0 0L5 5"/></svg>';
    const out = read(env([item({ svg: doctype }), { ...item({}), id: 'ok', name: 'Fine' }]));
    const r = ok(out);
    expect(r.items.map((i) => i.id)).toEqual(['ok']);
    expect(r.notes.some((n) => n.code === 'invalid_item' && n.item === 0)).toBe(true);
    expect(read(env([item({ svg: doctype })])).ok).toBe(false);
  });

  it('refuses an item over the image size limit', () => {
    const big = `<svg viewBox="0 0 10 10"><text>${'x'.repeat(IMAGE_MAX_BYTES)}</text></svg>`;
    const out = read(env([item({ svg: big })]));
    expect(out.ok).toBe(false);
  });

  it('keeps valid bindings and drops each bad one with a note', () => {
    const good = { target: 'lamp', entity: 'light.kitchen', set: 'fill', rules: [{ state: 'on', value: 'accent' }] };
    const bindings = [
      good,
      { ...good, rules: [{ state: 'off', value: '#000' }] },
      { ...good, target: 'nowhere' },
      { ...good, set: 'width' },
      { ...good, set: 'opacity', rules: [{ state: 'on', value: 150 }] },
      { ...good, set: 'visible', rules: [{ state: 'on', value: 'yes' }] },
      { ...good, set: 'stroke', entity: 'Light Kitchen' },
      { ...good, set: 'stroke', rules: [{ value: '#fff' }] },
      { ...good, set: 'stroke', rules: Array.from({ length: 17 }, () => ({ state: 'on', value: '#fff' })) },
      'nope',
      { ...good, set: 'opacity', rules: [{ above: 10, value: 50 }], default: 20 },
    ];
    const out = ok(read(env([item({ bindings })])));
    const kept = (out.items[0].data as { bindings: { set: string }[] }).bindings;
    expect(kept.map((b) => b.set)).toEqual(['fill', 'opacity']);
    expect(out.notes.filter((n) => n.code === 'dropped_value' && /^data\.bindings\[\d+\]/.test(n.path)).length).toBe(9);
  });

  it('keeps at most MAX_IMAGE_BINDINGS and says so', () => {
    const ids = Array.from({ length: 70 }, (_, i) => `p${i}`);
    const svg = `<svg viewBox="0 0 10 10">${ids.map((id) => `<path id="${id}" d="M0 0L5 5"/>`).join('')}</svg>`;
    const bindings = ids.map((target) => ({ target, entity: 'light.a', set: 'fill', rules: [{ state: 'on', value: 'main' }] }));
    const out = ok(read(env([item({ svg, bindings })])));
    expect((out.items[0].data as { bindings: unknown[] }).bindings).toHaveLength(64);
    expect(out.notes.some((n) => n.code === 'over_cap')).toBe(true);
  });

  it('counts bindings in the size limit', () => {
    const rules = Array.from({ length: 16 }, (_, i) => ({ state: `s${i}`, value: '#ffffff' }));
    const ids = Array.from({ length: 64 }, (_, i) => `p${i}`);
    const filler = '<path d="M0 0L5 5L6 6L7 7"/>'.repeat(8800);
    const svg = `<svg viewBox="0 0 10 10">${ids.map((id) => `<path id="${id}" d="M0 0L5 5"/>`).join('')}${filler}</svg>`;
    const bindings = ids.map((target) => ({ target, entity: 'light.a', set: 'fill', rules }));
    expect(new TextEncoder().encode(svg).length).toBeLessThan(IMAGE_MAX_BYTES);
    expect(read(env([item({ svg })])).ok).toBe(true);
    expect(read(env([item({ svg, bindings })])).ok).toBe(false);
  });

  it('drops a thumb and unknown data keys', () => {
    const out = ok(read(env([item({ thumb: 'data:image/png;base64,AAAA', extra: 1 })])));
    expect(Object.keys(out.items[0].data).sort()).toEqual(['svg', 'view_box']);
    expect(out.notes.filter((n) => n.code === 'dropped_key').map((n) => n.path).sort()).toEqual(['data.extra', 'data.thumb']);
  });

  it('refuses when the image checker is not available', () => {
    const out = parseTransfer(env([item({})]), { accept: ['image'] });
    expect(out.ok).toBe(false);
  });

  it('refuses an image file on a host that does not accept images, naming where to import it', () => {
    const out = parseTransfer(env([item({})]), { accept: ['icon'], images });
    expect(!out.ok && out.refusal).toBe('wrong_kind');
    expect(!out.ok && out.message).toMatch(/Images/);
  });

  it('does not read a plain .svg as an image', () => {
    const out = parseTransfer(SVG, { accept: ['image'], images, fileName: 'a.svg' });
    expect(out.ok).toBe(false);
  });
});

describe('image kind: JSON only, large files', () => {
  const bigSvg = (bytes: number) => `<svg viewBox="0 0 10 10"><path d="M0 0L5 5"/><text>${'z'.repeat(bytes)}</text></svg>`;
  const many = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `big-${i}`, name: `Big ${i}`, data: { svg: bigSvg(200_000) } }));

  it('reads a JSON image envelope over 1 MB', () => {
    const text = env(many(6));
    expect(text.length).toBeGreaterThan(1024 * 1024);
    expect(ok(read(text)).items).toHaveLength(6);
  });

  it('refuses text over 8 MiB', () => {
    const r = safeParse(' '.repeat(MAX_IMAGE_IMPORT_BYTES + 1) + '{}');
    expect(!r.ok && r.refusal).toBe('too_large');
  });

  it('refuses a large YAML text even when it holds an image envelope', () => {
    const lines = many(6).map((i) => `  - id: ${i.id}\n    name: ${i.name}\n    data:\n      svg: '${i.data.svg}'`).join('\n');
    const yaml = `magic_card_export: '1.0'\nkind: image\nitems:\n${lines}\n`;
    expect(yaml.length).toBeGreaterThan(1024 * 1024);
    const out = read(yaml);
    expect(!out.ok && out.refusal).toBe('too_large');
  });

  it('refuses a large JSON text of any other kind', () => {
    const items = Array.from({ length: 6 }, (_, i) => ({ id: `i${i}`, name: 'I', data: { svg: bigSvg(200_000), path: '' } }));
    const out = parseTransfer(env(items, 'icon'), { accept: ['icon', 'image'], images });
    expect(!out.ok && out.refusal).toBe('too_large');
  });

  it('does not take YAML for an image envelope under 1 MB either', () => {
    const yaml = `magic_card_export: '1.0'\nkind: image\nitems:\n  - id: house\n    name: House\n    data:\n      svg: '${SVG}'\n`;
    const out = read(yaml);
    expect(!out.ok && out.refusal).toBe('not_parseable');
    expect(!out.ok && out.message).toMatch(/JSON/);
  });

  it('lets a .json file through the size check up to 8 MiB and nothing else past 1 MB', () => {
    expect(checkFileSize({ size: 5e6, name: 'magic-card-images-9.json' })).toBeUndefined();
    expect(checkFileSize({ size: 5e6, name: 'x.yaml' })).toMatchObject({ ok: false, refusal: 'too_large' });
    expect(checkFileSize({ size: 5e6 })).toMatchObject({ ok: false });
    expect(checkFileSize({ size: MAX_IMAGE_IMPORT_BYTES + 1, name: 'a.json' })).toMatchObject({ ok: false, refusal: 'too_large' });
    expect(checkFileSize({ size: 1000, name: 'a.yaml' })).toBeUndefined();
  });

  it('still runs the node limit on a large JSON file', () => {
    const text = JSON.stringify({ magic_card_export: '1.0', kind: 'image', items: [{ id: 'a', name: 'A', data: { svg: bigSvg(1_100_000), bindings: Array.from({ length: 1_200_000 }, () => 0) } }] });
    const r = safeParse(text);
    expect(!r.ok && r.refusal).toBe('limits');
  });
});
