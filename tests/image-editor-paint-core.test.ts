import { describe, expect, it } from 'vitest';
import { ACCENT, MAIN, angleOf, cssOf, dashText, layerPaint, linearPts, parseDash, readGradient, readPaint, solidOf, themeOf, handleAt, dragHandle, type Grad } from '../src/image-editor/paint';

const box = { x: 100, y: 50, w: 200, h: 100 };
const grad = (over: Partial<Grad> = {}): Grad => ({ t: 'linear', s: [{ o: 0, c: MAIN }, { o: 1, c: '#ff0000' }], p: [0, 0.5, 1, 0.5], ...over });

describe('image paints: colour values', () => {
  it('accepts hex, colour functions and theme variables, lower-casing hex', () => {
    expect(solidOf('#FFAA00')).toBe('#ffaa00');
    expect(solidOf(' #abcd ')).toBe('#abcd');
    expect(solidOf('#ffaa00cc')).toBe('#ffaa00cc');
    expect(solidOf('rgb(1 2 3 / 50%)')).toBe('rgb(1 2 3 / 50%)');
    expect(solidOf('hsl(210, 40%, 50%)')).toBe('hsl(210, 40%, 50%)');
    expect(solidOf('oklch(0.7 0.1 200)')).toBe('oklch(0.7 0.1 200)');
    expect(solidOf('var(--primary-color)')).toBe('var(--primary-color)');
  });

  it('refuses anything that is not one of those', () => {
    for (const bad of ['', '#12', '#12345', '#gggggg', 'red', 'url(#a)', 'javascript:alert(1)', 'red; x:y', 'rgb(1,2,3', 'rgb(1,2,3))', 'var(--Bad)', 'var(--a, red)', 'var(--mc-image-main)', 'rgb(var(--x))', 'url(http://x)', 'expression(1)', 'x'.repeat(300), 'rgb(1,2,3)/*', 'rgb(1\\2,3)'])
      expect(solidOf(bad), bad).toBeUndefined();
  });

  it('reads the name of a theme variable', () => {
    expect(themeOf('var(--primary-color)')).toBe('--primary-color');
    expect(themeOf('#fff')).toBeUndefined();
    expect(themeOf(MAIN)).toBeUndefined();
  });

  it('draws Main and Accent through the editor variables', () => {
    expect(cssOf(MAIN)).toBe('var(--m)');
    expect(cssOf(ACCENT)).toBe('var(--a)');
    expect(cssOf('#fff')).toBe('#fff');
    expect(cssOf('none')).toBe('none');
  });
});

describe('image paints: gradient geometry', () => {
  it('puts the line of an angle across the box so its corners take the end colours', () => {
    expect(linearPts(0, 200, 100)).toEqual([0, 0.5, 1, 0.5]);
    const d = linearPts(90, 200, 100);
    expect(d[0]).toBeCloseTo(0.5);
    expect(d[1]).toBeCloseTo(0);
    expect(d[3]).toBeCloseTo(1);
    const [x1, y1, x2, y2] = linearPts(45, 200, 100);
    expect(angleOf([x1, y1, x2, y2], 200, 100)).toBeCloseTo(45, 5);
  });

  it('measures an angle in 0..360 from the points as drawn, not as fractions', () => {
    expect(angleOf([0, 0, 1, 0], 200, 100)).toBe(0);
    expect(angleOf([0, 0, 0, 1], 200, 100)).toBe(90);
    expect(angleOf([1, 0, 0, 0], 200, 100)).toBe(180);
    expect(angleOf([0, 1, 0, 0], 200, 100)).toBe(270);
  });

  it('finds the handle positions in drawing units', () => {
    expect(handleAt(grad(), box, 'a')).toEqual([100, 100]);
    expect(handleAt(grad(), box, 'b')).toEqual([300, 100]);
    expect(handleAt(grad(), box, 0)).toEqual([100, 100]);
    expect(handleAt(grad(), box, 1)).toEqual([300, 100]);
    const r: Grad = { t: 'radial', s: grad().s, p: [0.5, 0.5, 0.25] };
    expect(handleAt(r, box, 'a')).toEqual([200, 100]);
    expect(handleAt(r, box, 'b')).toEqual([250, 100]);
  });

  it('drags a handle to a point and keeps the stops inside 0..1', () => {
    const g = dragHandle(grad(), box, 'b', [200, 150]);
    expect(g.p).toEqual([0, 0.5, 0.5, 1]);
    const m = dragHandle({ ...grad(), s: [{ o: 0, c: MAIN }, { o: 0.5, c: '#fff' }, { o: 1, c: ACCENT }] }, box, 1, [400, 100]);
    expect(m.s[1].o).toBe(0.5 + 0.5);
    expect(dragHandle(grad(), box, 1, [-900, 100]).s[1].o).toBe(0);
    const r: Grad = { t: 'radial', s: grad().s, p: [0.5, 0.5, 0.25] };
    expect(dragHandle(r, box, 'b', [300, 100]).p[2]).toBeCloseTo(0.5);
    expect(dragHandle(r, box, 'a', [100, 50]).p.slice(0, 2)).toEqual([0, 0]);
    expect(dragHandle(r, box, 'b', [200, 100]).p[2]).toBeGreaterThan(0);
  });
});

