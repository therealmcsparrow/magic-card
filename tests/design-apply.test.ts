import { describe, it, expect } from 'vitest';
import '../src/index';
import '../src/editor/components/design-panel';
import { designToStyle, resolveConditionalDesign } from '../src/utils/css-utils';
import { mergeTemplateWithOverrides } from '../src/services/template-merge';
import type { MagicCardConfig, DesignConfig } from '../src/types';
import { controlsViewStyles } from '../src/css/controls-styles';
import { extrasViewStyles } from '../src/css/extras-styles';

// ── Cause 1: per-side box keys (written by mc-box-field) must reach the CSS ──

describe('designToStyle per-side longhands', () => {
  it('emits padding / margin / border-radius longhands', () => {
    const style = designToStyle({
      border_top_left_radius: '25px',
      border_bottom_right_radius: '4px',
      padding_top: '30px',
      margin_left: '5px',
    } as DesignConfig);
    expect(style).toContain('border-top-left-radius: 25px');
    expect(style).toContain('border-bottom-right-radius: 4px');
    expect(style).toContain('padding-top: 30px');
    expect(style).toContain('margin-left: 5px');
  });

  it('emits longhands after their shorthand so the longhand wins', () => {
    const style = designToStyle({ padding: '10px', padding_left: '2px' } as DesignConfig);
    expect(style.indexOf('padding: 10px')).toBeLessThan(style.indexOf('padding-left: 2px'));
  });

  it('applies longhands from a matching conditional rule', () => {
    const hass = { states: { 'light.a': { state: 'on', attributes: {} } } } as never;
    const design = {
      padding_top: '1px',
      conditional: [{ id: 'r', name: 'R', mode: 'every', conditions: [{ id: 'c', type: 'state', entity: 'light.a', state: 'on' }],
        design: { padding_top: '9px', border_top_right_radius: '7px' } }],
    } as unknown as DesignConfig;
    const style = designToStyle(resolveConditionalDesign(design, hass));
    expect(style).toContain('padding-top: 9px');
    expect(style).toContain('border-top-right-radius: 7px');
  });

  it('emits nothing for an empty design', () => {
    expect(designToStyle({} as DesignConfig)).toBe('');
    expect(designToStyle(undefined)).toBe('');
  });
});

describe('template merge with per-side box keys', () => {
  const tpl = { type: 'custom:magic-card', rows: [{ id: 'r', layout: '1', columns: [{ id: 'c', modules: [
    { id: 'm', type: 'button', design: { padding: '10px', border_radius: '8px' } },
  ] }] }] } as unknown as MagicCardConfig;

  it('a not-synced box field brings its local longhands and drops the template shorthand', () => {
    const local = { type: 'custom:magic-card', template: 't', rows: [{ id: 'r', layout: '1', columns: [{ id: 'c', modules: [
      { id: 'm', type: 'button', not_synced: ['design.border_radius'],
        design: { border_top_left_radius: '25px', border_top_right_radius: '0px' } },
    ] }] }] } as unknown as MagicCardConfig;
    const design = mergeTemplateWithOverrides(tpl, local).rows[0].columns[0].modules[0].design as Record<string, unknown>;
    expect(design.border_top_left_radius).toBe('25px');
    expect(design.border_top_right_radius).toBe('0px');
    expect(design.border_radius).toBeUndefined();
    // synced box fields still come from the template
    expect(design.padding).toBe('10px');
  });
});

describe('design panel and per-side box keys', () => {
  async function mountPanel(design: Record<string, unknown>, hasTemplate = false) {
    const calls: Record<string, unknown>[] = [];
    const el = document.createElement('mc-design-panel') as HTMLElement & {
      design: unknown; hasTemplate: boolean; onChange: (u: Record<string, unknown>) => void; updateComplete: Promise<unknown>;
    };
    el.design = design;
    el.hasTemplate = hasTemplate;
    el.onChange = (u) => calls.push(u);
    document.body.appendChild(el);
    await el.updateComplete;
    return { el, calls };
  }
  const sectorChip = (el: HTMLElement, name: string) => {
    const btn = [...el.shadowRoot!.querySelectorAll('.sector-btn')].find((b) => b.querySelector('.nm')?.textContent === name);
    return btn?.querySelector('.chip.is-count')?.textContent?.trim();
  };

  it('counts a per-side border radius as one set property', async () => {
    const { el } = await mountPanel({ border_top_left_radius: '25px', border_bottom_left_radius: '3px' });
    expect(sectorChip(el, 'Borders & outlines')).toBe('1 set');
  });

  it('counts per-side padding and margin', async () => {
    const { el } = await mountPanel({ padding_top: '30px', margin_left: '5px' });
    expect(sectorChip(el, 'Spacing & box model')).toBe('2 set');
  });

  it('marks the box field not synced when a side is edited on a template-linked card', async () => {
    const { el, calls } = await mountPanel({}, true);
    el.shadowRoot!.querySelector<HTMLButtonElement>('.sector-btn')!.click();
    await el.updateComplete;
    const box = el.shadowRoot!.querySelector('mc-box-field') as HTMLElement & { onChange: (u: Record<string, unknown>) => void };
    box.onChange({ padding: undefined, padding_top: '30px' });
    expect(calls.at(-1)).toMatchObject({ padding_top: '30px', _markNotSynced: 'padding' });
  });
});

