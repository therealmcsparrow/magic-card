import { describe, it, expect, afterEach } from 'vitest';
import '../src/editor/components/box-field';
import '../src/editor/components/design-panel';
import { tokens } from '../src/editor/components/box-field';
import { designToStyle, designUsesEntityColor } from '../src/utils/css-utils';
import type { DesignConfig } from '../src/types';

/* The Border colour field keeps the entity colour choice: per side and linked, as design.border_color = entity did. */
afterEach(() => {
  document.body.innerHTML = '';
});
const D = (d: Record<string, unknown>) => d as unknown as DesignConfig;
const VAR = 'var(--mc-entity-color, currentColor)';

describe('border_color with entity colours', () => {
  it('a single entity colour is the entity variable, as before', () => {
    expect(designToStyle(D({ border_color: 'entity' }))).toContain(`border-color: ${VAR}`);
    expect(designToStyle(D({ border_color: 'entity 50%' }))).toContain('color-mix(in srgb, var(--mc-entity-color, currentColor) 50%, transparent)');
  });
  it('one entity colour per side in a list', () => {
    const css = designToStyle(D({ border_width: '2px', border_color: 'entity red entity 40% blue' }));
    expect(css).toContain(`border-color: ${VAR} red color-mix(in srgb, ${VAR} 40%, transparent) blue`);
  });
  it('the design counts as using the entity colour', () => {
    expect(designUsesEntityColor(D({ border_color: 'red entity' }))).toBe(true);
    expect(designUsesEntityColor(D({ border_color: 'var(--entity-x) red' }))).toBe(false);
  });
});

describe('long colour lists', () => {
  it('a very long list is read up to a cap, in linear time', () => {
    const t0 = performance.now();
    const list = tokens('entity 10% '.repeat(200000));
    expect(performance.now() - t0).toBeLessThan(200);
    expect(list.length).toBeLessThanOrEqual(64);
    expect(list[0]).toBe('entity 10%');
  });
  it('a colour list over the cap is left as written, with no entity colour', () => {
    const long = `entity ${'red '.repeat(100)}`;
    expect(designToStyle(D({ border_color: long }))).not.toContain('--mc-entity-color');
    expect(designUsesEntityColor(D({ border_color: long }))).toBe(false);
  });
});

type El = HTMLElement & Record<string, unknown> & { updateComplete: Promise<unknown>; shadowRoot: ShadowRoot };
async function box(value: string, entity: boolean): Promise<{ el: El; got: string[] }> {
  const el = document.createElement('mc-box-field') as El;
  Object.assign(el, { shorthand: true, baseName: 'border_color', cell: 'color', value, label: 'Border colour', entity });
  const got: string[] = [];
  el.onChange = (u: Record<string, unknown>) => got.push(String(u.border_color));
  document.body.appendChild(el);
  await el.updateComplete;
  return { el, got };
}
const pickers = (el: El) => [...el.shadowRoot.querySelectorAll<El>('mc-color-picker')];

describe('four-side Border colour box with entity', () => {
  it('offers the entity toggle in each colour cell when enabled, and not otherwise', async () => {
    const on = await box('red', true);
    const p = pickers(on.el)[0];
    await p.updateComplete;
    expect(p.shadowRoot.querySelector('.entity-toggle')).not.toBeNull();
    const off = await box('red', false);
    await pickers(off.el)[0].updateComplete;
    expect(pickers(off.el)[0].shadowRoot.querySelector('.entity-toggle')).toBeNull();
  });
  it('the toggle writes entity for the linked value', async () => {
    const { el, got } = await box('red', true);
    const p = pickers(el)[0];
    await p.updateComplete;
    p.shadowRoot.querySelector<HTMLButtonElement>('.entity-toggle')!.click();
    await p.updateComplete;
    expect(got).toEqual(['entity']);
  });
  it('an entity colour with an opacity is one side value', async () => {
    const { el } = await box('entity 50% red', true);
    el.shadowRoot.querySelector<HTMLButtonElement>('.link-btn, [aria-pressed]')?.click();
    await el.updateComplete;
    const values = pickers(el).map((p) => p.value);
    expect(values.slice(0, 2)).toEqual(['entity 50%', 'red']);
  });
});

describe('design panel Border colour', () => {
  async function field(target: string, moduleEntity: string, moduleType = 'text'): Promise<El | undefined> {
    const el = document.createElement('mc-design-panel') as El;
    Object.assign(el, { design: {}, onChange: () => {}, target, moduleEntity, moduleType });
    document.body.appendChild(el);
    await el.updateComplete;
    [...el.shadowRoot.querySelectorAll<HTMLButtonElement>('.sector-btn')].find((b) => b.textContent!.includes('Borders & outlines'))!.click();
    await el.updateComplete;
    return [...el.shadowRoot.querySelectorAll<El>('mc-box-field')].find((f) => f.baseName === 'border_color');
  }
  it('offers the entity colour on a module with an entity', async () => {
    expect((await field('module', 'light.x'))?.entity).toBe(true);
  });
  it('not without an entity', async () => {
    expect((await field('module', ''))?.entity).toBe(false);
  });
});