describe('image paints: dashes', () => {
  it('reads a list of numbers, with commas or spaces', () => {
    expect(parseDash('8 4')).toEqual([8, 4]);
    expect(parseDash('8,4, 2')).toEqual([8, 4, 2]);
    expect(parseDash('')).toEqual([]);
    expect(dashText([8, 4])).toBe('8 4');
  });
  it('refuses negatives, text, units, a list of zeros and more than 8 numbers', () => {
    for (const bad of ['-1 2', 'a b', '4px 2', '0 0', '1 2 3 4 5 6 7 8 9', '1e9999', '1;2'])
      expect(parseDash(bad), bad).toBe('bad');
  });
});

describe('image paints: markup out', () => {
  const run = (s: object, b: typeof box | null = box) => {
    const defs: string[] = [];
    let n = 0;
    const attrs = layerPaint({ fill: 'main', stroke: 'none', width: 2, ...s } as never, () => b ?? undefined, defs, () => `grad${++n}`);
    return { attrs, defs };
  };

  it('writes Main, Accent and none as before', () => {
    expect(run({}).attrs).toBe(' fill="var(--mc-image-main)"');
    expect(run({ fill: 'accent', stroke: 'main' }).attrs).toBe(' fill="var(--mc-image-accent)" stroke="var(--mc-image-main)" stroke-width="2"');
    expect(run({ fill: 'none', stroke: 'accent', width: 3 }).attrs).toBe(' fill="none" stroke="var(--mc-image-accent)" stroke-width="3"');
  });

  it('writes a hex or theme paint in place of the placeholder', () => {
    expect(run({ look: { fill: '#3f6fb5' } }).attrs).toBe(' fill="#3f6fb5"');
    expect(run({ stroke: 'main', look: { stroke: 'var(--primary-color)' } }).attrs).toBe(' fill="var(--mc-image-main)" stroke="var(--primary-color)" stroke-width="2"');
  });

  it('writes opacity and dashes only when set and only with an outline', () => {
    expect(run({ look: { opacity: 50 } }).attrs).toBe(' fill="var(--mc-image-main)" opacity="0.5"');
    expect(run({ look: { opacity: 100 } }).attrs).toBe(' fill="var(--mc-image-main)"');
    expect(run({ stroke: 'main', look: { dash: [8, 4], offset: 2 } }).attrs).toBe(' fill="var(--mc-image-main)" stroke="var(--mc-image-main)" stroke-width="2" stroke-dasharray="8 4" stroke-dashoffset="2"');
    expect(run({ look: { dash: [8, 4] } }).attrs).not.toContain('dasharray');
    expect(run({ stroke: 'main', width: 0, look: { dash: [8, 4] } }).attrs).not.toContain('dasharray');
  });

  it('writes a linear gradient as userSpaceOnUse in the shape\'s own box', () => {
    const r = run({ look: { fill: grad() } });
    expect(r.attrs).toBe(' fill="url(#grad1)"');
    expect(r.defs).toEqual(['<linearGradient id="grad1" gradientUnits="userSpaceOnUse" x1="100" y1="100" x2="300" y2="100"><stop offset="0" stop-color="var(--mc-image-main)"/><stop offset="1" stop-color="#ff0000"/></linearGradient>']);
  });

  it('writes a radial gradient with its radius from the larger side and a stop opacity', () => {
    const g: Grad = { t: 'radial', s: [{ o: 0, c: '#fff', a: 0.5 }, { o: 1, c: ACCENT }], p: [0.5, 0.5, 0.25] };
    const r = run({ stroke: 'main', look: { stroke: g } });
    expect(r.attrs).toContain('stroke="url(#grad1)"');
    expect(r.defs[0]).toBe('<radialGradient id="grad1" gradientUnits="userSpaceOnUse" cx="200" cy="100" r="50"><stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="var(--mc-image-accent)"/></radialGradient>');
  });

  it('sorts stops by offset and gives each gradient its own id', () => {
    const g = grad({ s: [{ o: 1, c: '#000' }, { o: 0, c: '#fff' }] });
    const r = run({ stroke: 'main', look: { fill: g, stroke: g } });
    expect(r.defs).toHaveLength(2);
    expect(r.defs[0]).toMatch(/offset="0" stop-color="#fff"\/><stop offset="1" stop-color="#000"/);
    expect(r.attrs).toContain('fill="url(#grad1)"');
    expect(r.attrs).toContain('stroke="url(#grad2)"');
  });

  it('writes a gradient with no box as the first colour, never a broken reference', () => {
    expect(run({ look: { fill: grad() } }, null).attrs).toBe(' fill="var(--mc-image-main)"');
  });
});

