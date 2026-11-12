// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from 'lit';
import '../src/index';
import { ModuleRegistry } from '../src/modules/module-registry';
import { CARD_SYNC_KEYS, cardInstanceKeys, mergeTemplateWithOverrides } from '../src/services/template-merge';
import { designNumbersToCss, hoverRule, resolveBorderLength, splitDeclarations } from '../src/utils/css-utils';
import { isRunnableAction } from '../src/utils/actions';
import { fontCandidates } from '../src/utils/google-fonts';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';
import type { CardModule, DesignConfig, MagicCardConfig } from '../src/types';
import { editorFor } from './helpers/module-editor';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('card hover in templates', () => {
  it('hover is a synced card key, never copied as instance data', () => {
    expect(CARD_SYNC_KEYS).toContain('hover');
    const local = { type: 'custom:magic-card', rows: [], hover: { color: 'red' }, grid_options: { columns: 6 } } as unknown as MagicCardConfig;
    expect(cardInstanceKeys(local)).toEqual({ grid_options: { columns: 6 } });
  });

  it('the template hover wins unless the card overrides it', () => {
    const template = { type: 'custom:magic-card', rows: [], hover: { color: 'blue' } } as unknown as MagicCardConfig;
    const local = { type: 'custom:magic-card', template: 't', rows: [], hover: { color: 'red' } } as unknown as MagicCardConfig;
    expect(mergeTemplateWithOverrides(template, local).hover).toEqual({ color: 'blue' });
    const overridden = { ...local, not_synced: ['hover'] } as MagicCardConfig;
    expect(mergeTemplateWithOverrides(template, overridden).hover).toEqual({ color: 'red' });
  });
});

describe('hover on shaped elements and border length', () => {
  it('re-applies the shape overrides after the hover declarations', () => {
    const rule = hoverRule('m', { border_color: 'red', box_shadow: '0 2px 4px black', padding: '20px' } as DesignConfig, {
      shape: { design: { shape: 'hexagon', padding: '4px' } as DesignConfig },
    });
    const main = rule.slice(0, rule.indexOf('}'));
    expect(main.lastIndexOf('border-color: transparent !important')).toBeGreaterThan(main.indexOf('border-color: red'));
    expect(main.lastIndexOf('box-shadow: none !important')).toBeGreaterThan(main.indexOf('box-shadow: 0 2px 4px black'));
    expect(main).toContain('padding-top: max(20px, var(--mc-shape-it, 0px)) !important');
  });

  it('maps the hover border colour to the shape stroke and the shadow to the drop-shadow wrapper', () => {
    const rule = hoverRule('m', { border_color: 'red', box_shadow: '0 2px 4px black' } as DesignConfig, {
      shape: { design: { shape: 'hexagon' } as DesignConfig },
    });
    expect(rule).toContain('[data-mc-hover="m"]:hover > mc-shape { --mc-shape-stroke: red; }');
    expect(rule).toContain('.mc-shape-shadow:has(> [data-mc-hover="m"]:hover) { filter: drop-shadow(0px 2px 4px black) !important; }');
    const card = hoverRule('card', { border_color: 'red' } as DesignConfig, { shape: { card: true } });
    expect(card).toContain('[data-mc-hover="card"]:hover ~ mc-shape { --mc-shape-stroke: red; }');
  });

  it('keeps the border length overlay: real border transparent, hover colour on the lines', () => {
    const base = { border_length: '40%', border_width: '2px', border_style: 'solid', border_color: 'blue' } as DesignConfig;
    const rule = hoverRule('m', { border_color: 'red' } as DesignConfig, { borderLength: resolveBorderLength(base) });
    const main = rule.slice(0, rule.indexOf('}'));
    expect(main.lastIndexOf('border-color: transparent !important')).toBeGreaterThan(main.indexOf('border-color: red'));
    expect(rule).toContain('[data-mc-hover="m"]:hover > .mc-border-fx > i { border-color: red !important; }');
  });

  it('the shaped card renders the stroke colour through a variable', async () => {
    const card = await mountCard(cardConfig([{ id: 't', type: 'text', text: 'x', design: { shape: 'hexagon', border_width: '2px', border_style: 'solid', border_color: 'blue', hover: { border_color: 'red' } } }]), makeHass({}));
    const css = [...(card.shadowRoot!.querySelector('style[data-mc-hover-styles]') as HTMLStyleElement).sheet!.cssRules].map((r) => r.cssText).join(' ');
    expect(css).toContain('> mc-shape { --mc-shape-stroke: red; }');
    expect(css).toContain('border-color: transparent !important');
  });

  it('strips braces and at-signs from hover css', () => {
    const rule = hoverRule('m', { css: 'color: red; } @import url(x); body { color: blue' } as DesignConfig);
    expect(rule.match(/[{}]/g)).toEqual(['{', '}']);
    expect(rule).not.toContain('@');
  });
});

