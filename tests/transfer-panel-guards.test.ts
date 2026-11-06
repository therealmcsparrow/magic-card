import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../src/transfer/envelope', async (orig) => {
  const real = await orig<typeof import('../src/transfer/envelope')>();
  return { ...real, parseTransfer: (...a: Parameters<typeof real.parseTransfer>) => (a[0].includes('BOOM') ? (() => { throw new Error('boom'); })() : real.parseTransfer(...a)) };
});

import '../src/index';
import '../src/transfer/panel';
import type { TransferPanel } from '../src/transfer/panel';

const flush = async () => {
  for (let i = 0; i < 14; i++) await new Promise((r) => setTimeout(r, 0));
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('transfer panel guards', () => {
  it('turns a throw while reading into a visible refusal', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const el = document.createElement('mc-transfer-panel') as TransferPanel;
    Object.assign(el, { mode: 'import', accept: ['theme'], host: 'theme-editor' });
    document.body.append(el);
    await flush();
    el.shadowRoot!.querySelector<HTMLTextAreaElement>('#paste')!.value = 'BOOM';
    [...el.shadowRoot!.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Read')!.click();
    await flush();
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('Something went wrong while reading this');
    expect([...el.shadowRoot!.querySelectorAll('button')].some((b) => /^Import/.test(b.textContent?.trim() ?? ''))).toBe(false);
  });

  it('lists the websites taken out of an export', async () => {
    const el = document.createElement('mc-transfer-panel') as TransferPanel;
    el.mode = 'export';
    el.exportItems = { kind: 'card', items: [{ id: 'c', name: 'C', data: { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'k', modules: [{ id: 'm', type: 'text', text: 'see https://tracker.example/x?k=1' }] }] }] } as never }] };
    document.body.append(el);
    await flush();
    await el.updateComplete;
    const note = el.shadowRoot!.querySelector('[data-hosts-removed]');
    expect(note?.textContent).toContain('tracker.example');
  });
});
