import { describe, it, expect, afterEach } from 'vitest';
import { render } from 'lit';
import '../src/editor/components/box-field';
import type { BoxField } from '../src/editor/components/box-field';
import { renderBoxField } from '../src/utils/form-utils';

async function mount(design: Record<string, unknown>, baseName: BoxField['baseName'] = 'padding'): Promise<{ el: BoxField; calls: Record<string, unknown>[] }> {
  const calls: Record<string, unknown>[] = [];
  const el = document.createElement('mc-box-field') as BoxField;
  el.baseName = baseName;
  el.design = design;
  el.onChange = (updates) => calls.push(updates);
  document.body.appendChild(el);
  await settle(el);
  return { el, calls };
}

const uf = (el: BoxField, s: string) => el.shadowRoot!.querySelector(`mc-unit-field[data-side="${s}"]`) as HTMLElement & { updateComplete: Promise<unknown> };
const side = (el: BoxField, s: string) => uf(el, s).shadowRoot!.getElementById(`side-${s}`) as HTMLInputElement;
const SIDE_OF: Record<string, string> = { Top: 'top', Right: 'right', Bottom: 'bottom', Left: 'left', 'Top left': 'top', 'Top right': 'right', 'Bottom right': 'bottom', 'Bottom left': 'left' };
const unitSelect = (el: BoxField, label: string) => uf(el, SIDE_OF[label]).shadowRoot!.querySelector(`select[aria-label="${label} unit"]`) as HTMLSelectElement;

/** The unit marked selected (happy-dom's select.value is unreliable with Lit's ?selected options). */
const unitOf = (el: BoxField, label: string) =>
  [...unitSelect(el, label).options].find((o) => o.hasAttribute('selected'))?.value;

async function settle(el: BoxField): Promise<void> {
  await el.updateComplete;
  for (const f of el.shadowRoot!.querySelectorAll('mc-unit-field')) await (f as unknown as { updateComplete: Promise<unknown> }).updateComplete;
}

function changeUnit(el: BoxField, label: string, unit: string): void {
  const select = unitSelect(el, label);
  select.value = unit;
  select.dispatchEvent(new Event('change'));
}

/** Type into a side (no write yet) and, unless `commit` is false, commit it (change). */
function type(el: BoxField, s: string, value: string, commit = true): void {
  const input = side(el, s);
  input.value = value;
  input.dispatchEvent(new Event('input'));
  if (commit) input.dispatchEvent(new Event('change'));
}

describe('mc-box-field per-side units', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a 2x2 grid of value + unit compounds and no shared unit select', async () => {
    const { el } = await mount({ padding_top: '8px', padding_right: '1rem' });
    expect(el.shadowRoot!.querySelectorAll('.box-grid .box-side mc-unit-field[compact]')).toHaveLength(4);
    expect(side(el, 'top').type).toBe('number');
    expect(el.shadowRoot!.querySelector('.box-foot select')).toBeNull();
    expect(side(el, 'top').value).toBe('8');
    expect(unitOf(el, 'Top')).toBe('px');
    expect(side(el, 'right').value).toBe('1');
    expect(unitOf(el, 'Right')).toBe('rem');
  });

  it('a unit change only rewrites that side', async () => {
    const { el, calls } = await mount({ padding_top: '1em', padding_right: '8px' });
    changeUnit(el, 'Right', '%');
    expect(calls).toEqual([{ padding: undefined, padding_right: '8%' }]);
  });

  it('a unit change on an empty side writes nothing, and the next typed number uses it', async () => {
    const { el, calls } = await mount({ padding_top: '4px' });
    changeUnit(el, 'Left', 'rem');
    expect(calls).toHaveLength(0);
    await settle(el);
    type(el, 'left', '2');
    expect(calls).toEqual([{ padding: undefined, padding_left: '2rem' }]);
  });

  it('typing writes nothing until the side is committed', async () => {
    const { el, calls } = await mount({});
    type(el, 'top', '1', false);
    type(el, 'top', '12', false);
    expect(calls).toHaveLength(0);
    side(el, 'top').dispatchEvent(new Event('change'));
    expect(calls).toEqual([{ padding: undefined, padding_top: '12px' }]);
  });

  it('keeps unitless values; non-numeric ones are Custom text', async () => {
    const { el, calls } = await mount({ padding_top: '0', padding_left: 'auto' });
    expect(side(el, 'top').value).toBe('0');
    expect(side(el, 'left').type).toBe('text');
    expect(side(el, 'left').value).toBe('auto');
    expect(unitOf(el, 'Left')).toBe('custom');
    changeUnit(el, 'Bottom', 'custom');
    await settle(el);
    expect(side(el, 'bottom').type).toBe('text');
    type(el, 'bottom', 'var(--gap)');
    expect(calls).toEqual([{ padding: undefined, padding_bottom: 'var(--gap)' }]);
  });

  it('reads a mixed-unit shorthand and keeps untouched sides when editing one', async () => {
    const { el, calls } = await mount({ padding: '8px 1rem' });
    expect(side(el, 'bottom').value).toBe('8');
    expect(unitOf(el, 'Left')).toBe('rem');
    changeUnit(el, 'Top', 'em');
    expect(calls).toEqual([{ padding: undefined, padding_top: '8em', padding_right: '1rem', padding_bottom: '8px', padding_left: '1rem' }]);
  });

  it('"Same on all sides" copies value and unit to every side', async () => {
    const { el, calls } = await mount({ padding_top: '2rem', padding_right: '8px' });
    const link = el.shadowRoot!.querySelector('.box-foot .btn') as HTMLButtonElement;
    expect(link.getAttribute('aria-pressed')).toBe('false');
    link.click();
    await settle(el);
    expect(link.getAttribute('aria-pressed')).toBe('true');
    expect(calls).toEqual([{ padding: undefined, padding_top: '2rem', padding_right: '2rem', padding_bottom: '2rem', padding_left: '2rem' }]);
    changeUnit(el, 'Bottom', 'px');
    expect(calls[1]).toEqual({ padding: undefined, padding_top: '2px', padding_right: '2px', padding_bottom: '2px', padding_left: '2px' });
  });

  it('labels border-radius corners', async () => {
    const { el } = await mount({ border_radius: '12px 0' }, 'border_radius');
    expect(unitOf(el, 'Top left')).toBe('px');
    expect(side(el, 'right').value).toBe('0');
  });
});

