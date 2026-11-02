import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ForumShotLockReason, MagicCardRef } from '../src/contracts/forum-shot';
import { classifyCard } from '../src/forum-shot/font-address';
import { listMagicCards } from '../src/forum-shot/pick';

interface AddressCase {
  id: string;
  css?: string;
  config?: Record<string, unknown>;
  generate?: { prefix: string; repeat: string; count: number; suffix: string };
  expect: { lock: ForumShotLockReason | null; fontHosts: string[] };
}

const fixture = JSON.parse(readFileSync('tests/fixtures/forum-shot-font-cases.json', 'utf8')) as {
  origin: string;
  generatedMaxMs: number;
  addressCases: AddressCase[];
};

const configOf = (c: AddressCase): Record<string, unknown> => {
  if (c.config) return c.config;
  if (c.generate) {
    const g = c.generate;
    return { type: 'custom:magic-card', css: g.prefix + g.repeat.repeat(g.count) + g.suffix };
  }
  return { type: 'custom:magic-card', css: c.css };
};

describe('classifyCard', () => {
  it('has a case for every verdict', () => {
    expect(fixture.addressCases.length).toBeGreaterThan(100);
  });

  it.each(fixture.addressCases.map((c) => [c.id, c] as const))('classifies each card: %s', (_id, c) => {
    const config = configOf(c);
    const started = performance.now();
    const got = classifyCard(config, fixture.origin);
    if (c.generate) expect(performance.now() - started).toBeLessThan(fixture.generatedMaxMs);
    expect(got.lock).toBe(c.expect.lock);
    expect([...got.fontHosts].sort()).toEqual([...c.expect.fontHosts].sort());
  });
});

describe('listMagicCards fills the lock and the font hosts without a request', () => {
  afterEach(() => vi.unstubAllGlobals());

  const mc = (extra: Record<string, unknown>) => ({ type: 'custom:magic-card', ...extra });
  async function list(cards: Record<string, unknown>[]): Promise<MagicCardRef[]> {
    const callWS = vi.fn(async (msg: Record<string, unknown>) => (msg.type === 'lovelace/dashboards/list' ? [] : { views: [{ title: 'Home', cards }] }));
    return listMagicCards({ callWS });
  }

  it('font, Roboto, custom-card and outside-address configs', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const refs = await list([
      mc({ name: 'Font', css: '@import url(https://fonts.example.com/a.css);' }),
      mc({ name: 'Roboto', font_family: 'Roboto' }),
      mc({ name: 'Third party', rows: [{ type: 'custom-card' }] }),
      mc({ name: 'Picture', css: '@import url(https://fonts.example.com/a.css);', rows: [{ text: 'https://example.com/a.png' }] }),
      mc({ font_family: '"Open Sans", sans-serif' }),
      mc({ font_family: 'Papyrus' }),
    ]);
    expect(refs.map((r) => r.lock)).toEqual([null, null, 'custom_card', 'outside_address', null, null]);
    expect(refs.map((r) => r.fontHosts)).toEqual([['fonts.example.com'], [], [], [], ['fonts.googleapis.com', 'fonts.gstatic.com'], []]);
    expect(refs[0].cardName).toBe('Font');
    expect(refs[0].dashboardTitle).toBe('');
    expect(refs[4].cardName).toBe('#5');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
