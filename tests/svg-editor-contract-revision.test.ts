import { describe, expect, it } from 'vitest';
import '../src/svg-editor/index';
import { SVG_EDITOR_CONTRACT_REVISION, SVG_EDITOR_MCU_MIN_REVISION } from '../src/contracts/svg-editor';
import { IMAGES_MIN_CONTRACT_REVISION } from '../src/contracts/mcu-library-images';

/* The Utils panel opens the image editor only when mc-svg-editor reports at least the images minimum. */

describe('svg editor contract revision', () => {
  const rev = (): number => (customElements.get('mc-svg-editor') as unknown as { contractRevision: number }).contractRevision;

  it('mc-svg-editor reports revision 8 from the contract constant', () => {
    expect(SVG_EDITOR_CONTRACT_REVISION).toBe(8);
    expect(rev()).toBe(8);
    expect(rev()).toBe(SVG_EDITOR_CONTRACT_REVISION);
  });

  it('meets the Utils images minimum and the editors minimum', () => {
    expect(IMAGES_MIN_CONTRACT_REVISION).toBe(8);
    expect(rev()).toBeGreaterThanOrEqual(IMAGES_MIN_CONTRACT_REVISION);
    expect(rev()).toBeGreaterThanOrEqual(SVG_EDITOR_MCU_MIN_REVISION);
  });
});

describe('settle', () => {
  const settle = (customElements.get('mc-svg-editor') as unknown as { prototype: { settle(this: unknown, f: (d: unknown) => unknown): void } }).prototype.settle;
  const fake = (dirty: boolean, hot = false) => {
    const me = { dirty, hot, base: 'b', doc: 'd', baseline: 'old', set: [] as unknown[], refreshed: 0, setDoc: (d: unknown) => me.set.push(d), stamp: (d: unknown) => 'stamp:' + String(d), refresh: () => void me.refreshed++ };
    return me;
  };
  it('changes the document and its committed copy, and keeps a clean editor clean', () => {
    const me = fake(false);
    settle.call(me, (d) => d + '+');
    expect(me.base).toBe('b+');
    expect(me.set).toEqual(['d+']);
    expect(me.baseline).toBe('stamp:b+');
    expect(me.refreshed).toBe(1);
  });
  it('leaves the unsaved mark and a running gesture alone', () => {
    const me = fake(true, true);
    settle.call(me, (d) => d + '+');
    expect(me.base).toBe('b+');
    expect(me.set).toEqual([]);
    expect(me.baseline).toBe('old');
  });
});
