import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MagicCardRef } from '../src/contracts/forum-shot';
import { listMagicCards } from '../src/forum-shot/pick';
import { MagicCardForumShot } from '../src/forum-shot/element';
import '../src/forum-shot';

(window as unknown as { magicCardUtils: unknown }).magicCardUtils = { settings: { googleFonts: true } };
await (await import('../src/forum-shot/font-address')).loadGoogleFontsLib();

// Regression for the two reported forum shot bugs: a card that names a Google font (Roboto included) is locked by
// the list, and the list is radios in a fieldset instead of a table with Dashboard, View, Card and Status columns.

const mc = (extra: Record<string, unknown> = {}) => ({ type: 'custom:magic-card', ...extra });

function wsOf(cards: Record<string, unknown>[]) {
  const callWS = vi.fn(async (msg: Record<string, unknown>) => {
    if (msg.type === 'lovelace/dashboards/list') return [];
    return { views: [{ title: 'Home', cards }] };
  });
  return { callWS, language: 'en' };
}

/** Locked by the list: the `lock` value once the classifier supplies it, else today's rule (any outside address or font family in `remote`). */
function locked(ref: MagicCardRef): boolean {
  const lock = (ref as unknown as { lock?: unknown }).lock;
  return lock === undefined ? ref.remote.length > 0 : lock !== false && lock !== null;
}

async function only(card: Record<string, unknown>): Promise<MagicCardRef> {
  return (await listMagicCards(wsOf([card])))[0];
}

describe('a card that names a font is not locked by the list', () => {
  it('Google font in font_family', async () => {
    expect(locked(await only(mc({ font_family: '"Open Sans", sans-serif' })))).toBe(false);
  });

  it('Google font in a css font-family declaration', async () => {
    expect(locked(await only(mc({ css: '.card { font-family: Lora, serif; }' })))).toBe(false);
  });

  it('Roboto only, which the card never fetches', async () => {
    expect(locked(await only(mc({ font_family: 'Roboto' })))).toBe(false);
  });

  it('control: an outside image address still locks the card', async () => {
    expect(locked(await only(mc({ rows: [{ text: 'https://example.com/a.png' }] })))).toBe(true);
  });

  it('control: a custom-card still locks the card', async () => {
    expect(locked(await only(mc({ rows: [{ type: 'custom-card' }] })))).toBe(true);
  });
});

describe('the card list is a table', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has Card, Dashboard, View and Status columns and one row per card', async () => {
    const el = document.createElement('magic-card-forum-shot') as MagicCardForumShot;
    el.hass = wsOf([mc({ name: 'One' }), mc({ name: 'Two' })]) as never;
    document.body.append(el);
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
    }
    const root = el.shadowRoot!;
    const table = root.querySelector('table, [role=table]');
    expect(table, 'the card list renders a table').not.toBeNull();
    const heads = [...table!.querySelectorAll('th, [role=columnheader]')].map((h) => h.textContent!.trim());
    expect(heads).toEqual(['Card', 'Dashboard', 'View', 'Status']);
    expect(table!.querySelectorAll('tbody tr, [role=row]:not(:has([role=columnheader]))').length).toBe(2);
  });
});
