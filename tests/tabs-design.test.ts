import { describe, it, expect, afterEach } from 'vitest';
import '../src/index';
import '../src/editor/editor-entry';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';
import { TAB_KEYS, tabLook } from '../src/modules/layout/tabs-look';
import { tabsStyles } from '../src/modules/layout/tabs-styles';
import { CSS_SECTORS, DESIGN_GROUPS } from '../src/utils/css-properties';
import * as extras from '../src/modules/lazy/extras-chunk';
import plain from '../tools/plain-keys.json';
import { readFileSync } from 'node:fs';
import { copyDesign, pastedDesign, readDesignClipboard } from '../src/utils/design-clipboard';
import { mergeTemplateWithOverrides } from '../src/services/template-merge';
import type { DesignConfig, MagicCardConfig } from '../src/types';

afterEach(() => {
  document.body.innerHTML = '';
});

const ALL = [
  'tab_bar_background', 'tab_bar_border_width', 'tab_bar_border_style', 'tab_bar_border_color', 'tab_bar_padding', 'tab_bar_position', 'tab_align', 'tab_gap',
  'tab_color', 'tab_background', 'tab_border_width', 'tab_border_color', 'tab_opacity', 'tab_disabled_tabs',
  'tab_radius', 'tab_padding', 'tab_font_family', 'tab_font_size', 'tab_font_weight', 'tab_text_transform', 'tab_icon_position', 'tab_icon_size',
  'tab_animation', 'tab_border_style', 'tab_letter_spacing', 'tab_shadow', 'tab_icon_color', 'tab_animations', 'tab_icon_fx',
];

describe('tabLook', () => {
  it('lists the 29 tab keys', () => {
    expect([...TAB_KEYS].sort()).toEqual([...ALL].sort());
  });
  it('no keys, no output', () => {
    expect(tabLook(undefined)).toEqual({ vars: {}, tokens: [] });
    expect(tabLook({})).toEqual({ vars: {}, tokens: [] });
    expect(tabLook({ color: 'red', padding: '4px' })).toEqual({ vars: {}, tokens: [] });
  });
  it('default values (top, start, left, none) add no token', () => {
    const l = tabLook({ tab_bar_position: 'top', tab_align: 'start', tab_icon_position: 'left', tab_animation: 'none' });
    expect(l).toEqual({ vars: {}, tokens: [] });
  });
  it('valid keys become a custom property and a token', () => {
    const l = tabLook({
      tab_bar_background: '#112233', tab_gap: '6', tab_radius: '4px 8px', tab_font_weight: 600, tab_font_family: "Lato, 'Open Sans'",
      tab_text_transform: 'UPPERCASE', tab_font_size: '90%', tab_icon_size: '20px',
    });
    expect(l.vars['--mc-tb-bg']).toBe('#112233');
    expect(l.vars['--mc-tb-gap']).toBe('6px');
    expect(l.vars['--mc-tt-r']).toBe('4px 8px');
    expect(l.vars['--mc-tt-fw']).toBe('600');
    expect(l.vars['--mc-tt-ff']).toBe("Lato, 'Open Sans'");
    expect(l.vars['--mc-tt-tt']).toBe('uppercase');
    expect(l.vars['--mc-tt-fs']).toBe('90%');
    expect(l.vars['--mc-tt-is']).toBe('20px');
    expect(l.tokens).toEqual(expect.arrayContaining(['bar-bg', 'gap', 'radius', 'weight', 'family', 'transform', 'size', 'icon-size']));
  });
  it('keywords become tokens', () => {
    expect(tabLook({ tab_bar_position: 'bottom', tab_align: 'center', tab_icon_position: 'above', tab_animation: 'slide' }).tokens.sort()).toEqual(
      ['align-center', 'anim-slide', 'bottom', 'icon-above', 'icon-flex'],
    );
    expect(tabLook({ tab_icon_position: 'right' }).tokens.sort()).toEqual(['icon-flex', 'icon-right']);
    expect(tabLook({ tab_align: 'stretch' }).tokens).toEqual(['align-stretch']);
  });
  it('tokens come from code and never from the config text', () => {
    const l = tabLook({ tab_color: 'red', tab_align: 'center" onload="x' });
    expect(l.tokens).toEqual(['color']);
  });
  it('hostile and out of range values are dropped', () => {
    const bad = [
      'red;x:y', 'url(https://x)', '1e9px', '"', "'", '\\', 'var(--x)', 'expression(1)', '1px; color: red', '-4px', '9999999px', '5%', '',
      'calc(1px+2px)', 'x'.repeat(500), '{}', 12345678, NaN, null, {}, [],
    ];
    for (const key of ['tab_bar_border_width', 'tab_bar_padding', 'tab_gap', 'tab_border_width', 'tab_radius', 'tab_padding', 'tab_icon_size']) {
      for (const v of bad) {
        if ((key === 'tab_bar_padding' || key === 'tab_gap' || key === 'tab_radius' || key === 'tab_padding') && v === '5%') continue;
        expect(tabLook({ [key]: v }), `${key}=${String(v)}`).toEqual({ vars: {}, tokens: [] });
      }
    }
    for (const key of ['tab_bar_background', 'tab_bar_border_color', 'tab_color', 'tab_background', 'tab_border_color']) {
      for (const v of ['red;x:y', 'url(https://x)', 'red} a{b:c', '"', '\\', 'image-set(x)', 1, null, {}]) {
        expect(tabLook({ [key]: v }), `${key}=${String(v)}`).toEqual({ vars: {}, tokens: [] });
      }
    }
    for (const [key, v] of [
      ['tab_font_family', "a;b"], ['tab_font_family', "'a"], ['tab_font_family', 'a, url(x)'], ['tab_font_family', 'x'.repeat(200)],
      ['tab_font_size', '1e9px'], ['tab_font_size', 'var(--x)'], ['tab_font_weight', '650'], ['tab_font_weight', 'bolder'], ['tab_font_weight', 'bold;x'],
      ['tab_text_transform', 'full-width'], ['tab_bar_position', 'left'], ['tab_align', 'space-between'], ['tab_icon_position', 'x}'],
      ['tab_animation', 'spin'],
    ] as Array<[string, unknown]>) {
      expect(tabLook({ [key]: v }), `${key}=${String(v)}`).toEqual({ vars: {}, tokens: [] });
    }
  });
  it('a border width keeps a unit-less number as px and drops a percentage', () => {
    expect(tabLook({ tab_border_width: 2 }).vars['--mc-tt-bw']).toBe('2px');
    expect(tabLook({ tab_border_width: '50%' }).vars).toEqual({});
  });
  it('values go through only the allow-list characters', () => {
    const l = tabLook(Object.fromEntries(ALL.map((k) => [k, '!'])));
    expect(l).toEqual({ vars: {}, tokens: [] });
  });
});

