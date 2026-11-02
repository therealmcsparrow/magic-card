import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ForumShotLockReason, MagicCardRef } from '../src/contracts/forum-shot';
import { aliasInText, classifyCard, prepareCard } from '../src/forum-shot/font-address';
import { configGoogleFonts } from '../src/utils/google-fonts';
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

describe('a font-family value is read the way the card loader reads it', () => {
  const probe = '.a{font-family: x}, Nunito;}';
  const config = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'a', css: probe }] }] }] };

  it('finds the family the loader finds, and renames it in a template text and in the mounted css', () => {
    expect(configGoogleFonts(config)).toEqual(['Nunito']);
    const missing = vi.fn();
    expect(aliasInText(probe, new Set(), missing)).toBe('.a{font-family: x}, "mc-shot-nunito";}');
    expect(missing).toHaveBeenCalledTimes(1);
    const kit = prepareCard(config, 'http://localhost:3000');
    const css = JSON.stringify(kit.mount);
    expect(css).toContain('mc-shot-nunito');
    expect(configGoogleFonts(kit.mount)).toEqual([]);
  });

  it.each([
    ['.a{font-family:Arial}.b{font-family:Lora}', '.a{font-family:Arial}.b{font-family:"mc-shot-lora"}', 0],
    ['.a{font-family: Oswald}.b{font-family: Lora}', '.a{font-family: "mc-shot-oswald"}.b{font-family: "mc-shot-lora"}', 0],
    ['.a{font-family:Arial}.b{font-family:Lora}', '.a{font-family:Arial}.b{font-family:"mc-shot-lora"}', 1],
    ['.a{font-family: x}, Nunito;}', '.a{font-family: x}, "mc-shot-nunito";}', 1],
  ])('renames every rule of minified css %s', (text, expected, missingCount) => {
    const missing = vi.fn();
    expect(aliasInText(text, new Set(missingCount ? [] : ['lora', 'oswald', 'nunito']), missing)).toBe(expected);
    expect(missing).toHaveBeenCalledTimes(missingCount);
    expect(configGoogleFonts({ css: aliasInText(text, new Set(['lora', 'oswald']), () => undefined) })).toEqual([]);
  });

  it('gives the mounted copy an alias for the family of a later rule', () => {
    const cfg = { type: 'custom:magic-card', font_family: 'Lora', css: '.a{font-family:Arial}.b{font-family:Lora}', rows: [] };
    const kit = prepareCard(cfg, 'http://localhost:3000');
    expect(kit.aliases.get('lora')).toBe('mc-shot-lora');
    expect(JSON.stringify(kit.mount)).toContain('.b{font-family:\\"mc-shot-lora\\"}');
  });

  it.each(['.a{font-family: Lora}', '.a{font-family: Lora } .b{x:1}', 'p{font-family: Lora, serif;}'])('renames the family in %s', (text) => {
    expect(configGoogleFonts({ css: aliasInText(text, new Set(['lora']), () => undefined) })).toEqual([]);
    expect(aliasInText(text, new Set(['lora']), () => undefined)).toContain('mc-shot-lora');
  });
});
