import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import { contactsOtherHost, decodeCssEscapes } from '../src/contracts/preset-transfer';
import { parseTransfer } from '../src/transfer/envelope';
import { renderPicker } from '../src/theme-editor/presets/picker';

const BAD = [
  'url(data:image/png;base64,AAAA)',
  String.raw`url(ht\74ps://evil.example/t.png)`,
  String.raw`url("\2f\2f evil.example/t.png")`,
  'url(http:evil.example/t.png)',
  'url(HTTPS:evil.example/t.png)',
  'center / cover url(https://x.example/a.png)',
  'image-set(url(//cdn.example/b.png) 1x)',
  'image-set("https://x.example/a.png" 1x)',
  'url(img.png)',
  'url(//evil.example/a.png)',
  String.raw`ur\6c(x)`,
  '@import "x.css"',
];
const GOOD = ['#fff', 'linear-gradient(135deg, #111, #222)', 'url(/local/bg.png)', 'url("/local/bg.png")', 'url(#grad)', 'rgb(1 2 3 / 40%)', 'var(--primary-color)'];

describe('external host detection', () => {
  it('decodes CSS escapes', () => {
    expect(decodeCssEscapes(String.raw`ht\74ps\3a //x`)).toBe('https://x');
    expect(decodeCssEscapes(String.raw`\2f\2f evil`)).toBe('//evil');
  });
  it.each(BAD)('flags %s', (v) => expect(contactsOtherHost(v)).toBe(true));
  it.each(GOOD)('does not flag %s', (v) => expect(contactsOtherHost(v)).toBe(false));
  it('flags any value holding a backslash', () => expect(contactsOtherHost(String.raw`#ff\00 0`)).toBe(true));

  const themeFile = (v: string): string => `magic_card_export: "1.0"\nkind: theme\nitems:\n  - id: t\n    name: T\n    data:\n      primary-color: "#fff"\n      lovelace-background: ${JSON.stringify(v)}\n`;
  it.each(BAD.filter((v) => !v.startsWith('@')))('the import lists %s as external_ref with a host', (v) => {
    const r = parseTransfer(themeFile(v), { accept: ['theme'] }) as { ok: boolean; notes: { code: string; hosts?: string[] }[] };
    const ext = r.notes.filter((n) => n.code === 'external_ref');
    expect(ext).toHaveLength(1);
  });
  it('names the host behind an escaped or slash-less scheme', () => {
    for (const v of [String.raw`url(ht\74ps://evil.example/t.png)`, String.raw`url("\2f\2f evil.example/t.png")`, 'url(http:evil.example/t.png)']) {
      const r = parseTransfer(themeFile(v), { accept: ['theme'] }) as { notes: { code: string; hosts?: string[] }[] };
      expect(r.notes.find((n) => n.code === 'external_ref')?.hosts).toEqual(['evil.example']);
    }
  });
});

describe('theme picker swatches', () => {
  const preset = (bg: string) => ({ id: 'x', group: 'mine', name: 'X', blurb: '', doc: { 'lovelace-background': bg, 'primary-background-color': bg, 'card-background-color': bg, 'primary-color': bg, 'accent-color': bg } });
  it.each([...BAD, 'url(/local/a.png)', 'image-set(url(/local/a.png) 1x)'])('puts %s into no style', (v) => {
    const el = document.createElement('div');
    render(renderPicker({ lib: { presets: [] } as never, selected: '', query: '', filter: 'all', mine: [preset(v)] as never }, { select() {}, query() {}, filter() {}, act() {} }), el);
    const styles = [...el.querySelectorAll('[style]')].map((n) => n.getAttribute('style') ?? '').join('|');
    expect(styles).not.toMatch(/url|image|\|evil|x\.example|cdn\.example/i);
  });
  it('still paints a colour', () => {
    const el = document.createElement('div');
    render(renderPicker({ lib: { presets: [] } as never, selected: '', query: '', filter: 'all', mine: [preset('#123456')] as never }, { select() {}, query() {}, filter() {}, act() {} }), el);
    expect(el.innerHTML).toContain('#123456');
  });
});

import { outsideOf } from '../src/theme-editor/outside';
describe('outsideOf (badge and editor note)', () => {
  it('names the host behind each bypass and ignores local values', () => {
    expect(outsideOf({ 'lovelace-background': String.raw`url(ht\74ps://evil.example/t.png)` } as never)).toEqual({ any: true, unknown: false, hosts: ['evil.example'] });
    expect(outsideOf({ modes: { dark: { a: 'url(http:evil.example/t.png)' } } } as never).hosts).toEqual(['evil.example']);
    expect(outsideOf({ a: 'url(/local/a.png)', b: '#fff' } as never)).toEqual({ any: false, unknown: false, hosts: [] });
  });
  it('badges the preset card in the picker', () => {
    const el = document.createElement('div');
    const p = { id: 'x', group: 'mine', name: 'X', blurb: '', doc: { 'lovelace-background': 'url(http:evil.example/t.png)', 'primary-color': '#fff' } };
    render(renderPicker({ lib: { presets: [] } as never, selected: '', query: '', filter: 'all', mine: [p] as never }, { select() {}, query() {}, filter() {}, act() {} }), el);
    expect(el.textContent).toContain('Contacts another website');
  });
});