// ── Cause 2: a template-linked card re-merges local overrides on every setConfig ──

describe('template-linked card re-merges on setConfig', () => {
  const template = { type: 'custom:magic-card', rows: [{ id: 'r', layout: '1', columns: [{ id: 'c', modules: [
    { id: 'm', type: 'text', text: 'T', design: { padding: '4px' } },
  ] }] }] };
  const local = (color?: string) => ({
    type: 'custom:magic-card', template: 'room-card', rows: [{ id: 'r', layout: '1', columns: [{ id: 'c', modules: [
      { id: 'm', type: 'text', text: 'T', ...(color ? { not_synced: ['design.color'], design: { padding: '4px', color } } : { design: { padding: '4px' } }) },
    ] }] }],
  }) as unknown as MagicCardConfig;
  const flush = () => new Promise((r) => setTimeout(r, 0));

  it('renders a local override added after the template was fetched, without refetching', async () => {
    const getTemplates: unknown[] = [];
    const hass = {
      states: {}, language: 'en',
      callWS: async () => ({}),
      connection: {
        subscribeMessage: async (cb: (m: unknown) => void, msg: { type: string; name: string }) => {
          getTemplates.push(msg);
          queueMicrotask(() => cb({ action: 'saved', name: msg.name, template: { config: template } }));
          return () => undefined;
        },
      },
    };
    const el = document.createElement('magic-card') as HTMLElement & {
      setConfig(c: MagicCardConfig): void; hass: unknown; updateComplete: Promise<unknown>;
    };
    el.hass = hass;
    el.setConfig(local());
    document.body.appendChild(el);
    await el.updateComplete; await flush(); await el.updateComplete;
    const wrapper = () => el.shadowRoot!.querySelector('.mc-module-wrapper')!.getAttribute('style') || '';
    expect(wrapper()).toContain('padding: 4px');
    expect(getTemplates).toHaveLength(1);

    el.setConfig(local('rgb(255, 0, 0)'));
    await el.updateComplete; await flush(); await el.updateComplete;
    expect(wrapper()).toContain('color: rgb(255, 0, 0)');
    expect(getTemplates).toHaveLength(1);
    el.remove();
  });
});

// ── Cause 3: design `color` reaches module text that sets its own colour ──

describe('design color reaches module text', () => {
  it('designToStyle exposes the colour as --mc-design-color (and nothing when unset)', () => {
    const style = designToStyle({ color: 'rgb(255, 0, 0)' } as DesignConfig);
    expect(style).toContain('color: rgb(255, 0, 0)');
    expect(style).toContain('--mc-design-color: rgb(255, 0, 0)');
    expect(designToStyle({ padding: '1px' } as DesignConfig)).not.toContain('--mc-design-color');
  });

  // happy-dom does not resolve var() in computed styles, so assert the card stylesheet instead
  // (computed colours are checked end-to-end in the harness).
  // the rules of the module views live in the sheets of their chunks; the card sheet holds the rest
  const cardCss = () => {
    const ctor = customElements.get('magic-card') as unknown as { elementStyles: Array<{ cssText: string }> };
    return [...ctor.elementStyles.map((s) => s.cssText), controlsViewStyles.cssText, extrasViewStyles.cssText].join('\n');
  };
  const colorOf = (selector: string) => {
    const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // a selector can have a block in the card sheet (layout) and one in a chunk sheet (colour): the first block with a colour
    for (const m of cardCss().matchAll(new RegExp(`(?:^|[\\s}])${esc}\\s*\\{([^}]*)\\}`, 'g'))) {
      const c = m[1].match(/(?:^|[;\s])color:\s*([^;]+);/)?.[1].trim();
      if (c) return c;
    }
    return undefined;
  };

  it.each([
    '.mc-button', '.mc-button-inner', '.mc-button-inner--default', '.mc-button-inner--outline', '.mc-button-inner--flat',
    '.mc-info-name', '.mc-info-state', '.mc-info-secondary', '.mc-bar-value', '.mc-slider-value', '.mc-spinbox-btn',
    '.mc-dropdown select', '.mc-tab-button', '.mc-clock-date', '.mc-weather-condition', '.mc-forecast-label', '.mc-graphs-label',
  ])('%s takes the design colour, keeping its default', (selector) => {
    expect(colorOf(selector)).toMatch(/^var\(--mc-design-color, .+\)$/);
  });
});

