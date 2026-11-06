import { describe, it, expect, afterEach } from 'vitest';
import '../src/index';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';
import { magicCardStyles } from '../src/css/css';
import { tabsStyles } from '../src/modules/layout/tabs-styles';
import { tabLook } from '../src/modules/layout/tabs-look';
import { designToStyle, hoverRule } from '../src/utils/css-utils';

/*
 * The tabs module draws no indicator of its own on the active tab, the Design > Border section styles the tab buttons
 * instead of the tabs box, and borders of the tab states reach the tab buttons only.
 * Covers src/css/css.ts, src/utils/css-utils.ts (designToStyle / hoverRule with `tabs`), src/card/magic-card.ts
 * (metadata.tabBar) and tabs-styles.ts.
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
  it('designToStyle for a tabs module leaves the border width, style and colour off the wrapper', () => {
    const wrapper = designToStyle({ border_width: '3px', border_style: 'dashed', border_color: 'blue', padding: 8 } as never, undefined, false, true);
    expect(wrapper).toContain('padding: 8px');
    expect(wrapper).not.toMatch(/border-(width|style|color)/);
  });
  it('the border shorthands stay on the wrapper, in the base and in the hover, and never reach the buttons', () => {
    const wrapper = designToStyle(border, undefined, false, true);
    expect(wrapper).toContain('border-top: 1px solid red');
    expect(wrapper).toMatch(/(^|;\s*)border: 1px solid red/);
    const rule = hoverRule('m', { border: '1px solid red', border_left: '2px solid blue' } as never, { tabs: true });
    expect(rule).toMatch(/\[data-mc-hover="m"\]:hover \{[^}]*border: 1px solid red/);
    expect(rule).not.toContain('.mc-tab-button');
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
  it('the hover border of the buttons is rebuilt from the allow-listed width, style and colour', () => {
    const rule = hoverRule('m', { border_width: '2px 0', border_style: 'dashed', border_color: 'red blue' } as never, { tabs: true });
    expect(rule).toContain('border-width: 2px 0px !important');
    expect(rule).toContain('border-style: dashed !important');
    expect(rule).toContain('border-color: red blue !important');
  });
  it('a hover border written as declaration text adds nothing to the button rule', () => {
    const rule = hoverRule('m', { border_color: 'red; background:url(https://x)', border_style: 'solid}', border_width: '2px /*' } as never, { tabs: true });
    expect(rule).not.toMatch(/url\(|background|\/\*/);
    expect(rule).not.toContain('.mc-tab-button');
  });
  it('a bad style or colour in the hover is dropped one by one', () => {
    const rule = hoverRule('m', { border_width: '2px', border_style: 'wavy', border_color: 'red; x:y' } as never, { tabs: true });
    expect(rule).toContain('border-width: 2px !important');
    expect(rule).not.toMatch(/wavy|x:y/);
  });
  it('hostile Design border values on a tabs module reach no variable and no wrapper declaration', () => {
    const look = tabLook({ border_color: 'red; background:url(//x)', border_style: 'solid}', border_width: '2px;color:red' });
    expect(Object.keys(look.vars).filter((k) => /^--mc-tt-(bc|bs|bw)$/.test(k))).toEqual([]);
    const wrapper = designToStyle({ border_color: 'red; background:url(//x)', border_style: 'solid}' } as never, undefined, false, true);
    expect(wrapper).not.toMatch(/border-(color|style)/);
  });
  it('border radius and shadow stay with the box', () => {
    const wrapper = designToStyle({ border_radius: '12px', box_shadow: '0 0 4px red' } as never, undefined, false, true);
    expect(wrapper).toContain('border-radius: 12px');
    expect(wrapper).toContain('box-shadow');
  });
});