describe('the Tab bar sector', () => {
  const sector = CSS_SECTORS.find((s) => s.id === 'tabs-bar')!;
  it('has the look keys the editor shows, all virtual, tabs only, hover only on the state fields', () => {
    const keys = sector.properties.map((p) => p.key);
    for (const k of keys) expect([...TAB_KEYS, 'tab_disabled_tabs'], k).toContain(k);
    expect(sector.properties.every((p) => p.virtual && (!p.hover || p.tabState))).toBe(true);
    expect(sector.modules).toEqual(['tabs']);
    expect(DESIGN_GROUPS.find((g) => g.id === 'style')!.entries).toContain('tabs-bar');
  });
  it('is in plain-keys design.css', () => {
    const css = plain.design.css as string[];
    for (const k of TAB_KEYS) expect(css, k).toContain(k);
  });
  it('shows for a tabs module only', async () => {
    const mount = async (moduleType: string) => {
      const el = document.createElement('mc-design-panel') as HTMLElement & { design: unknown; moduleType: string; updateComplete: Promise<boolean>; onChange: unknown };
      el.design = {};
      el.moduleType = moduleType;
      el.onChange = () => undefined;
      document.body.appendChild(el);
      await el.updateComplete;
      return el.shadowRoot!.querySelector('[aria-controls="sb-tabs-bar"]');
    };
    expect(await mount('tabs')).not.toBeNull();
    for (const t of ['button', 'text', 'vertical', '']) expect(await mount(t), t).toBeNull();
  });
  it('is offered in Default and in a conditional rule; the hover design shows its state fields only', async () => {
    type Panel = HTMLElement & { design: unknown; moduleType: string; updateComplete: Promise<boolean>; onChange: unknown; _activeView: string };
    const show = async (view: string) => {
      const el = document.createElement('mc-design-panel') as Panel;
      el.design = { conditional: [{ id: 'r1', conditions: [] }] };
      el.moduleType = 'tabs';
      el.onChange = () => undefined;
      document.body.appendChild(el);
      await el.updateComplete;
      el._activeView = view;
      await el.updateComplete;
      return el.shadowRoot!.querySelector('[aria-controls="sb-tabs-bar"]');
    };
    expect(await show('default')).not.toBeNull();
    expect(await show('r1')).not.toBeNull();
    expect(await show('__hover__')).not.toBeNull();
    expect(sector.properties.some((p) => p.baseOnly)).toBe(false);
  });
});

