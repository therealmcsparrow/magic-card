import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/index';
import { ModuleRegistry } from '../src/modules/module-registry';
import { clockMinHeight } from '../src/modules/lazy-heights';
import { ImageView } from '../src/modules/content/image-view';
import { cssAspectRatio } from '../src/utils/aspect-ratio';
import type { CardModule } from '../src/types';
import { LAZY_FEATURES } from '../src/utils/lazy-features';

const stub = (config: Record<string, unknown>) => {
  const host = document.createElement('div');
  const lazy = ModuleRegistry.get(config.type as string) as unknown as { placeholder(c: CardModule, s: 'pending' | 'failed'): import('lit').TemplateResult };
  render(lazy.placeholder(config as CardModule, 'pending'), host);
  return host.firstElementChild as HTMLElement;
};

describe('clockMinHeight', () => {
  it('reserves the time and date lines at 1.17 by default', () => {
    expect(clockMinHeight({})).toBe('calc(2.875rem * 1.17)');
    expect(clockMinHeight({ show_date: true })).toBe('calc(2.875rem * 1.17)');
  });
  it('drops the date line when show_date is false', () => {
    expect(clockMinHeight({ show_date: false })).toBe('calc(2rem * 1.17)');
  });
  it('takes a unitless or numeric string line height as the factor', () => {
    expect(clockMinHeight({ design: { line_height: 1.5 } })).toBe('calc(2.875rem * 1.5)');
    expect(clockMinHeight({ design: { line_height: '1.5' } })).toBe('calc(2.875rem * 1.5)');
    expect(clockMinHeight({ show_date: false, design: { line_height: 1.6 } })).toBe('calc(2rem * 1.6)');
  });
  it('counts a length or percentage line height per line (a percentage is inherited as a length)', () => {
    expect(clockMinHeight({ design: { line_height: '150%' } })).toBe('calc(1.5em * 2)');
    expect(clockMinHeight({ design: { line_height: '24px' } })).toBe('calc(24px * 2)');
    expect(clockMinHeight({ show_date: false, design: { line_height: '1.5em' } })).toBe('calc(1.5em * 1)');
  });
  it('falls back to 1.17 for an invalid line height', () => {
    for (const lh of ['normal', 'abc', 0, -1, '0', null, NaN, {}, '1px; background:url(x)', '1.5)', '1e3', '-2em', '2em;', '1px)', 'calc(1px)']) {
      expect(clockMinHeight({ design: { line_height: lh } })).toBe('calc(2.875rem * 1.17)');
    }
  });
  it('falls back for a number too long to be a line height, and for one that overflows', () => {
    const fallback = 'calc(2.875rem * 1.17)';
    expect(clockMinHeight({ design: { line_height: `${'9'.repeat(400)}px` } })).toBe(fallback);
    expect(clockMinHeight({ design: { line_height: '9'.repeat(400) } })).toBe(fallback);
    expect(clockMinHeight({ design: { line_height: Infinity } })).toBe(fallback);
  });
  it('rejects a long digit run that never matches in linear time', () => {
    const started = performance.now();
    expect(clockMinHeight({ design: { line_height: `${'1'.repeat(50_000)}x` } })).toBe('calc(2.875rem * 1.17)');
    expect(performance.now() - started).toBeLessThan(200);
  });
  it('accepts the plain forms of a number', () => {
    expect(clockMinHeight({ design: { line_height: '.5' } })).toBe('calc(2.875rem * 0.5)');
    expect(clockMinHeight({ design: { line_height: '2.' } })).toBe('calc(2.875rem * 1.17)');
  });
  it('writes a length as a number and a fixed unit, not as the config text', () => {
    expect(clockMinHeight({ design: { line_height: '24.0px' } })).toBe('calc(24px * 2)');
    expect(clockMinHeight({ design: { line_height: '.5rem' } })).toBe('calc(0.5rem * 2)');
  });
  it('reserves nothing when the design sets the height', () => {
    expect(clockMinHeight({ design: { height: '80px' } })).toBe('');
    expect(clockMinHeight({ design: { min_height: '3em', line_height: 2 } })).toBe('');
  });
});

