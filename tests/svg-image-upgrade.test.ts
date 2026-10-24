import { describe, it, expect, vi } from 'vitest';
import { install } from '../src/svg-image/chunk';
import type { McSvgImage } from '../src/svg-image/mc-svg-image';

describe('<mc-svg-image> defined after it is in the page', () => {
  it('reads the properties it was given before the chunk defined it', async () => {
    vi.useFakeTimers();
    const el = document.createElement('mc-svg-image') as McSvgImage & Record<string, unknown>;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0L5 5"/></svg>';
    el.ref = 'mcu-image:plan';
    el.hass = { states: {}, callWS: async () => ({ images: [{ id: 'plan', name: 'p', view_box: '0 0 10 10', svg, created_at: 't', updated_at: 't' }] }) } as never;
    el.description = 'Plan';
    el.fit = 'cover';
    document.body.append(el);
    expect(customElements.get('mc-svg-image')).toBeUndefined();
    install();
    await vi.advanceTimersByTimeAsync(400);
    expect(el.shadowRoot?.querySelector('.stage > svg path')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.stage > svg')?.getAttribute('aria-label')).toBe('Plan');
    expect(el.fit).toBe('cover');
    vi.useRealTimers();
  });
});