describe('design numbers', () => {
  it('a bare border_length number is a percentage', () => {
    expect((designNumbersToCss({ border_length: 40 } as unknown as DesignConfig) as Record<string, unknown>).border_length).toBe('40%');
  });
});

describe('info module toggles', () => {
  const hass = makeHass({ 'sensor.t': { state: '42', attributes: { friendly_name: 'Temp' } } });
  const switchState = (cfg: Record<string, unknown>, label: string) => {
    const el = document.createElement('div');
    render(editorFor('info').renderGeneralTab({ id: 'm', type: 'info', ...cfg } as CardModule, hass, () => {}), el);
    return el.querySelector(`[role="switch"][aria-label="${label}"]`)!.getAttribute('aria-checked');
  };

  it('both on when neither is set', () => {
    expect(switchState({}, 'Show name')).toBe('true');
    expect(switchState({}, 'Show state')).toBe('true');
  });

  it('one set: the missing other is off (legacy configs)', () => {
    expect(switchState({ show_name: true }, 'Show state')).toBe('false');
    expect(switchState({ show_state: true }, 'Show name')).toBe('false');
    expect(switchState({ show_state: false }, 'Show name')).toBe('false');
  });

  it('a toggle writes both keys', () => {
    const writes: Record<string, unknown>[] = [];
    const el = document.createElement('div');
    render(editorFor('info').renderGeneralTab({ id: 'm', type: 'info' } as CardModule, hass, (c) => writes.push(c as Record<string, unknown>)), el);
    (el.querySelector('[role="switch"][aria-label="Show name"]') as HTMLElement).click();
    expect(writes.at(-1)).toMatchObject({ show_name: false, show_state: true });
  });
});

describe('row actions accessibility', () => {
  async function row(rowActions: Record<string, unknown> | undefined, modules: unknown[]) {
    const config = { type: 'custom:magic-card', rows: [{ id: 'r', layout: '1', actions: rowActions, columns: [{ id: 'c', modules }] }] } as unknown as MagicCardConfig;
    const hass = makeHass({ 'light.a': { state: 'on' }, 'input_number.n': { state: '5', attributes: { min: 0, max: 10 } } });
    const card = await mountCard(config, hass);
    await card.updateComplete;
    return card.shadowRoot!.querySelector('.mc-row') as HTMLElement;
  }
  const act = { tap_action: { action: 'toggle', entity: 'light.a' } };

  it('no role or aria-label on the row; focusable without interactive children', async () => {
    const r = await row(act, [{ id: 't', type: 'text', text: 'x' }]);
    expect(r.hasAttribute('role')).toBe(false);
    expect(r.hasAttribute('aria-label')).toBe(false);
    expect(r.getAttribute('tabindex')).toBe('0');
  });

  it('not focusable when it holds interactive children', async () => {
    const r = await row(act, [{ id: 's', type: 'slider', entity: 'input_number.n' }]);
    expect(r.hasAttribute('role')).toBe(false);
    expect(r.hasAttribute('tabindex')).toBe(false);
    const r2 = await row(act, [{ id: 'b', type: 'button', entity: 'light.a', label: 'A', actions: { tap_action: { action: 'toggle' } } }]);
    expect(r2.hasAttribute('tabindex')).toBe(false);
  });

  it('a row action that cannot run makes no actionable row', async () => {
    const r = await row({ tap_action: { action: 'toggle' } }, [{ id: 't', type: 'text', text: 'x' }]);
    expect(r.hasAttribute('tabindex')).toBe(false);
    expect(r.hasAttribute('data-mc-row-actions')).toBe(false);
  });
});