describe('image paints: markup in', () => {
  const doc = (inner: string, attrs = '') => new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"${attrs}>${inner}</svg>`, 'image/svg+xml');

  it('reads hex, theme and colour functions and flags anything else', () => {
    const bad = { v: false };
    expect(readPaint('#FF0000', undefined, box, bad)).toBe('#ff0000');
    expect(readPaint('var(--primary-color)', undefined, box, bad)).toBe('var(--primary-color)');
    expect(bad.v).toBe(false);
    expect(readPaint('red', undefined, box, bad)).toBeUndefined();
    expect(bad.v).toBe(true);
  });

  it('reads a userSpaceOnUse linear gradient into fractions of the shape box', () => {
    const d = doc('<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="100" y1="100" x2="300" y2="100"><stop offset="0" stop-color="var(--mc-image-main)"/><stop offset="50%" stop-color="#00f" stop-opacity="0.5"/><stop offset="1" stop-color="#f00"/></linearGradient>');
    const bad = { v: false };
    const g = readGradient(d.getElementById('g')!, box, bad) as Grad;
    expect(bad.v).toBe(false);
    expect(g).toEqual({ t: 'linear', p: [0, 0.5, 1, 0.5], s: [{ o: 0, c: MAIN }, { o: 0.5, c: '#00f', a: 0.5 }, { o: 1, c: '#f00' }] });
  });

  it('reads the default object-bounding-box units when the result would look the same', () => {
    const lin = doc('<linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>');
    const bad = { v: false };
    expect((readGradient(lin.getElementById('g')!, box, bad) as Grad).p).toEqual([0, 0, 1, 0]);
    expect(bad.v).toBe(false);
    const diag = doc('<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>');
    const b2 = { v: false };
    readGradient(diag.getElementById('g')!, box, b2);
    expect(b2.v).toBe(true);
    const b3 = { v: false };
    expect((readGradient(diag.getElementById('g')!, { x: 0, y: 0, w: 100, h: 100 }, b3) as Grad).p).toEqual([0, 0, 1, 1]);
    expect(b3.v).toBe(false);
  });

  it('flags a gradient it cannot keep: transform, spread, focus, one stop, nine stops, unknown colour', () => {
    const stops = (n: number, c = '#fff') => Array.from({ length: n }, (_, i) => `<stop offset="${i / Math.max(1, n - 1)}" stop-color="${c}"/>`).join('');
    const cases = [
      `<linearGradient id="g" x1="0" x2="1" gradientTransform="rotate(10)">${stops(2)}</linearGradient>`,
      `<linearGradient id="g" x1="0" x2="1" spreadMethod="reflect">${stops(2)}</linearGradient>`,
      `<radialGradient id="g" cx="0.5" cy="0.5" r="0.5" fx="0.2">${stops(2)}</radialGradient>`,
      `<linearGradient id="g" x1="0" x2="1">${stops(1)}</linearGradient>`,
      `<linearGradient id="g" x1="0" x2="1">${stops(9)}</linearGradient>`,
      `<linearGradient id="g" x1="0" x2="1">${stops(2, 'currentColor')}</linearGradient>`,
      `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="10%" x2="20%">${stops(2)}</linearGradient>`,
    ];
    for (const c of cases) {
      const bad = { v: false };
      readGradient(doc(c).getElementById('g')!, { x: 0, y: 0, w: 100, h: 100 }, bad);
      expect(bad.v, c).toBe(true);
    }
  });

  it('reads a url(#id) paint through the gradient it names', () => {
    const d = doc('<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="100" y1="100" x2="300" y2="100"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>');
    const bad = { v: false };
    const g = readPaint('url(#g)', d, box, bad) as Grad;
    expect(g.t).toBe('linear');
    const b2 = { v: false };
    expect(readPaint('url(#nope)', d, box, b2)).toBeUndefined();
    expect(b2.v).toBe(true);
  });
});