describe('renderBoxField shorthand round-trip', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  async function field(value: string | undefined) {
    const out: Array<string | undefined> = [];
    const host = document.createElement('div');
    document.body.appendChild(host);
    render(renderBoxField('Padding', value, (v) => out.push(v), 'padding'), host);
    const el = host.querySelector('mc-box-field') as BoxField;
    await settle(el);
    return { el, out };
  }

  it('names the group with the field label', async () => {
    const { el } = await field('8px');
    const group = el.shadowRoot!.querySelector('[role="group"]')!;
    const labelId = group.getAttribute('aria-labelledby')!;
    expect(el.shadowRoot!.getElementById(labelId)!.textContent).toBe('Padding');
  });

  it('writes mixed units back as a shorthand', async () => {
    const { el, out } = await field('8px 1rem 8px 1rem');
    changeUnit(el, 'Right', '%');
    expect(out).toEqual(['8px 1% 8px 1rem']);
  });

  it('round-trips "0 10%" and leaves untouched sides as they were', async () => {
    const { el, out } = await field('0 10%');
    expect(side(el, 'top').value).toBe('0');
    expect(unitOf(el, 'Right')).toBe('%');
    type(el, 'bottom', '4');
    expect(out).toEqual(['0 10% 4px']);
  });

  it('clearing every side removes the value', async () => {
    const { el, out } = await field('6px');
    const link = el.shadowRoot!.querySelector('.box-foot .btn') as HTMLButtonElement;
    link.click();
    await settle(el);
    type(el, 'top', '');
    expect(out[out.length - 1]).toBeUndefined();
  });
});

describe('mc-box-field after Undo and Redo', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shows each side again when Undo reverts Same on all sides', async () => {
    const before = { top: '12px', right: '4px', bottom: '6px', left: '8px' };
    const { el } = await mount(before, '');
    (el.shadowRoot!.querySelector('.box-foot button') as HTMLButtonElement).click();
    el.design = { top: '12px', right: '12px', bottom: '12px', left: '12px' };
    await settle(el);
    expect(side(el, 'right').value).toBe('12');
    el.design = before;
    await settle(el);
    expect(side(el, 'top').value).toBe('12');
    expect(side(el, 'right').value).toBe('4');
    expect(side(el, 'bottom').value).toBe('6');
    expect(side(el, 'left').value).toBe('8');
    expect((el.shadowRoot!.querySelector('.box-foot button') as HTMLElement).getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps the sides linked while the config keeps them equal', async () => {
    const { el } = await mount({ top: '1px', right: '2px', bottom: '3px', left: '4px' }, '');
    (el.shadowRoot!.querySelector('.box-foot button') as HTMLButtonElement).click();
    el.design = { top: '1px', right: '1px', bottom: '1px', left: '1px' };
    await settle(el);
    el.design = { top: '2px', right: '2px', bottom: '2px', left: '2px' };
    await settle(el);
    expect((el.shadowRoot!.querySelector('.box-foot button') as HTMLElement).getAttribute('aria-pressed')).toBe('true');
  });

  it('names the four sides as one group with the field label', async () => {
    const { el } = await mount({}, '');
    el.label = 'Offsets';
    await settle(el);
    const box = el.shadowRoot!.querySelector('.box') as HTMLElement;
    expect(box.getAttribute('role')).toBe('group');
    const label = el.shadowRoot!.getElementById(box.getAttribute('aria-labelledby')!);
    expect(label?.textContent?.trim()).toBe('Offsets');
  });
});
