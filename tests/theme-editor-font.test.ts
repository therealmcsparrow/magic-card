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

async function mountGroup(errors = new Map<string, string>(), custom = false): Promise<McteFieldGroup> {
  const el = document.createElement('mcte-field-group') as McteFieldGroup;
  el.group = { id: 'fonts', label: 'Fonts', entries: [] } as never;
  el.rows = [{ entry: { name: 'ha-font-family-body', group: 'fonts', source: 'ha', kind: 'font', default: 'Roboto', label: 'Body font' } as never, follows: false, custom }];
  el.ctx = { doc: {}, scope: 'shared', hasModes: false, errors, hints: new Map(), touched: new Set(), readOnly: false };
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

  it('names the font textbox after its field, marks an error on it and focuses it on a jump', async () => {
    // a custom row is labelled with its variable name, which needs no translation table
    const el = await mountGroup(new Map([['ha-font-family-body', 'Not a font value']]), true);
    const field = el.shadowRoot!.querySelector('#f-ha-font-family-body')!;
    expect(field.querySelector('label')).toBeNull();
    const picker = field.querySelector('mc-font-picker') as HTMLElement & { label: string; updateComplete: Promise<unknown> };
    expect(picker.label).toBe('ha-font-family-body');
    expect(field.querySelector('.lbl')!.textContent!.trim()).toBe('ha-font-family-body');
    await picker.updateComplete;
    await el.updateComplete;
    const input = picker.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-label')).toBe(picker.label);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-description')).toBeTruthy();
    el.focusField('ha-font-family-body');
    expect(picker.shadowRoot!.activeElement).toBe(input);
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
