import { describe, it, expect } from 'vitest';
import { LitElement, html } from 'lit';
import { lazyChunk, trackHost, untrackHost } from '../src/utils/lazy-chunk';
import { magicCardStyles } from '../src/css/css';
import * as controls from '../src/modules/lazy/controls-chunk';
import * as extras from '../src/modules/lazy/extras-chunk';

const text = (group: unknown): string => {
  if (Array.isArray(group)) return group.map(text).join('\n');
  const g = group as { cssText?: string } | undefined;
  return g?.cssText ?? '';
};

describe('rules only one chunk renders', () => {
  const plain = text(magicCardStyles);

  it('the controls chunk carries the slider, spinbox, gauge and light rules', () => {
    const own = text((controls as { styles?: unknown }).styles);
    for (const sel of ['.mc-tile-slider-bar', '.mc-spinbox-value', '.mc-gauge-name', '.mc-light-effect-select', '.mc-light-color-input']) {
      expect(own.includes(sel), sel).toBe(true);
      expect(new RegExp(`(^|[^\\w-])${sel.replace('.', '\\.')}(?![\\w-])`).test(plain), sel).toBe(false);
    }
  });

  it('the modules-extra chunk carries the clock, weather, video, camera, graphs and image fallback rules', () => {
    const own = text((extras as { styles?: unknown }).styles);
    for (const sel of ['.mc-clock-time', '.mc-weather-condition', '.mc-video-bg-placeholder', '.mc-camera-fallback', '.mc-graphs-empty', '.mc-image-fallback']) {
      expect(own.includes(sel), sel).toBe(true);
      expect(new RegExp(`(^|[^\\w-])${sel.replace('.', '\\.')}(?![\\w-])`).test(plain), sel).toBe(false);
    }
  });

  it('a rule shared by the plain sheet and a chunk stays in the plain sheet', () => {
    expect(plain.includes('.mc-module-wrapper')).toBe(true);
    expect(plain.includes('ha-card')).toBe(true);
  });

  it('a rule that must keep its place after a plain rule of equal weight stays in the plain sheet', () => {
    expect(plain.includes('.mc-spinbox-btn:disabled')).toBe(true);
    expect(plain.includes('.mc-light-toggle:focus-visible')).toBe(true);
  });

  it('the light placeholder rules, which reserve the box before the chunk arrives, stay in the plain sheet', () => {
    expect(plain.includes('.mc-light--compact')).toBe(true);
  });

  it('the chunk sheets hold no rule of the plain sheet', () => {
    const own = text((controls as { styles?: unknown }).styles) + text((extras as { styles?: unknown }).styles);
    expect(own.includes(':host')).toBe(false);
    expect(own.includes('.mc-card-content')).toBe(false);
  });
});

describe('the chunk sheets reach a card before its views render', () => {
  class Host extends LitElement {
    render() {
      return html`<div></div>`;
    }
    connectedCallback() {
      super.connectedCallback();
      trackHost(this);
    }
    disconnectedCallback() {
      untrackHost(this);
      super.disconnectedCallback();
    }
  }
  customElements.define('mc-css-owned-host', Host);

  it.each([
    ['controls', controls, '.mc-tile-slider-bar'],
    ['modules-extra', extras, '.mc-clock-time'],
  ] as const)('the %s sheet is on the card when its whenReady callback runs', async (name, mod, sel) => {
    const card = document.body.appendChild(new Host());
    await card.updateComplete;
    const root = card.renderRoot as ShadowRoot;
    const seen: boolean[] = [];
    const chunk = lazyChunk(name, async () => mod as never);
    chunk.whenReady(() => {
      seen.push([...root.adoptedStyleSheets].some((sheet) => [...sheet.cssRules].some((r) => r.cssText.includes(sel))));
    });
    expect(await chunk.load()).toBe(true);
    expect(seen).toEqual([true]);
    card.remove();
  });
});