describe('runnable actions', () => {
  it('needs the action fields', () => {
    expect(isRunnableAction(undefined)).toBe(false);
    expect(isRunnableAction({ action: 'none' })).toBe(false);
    expect(isRunnableAction({ action: 'navigate' })).toBe(false);
    expect(isRunnableAction({ action: 'navigate', navigation_path: '/a' })).toBe(true);
    expect(isRunnableAction({ action: 'toggle' })).toBe(false);
    expect(isRunnableAction({ action: 'toggle', entity: 'light.a' })).toBe(true);
    expect(isRunnableAction({ action: 'toggle' }, 'light.a')).toBe(true);
    expect(isRunnableAction({ action: 'toggle', use_module_entity: false }, 'light.a')).toBe(false);
    expect(isRunnableAction({ action: 'more-info' })).toBe(false);
    expect(isRunnableAction({ action: 'perform-action' })).toBe(false);
    expect(isRunnableAction({ action: 'perform-action', service: 'light.turn_on' })).toBe(true);
    expect(isRunnableAction({ action: 'url' })).toBe(false);
    expect(isRunnableAction({ action: 'url', url_path: 'https://x' })).toBe(true);
    expect(isRunnableAction({ action: 'popup' })).toBe(false);
    expect(isRunnableAction({ action: 'popup', hash: 'k' })).toBe(true);
    expect(isRunnableAction({ action: 'assist' })).toBe(true);
    expect(isRunnableAction({ action: 'close-popup' })).toBe(true);
  });
});

describe('google fonts loading', () => {
  it('never loads Roboto (Home Assistant ships it)', () => {
    expect(fontCandidates('Roboto, sans-serif')).toEqual([]);
  });
});

describe('pop-up card css', () => {
  it('splits declarations outside parentheses and quotes', () => {
    expect(splitDeclarations('background: url("a;b"); color: red;padding:4px')).toEqual(['background: url("a;b")', 'color: red', 'padding:4px']);
  });

  it('only background and shadow declarations move to the surface', async () => {
    const config = {
      type: 'custom:magic-card',
      popup: { enabled: true, hash: 'k' },
      css: 'color: red;background-color: blue;letter-spacing:1px',
      rows: [{ id: 'r', layout: '1', columns: [{ id: 'c', modules: [{ id: 't', type: 'text', text: 'x' }] }] }],
    } as unknown as MagicCardConfig;
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    history.pushState(null, '', '#k');
    const card = await mountCard(config, makeHass({}));
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    for (let i = 0; i < 3; i++) await card.updateComplete;
    const surface = card.shadowRoot!.querySelector('.mc-popup-surface') as HTMLElement;
    expect(surface).toBeTruthy();
    const content = surface.querySelector('.mc-card-content')!.getAttribute('style') ?? '';
    expect(surface.getAttribute('style')).toContain('background-color: blue');
    expect(surface.getAttribute('style')).not.toContain('color: red');
    expect(content).toContain('color: red');
    expect(content).toContain('letter-spacing: 1px');
    expect(content).not.toContain('background-color');
    history.replaceState(null, '', location.pathname);
    vi.unstubAllGlobals();
  });
});
