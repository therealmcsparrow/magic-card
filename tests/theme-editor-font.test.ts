// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { ThemeDoc } from '../src/contracts/theme-editor';
import '../src/theme-editor/preview';
import '../src/theme-editor/field-group';
import { McteThemePreview } from '../src/theme-editor/preview';
import { McteFieldGroup } from '../src/theme-editor/field-group';
import { validateValue } from '../src/theme-editor/model';
import { defineUiKit } from '../src/ui-kit';
import '../src/editor/components/font-picker';

defineUiKit();
if (!customElements.get('mcte-field-group')) customElements.define('mcte-field-group', McteFieldGroup);

const w = window as unknown as { magicCardUtils?: { settings?: { googleFonts?: boolean } } };
const links = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-mc-font]')];
const flush = (ms = 120) => new Promise((r) => setTimeout(r, ms));

async function mountGroup(): Promise<McteFieldGroup> {
  const el = document.createElement('mcte-field-group') as McteFieldGroup;
  el.group = { id: 'fonts', label: 'Fonts', entries: [] } as never;
  el.rows = [{ entry: { name: 'ha-font-family-body', group: 'fonts', source: 'ha', kind: 'font', default: 'Roboto', label: 'Body font' } as never, follows: false }];
  el.ctx = { doc: {}, scope: 'shared', hasModes: false, errors: new Map(), hints: new Map(), touched: new Set(), readOnly: false };
  el.open = true;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

beforeEach(() => {
  w.magicCardUtils = { settings: { googleFonts: true } };
});
afterEach(() => {
  document.body.innerHTML = '';
  document.head.querySelectorAll('link[data-mc-font]').forEach((n) => n.remove());
  delete w.magicCardUtils;
});

describe('theme editor font fields', () => {
  it('renders the font picker and stores what it emits', async () => {
    const el = await mountGroup();
    const picker = el.shadowRoot!.querySelector('mc-font-picker');
    expect(picker).not.toBeNull();
    expect(el.shadowRoot!.querySelector('input#in-ha-font-family-body')).toBeNull();
    const seen: unknown[] = [];
    el.addEventListener('mcte-set', (e) => seen.push((e as CustomEvent).detail));
    picker!.dispatchEvent(new CustomEvent('value-changed', { detail: { value: '"Lato", sans-serif' } }));
    expect(seen).toEqual([{ name: 'ha-font-family-body', value: '"Lato", sans-serif' }]);
  });

  it('keeps a variable reference as typed, and it validates', async () => {
    const el = await mountGroup();
    const seen: Array<{ value: string }> = [];
    el.addEventListener('mcte-set', (e) => seen.push((e as CustomEvent).detail));
    el.shadowRoot!.querySelector('mc-font-picker')!.dispatchEvent(new CustomEvent('value-changed', { detail: { value: 'var(--ha-font-family-body)' } }));
    expect(seen[0].value).toBe('var(--ha-font-family-body)');
    expect(validateValue('font', 'var(--ha-font-family-body)')).toBeNull();
  });
});

describe('theme preview fonts', () => {
  const doc: ThemeDoc = { 'ha-font-family-body': '"Lato", sans-serif' };
  async function preview(): Promise<void> {
    const el = document.createElement('mcte-theme-preview') as McteThemePreview;
    el.doc = doc;
    el.mode = 'light';
    document.body.appendChild(el);
    await el.updateComplete;
    el.flush();
    await flush();
  }
  it('loads a chosen Google font when the gate is open', async () => {
    await preview();
    expect(links().some((l) => l.dataset.mcFont === 'Lato')).toBe(true);
  });
  it('requests nothing when the gate is closed', async () => {
    w.magicCardUtils = { settings: { googleFonts: false } };
    await preview();
    expect(links()).toHaveLength(0);
  });
});
