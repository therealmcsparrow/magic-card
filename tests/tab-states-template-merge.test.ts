import { describe, it, expect } from 'vitest';
import { mergeTemplateWithOverrides } from '../src/services/template-merge';
import type { MagicCardConfig } from '../src/types';

const card = (mod: Record<string, unknown>) =>
  ({ type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [mod] }] }] }) as unknown as MagicCardConfig;
const design = (c: MagicCardConfig) => (c.rows[0].columns[0].modules[0] as { design?: Record<string, unknown> }).design;

const states = {
  tab_disabled_tabs: [1],
  tab_active: { tab_color: '#ff0000', tab_border_color: '#00aa00' },
  tab_disabled: { tab_opacity: 0.3 },
  hover: { tab_color: '#0000ff' },
};

describe('a template merge keeps the tab states', () => {
  it('keeps the template tab_active, tab_disabled and tab_disabled_tabs on a linked card', () => {
    const template = card({ id: 'm', type: 'tabs', tabs: [{ label: 'A', modules: [] }, { label: 'B', modules: [] }], design: states });
    const local = { ...card({ id: 'm', type: 'tabs' }), template: 'x' } as MagicCardConfig;
    expect(design(mergeTemplateWithOverrides(template, local))).toEqual(states);
  });

  it('a not-synced design on this card replaces the tab states key by key and leaves the template keys it does not set', () => {
    const template = card({ id: 'm', type: 'tabs', design: states });
    const local = {
      ...card({ id: 'm', type: 'tabs', not_synced: ['design'], design: { tab_active: { tab_color: '#123456' } } }),
      template: 'x',
    } as MagicCardConfig;
    const d = design(mergeTemplateWithOverrides(template, local)) as Record<string, unknown>;
    expect(d.tab_active).toEqual({ tab_color: '#123456' });
    expect(d.tab_disabled).toEqual(states.tab_disabled);
    expect(d.tab_disabled_tabs).toEqual([1]);
  });

  it('a rule with tab states in the template comes through unchanged', () => {
    const rule = { id: 'g', name: 'Guest', conditions: [], design: { tab_disabled_tabs: [0], tab_active: { tab_border_color: '#e8590c' } } };
    const template = card({ id: 'm', type: 'tabs', design: { ...states, conditional: [rule] } });
    const local = { ...card({ id: 'm', type: 'tabs' }), template: 'x' } as MagicCardConfig;
    expect((design(mergeTemplateWithOverrides(template, local)) as Record<string, unknown>).conditional).toEqual([rule]);
  });
});

describe('a template merge keeps a local Offsets edit', () => {
  for (const side of ['top', 'right', 'bottom', 'left']) {
    it(`an edit of ${side} marked as not synced from "top" survives`, () => {
      const template = card({ id: 'm', type: 'text', design: { top: '1px', right: '2px', bottom: '3px', left: '4px' } });
      const local = {
        ...card({ id: 'm', type: 'text', not_synced: ['design.top'], design: { top: '1px', right: '2px', bottom: '3px', left: '9px' } }),
        template: 'x',
      } as MagicCardConfig;
      expect(design(mergeTemplateWithOverrides(template, local))).toMatchObject({ left: '9px' });
    });
  }
});