describe('image stub', () => {
  const view = new ImageView();
  const real = (aspect_ratio: unknown) => {
    const host = document.createElement('div');
    render(view.renderPreview({ id: 'i', type: 'image', aspect_ratio } as CardModule), host);
    return host.querySelector<HTMLElement>('.mc-image')!;
  };

  it.each(['16:9', '4/3', 1.5, '56.25%', undefined, 'bad', 0])('reserves the same aspect-ratio as the view for %s', (ratio) => {
    const s = stub({ id: 'i', type: 'image', aspect_ratio: ratio });
    expect(s.style.aspectRatio).toBe(real(ratio).style.aspectRatio);
    expect(s.getAttribute('style')).toContain(`aspect-ratio: ${cssAspectRatio(ratio)}`);
  });

  it('uses the real wrapper class and flow-end mark', () => {
    const s = stub({ id: 'i', type: 'image' });
    expect(s.className).toBe('mc-module mc-image');
    expect(s.hasAttribute('data-mc-flow-end')).toBe(true);
  });
});

describe('clock and image stubs are silent', () => {
  it.each([{ type: 'clock' }, { type: 'clock', show_date: false }, { type: 'image', image: 'https://x/y.png', entity_picture: true }])(
    'has no text, tabindex, role, aria or icon: %o',
    (cfg) => {
      const s = stub({ id: 'x', ...cfg });
      expect(s.textContent).toBe('');
      expect(s.children.length).toBe(0);
      for (const el of [s, ...s.querySelectorAll('*')]) {
        expect(el.hasAttribute('tabindex')).toBe(false);
        expect(el.hasAttribute('role')).toBe(false);
        expect(el.getAttributeNames().some((n) => n.startsWith('aria-'))).toBe(false);
      }
    },
  );

  it('the clock stub carries the min-height inline and nothing else', () => {
    const s = stub({ id: 'c', type: 'clock', design: { line_height: 1.6 } });
    expect(s.className).toBe('mc-module mc-clock');
    expect(s.getAttribute('style')).toBe('min-height: calc(2.875rem * 1.6)');
    expect(stub({ id: 'c', type: 'clock', design: { height: '50px' } }).hasAttribute('style')).toBe(false);
  });
});

describe('modules-extra needs for clock and image', () => {
  const needs = (c: unknown) => LAZY_FEATURES['modules-extra'].needs(c);
  it('a clock or image module at any depth needs the chunk', () => {
    expect(needs({ type: 'custom:magic-card', modules: [{ type: 'clock' }] })).toBe(true);
    expect(needs({ type: 'custom:magic-card', rows: [{ columns: [{ modules: [{ type: 'image', image: '/a.png' }] }] }] })).toBe(true);
  });
  it('an image background layer is not an image module', () => {
    expect(needs({ type: 'custom:magic-card', background_layers: [{ type: 'image', image: '/a.svg' }, { type: 'gradient' }], modules: [{ type: 'text' }] })).toBe(false);
    expect(needs({ type: 'custom:magic-card', background_layers: [{ type: 'image', image: '/a.svg' }], modules: [{ type: 'image' }] })).toBe(true);
  });
});

describe('clock view styles', () => {
  it('lets the time and the date wrap in a narrow column (reflow at 320 px), never clip or overflow', async () => {
    const { extrasViewStyles } = await import('../src/css/extras-styles');
    const text = extrasViewStyles.cssText.replace(/\s+/g, ' ');
    for (const sel of ['time', 'date']) {
      const rule = new RegExp(`\\.mc-clock-${sel} \\{([^}]*)\\}`).exec(text)![1];
      expect(rule).not.toMatch(/white-space:\s*nowrap|overflow:\s*hidden|text-overflow/);
      expect(rule).toMatch(/overflow-wrap:\s*anywhere/);
    }
  });
});
