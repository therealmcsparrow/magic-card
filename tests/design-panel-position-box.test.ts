import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/editor/editor-entry';

/*
 * Design > Positioning & layout: Top, Right, Bottom and Left are one four-side box like Padding and
 * Margin (mc-box-field with "Same on all sides"), not four loose unit fields. The design keys stay
 * top / right / bottom / left (the card CSS reads them); no position_top style keys appear.
 * Covers src/utils/css-properties.ts (positioning sector) and src/editor/components/design-panel.ts.
 */
type Panel = HTMLElement & {
  design: Record<string, unknown>;
  moduleType: string;
  updateComplete: Promise<boolean>;
  onChange: (u: Record<string, unknown>) => void;
  _openSectors: Set<string>;
};
type Unit = HTMLElement & { value: string; updateComplete: Promise<unknown> };
type Box = HTMLElement & { updateComplete: Promise<unknown> };

afterEach(() => {
  document.body.innerHTML = '';
});

async function mount(design: Record<string, unknown>, moduleType = 'text') {
  const onChange = vi.fn();
  const el = document.createElement('mc-design-panel') as Panel;
  el.design = design;
  el.moduleType = moduleType;
  el.onChange = onChange;
  document.body.appendChild(el);
  await el.updateComplete;
  el._openSectors = new Set(['positioning']);
  await el.updateComplete;
  for (const b of el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.subgroup-btn')) if (b.getAttribute('aria-expanded') === 'false') b.click();
  await el.updateComplete;
  const b = box(el);
  if (b) {
    await b.updateComplete;
    for (const u of b.shadowRoot!.querySelectorAll<Unit>('mc-unit-field')) await u.updateComplete;
  }
  return { el, onChange };
}
const box = (el: Panel) => el.shadowRoot!.querySelector<Box>('mc-box-field');
const side = (el: Panel, s: string) => box(el)!.shadowRoot!.querySelector<Unit>(`mc-unit-field[data-side="${s}"]`)!;
const input = (el: Panel, s: string) => side(el, s).shadowRoot!.querySelector<HTMLInputElement>('input')!;
const written = (onChange: ReturnType<typeof vi.fn>) => onChange.mock.calls.map((c) => c[0] as Record<string, unknown>);

describe('Design > Position insets as a four-side box', () => {
  it('shows Top, Right, Bottom and Left as one mc-box-field with four side fields', async () => {
    const { el } = await mount({});
    expect(box(el), 'mc-box-field in the positioning sector').not.toBeNull();
    expect(box(el)!.shadowRoot!.querySelectorAll('.box-grid .box-side mc-unit-field')).toHaveLength(4);
  });

  it('has no loose Top / Right / Bottom / Left unit field next to the box', async () => {
    const { el } = await mount({});
    const loose = el.shadowRoot!.querySelectorAll('mc-unit-field[data-key="top"], mc-unit-field[data-key="right"], mc-unit-field[data-key="bottom"], mc-unit-field[data-key="left"]');
    expect(loose).toHaveLength(0);
  });

  it('has a "Same on all sides" toggle', async () => {
    const { el } = await mount({});
    const btn = box(el)!.shadowRoot!.querySelector('.box-foot button');
    expect(btn?.textContent).toContain('Same on all sides');
  });

  it('shows the values of the top / right / bottom / left keys in their sides', async () => {
    const { el } = await mount({ top: '10px', right: '2rem', bottom: '5%', left: '0' });
    expect(side(el, 'top').value).toBe('10px');
    expect(side(el, 'right').value).toBe('2rem');
    expect(side(el, 'bottom').value).toBe('5%');
    expect(side(el, 'left').value).toBe('0');
  });

  for (const s of ['top', 'right', 'bottom', 'left']) {
    it(`typing in the ${s} side writes the ${s} key and nothing else`, async () => {
      const { el, onChange } = await mount({});
      const i = input(el, s);
      i.value = '12';
      i.dispatchEvent(new Event('change'));
      const w = written(onChange);
      expect(w.length, 'one write').toBeGreaterThan(0);
      const merged = Object.assign({}, ...w);
      expect(merged[s]).toBe('12px');
      for (const other of ['top', 'right', 'bottom', 'left'].filter((k) => k !== s)) expect(merged[other]).toBeUndefined();
      expect(Object.keys(merged).filter((k) => k.startsWith('position_') || k.endsWith('_top'))).toEqual([]);
    });
  }

  it('"Same on all sides" writes one value to all four keys', async () => {
    const { el, onChange } = await mount({});
    box(el)!.shadowRoot!.querySelector<HTMLButtonElement>('.box-foot button')!.click();
    await box(el)!.updateComplete;
    const i = input(el, 'top');
    i.value = '8';
    i.dispatchEvent(new Event('change'));
    const merged = Object.assign({}, ...written(onChange));
    expect(merged).toMatchObject({ top: '8px', right: '8px', bottom: '8px', left: '8px' });
  });

  it('keeps the Position select and the Inset field', async () => {
    const { el } = await mount({});
    expect(el.shadowRoot!.querySelector('select#dp-position, select[data-key="position"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('mc-unit-field[data-key="inset"]')).not.toBeNull();
  });
});
