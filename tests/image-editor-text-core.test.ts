import { describe, expect, it } from 'vitest';
import { IMAGE_MAX_TEXT_CHARS } from '../src/contracts/svg-image';
import {
  anchorOf,
  blank,
  boxFor,
  boxPaths,
  changed,
  cleanText,
  defaultSize,
  nameOf,
  readText,
  safeWeight,
  textAttrs,
  textBody,
  type Measure,
  type TextData,
} from '../src/image-editor/text';

const flat: Measure = (line, t) => [...line].length * 10 + (t.l ?? 0) * [...line].length;
const T: TextData = { s: 'Hello', z: 50, w: 400, a: 'start', f: 'sans-serif' };
const svgOf = (inner: string, attrs = ''): Element => new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"${attrs}>${inner}</svg>`, 'image/svg+xml').querySelector('text')!;
const read = (inner: string, attrs = '') => {
  const flag = { v: false };
  const r = readText(svgOf(inner, attrs), flag);
  return { r, flag };
};

describe('text layers: words and geometry', () => {
  it('cleans words: one kind of line break, no control characters, at most the limit', () => {
    expect(cleanText('a\r\nb\rc\u0000d\te')).toBe('a\nb\ncde');
    expect(cleanText('x'.repeat(IMAGE_MAX_TEXT_CHARS + 50))).toHaveLength(IMAGE_MAX_TEXT_CHARS);
    expect(cleanText('x'.repeat(IMAGE_MAX_TEXT_CHARS - 1) + '😀').endsWith('\ud83d')).toBe(false);
  });

  it('names a layer after its first words, cut at 24 characters', () => {
    expect(nameOf('Kitchen light\nsecond', 'Text')).toBe('Kitchen light');
    expect(nameOf('', 'Text')).toBe('Text');
    expect(nameOf('\n  \n', 'Text')).toBe('Text');
    expect(nameOf('abcdefghijklmnopqrstuvwxyz', 'Text')).toBe('abcdefghijklmnopqrstuvwx…');
  });

  it('puts the box left of the anchor for End, centred for Centre and right of it for Start', () => {
    const at: [number, number] = [200, 100];
    const w = 50;
    expect(boxFor(at, { ...T, a: 'start' }, flat)).toMatchObject({ x: 200, w });
    expect(boxFor(at, { ...T, a: 'middle' }, flat)).toMatchObject({ x: 175, w });
    expect(boxFor(at, { ...T, a: 'end' }, flat)).toMatchObject({ x: 150, w });
  });

  it('reads the anchor back from the box it made, for every alignment', () => {
    for (const a of ['start', 'middle', 'end'] as const) {
      const t = { ...T, a, s: 'Two\nlines here' };
      const b = boxFor([123.45, 77.7], t, flat);
      const [x, y] = anchorOf(b, t);
      expect(x).toBeCloseTo(123.45, 1);
      expect(y).toBeCloseTo(77.7, 1);
    }
  });

  it('makes the box taller by a line distance for each extra line', () => {
    const one = boxFor([0, 100], T, flat);
    const three = boxFor([0, 100], { ...T, s: 'a\nb\nc' }, flat);
    expect(three.h - one.h).toBeCloseTo(2 * 1.2 * T.z, 1);
    expect(three.y).toBe(one.y);
  });

  it('makes a closed rectangle of four corners for the layer', () => {
    const p = boxPaths({ x: 1, y: 2, w: 3, h: 4 });
    expect(p).toHaveLength(1);
    expect(p[0].closed).toBe(true);
    expect(p[0].anchors.map((a) => [a.x, a.y])).toEqual([[1, 2], [4, 2], [4, 6], [1, 6]]);
  });

  it('suggests a size from the shorter side', () => {
    expect(defaultSize(1920, 1080)).toBe(68);
    expect(defaultSize(100, 100)).toBe(8);
    expect(defaultSize(4096, 4096)).toBe(256);
  });

  it('snaps a weight to one the editor offers', () => {
    expect(safeWeight(100)).toBe(300);
    expect(safeWeight(650)).toBe(600);
    expect(safeWeight(900)).toBe(800);
  });

  it('keeps the anchor when the words, size or alignment change', () => {
    const b = boxFor([300, 200], { ...T, a: 'middle' }, flat);
    const r = changed({ ...T, a: 'middle' }, b, { s: 'A much longer line' }, flat);
    expect(anchorOf(r.box, r.t)[0]).toBeCloseTo(300, 1);
    expect(anchorOf(r.box, r.t)[1]).toBeCloseTo(200, 1);
    const big = changed({ ...T, a: 'middle' }, b, { z: 80 }, flat);
    expect(anchorOf(big.box, big.t)[1]).toBeCloseTo(200, 1);
  });

  it('keeps values inside what the markup allows', () => {
    const r = changed(T, undefined, { z: 99999, w: 650, f: 'Comic Sans', l: 5000, s: 'a\u0000b' }, flat);
    expect(r.t).toMatchObject({ z: 1000, w: 600, f: 'sans-serif', l: 1000, s: 'ab' });
    expect(changed({ ...T, i: true }, undefined, { i: undefined }, flat).t.i).toBeUndefined();
    expect(changed({ ...T, l: 4 }, undefined, { l: 0 }, flat).t.l).toBeUndefined();
  });

  it('treats only spaces and line breaks as blank', () => {
    expect(blank({ ...T, s: ' \n ' })).toBe(true);
    expect(blank({ ...T, s: '.' })).toBe(false);
  });
});