describe('the chunk styles', () => {
  it('extras-chunk exports a group that holds the weather, the tabs and the view sheets', () => {
    expect(Array.isArray(extras.styles)).toBe(true);
    expect((extras.styles as unknown[]).length).toBe(3);
    expect((extras.styles as unknown[])).toContain(tabsStyles);
  });
  it('the sheet stays inside the browser floor and is gated on a token', () => {
    const text = tabsStyles.cssText;
    expect(text).not.toMatch(/:is\(|:where\(|color-mix\(|\binset:|padding-inline|margin-inline|border-(start|end)-(start|end)-radius/);
    expect(text).toMatch(/@media \(prefers-reduced-motion:reduce\)\{[^}]*\.mc-tabs-content\{animation:none\}/);
    for (const rule of text.split('}')) {
      const sel = rule.split('{')[0];
      // the dimming of a disabled tab and the focus ring are the only rules without a token; they need a tab to match
      if (/\.mc-tabs/.test(sel) && !/@keyframes|@media/.test(sel) && !/aria-disabled='true'\]$|data-mc-force='disabled'\]:not\(\.active\)$|:focus-visible$|data-style=pills\]>\.mc-tabs-header>\.mc-tab-button\.active$/.test(sel)) expect(sel, sel).toMatch(/data-mc-tab/);
    }
    const src = readFileSync('src/modules/layout/tabs-styles.ts', 'utf8');
    expect(src).not.toMatch(/:focus-visible[^{]*,|,[^{]*:focus-visible/);
  });
});

describe('the tabs render', () => {
  const tabs = (extra: Record<string, unknown> = {}, design?: Record<string, unknown>) => cardConfig([{
    id: 't', type: 'tabs', ...extra, ...(design ? { design } : {}),
    tabs: [
      { label: 'One', icon: 'mdi:home', modules: [{ type: 'text', text: 'first' }] },
      { label: 'Two', modules: [{ type: 'text', text: 'second' }] },
    ],
  }]);
  const root = (c: HTMLElement) => c.shadowRoot!.querySelector<HTMLElement>('.mc-tabs')!;
  const order = (c: HTMLElement) => [...root(c).children].map((e) => e.className.split(' ')[0]);

  it('without tab_ keys: no token, no style, header before panel, for all three styles', async () => {
    for (const tab_style of [undefined, 'default', 'pills', 'underline']) {
      const card = await mountCard(tabs(tab_style ? { tab_style } : {}, { padding: '4px' }), makeHass({}));
      expect(root(card).hasAttribute('data-mc-tab')).toBe(false);
      expect(root(card).hasAttribute('style')).toBe(false);
      expect(order(card)).toEqual(['mc-tabs-header', 'mc-tabs-content']);
    }
  });
  it('valid keys set the token attribute and the custom properties', async () => {
    const card = await mountCard(tabs({}, { tab_color: '#abc', tab_gap: '8px', tab_animation: 'fade' }), makeHass({}));
    expect(root(card).getAttribute('data-mc-tab')!.split(' ').sort()).toEqual(['anim-fade', 'color', 'gap']);
    expect(root(card).style.getPropertyValue('--mc-tt-c')).toBe('#abc');
    expect(root(card).style.getPropertyValue('--mc-tb-gap')).toBe('8px');
  });
  it('a bottom bar is rendered after the panel, so focus order follows the visual order', async () => {
    const card = await mountCard(tabs({}, { tab_bar_position: 'bottom' }), makeHass({}));
    expect(order(card)).toEqual(['mc-tabs-content', 'mc-tabs-header']);
    const header = root(card).querySelector('.mc-tabs-header')!;
    expect(header.querySelectorAll('[role=tab]').length).toBe(2);
  });
  it('hostile values write nothing', async () => {
    const card = await mountCard(tabs({}, { tab_color: 'red;background:url(x)', tab_gap: '1e9px', tab_font_family: "'a", tab_align: 'x"y' }), makeHass({}));
    expect(root(card).hasAttribute('data-mc-tab')).toBe(false);
    expect(root(card).getAttribute('style') ?? '').not.toMatch(/url|1e9/);
  });
  it('switching a tab with an animation still shows the right panel', async () => {
    const card = await mountCard(tabs({}, { tab_animation: 'slide' }), makeHass({}));
    const second = card.shadowRoot!.querySelectorAll<HTMLElement>('[role=tab]')[1];
    second.click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('.mc-tabs-content')!.textContent!.trim()).toBe('second');
  });
  it('copy and paste of a design carry the tab keys, replace and merge', () => {
    const d = { tab_color: 'red', tab_animation: 'fade', tab_radius: '4px 8px', color: 'blue' } as unknown as DesignConfig;
    copyDesign(d);
    const clip = readDesignClipboard()!;
    expect(clip).toMatchObject(d);
    expect(pastedDesign({ tab_gap: '6px', tab_color: 'green' } as unknown as DesignConfig, clip, 'replace')).toEqual(d);
    const merged = pastedDesign({ tab_gap: '6px', tab_color: 'green' } as unknown as DesignConfig, clip, 'merge') as Record<string, unknown>;
    expect(merged).toMatchObject({ ...d, tab_gap: '6px' });
    expect(tabLook(merged).tokens).toEqual(expect.arrayContaining(['color', 'gap', 'radius', 'anim-fade']));
  });
  it('a linked card takes the tab keys from its template', () => {
    const tabsMod = { id: 'm1', type: 'tabs', tabs: [{ label: 'A', modules: [] }], design: { tab_color: 'red', tab_indicator_color: '#abc', tab_bar_position: 'bottom' } };
    const card = (extra: Record<string, unknown>) => ({ type: 'custom:magic-card', rows: [{ id: 'r1', columns: [{ id: 'c1', modules: [tabsMod] }] }], ...extra }) as unknown as MagicCardConfig;
    const merged = mergeTemplateWithOverrides(card({}), { ...card({ template: 'tpl' }), rows: [] } as MagicCardConfig);
    const mod = merged.rows![0].columns![0].modules![0] as unknown as { design: Record<string, unknown> };
    expect(mod.design).toEqual(tabsMod.design);
    expect(mod.design).not.toBe(tabsMod.design);
  });
  it('a nested tabs module takes nothing from the one around it', async () => {
    const card = await mountCard(cardConfig([{
      id: 'o', type: 'tabs', design: { tab_color: 'red', tab_border_width: 3, tab_animation: 'fade' },
      tabs: [{ label: 'Out', modules: [{ id: 'i', type: 'tabs', tabs: [{ label: 'In', modules: [] }] }] }],
    }]), makeHass({}));
    const all = card.shadowRoot!.querySelectorAll<HTMLElement>('.mc-tabs');
    expect(all.length).toBe(2);
    expect(all[1].hasAttribute('data-mc-tab')).toBe(false);
    expect(all[1].hasAttribute('style')).toBe(false);
    const text = tabsStyles.cssText;
    for (const rule of text.split('}')) {
      const sel = rule.split('{')[0];
      if (/-header|-tab-button|-content/.test(sel)) expect(sel, sel).not.toMatch(/\.mc-tabs\[[^\]]*\](\[[^\]]*\])* \.mc-/);
    }
    expect(text).toContain('.mc-tabs[data-mc-tab] .mc-tabs{--mc-tb-bw:initial');
  });
  it('a set font weight also applies to the active tab in underline', () => {
    expect(tabsStyles.cssText).not.toContain("[data-mc-tab~='weight']>.mc-tabs-header>.mc-tab-button.active{font-weight:700}");
  });
  it('the animation name alternates with the active tab and the panel is not rebuilt', async () => {
    expect(tabLook({ tab_animation: 'fade' }, 0).vars['--mc-tt-an']).toBe('mc-tabs-fade-0');
    expect(tabLook({ tab_animation: 'fade' }, 3).vars['--mc-tt-an']).toBe('mc-tabs-fade-1');
    expect(tabLook({ tab_animation: 'slide' }, 2).vars['--mc-tt-an']).toBe('mc-tabs-slide-0');
    expect(tabLook({}, 1).vars['--mc-tt-an']).toBeUndefined();
    expect(tabsStyles.cssText).toContain('@keyframes mc-tabs-slide-1');
    const card = await mountCard(tabs({}, { tab_animation: 'fade' }), makeHass({}));
    const panel = root(card).querySelector('.mc-tabs-content');
    expect(root(card).style.getPropertyValue('--mc-tt-an')).toBe('mc-tabs-fade-0');
    card.shadowRoot!.querySelectorAll<HTMLElement>('[role=tab]')[1].click();
    await card.updateComplete;
    expect(root(card).style.getPropertyValue('--mc-tt-an')).toBe('mc-tabs-fade-1');
    expect(root(card).querySelector('.mc-tabs-content')).toBe(panel);
  });
  it('the animation name changes on every switch, also between tabs of the same parity', async () => {
    const card = await mountCard(cardConfig([{
      id: 't3', type: 'tabs', design: { tab_animation: 'fade' },
      tabs: [0, 1, 2].map((n) => ({ label: `T${n}`, modules: [{ type: 'text', text: `t${n}` }] })),
    }]), makeHass({}));
    const name = () => root(card).style.getPropertyValue('--mc-tt-an');
    const go = async (i: number) => {
      card.shadowRoot!.querySelectorAll<HTMLElement>('[role=tab]')[i].click();
      await card.updateComplete;
    };
    const seen = [name()];
    await go(2);
    seen.push(name());
    await go(0);
    seen.push(name());
    expect(seen[1]).not.toBe(seen[0]);
    expect(seen[2]).not.toBe(seen[1]);
  });
});
