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