describe('an active tab without tab_active fields looks like the other tabs', () => {
  it('no rule of the card sheet sets the label colour, background or weight of the active tab button', () => {
    const own = card.filter((r) => /\.mc-tab-button\.active/.test(r.sel) && /(^|;|\s)(color|background|font-weight)\s*:/.test(r.decl));
    expect(own, own.map((r) => `${r.sel}{${r.decl}}`).join('\n')).toEqual([]);
  });
  it('a gradient colour paints every tab label alike: no solid label rule for the active pill', () => {
    const solid = tabsSheet.filter((r) => /pills/.test(r.sel) && /\.active/.test(r.sel) && /text-fill-color/.test(r.decl) && !/data-mc-tab~='a-/.test(r.sel));
    expect(solid, solid.map((r) => r.sel).join('\n')).toEqual([]);
  });
  it('Underline with a font size gives the active tab no weight of its own', () => {
    const weight = tabsSheet.filter((r) => /\.mc-tab-button\.active/.test(r.sel) && /font-weight/.test(r.decl) && !/data-mc-tab~='a-/.test(r.sel));
    expect(weight, weight.map((r) => r.sel).join('\n')).toEqual([]);
  });
  it('Pills has no fill rule for the active tab', () => {
    const fill = card.filter((r) => /data-style='pills'\] \.mc-tab-button\.active/.test(r.sel));
    expect(fill).toEqual([]);
  });
});

describe('the bar line (tab_bar_border_*)', () => {
  it('is the card sheet default on .mc-tabs-header in every style, untouched without a bar key', () => {
    const line = card.filter((r) => /(^|\*\/ )(\.mc-tabs\[data-style='underline'\] )?\.mc-tabs-header$/.test(r.sel) && /border-bottom/.test(r.decl));
    expect(line.map((r) => r.decl).join(' ')).toContain('1px solid var(--mc-border)');
    expect(line.map((r) => r.decl).join(' ')).toContain('2px solid var(--mc-border)');
    expect(tabLook({}).tokens).not.toContain('bar-border');
  });
  it('tab_bar_border_style becomes --mc-tb-bs on the bar border token, one to four words', () => {
    const look = tabLook({ tab_bar_border_style: 'none' });
    expect(look.vars['--mc-tb-bs']).toBe('none');
    expect(look.tokens).toContain('bar-border');
    expect(tabLook({ tab_bar_border_style: 'solid none none none' }).vars['--mc-tb-bs']).toBe('solid none none none');
    expect(tabLook({ tab_bar_border_style: 'wavy' }).vars['--mc-tb-bs']).toBeUndefined();
    expect(tabLook({ tab_bar_border_style: 'solid '.repeat(40) }).vars['--mc-tb-bs']).toBeUndefined();
  });
  it('tab_bar_border_style refuses text that is more than style words', () => {
    for (const bad of ['solid;}', 'solid url(x)', 'solid; background:red', 'solid /* x */', '}solid{']) {
      expect(tabLook({ tab_bar_border_style: bad }).vars['--mc-tb-bs'], bad).toBeUndefined();
    }
  });
  it('width 0 and style none are values of the bar rule, which targets the bar only', () => {
    expect(tabLook({ tab_bar_border_width: '0' }).vars['--mc-tb-bw']).toBe('0px');
    const rules = tabsSheet.filter((r) => r.sel.includes("~='bar-border'"));
    expect(rules.length).toBeGreaterThan(0);
    for (const r of rules) {
      expect(r.sel).toMatch(/\.mc-tabs-header$/);
      expect(r.decl).not.toMatch(/\.mc-tab-button/);
    }
    expect(rules.map((r) => r.decl).join(' ')).toContain('border-style:var(--mc-tb-bs,solid)');
  });
  it('width, colour and style per side reach the tabs element as variables for the bar', async () => {
    const c = await mountCard(
      cardConfig([tabsModule({ tab_bar_border_width: '0 0 2px 0', tab_bar_border_style: 'none none dashed none', tab_bar_border_color: 'red' }, 'underline')]),
      makeHass({}),
    );
    const bar = c.shadowRoot!.querySelector('.mc-tabs')!;
    const style = bar.getAttribute('style') ?? '';
    expect(style).toContain('--mc-tb-bw:0px 0px 2px 0px');
    expect(style).toContain('--mc-tb-bs:none none dashed none');
    expect(style).toContain('--mc-tb-bc:red');
    expect(c.shadowRoot!.querySelector('.mc-module-wrapper')!.getAttribute('style') ?? '').not.toMatch(/border/);
  });
  it('a nested tabs module does not inherit the bar variables', () => {
    expect(tabsStyles.cssText).toContain('--mc-tb-bs');
    expect(tabsStyles.cssText.match(/--mc-tb-bs:\s*initial|--mc-tb-bs[^;}]*initial/)).not.toBeNull();
  });
});
