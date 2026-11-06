import { describe, it, expect } from 'vitest';
import '../src/index';
import '../src/editor/editor-entry';
import { applyPreset, newAnimation } from '../src/anim-studio/entries';
import { resolveAnimations } from '../src/anim-studio/resolve';
import { ringStroke } from '../src/card/ring-stroke';
import type { DesignConfig, HomeAssistant, MagicCardConfig } from '../src/types';
import type { AnimationList } from '../src/editor/components/animation-list';

// the animation rules ship with the `anim` chunk, which Core adopts into the live cards
import { styles as animChunkStyles } from '../src/anim-studio/anim-chunk';

const cardCss = () => {
  const ctor = customElements.get('magic-card') as unknown as { elementStyles: Array<{ cssText: string }> };
  return [...new Set([...ctor.elementStyles, ...animChunkStyles])].map((s) => s.cssText).join('\n').replace(/\s+/g, ' ');
};

describe('tap trigger', () => {
  it('Tap ripple and Press start on tap, once', () => {
    expect(newAnimation('tap-ripple', 'a')).toMatchObject({ trigger: 'tap', iterations: 1 });
    expect(newAnimation('press', 'a')).toMatchObject({ trigger: 'tap', iterations: 1 });
    expect(applyPreset(newAnimation('spin', 'a'), 'tap-ripple').trigger).toBe('tap');
    // other presets keep the entry's Play
    expect(applyPreset({ ...newAnimation('spin', 'a'), trigger: 'state' }, 'float').trigger).toBe('state');
  });

  it('element animations on tap go to their own list, forced to a finite repeat', () => {
    const r = resolveAnimations({ animations: [{ id: 'a', preset: 'float' }, { id: 'b', preset: 'press', trigger: 'tap', iterations: 'infinite' }] } as DesignConfig)!;
    expect(r.tap).toBe(true);
    expect(r.style).toContain('--mc-anim-m: mc-anim-float 3s');
    expect(r.style).toContain('--mc-anim-t: mc-anim-press 0.3s ease-out 0s 1 normal');
    expect(r.targets).toBe('module');
  });

  it('a tap particle layer is marked, the ripple sits at the pointer', () => {
    const r = resolveAnimations({ animations: [{ id: 'a', preset: 'tap-ripple', trigger: 'tap' }] } as DesignConfig)!;
    expect(r.fx[0]).toMatchObject({ preset: 'tap-ripple', tap: true });
    expect(r.tap).toBeFalsy();
    const css = cardCss();
    expect(css).toContain('.mc-anim-fx[data-tap]:not([data-tapped]), .mc-anim-ring[data-tap]:not([data-tapped]) { display: none');
    expect(css).toMatch(/\[data-mc-tap\]\[data-mc-tapped\] \{ animation: var\(--mc-anim-m, none\), var\(--mc-anim-t\)/);
    expect(css).toContain('left: var(--mc-tap-x, 50%)');
  });

  it('a tap restarts the layers and the element under the pointer', async () => {
    const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: MagicCardConfig): void; hass?: HomeAssistant; updateComplete: Promise<boolean> };
    el.setConfig({
      type: 'custom:magic-card',
      rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'x', design: { animations: [
        { id: 'a', preset: 'tap-ripple', trigger: 'tap' }, { id: 'b', preset: 'press', trigger: 'tap' },
      ] } }] }] }],
    } as MagicCardConfig);
    el.hass = { states: {}, language: 'en', themes: { themes: {} } } as unknown as HomeAssistant;
    document.body.appendChild(el);
    await el.updateComplete;
    const w = el.shadowRoot!.querySelector('.mc-module-wrapper') as HTMLElement;
    expect(w.hasAttribute('data-mc-tap')).toBe(true);
    const layer = w.querySelector('.mc-anim-fx') as HTMLElement;
    expect(layer.hasAttribute('data-tap')).toBe(true);
    w.querySelector('.mc-text, div')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, clientX: 30, clientY: 12 }));
    expect(layer.hasAttribute('data-tapped')).toBe(true);
    expect(layer.style.getPropertyValue('--mc-tap-x')).toMatch(/px$/);
    expect(w.hasAttribute('data-mc-tapped')).toBe(true);
  });

  it('the editor offers On tap', async () => {
    const el = document.createElement('mc-animation-list') as AnimationList;
    el.animations = [newAnimation('spin', 'a')];
    el.requireTriggerEntity = true;
    document.body.appendChild(el);
    await el.updateComplete;
    const opts = [...el.shadowRoot!.querySelectorAll<HTMLOptionElement>('select[id$="-play"] option')];
    expect(opts.map((o) => [o.value, o.disabled])).toEqual([['always', false], ['entity_on', true], ['state', true], ['tap', false]]);
  });
});