describe('text layers: markup out', () => {
  it('writes the place and the type of a single line', () => {
    expect(textAttrs(T, [10.456, 20])).toBe(' x="10.46" y="20" font-size="50" font-family="sans-serif" font-weight="400" text-anchor="start"');
    expect(textAttrs({ ...T, i: true, a: 'end', l: 2, w: 700, f: 'serif' }, [0, 0])).toBe(' x="0" y="0" font-size="50" font-family="serif" font-weight="700" font-style="italic" text-anchor="end" letter-spacing="2"');
  });

  it('escapes the words', () => {
    expect(textBody({ ...T, s: 'a < b & c > "d"' }, [0, 0])).toBe('a &lt; b &amp; c &gt; "d"');
    expect(textBody({ ...T, s: '<script>alert(1)</script>' }, [0, 0])).not.toContain('<script');
  });

  it('writes one tspan with its own x and y for each non-empty line and skips empty ones', () => {
    expect(textBody({ ...T, s: 'one\n\nthree' }, [10, 100])).toBe('<tspan x="10" y="100">one</tspan><tspan x="10" y="220">three</tspan>');
  });
});

describe('text layers: markup in', () => {
  it('reads what the editor writes, for every field', () => {
    const t: TextData = { s: 'Hall', z: 40, w: 700, i: true, a: 'middle', l: 3, f: 'monospace' };
    const el = `<text${textAttrs(t, [100, 50])}>Hall</text>`;
    const { r, flag } = read(el);
    expect(flag.v).toBe(false);
    expect(r?.t).toEqual(t);
    expect(r?.at).toEqual([100, 50]);
  });

  it('reads lines back, empty ones included', () => {
    const t: TextData = { s: 'one\n\nthree', z: 20, w: 400, a: 'start', f: 'serif' };
    const { r } = read(`<text${textAttrs(t, [5, 30])}>${textBody(t, [5, 30])}</text>`);
    expect(r?.t.s).toBe('one\n\nthree');
  });

  it('collapses white space the way the drawing does', () => {
    const { r } = read('<text x="0" y="10" font-size="12">\n   Hello\n     world  </text>');
    expect(r?.t.s).toBe('Hello world');
  });

  it('takes the type from the group it sits in', () => {
    const { r, flag } = read('<g font-size="30" font-weight="bold" text-anchor="end"><text x="0" y="10">x</text></g>');
    expect(flag.v).toBe(false);
    expect(r?.t).toMatchObject({ z: 30, w: 700, a: 'end' });
  });

  it('uses 16 units and a sans-serif font when the file says nothing, and a font off the list becomes sans-serif', () => {
    expect(read('<text x="0" y="10">x</text>').r?.t).toMatchObject({ z: 16, f: 'sans-serif', w: 400 });
    expect(read('<text x="0" y="10" font-family="Comic Sans">x</text>').r?.t.f).toBe('sans-serif');
  });

  it.each([
    ['a transform on the text', '<text x="0" y="10" transform="rotate(10)">x</text>', ''],
    ['a transform on a group', '<g transform="scale(2)"><text x="0" y="10">x</text></g>', ''],
    ['a transform on the drawing', '<text x="0" y="10">x</text>', ' transform="scale(2)"'],
    ['a list of positions', '<text x="0 5 10" y="10">xyz</text>', ''],
    ['a shift', '<text x="0" y="10" dx="4">x</text>', ''],
    ['a size in other units', '<text x="0" y="10" font-size="2em">x</text>', ''],
    ['a size of zero', '<text x="0" y="10" font-size="0">x</text>', ''],
    ['an unknown weight', '<text x="0" y="10" font-weight="lighter">x</text>', ''],
    ['an oblique style', '<text x="0" y="10" font-style="oblique">x</text>', ''],
    ['spacing in other units', '<text x="0" y="10" letter-spacing="1em">x</text>', ''],
    ['a nested element', '<text x="0" y="10">a<title>b</title></text>', ''],
    ['words next to lines', '<text x="0" y="10" font-size="10">a<tspan x="0" y="22">b</tspan></text>', ''],
    ['a line off the line distance', '<text x="0" y="10" font-size="10"><tspan x="0" y="10">a</tspan><tspan x="0" y="19">b</tspan></text>', ''],
    ['a line shifted sideways', '<text x="0" y="10" font-size="10"><tspan x="0" y="10">a</tspan><tspan x="4" y="22">b</tspan></text>', ''],
    ['two lines at the same place', '<text x="0" y="10" font-size="10"><tspan x="0" y="10">a</tspan><tspan x="0" y="10">b</tspan></text>', ''],
    ['a line with only a shift', '<text x="0" y="10" font-size="10"><tspan x="0" y="10">a</tspan><tspan dy="12">b</tspan></text>', ''],
    ['an attribute the editor does not write', '<text x="0" y="10" dominant-baseline="middle">x</text>', ''],
  ])('refuses %s so the image opens for viewing only', (_n, inner, attrs) => {
    const { r, flag } = read(inner, attrs);
    expect(r).toBeUndefined();
    expect(flag.v).toBe(true);
  });

  it('refuses more words than the limit', () => {
    const { r, flag } = read(`<text x="0" y="10">${'x'.repeat(IMAGE_MAX_TEXT_CHARS + 1)}</text>`);
    expect(r).toBeUndefined();
    expect(flag.v).toBe(true);
  });

  it('does not touch a flag that was already set when the text is fine', () => {
    const el = svgOf('<text x="0" y="10">x</text>');
    const flag = { v: true };
    expect(readText(el, flag)?.t.s).toBe('x');
    expect(flag.v).toBe(true);
  });
});
