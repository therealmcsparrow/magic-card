import { describe, it, expect, afterEach } from 'vitest';
import '../src/index';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';
import { magicCardStyles } from '../src/css/css';
import { tabsStyles } from '../src/modules/layout/tabs-styles';
import { tabLook } from '../src/modules/layout/tabs-look';
import { designToStyle, hoverRule } from '../src/utils/css-utils';

/*
 * Regression (CEO report): the tabs module drew an indicator line under the active tab by itself, the Design > Border
 * section drew around the tabs box, and borders of the tab states must reach the tab buttons only.
 * Suspected: src/css/css.ts (.mc-tab-button.active border-bottom-color, underline border widths), src/utils/css-utils.ts
 * (designToStyle / hoverRule with `tabs`), src/card/magic-card.ts (metadata.tabBar), tabs-styles.ts.
 */
afterEach(() => {
  document.body.innerHTML = '';
});

const flat = (s: unknown): string => [s].flat(Infinity).map((c) => (c as { cssText?: string }).cssText ?? '').join('');
const rulesOf = (css: string) => [...css.replace(/\s+/g, ' ').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), decl: m[2].trim() }));
const card = rulesOf(flat(magicCardStyles));
const tabsSheet = rulesOf(tabsStyles.cssText);

const tabsModule = (design: Record<string, unknown> | undefined, style = 'default') => ({
  id: 't', type: 'tabs', tab_style: style, ...(design ? { design } : {}),
  tabs: [{ label: 'One', modules: [{ type: 'text', text: 'first' }] }, { label: 'Two', modules: [{ type: 'text', text: 'second' }] }],
});