// ── Cause 4: design radius / background reach module surfaces that draw their own rounded box ──

describe('design radius and background reach module surfaces', () => {
  it('exposes per-corner radius vars from the shorthand, with corner longhands winning', () => {
    const style = designToStyle({ border_radius: '8px 4px', border_bottom_left_radius: '1px' } as DesignConfig);
    expect(style).toContain('--mc-design-radius-tl: 8px');
    expect(style).toContain('--mc-design-radius-tr: 4px');
    expect(style).toContain('--mc-design-radius-br: 8px');
    expect(style).toContain('--mc-design-radius-bl: 1px');
  });

  it('keeps calc()/var() values and elliptical radii intact', () => {
    const style = designToStyle({ border_radius: 'calc(2px + 1px) var(--r, 3px) / 5px' } as DesignConfig);
    expect(style).toContain('--mc-design-radius-tl: calc(2px + 1px) 5px');
    expect(style).toContain('--mc-design-radius-tr: var(--r, 3px) 5px');
  });

  it('only sets the corners that are set', () => {
    const style = designToStyle({ border_top_left_radius: '25px' } as DesignConfig);
    expect(style).toContain('--mc-design-radius-tl: 25px');
    expect(style).not.toContain('--mc-design-radius-tr');
  });

  it('exposes the background as --mc-design-bg (background_color wins over background)', () => {
    expect(designToStyle({ background: 'blue' } as DesignConfig)).toContain('--mc-design-bg: blue');
    expect(designToStyle({ background: 'blue', background_color: 'red' } as DesignConfig)).toContain('--mc-design-bg: red');
  });

  it('emits no surface vars without radius or background', () => {
    const style = designToStyle({ padding: '1px', color: 'red' } as DesignConfig);
    expect(style).not.toContain('--mc-design-radius');
    expect(style).not.toContain('--mc-design-bg');
  });

  const cardCss = () => {
    const ctor = customElements.get('magic-card') as unknown as { elementStyles: Array<{ cssText: string }> };
    return ctor.elementStyles.map((s) => s.cssText).join('\n');
  };
  const ruleOf = (selector: string) => {
    const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cardCss().match(new RegExp(`(?:^|[\\s}])${esc}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  };

  it.each([
    '.mc-button', '.mc-button-inner', '.mc-dropdown select', '.mc-slider-container > .mc-tile-slider',
    '.mc-bar-horizontal .mc-bar-track', '.mc-bar-vertical .mc-bar-track', '.mc-image', '.mc-camera',
  ])('%s rounds its corners with the design radius', (selector) => {
    const rule = ruleOf(selector);
    for (const [corner, v] of [['top-left', 'tl'], ['top-right', 'tr'], ['bottom-right', 'br'], ['bottom-left', 'bl']]) {
      expect(rule).toMatch(new RegExp(`border-${corner}-radius:\\s*var\\(--mc-design-radius-${v}, [^;]+\\);`));
    }
  });

  it.each(['.mc-button-inner--default', '.mc-button-inner--outline', '.mc-button-inner--flat', '.mc-dropdown select'])(
    '%s fills with the design background', (selector) => {
      expect(ruleOf(selector)).toMatch(/background:\s*var\(--mc-design-bg, [^;]+\);/);
    },
  );

  it('does not leak surface vars from a row/column or a parent module into nested modules', () => {
    const rule = ruleOf('.mc-module-wrapper,\n  :not(.mc-module-wrapper) > .mc-module');
    expect(rule).toContain('--mc-design-radius-tl: initial');
    expect(rule).toContain('--mc-design-bg: initial');
  });
});
