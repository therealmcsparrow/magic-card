import { describe, expect, it } from 'vitest';
import { IMAGE_REF_RE, IMAGE_REF_PREFIX } from '../src/contracts/svg-image';
import { IMAGE_CMD, THUMB_RE as CONTRACT_THUMB_RE } from '../src/contracts/mcu-library-images';
import { CMD_GET, CMD_LIST, REF_PREFIX, REF_RE, THUMB_RE, entitiesOf, isLibraryValue, pickKeys, ratioValue, refId, sameShape, shapeOf, toRef, shapeKeys } from '../src/image-tools/model';

describe('library references', () => {
  it('uses the contract prefix and expression', () => {
    expect(REF_PREFIX).toBe(IMAGE_REF_PREFIX);
    expect(REF_RE.source).toBe(IMAGE_REF_RE.source);
  });

  it('uses the commands and the thumbnail expression of the library contract', () => {
    expect(CMD_LIST).toBe(IMAGE_CMD.list);
    expect(CMD_GET).toBe(IMAGE_CMD.get);
    expect(THUMB_RE.source).toBe(CONTRACT_THUMB_RE.source);
  });

  it('reads the id of a well-formed reference only', () => {
    expect(refId('mcu-image:ground-floor')).toBe('ground-floor');
    expect(refId('mcu-image:')).toBeUndefined();
    expect(refId('mcu-image:Bad Id')).toBeUndefined();
    expect(refId('https://x/y.png')).toBeUndefined();
    expect(refId(undefined)).toBeUndefined();
    expect(refId(5)).toBeUndefined();
    expect(toRef('a-b')).toBe('mcu-image:a-b');
  });

  it('tells a library value (well formed or not) from a URL', () => {
    expect(isLibraryValue('mcu-image:x')).toBe(true);
    expect(isLibraryValue('mcu-image:???')).toBe(true);
    expect(isLibraryValue('/local/a.png')).toBe(false);
    expect(isLibraryValue(undefined)).toBe(false);
  });
});

describe('the drawing shape', () => {
  it('reduces a viewBox to a ratio', () => {
    expect(shapeOf('0 0 1920 1080')).toMatchObject({ label: '16:9', w: 1920, h: 1080 });
    expect(shapeOf('0 0 1280 960')?.label).toBe('4:3');
    expect(shapeOf('0,0,1024,1024')?.label).toBe('1:1');
    expect(shapeOf('0 0 1080 1920')?.label).toBe('9:16');
  });

  it('falls back to a decimal when the reduced ratio is not readable', () => {
    expect(shapeOf('0 0 1000 777')?.label).toBe('1.287');
  });

  it('refuses a viewBox it cannot read', () => {
    expect(shapeOf(undefined)).toBeUndefined();
    expect(shapeOf('')).toBeUndefined();
    expect(shapeOf('0 0 0 10')).toBeUndefined();
    expect(shapeOf('0 0 -4 10')).toBeUndefined();
    expect(shapeOf('0 0 a b')).toBeUndefined();
    expect(shapeOf('0 0 1 2 3')).toBeUndefined();
  });

  it('reads the card setting in every spelling the card accepts', () => {
    expect(ratioValue('16:9')).toBeCloseTo(16 / 9);
    expect(ratioValue('16/9')).toBeCloseTo(16 / 9);
    expect(ratioValue('16x9')).toBeCloseTo(16 / 9);
    expect(ratioValue(1.5)).toBe(1.5);
    expect(ratioValue('1.5')).toBe(1.5);
    expect(ratioValue('56.25%')).toBeCloseTo(16 / 9);
    expect(ratioValue('')).toBeUndefined();
    expect(ratioValue(undefined)).toBeUndefined();
    expect(ratioValue('wide')).toBeUndefined();
    expect(ratioValue(0)).toBeUndefined();
  });

  it('compares the card setting with the drawing', () => {
    const s = shapeOf('0 0 1920 1080')!;
    expect(sameShape('16:9', s)).toBe(true);
    expect(sameShape(1.778, s)).toBe(true);
    expect(sameShape('4:3', s)).toBe(false);
    expect(sameShape(undefined, s)).toBe(false);
  });
});

describe('what picking writes', () => {
  const shape = shapeOf('0 0 1920 1080')!;
  it('writes the reference and, for a module without a shape, the drawing shape', () => {
    expect(pickKeys('module', {}, 'ground', shape)).toEqual({ keys: { image: 'mcu-image:ground', aspect_ratio: '16:9' }, shapeSet: true });
    expect(pickKeys('module', { aspect_ratio: '' }, 'ground', shape).keys.aspect_ratio).toBe('16:9');
  });

  it('keeps the shape a module already has', () => {
    expect(pickKeys('module', { aspect_ratio: '4:3' }, 'ground', shape)).toEqual({ keys: { image: 'mcu-image:ground' }, shapeSet: false });
    expect(pickKeys('module', { aspect_ratio: 2 }, 'ground', shape).keys).toEqual({ image: 'mcu-image:ground' });
  });

  it('writes only the reference in a background layer or when the viewBox is unknown', () => {
    expect(pickKeys('background', {}, 'ground', shape)).toEqual({ keys: { image: 'mcu-image:ground' }, shapeSet: false });
    expect(pickKeys('module', {}, 'ground', undefined)).toEqual({ keys: { image: 'mcu-image:ground' }, shapeSet: false });
  });

  it('shapeKeys writes the drawing shape', () => {
    expect(shapeKeys(shape)).toEqual({ aspect_ratio: '16:9' });
  });
});

describe('entities of a drawing', () => {
  it('lists each entity once, in order of first use', () => {
    const b = (entity: string, set = 'fill') => ({ target: 't', entity, set: set as 'fill', rules: [] });
    expect(entitiesOf([b('light.a'), b('light.b'), b('light.a', 'stroke')])).toEqual(['light.a', 'light.b']);
    expect(entitiesOf(undefined)).toEqual([]);
  });
});