describe('no indicator of its own on the active tab', () => {
  it('the card sheet draws no border on the active tab button (no accent colour in a border of .active)', () => {
    const bad = card.filter((r) => /\.mc-tab-button\.active/.test(r.sel) && /border[a-z-]*:[^;]*(--mc-primary|--mc-accent)/.test(r.decl));
    expect(bad, bad.map((r) => `${r.sel}{${r.decl}}`).join('\n')).toEqual([]);
  });
  it('no rule of the card sheet gives a tab button a visible bottom line in any style', () => {
    const lines = card.filter(
      (r) => /\.mc-tab-button(?![-\w])/.test(r.sel) && !/:hover|:focus/.test(r.sel) && /border-bottom(-color)?\s*:\s*[^;]*(var\(--mc-(primary|border|accent)|#|rgb)/.test(r.decl),
    );
    expect(lines, lines.map((r) => `${r.sel}{${r.decl}}`).join('\n')).toEqual([]);
  });
  for (const style of ['default', 'pills', 'underline'] as const) {
    it(`tabLook without tab_active keys has no active-state variable or token (${style})`, () => {
      const look = tabLook({ tab_color: '#111' }, 0, style);
      expect(Object.keys(look.vars).filter((k) => k.startsWith('--mc-ta-'))).toEqual([]);
      expect(look.tokens.filter((t) => t.startsWith('a-'))).toEqual([]);
    });
    it(`a tabs module with no tab_active keys renders no active-state token (${style})`, async () => {
      const c = await mountCard(cardConfig([tabsModule({ tab_color: '#111' }, style)]), makeHass({}));
      const bar = c.shadowRoot!.querySelector('.mc-tabs')!;
      expect((bar.getAttribute('data-mc-tab') ?? '').split(' ').filter((t) => t.startsWith('a-'))).toEqual([]);
    });
  }
  it('the tabs sheet draws a border on the active tab only through a token the user sets (a-*)', () => {
    const own = tabsSheet.filter((r) => /\.mc-tab-button\.active/.test(r.sel) && /border/.test(r.decl));
    for (const r of own) expect(r.sel, r.sel).toMatch(/data-mc-tab~='a-[a-z-]+'/);
  });
});

describe('tab and tab-state borders reach the tab buttons only', () => {
  const STATES: Array<[string, string]> = [['', 'tab'], ['h-', 'hover'], ['a-', 'active'], ['d-', 'disabled']];
  for (const [prefix, name] of STATES) {
    for (const token of prefix ? ['border', 'bw', 'bs', 'radius'] : ['border', 'radius']) {
      it(`${name}: the ${prefix}${token} rule targets .mc-tab-button, never the bar or the tabs box`, () => {
        const rs = tabsSheet.filter((r) => r.sel.includes(`~='${prefix}${token}'`));
        expect(rs.length, `${prefix}${token} has a rule`).toBeGreaterThan(0);
        for (const r of rs) {
          for (const sel of r.sel.split(',')) expect(sel, sel).toMatch(/\.mc-tab-button/);
        }
      });
    }
  }
  it('the tab border keys become variables of the tabs element, no property of the box', async () => {
    const c = await mountCard(
      cardConfig([tabsModule({ tab_border_width: '2px', tab_border_style: 'solid', tab_border_color: 'red', tab_active: { tab_border_color: 'blue' } })]),
      makeHass({}),
    );
    const wrapper = c.shadowRoot!.querySelector('.mc-module-wrapper')!.getAttribute('style') ?? '';
    expect(wrapper).not.toMatch(/border/);
    const bar = c.shadowRoot!.querySelector('.mc-tabs')!;
    expect(bar.getAttribute('style')).toContain('--mc-tt-bw:2px');
    expect(bar.getAttribute('style')).toContain('--mc-ta-bc:blue');
  });
});

describe('Design > Border on a tabs module styles the tab buttons, not the tabs box', () => {
  const border = {
    border_width: '3px', border_style: 'dashed', border_color: 'blue',
    border_top: '1px solid red', border_right: '1px solid red', border_bottom: '1px solid red', border_left: '1px solid red', border: '1px solid red',
  } as never;
  it('designToStyle for a tabs module leaves every border key off the wrapper', () => {
    const wrapper = designToStyle({ ...(border as object), padding: 8 } as never, undefined, false, true);
    expect(wrapper).toContain('padding: 8px');
    expect(wrapper).not.toMatch(/border-(width|style|color|top|right|bottom|left)|(^|;\s*)border:/);
  });
  it('another module keeps its border on the wrapper', () => {
    expect(designToStyle(border)).toContain('border-width: 3px');
  });
  it('the rendered wrapper has no border and the tab bar carries the width, style and colour for the buttons', async () => {
    const c = await mountCard(cardConfig([tabsModule({ border_width: '3px', border_style: 'dashed', border_color: 'blue' })]), makeHass({}));
    const wrapper = c.shadowRoot!.querySelector('.mc-module-wrapper')!.getAttribute('style') ?? '';
    expect(wrapper).not.toMatch(/border/);
    const bar = c.shadowRoot!.querySelector('.mc-tabs')!;
    const carried = `${bar.getAttribute('style') ?? ''};${bar.querySelector('.mc-tabs-header')!.getAttribute('style') ?? ''}`;
    expect(carried).toContain('3px');
    expect(carried).toContain('dashed');
    expect(carried).toContain('blue');
  });
  it('a tab_border key still wins over the Design border on the buttons', () => {
    expect(tabLook({ tab_border_color: 'red' }).vars['--mc-tt-bc']).toBe('red');
  });
  it('the Hover design border goes to the buttons too, not the wrapper', () => {
    const rule = hoverRule('m', { border_color: 'blue', border_width: '2px' } as never, { tabs: true });
    expect(rule).not.toMatch(/\[data-mc-hover="m"\]:hover \{[^}]*border/);
    expect(rule).toContain('.mc-tabs-header');
    expect(rule).toContain('blue');
  });
  it('border radius and shadow stay with the box', () => {
    const wrapper = designToStyle({ border_radius: '12px', box_shadow: '0 0 4px red' } as never, undefined, false, true);
    expect(wrapper).toContain('border-radius: 12px');
    expect(wrapper).toContain('box-shadow');
  });
});
