import { describe, it, expect, vi, afterEach } from 'vitest';
import { fileBlob, fragment, thumbnail } from '../src/svg-image/export';
import { bindingValue } from '../src/svg-image/binding-value';
import { api } from '../src/svg-image/chunk';
import { THUMB_RE } from '../src/contracts/mcu-library-images';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path d="M0 0L10 10" fill="var(--mc-image-main)" stroke="var(--primary-color, #0f0)"/><circle cx="5" cy="5" r="2" fill="var(--mc-image-accent)"/></svg>';
const HOSTILE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" onload="alert(1)"><script>alert(1)</script><path d="M0 0L5 5" onclick="x"/></svg>';

afterEach(() => vi.restoreAllMocks());

describe('fragment', () => {
  it('returns sanitised nodes, or undefined when nothing is drawable', () => {
    const f = fragment(HOSTILE);
    expect(f).toBeInstanceOf(DocumentFragment);
    expect(f!.querySelector('script')).toBeNull();
    expect(f!.querySelector('[onclick]')).toBeNull();
    expect(f!.querySelector('path')).not.toBeNull();
    expect(fragment('<svg viewBox="0 0 1 1"><script/></svg>')).toBeUndefined();
    expect(fragment('<!DOCTYPE svg><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>')).toBeUndefined();
  });
});

describe('fileBlob', () => {
  it('is an image/svg+xml blob of sanitised markup', async () => {
    const b = fileBlob(HOSTILE)!;
    expect(b.type).toBe('image/svg+xml');
    const text = await b.text();
    expect(text).toContain('<path');
    expect(text.toLowerCase()).not.toContain('script');
    expect(text).not.toContain('onclick');
    expect(text).not.toContain('onload');
  });
  it('is undefined for refused or empty markup', () => {
    expect(fileBlob('<!DOCTYPE svg><svg/>')).toBeUndefined();
    expect(fileBlob('nope')).toBeUndefined();
  });
});

describe('thumbnail', () => {
  const stubRaster = (dataFor: (type: string, quality?: number) => string) => {
    const made: Blob[] = [];
    const revoked: string[] = [];
    vi.spyOn(URL, 'createObjectURL').mockImplementation((b) => {
      made.push(b as Blob);
      return `blob:test/${made.length}`;
    });
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation((u) => void revoked.push(u));
    class FakeImage {
      src = '';
      decode = async () => undefined;
    }
    vi.stubGlobal('Image', FakeImage);
    const drawn: number[][] = [];
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((() => ({ drawImage: (_i: unknown, _x: number, _y: number, w: number, h: number) => drawn.push([w, h]) })) as never);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(((type?: string, q?: number) => dataFor(type ?? 'image/png', q)) as never);
    return { made, revoked, drawn };
  };

  it('draws the longest side at `side`, keeps the shape and revokes the blob url', async () => {
    const s = stubRaster((type) => `data:${type};base64,AAAA`);
    const out = await thumbnail(SVG, 100, 1000);
    expect(out).toMatch(THUMB_RE);
    expect(s.drawn[0]).toEqual([100, 50]);
    expect(s.revoked).toEqual(['blob:test/1']);
  });

  it('resolves theme variables in the picture it rasterises, since a picture has no page styles', async () => {
    const s = stubRaster((type) => `data:${type};base64,AAAA`);
    await thumbnail(SVG, 100, 1000);
    const text = await s.made[0].text();
    expect(text).not.toContain('--mc-image-main');
    expect(text).not.toContain('--mc-image-accent');
    expect(text).toContain('#0f0');
    expect(text).not.toContain('var(');
  });

  it('lowers quality, then size, then falls back to png until it fits maxBytes', async () => {
    const calls: Array<[string, number | undefined]> = [];
    stubRaster((type, q) => {
      calls.push([type, q]);
      const fits = type === 'image/png' ? 'AAAA' : 'A'.repeat(2000);
      return `data:${type};base64,${fits}`;
    });
    const out = await thumbnail(SVG, 100, 300);
    expect(out?.startsWith('data:image/png')).toBe(true);
    expect(calls.some(([t, q]) => t === 'image/webp' && q !== undefined && q < 0.8)).toBe(true);
  });

  it('gives undefined when nothing fits, when the browser cannot encode, or for refused markup', async () => {
    const s = stubRaster(() => `data:image/webp;base64,${'A'.repeat(5000)}`);
    expect(await thumbnail(SVG, 100, 100)).toBeUndefined();
    expect(await thumbnail('<!DOCTYPE svg><svg/>', 100, 1000)).toBeUndefined();
    expect(s.made).toHaveLength(1);
    vi.restoreAllMocks();
    expect(await thumbnail(SVG, 100, 1000)).toBeUndefined();
  });

  it('revokes the url when decoding fails', async () => {
    const s = stubRaster(() => 'data:image/png;base64,AAAA');
    class Broken {
      src = '';
      decode = async () => {
        throw new Error('bad');
      };
    }
    vi.stubGlobal('Image', Broken);
    expect(await thumbnail(SVG, 100, 1000)).toBeUndefined();
    expect(s.revoked).toHaveLength(1);
  });
});

