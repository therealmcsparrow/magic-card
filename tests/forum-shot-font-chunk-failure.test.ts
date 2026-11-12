import { describe, expect, it, vi } from 'vitest';

// A Google fonts chunk that fails to load (wrong base, stale hash) counts as "no Google families": the forum shot
// still lists and classifies every card.
vi.mock('../src/utils/google-fonts', async (orig) => ({
  ...(await orig<typeof import('../src/utils/google-fonts')>()),
  googleFontsChunk: () => Promise.reject(new TypeError('Failed to resolve module specifier')),
}));

const { classifyCard, configGoogleFamilies, loadGoogleFontsLib } = await import('../src/forum-shot/font-address');
const { listMagicCards } = await import('../src/forum-shot/pick');

(window as unknown as { magicCardUtils: unknown }).magicCardUtils = { settings: { googleFonts: true } };

describe('forum shot with a Google fonts chunk that does not load', () => {
  it('resolves the library as missing instead of rejecting', async () => {
    await expect(loadGoogleFontsLib()).resolves.toBeUndefined();
    await expect(configGoogleFamilies({ font_family: '"Lato", sans-serif' })).resolves.toEqual([]);
  });

  it('still classifies and lists the cards', async () => {
    const card = { type: 'custom:magic-card', name: 'Hall', font_family: '"Lato", sans-serif' };
    expect((await classifyCard(card, 'https://ha.local:8123')).lock).toBeNull();
    const callWS = vi.fn(async (msg: Record<string, unknown>) => (msg.type === 'lovelace/dashboards/list' ? [] : { views: [{ title: 'Home', cards: [card, { type: 'custom:magic-card' }] }] }));
    const refs = await listMagicCards({ callWS });
    expect(refs.map((r) => r.lock)).toEqual([null, null]);
  });
});
