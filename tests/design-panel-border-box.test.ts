import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/editor/editor-entry';

/*
 * CEO request: the Border section of the Design panel edits width, colour and style as one 4-side box each, like
 * padding and margin (mc-box-field with "Same on all sides"), for every module. The tab border fields already do.
 * Suspected: src/utils/css-properties.ts (borders sector: type 'unit' / 'select' / 'color' -> 'sides'),
 * src/editor/components/design-panel.ts (case 'sides').
 */
type Panel = HTMLElement & {
  design: Record<string, unknown>;
  moduleType: string;
  updateComplete: Promise<boolean>;
  onChange: (u: Record<string, unknown>) => void;
  _activeView: string;
  _openSectors: Set<string>;
};
type Box = HTMLElement & { shorthand: boolean; baseName: string; cell: string; options: Array<{ value: string }>; onChange: (u: Record<string, unknown>) => void; updateComplete: Promise<unknown> };

afterEach(() => {
  document.body.innerHTML = '';
});

async function mount(design: Record<string, unknown>, moduleType: string) {
  const onChange = vi.fn();
  const el = document.createElement('mc-design-panel') as Panel;
  el.design = design;
  el.moduleType = moduleType;
  el.onChange = onChange;
  document.body.appendChild(el);
  await el.updateComplete;
  el._openSectors = new Set(['borders']);
  await el.updateComplete;
  for (const b of el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.subgroup-btn')) if (b.getAttribute('aria-expanded') === 'false') b.click();
  await el.updateComplete;
  return { el, onChange };
}
const boxes = (el: Panel) => [...el.shadowRoot!.querySelectorAll<Box>('mc-box-field')];
const box = (el: Panel, key: string) => boxes(el).find((b) => b.baseName === key);

const KEYS: Array<[string, string]> = [['border_width', 'length'], ['border_colour', 'color'], ['border_style', 'style']].map(([k, c]) => [k === 'border_colour' ? 'border_color' : k, c]);

for (const type of ['text', 'button', 'tabs']) {
  describe(`Design > Border on a ${type} module`, () => {
    for (const [key, cell] of KEYS) {
      it(`${key} is one mc-box-field in shorthand mode with a ${cell} cell`, async () => {
        const { el } = await mount({}, type);
        const b = box(el, key);
        expect(b, `mc-box-field for ${key}`).toBeDefined();
        expect(b!.shorthand).toBe(true);
        expect(b!.cell).toBe(cell);
      });
      it(`${key} has no separate single-value field next to it`, async () => {
        const { el } = await mount({}, type);
        const old = el.shadowRoot!.querySelectorAll(`mc-unit-field[data-key="${key}"], mc-color-picker[data-key="${key}"], select[data-key="${key}"], select#dp-${key}`);
        expect(old.length).toBe(0);
      });
    }
    it('the style box offers the border style words', async () => {
      const { el } = await mount({}, type);
      const words = (box(el, 'border_style')?.options ?? []).map((o) => o.value);
      expect(words).toEqual(expect.arrayContaining(['solid', 'dashed', 'dotted']));
    });
    it('the box shows the value the design already holds (one to four values)', async () => {
      const { el } = await mount({ border_width: '1px 2px', border_color: 'red blue', border_style: 'solid dashed' }, type);
      await el.updateComplete;
      expect((box(el, 'border_width') as unknown as { value: string }).value).toBe('1px 2px');
      expect((box(el, 'border_color') as unknown as { value: string }).value).toBe('red blue');
      expect((box(el, 'border_style') as unknown as { value: string }).value).toBe('solid dashed');
    });
    for (const [key, sample] of [['border_width', '2px 4px'], ['border_color', 'red'], ['border_style', 'dashed solid']] as const) {
      it(`a ${key} edit in the box writes ${key} as a shorthand value`, async () => {
        const { el, onChange } = await mount({}, type);
        box(el, key)!.onChange({ [key]: sample });
        const written = onChange.mock.calls.map((c) => c[0] as Record<string, unknown>);
        expect(written.some((u) => u[key] === sample), JSON.stringify(written)).toBe(true);
      });
    }
    it('clearing the box removes the key', async () => {
      const { el, onChange } = await mount({ border_width: '2px' }, type);
      box(el, 'border_width')!.onChange({ border_width: undefined });
      const written = onChange.mock.calls.map((c) => c[0] as Record<string, unknown>);
      expect(written.some((u) => 'border_width' in u && (u.border_width === undefined || u.border_width === ''))).toBe(true);
    });
  });
}