describe('bindingValue', () => {
  const hass = (state: string, attributes: Record<string, unknown> = {}) => ({ states: { 'sensor.t': { entity_id: 'sensor.t', state, attributes } } }) as never;
  const b = (extra: Record<string, unknown>) => ({ target: 'x', entity: 'sensor.t', set: 'fill', rules: [], ...extra }) as never;

  it('matches an exact state first, then ranges, first match wins', () => {
    const rules = [{ state: 'on', value: '#0f0' }, { above: 20, value: '#f00' }, { below: 5, value: '#00f' }, { above: 0, value: '#999' }];
    expect(bindingValue(b({ rules }), hass('on'))).toBe('#0f0');
    expect(bindingValue(b({ rules }), hass('25'))).toBe('#f00');
    expect(bindingValue(b({ rules }), hass('3'))).toBe('#00f');
    expect(bindingValue(b({ rules }), hass('10'))).toBe('#999');
  });
  it('uses above < value < below and never matches a non-numeric state', () => {
    const rules = [{ above: 5, below: 10, value: 1 }];
    expect(bindingValue(b({ rules }), hass('5'))).toBeUndefined();
    expect(bindingValue(b({ rules }), hass('7'))).toBe(1);
    expect(bindingValue(b({ rules }), hass('10'))).toBeUndefined();
    expect(bindingValue(b({ rules }), hass('warm'))).toBeUndefined();
    expect(bindingValue(b({ rules }), hass(''))).toBeUndefined();
  });
  it('matches unavailable and unknown as plain states', () => {
    const rules = [{ state: 'unavailable', value: 'x' }];
    expect(bindingValue(b({ rules }), hass('unavailable'))).toBe('x');
  });
  it('uses the default for a missing entity, a missing attribute or no match; otherwise undefined', () => {
    const rules = [{ state: 'on', value: 'a' }];
    expect(bindingValue(b({ rules, default: 'd' }), undefined)).toBe('d');
    expect(bindingValue(b({ rules, default: 'd', entity: 'sensor.none' }), hass('on'))).toBe('d');
    expect(bindingValue(b({ rules, default: 'd', attribute: 'mode' }), hass('on'))).toBe('d');
    expect(bindingValue(b({ rules, default: 'd' }), hass('off'))).toBe('d');
    expect(bindingValue(b({ rules }), hass('off'))).toBeUndefined();
  });
  it('compares an attribute instead of the state', () => {
    const rules = [{ above: 50, value: true }];
    expect(bindingValue(b({ rules, attribute: 'level' }), hass('on', { level: 70 }))).toBe(true);
    expect(bindingValue(b({ rules, attribute: 'level' }), hass('on', { level: 10 }))).toBeUndefined();
  });
  it('reads at most MAX_BINDING_RULES rules', () => {
    const rules = Array.from({ length: 40 }, (_, i) => ({ state: `s${i}`, value: i }));
    expect(bindingValue(b({ rules }), hass('s39'))).toBeUndefined();
    expect(bindingValue(b({ rules }), hass('s15'))).toBe(15);
  });
});

describe('chunk api', () => {
  it('exposes the contract functions', () => {
    for (const k of ['sanitizeImage', 'getImage', 'fragment', 'thumbnail', 'fileBlob', 'bindingValue', 'invalidate'] as const) expect(typeof api[k]).toBe('function');
    expect(api.sanitizeImage(SVG).error).toBeUndefined();
  });
});