describe('ring presets (border snake, power flow dots, marching ants)', () => {
  it('render a ring along the outline, in the entry colour, width from the intensity', () => {
    const r = resolveAnimations({ animations: [{ id: 'a', preset: 'border-snake', color: '#e91e63', intensity: 4, strength: 50, direction: 'reverse' }] } as DesignConfig)!;
    const ring = r.fx[0].ring!;
    expect(ring).toMatchObject({ mode: 'animated', animation: 'snake', color: '#e91e63', width: 4, position: 'inside', opacity: 0.5 });
    expect(ringStroke(ring, false).animation).toBe('mc-ring-run 3s linear 0s infinite reverse');
  });

  it('default colour: the animation colour of the wrapper', () => {
    const r = resolveAnimations({ animations: [{ id: 'a', preset: 'power-flow' }] } as DesignConfig)!;
    expect(r.fx[0].ring).toMatchObject({ animation: 'dots', color: 'var(--mc-anim-c)' });
    const ants = resolveAnimations({ animations: [{ id: 'a', preset: 'marching-ants' }] } as DesignConfig)!;
    expect(ringStroke(ants.fx[0].ring!, false).dasharray).toBe('1.5 1.5');
  });

  it('the card renders an mc-ring for them, hidden for reduced motion', async () => {
    const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: MagicCardConfig): void; hass?: HomeAssistant; updateComplete: Promise<boolean> };
    el.setConfig({ type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'x', design: { animations: [{ id: 'a', preset: 'border-snake' }] } }] }] }] } as MagicCardConfig);
    el.hass = { states: {}, language: 'en', themes: { themes: {} } } as unknown as HomeAssistant;
    document.body.appendChild(el);
    await el.updateComplete;
    const ring = el.shadowRoot!.querySelector('.mc-module-wrapper > mc-ring.mc-anim-ring')!;
    expect(ring.getAttribute('data-fx')).toBe('border-snake');
    const css = cardCss();
    const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(block).toContain('.mc-anim-ring { display: none');
  });

  it('an On tap ring hides again after its lap (data-tapped removed on animationend)', async () => {
    const el = document.createElement('magic-card') as HTMLElement & { setConfig(c: MagicCardConfig): void; hass?: HomeAssistant; updateComplete: Promise<boolean> };
    el.setConfig({ type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'x', design: { animations: [{ id: 'a', preset: 'border-snake', trigger: 'tap' }] } }] }] }] } as MagicCardConfig);
    el.hass = { states: {}, language: 'en', themes: { themes: {} } } as unknown as HomeAssistant;
    document.body.appendChild(el);
    await el.updateComplete;
    const w = el.shadowRoot!.querySelector('.mc-module-wrapper') as HTMLElement;
    Object.defineProperty(w, 'offsetWidth', { value: 100 });
    Object.defineProperty(w, 'offsetHeight', { value: 40 });
    const ring = w.querySelector('mc-ring.mc-anim-ring') as HTMLElement & { measure(): void; updateComplete: Promise<boolean> };
    ring.measure();
    await ring.updateComplete;
    w.querySelector('.mc-text, div')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, clientX: 5, clientY: 5 }));
    expect(ring.hasAttribute('data-tapped')).toBe(true);
    const path = [...ring.shadowRoot!.querySelectorAll('path')].pop()!;
    path.dispatchEvent(new Event('animationend', { bubbles: true }));
    expect(ring.hasAttribute('data-tapped')).toBe(false);
  });
});
