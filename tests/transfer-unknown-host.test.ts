import { describe, it, expect, beforeEach } from 'vitest';
import { msg } from '../tools/i18n/test-msg';
import { readTheme } from '../src/transfer/kinds/theme';
import { createShareKit } from '../src/share-kit/chunk';
import { shareKitHelpers } from '../src/transfer/share-kit-loader';
import '../src/transfer/panel';
import type { TransferPanel } from '../src/transfer/panel';

const kit = createShareKit(shareKitHelpers);
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
  return [...el.shadowRoot!.querySelectorAll<HTMLElement>('.notice.warn')].find((n) => n.querySelector('ul'))!;
}
const another = msg('transfer.theme.another-website');
const MOD = 'card-mod-root';

describe('transfer notes for card-mod values', () => {
  it('flags a card-mod value as unknown and names no host', () => {
    const r = readTheme(0, { [MOD]: 'dusk' }, kit);
    const n = (r.notes as Array<{ code: string; hosts?: string[]; unknown?: boolean }>).find((x) => x.code === 'external_ref');
    expect(n?.unknown).toBe(true);
    expect(n?.hosts ?? []).toEqual([]);
  });
  it('a card-mod value with an address is left out, with no external_ref note', () => {
    const r = readTheme(0, { [MOD]: 'url("https://a‮b.example/x")' }, kit);
    const codes = (r.notes as Array<{ code: string }>).map((x) => x.code);
    expect(codes).toContain('dropped_value');
    expect(codes).not.toContain('external_ref');
  });
  it('leaves out a plain value that points at another website and names the readable host', () => {
    const r = readTheme(0, { a: 'url(https://real.example/a.png) url("https://a‮b.example/x")' }, kit);
    const n = (r.notes as Array<{ code: string; hosts?: string[] }>).find((x) => x.code === 'dropped_value');
    expect(n?.hosts).toEqual(['real.example']);
    expect((r.notes as Array<{ code: string }>).some((x) => x.code === 'external_ref')).toBe(false);
  });
});

describe('<mc-transfer-panel> privacy sentence for card-mod values', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('shows the sentence with the generic wording', async () => {
    const warn = await open({ [MOD]: 'dusk' });
    expect(warn.textContent).toContain('those sites can see the visitor');
    expect(warn.textContent).toContain(another);
  });
  it('names no host of a value that was left out', async () => {
    const warn = await open({ [MOD]: 'dusk', b: 'url(https://trusted.example/y)' });
    expect(warn.textContent).not.toContain('trusted.example');
    expect(warn.textContent).toContain(another);
  });
});
