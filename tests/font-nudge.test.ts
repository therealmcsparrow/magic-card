// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { describe, it, expect, beforeEach } from 'vitest';
import '../src/editor/components/font-nudge';
import { renderFontNudge } from '../src/editor/components/font-nudge';
import { render } from 'lit';
import { t } from '../src/editor/i18n';

const w = window as unknown as { magicCardUtils?: { settings?: { googleFonts?: boolean } } };
const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms));

async function lineFor(value: string): Promise<string> {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(renderFontNudge(value), host);
  const el = host.querySelector('mc-font-nudge') as (HTMLElement & { updateComplete: Promise<boolean> }) | null;
  for (let i = 0; i < 40 && el; i++) {
    await flush(25);
    await el.updateComplete;
    if (el.shadowRoot?.textContent?.trim()) break;
  }
  return el?.shadowRoot?.textContent?.trim() ?? '';
}

beforeEach(() => {
  document.body.innerHTML = '';
  delete w.magicCardUtils;
});

describe('font nudge', () => {
  it('names the switch when Utils is present and Google Fonts are off', async () => {
    w.magicCardUtils = { settings: { googleFonts: false } };
    expect(await lineFor('"Lato", sans-serif')).toBe(t('card-editor.font-picker.nudge-utils-off'));
    expect(t('card-editor.font-picker.nudge-utils-off')).toContain('Magic Card Utils → Configure');
  });
  it('names installing Utils when it is missing', async () => {
    expect(await lineFor('"Lato", sans-serif')).toBe(t('card-editor.font-picker.nudge-utils-missing'));
    expect(t('card-editor.font-picker.nudge-utils-missing')).toContain('Install Magic Card Utils');
  });
  it('shows nothing when Google Fonts are on', async () => {
    w.magicCardUtils = { settings: { googleFonts: true } };
    expect(await lineFor('"Lato", sans-serif')).toBe('');
  });
  it('shows nothing for a local font', async () => {
    w.magicCardUtils = { settings: { googleFonts: false } };
    expect(await lineFor('Arial')).toBe('');
    expect(await lineFor('')).toBe('');
  });
});