describe('further vectors', () => {
  const R2 = [
    'url("/a/*"), url("https://evil.example/x"), url("*/b")',
    'url(/a/*), url(https://evil.example/x), url(*/b)',
    'url("/\t/evil.example/x")',
    'url("/\n/evil.example/x")',
    'url(/\r/evil.example/x)',
    'url(ht\ttps://evil.example/x)',
    'image-set(url(/local/a.png) 1x, url("/\t/evil.example/b.png") 2x)',
    'image-set("/local/a.png" 1x, "/\t/evil.example/b.png" 2x)',
    '-webkit-image-set(url(/local/a.png) 1x, "https://evil.example/b.png" 2x)',
    'image-set("/local/a.png" 1x, "b.png" 2x, "//evil.example/c.png" 3x)',
    'url(/ok.png) /* hi */',
  ];
  it.each(R2)('flags %j', (v) => expect(contactsOtherHost(v)).toBe(true));
  it('flags image functions even with local paths (allow-list)', () => expect(contactsOtherHost('image-set("/local/a.png" 1x, "/local/b.png" 2x)')).toBe(true));
  it.each(R2.filter((v) => !v.includes('/*') || v.startsWith('url("/a')))('import note for %j', (v) => {
    const themeFile = `magic_card_export: "1.0"\nkind: theme\nitems:\n  - id: t\n    name: T\n    data:\n      primary-color: "#fff"\n      lovelace-background: ${JSON.stringify(v)}\n`;
    const r = parseTransfer(themeFile, { accept: ['theme'] }) as { notes: { code: string }[] };
    expect(r.notes.filter((n) => n.code === 'external_ref')).toHaveLength(1);
  });
});

describe('more vectors', () => {
  const R3 = [
    '"///evil.example/x"',
    "'///evil.example/x'",
    '"\u0001//evil.example/x"',
    '" \t//evil.example/x"',
    'image-set(var(--x) 1x)',
    '-webkit-image-set(var(--x) 1x)',
    'image-set(var(--a) 1x, "/local/b.png" 2x)',
    'url(var(--x))',
    'cross-fade(var(--x), #fff)',
    '"https://evil.example/x"',
  ];
  it.each(R3)('flags %j', (v) => expect(contactsOtherHost(v)).toBe(true));
  it('a pair of values is flagged on both sides', () => {
    expect(contactsOtherHost('"///evil.example/x"')).toBe(true);
    expect(contactsOtherHost('-webkit-image-set(var(--x) 1x)')).toBe(true);
  });
  it('keeps ordinary values', () => {
    for (const v of ['linear-gradient(var(--a), var(--b))', '"Roboto", sans-serif', 'var(--primary-color)']) expect(contactsOtherHost(v), v).toBe(false);
  });
  it('checks a 1 MB value of url( and spaces quickly', () => {
    const big = 'url(' + ' '.repeat(1024 * 1024);
    const t0 = performance.now();
    contactsOtherHost(big);
    expect(performance.now() - t0).toBeLessThan(50);
    const t1 = performance.now();
    contactsOtherHost('url('.repeat(200_000));
    expect(performance.now() - t1).toBeLessThan(50);
  });
  it.each(R3.slice(0, 7))('import note for %j', (v) => {
    const themeFile = `magic_card_export: "1.0"\nkind: theme\nitems:\n  - id: t\n    name: T\n    data:\n      primary-color: "#fff"\n      lovelace-background: ${JSON.stringify(v)}\n`;
    const r = parseTransfer(themeFile, { accept: ['theme'] }) as { notes: { code: string }[] };
    expect(r.notes.filter((n) => n.code === 'external_ref')).toHaveLength(1);
  });
});

describe('strict allow-list (158)', () => {
  const R4 = [
    'url("///evil.example/x',
    "url('///evil.example/x",
    'url("//evil.example/x',
    'url(//evil.example/x',
    'url(///evil.example/x',
    'url(///evil.example/x)',
    'image-set("///evil.example/x',
    'image-set("///evil.example/x" 1x)',
    '-webkit-image-set("///evil.example/x" 1x)',
    'url(',
    'url(/local/a.png',
    'url( "/local/a.png" ) url(',
    'url(/local/../etc/x)',
    'url(/local//evil.example/x)',
    'url(/local/a.png "x")',
    "url(\"/local/a.png'\")",
    'url(/other/a.png)',
    'src("/local/a.png")',
    'element(#x)',
    '"a:b"',
    '"a/b"',
    '"unterminated',
    "'x",
    '@import url(/local/a.css)',
  ];
  it.each(R4)('flags %j', (v) => expect(contactsOtherHost(v)).toBe(true));
  const OK = ['#fff', 'rgba(1, 2, 3, 0.4)', '12px', '0.5', 'linear-gradient(135deg, #111, #222)', 'var(--x)', 'var(--x, #fff)', 'Roboto, sans-serif', '"Segoe UI", Roboto, sans-serif', "'Segoe UI'", 'url(/local/bg.png)', 'url("/local/bg.png")', "url('/local/img/bg-1.png')", 'url( /local/bg.png )', 'url(#grad)', 'center / cover url(/local/bg.png) no-repeat'];
  it.each(OK)('keeps %j', (v) => expect(contactsOtherHost(v), v).toBe(false));
  it('names the host or says another host in the import', () => {
    for (const v of ['url("///evil.example/x', 'image-set("///evil.example/x" 1x)']) {
      const f = `magic_card_export: "1.0"
kind: theme
items:
  - id: t
    name: T
    data:
      primary-color: "#fff"
      lovelace-background: ${JSON.stringify(v)}
`;
      const r = parseTransfer(f, { accept: ['theme'] }) as { notes: { code: string }[] };
      expect(r.notes.filter((n) => n.code === 'external_ref')).toHaveLength(1);
    }
  });
});
