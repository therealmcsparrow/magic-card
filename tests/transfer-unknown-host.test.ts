import { describe, it, expect, beforeEach } from 'vitest';
import { msg } from '../tools/i18n/test-msg';
import { readTheme } from '../src/transfer/kinds/theme';
import '../src/transfer/panel';
import type { TransferPanel } from '../src/transfer/panel';

const flush = async () => {
  for (let i = 0; i < 6; i++) await new Promise((r) => setTimeout(r, 0));
};
const file = (data: Record<string, string>) => JSON.stringify({ magic_card_export: '1.0', kind: 'theme', items: [{ id: 't', name: 'T', data }] });
async function open(data: Record<string, string>): Promise<HTMLElement> {
  const el = document.createElement('mc-transfer-panel') as TransferPanel;
  el.host = 'theme-editor';
  document.body.append(el);
  await el.updateComplete;
  el.shadowRoot!.querySelector<HTMLTextAreaElement>('#paste')!.value = file(data);
  [...el.shadowRoot!.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Read')!.click();
  await flush();
  await el.updateComplete;
  return el.shadowRoot!.querySelector<HTMLElement>('.notice.warn')!;
}
const another = msg('transfer.theme.another-website');
const unreadable = `url("ht${String.fromCharCode(92)}A tps://evil.example/x")`;

describe('transfer notes for values that cannot be read', () => {
  it('flags the note and names no host', () => {
    const r = readTheme(0, { a: 'url("https://a\u202eb.example/x")' });
    const n = (r.notes as Array<{ code: string; hosts?: string[]; unknown?: boolean }>).find((x) => x.code === 'external_ref');
    expect(n?.unknown).toBe(true);
    expect(n?.hosts ?? []).toEqual([]);
  });
  it('keeps the named host and flags the rest in a mixed value', () => {
    const r = readTheme(0, { a: 'url(https://real.example/a.png) url("https://a\u202eb.example/x")' });
    const n = (r.notes as Array<{ code: string; hosts?: string[]; unknown?: boolean }>).find((x) => x.code === 'external_ref');
    expect(n).toMatchObject({ hosts: ['real.example'], unknown: true });
  });
});

describe('<mc-transfer-panel> privacy sentence for unreadable addresses', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('shows the sentence with the generic wording when no host can be named', async () => {
    const warn = await open({ 'lovelace-background': 'url("https://a\u202eb.example/x")' });
    expect(warn.textContent).toContain('those sites can see the visitor');
    expect(warn.textContent).toContain(another);
  });
  it('shows the sentence when a hex escape hides the scheme', async () => {
    const warn = await open({ 'lovelace-background': unreadable });
    expect(warn.textContent).toContain('those sites can see the visitor');
  });
  it('names the readable host and the generic wording together, across keys and inside one value', async () => {
    const across = await open({ a: unreadable, b: 'url(https://trusted.example/y)' });
    expect(across.textContent).toContain('trusted.example');
    expect(across.textContent).toContain(another);
    document.body.innerHTML = '';
    const mixed = await open({ a: 'url(https://trusted.example/y) url("https://a\u202eb.example/x")' });
    expect(mixed.textContent).toContain('trusted.example');
    expect(mixed.textContent).toContain(another);
  });
  it('does not add the generic wording when every host is named', async () => {
    const warn = await open({ a: 'url(https://trusted.example/y)' });
    expect(warn.textContent).toContain('trusted.example');
    expect(warn.textContent).not.toContain(another);
  });
});
