import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ForumShotLockReason, MagicCardRef } from '../src/contracts/forum-shot';
import { aliasInText, classifyCard, configGoogleFamilies as configGoogleFonts, prepareCard } from '../src/forum-shot/font-address';
import { listMagicCards } from '../src/forum-shot/pick';
import { findRemoteAssets } from '../src/forum-shot/remote';

(window as unknown as { magicCardUtils: unknown }).magicCardUtils = { settings: { googleFonts: true } };
await (await import('../src/forum-shot/font-address')).loadGoogleFontsLib();

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

  it.each(fixture.addressCases.map((c) => [c.id, c] as const))('classifies each card: %s', async (_id, c) => {
    const config = configOf(c);
    const started = performance.now();
    const got = await classifyCard(config, fixture.origin);
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

  it('finds the family the loader finds, and renames it in a template text and in the mounted css', async () => {
    expect(await configGoogleFonts(config)).toEqual(['Nunito']);
    const missing = vi.fn();
    expect(aliasInText(probe, new Set(), missing)).toBe('.a{font-family: x}, "mc-shot-nunito";}');
    expect(missing).toHaveBeenCalledTimes(1);
    const kit = await prepareCard(config, 'http://localhost:3000');
    const css = JSON.stringify(kit.mount);
    expect(css).toContain('mc-shot-nunito');
    expect(await configGoogleFonts(kit.mount)).toEqual([]);
  });

  it.each([
    ['.a{font-family:Arial}.b{font-family:Lora}', '.a{font-family:Arial}.b{font-family:"mc-shot-lora"}', 0],
    ['.a{font-family: Oswald}.b{font-family: Lora}', '.a{font-family: "mc-shot-oswald"}.b{font-family: "mc-shot-lora"}', 0],
    ['.a{font-family:Arial}.b{font-family:Lora}', '.a{font-family:Arial}.b{font-family:"mc-shot-lora"}', 1],
    ['.a{font-family: x}, Nunito;}', '.a{font-family: x}, "mc-shot-nunito";}', 1],
  ])('renames every rule of minified css %s', async (text, expected, missingCount) => {
    const missing = vi.fn();
    expect(aliasInText(text, new Set(missingCount ? [] : ['lora', 'oswald', 'nunito']), missing)).toBe(expected);
    expect(missing).toHaveBeenCalledTimes(missingCount);
    expect(await configGoogleFonts({ css: aliasInText(text, new Set(['lora', 'oswald']), () => undefined) })).toEqual([]);
  });

  it('gives the mounted copy an alias for the family of a later rule', async () => {
    const cfg = { type: 'custom:magic-card', font_family: 'Lora', css: '.a{font-family:Arial}.b{font-family:Lora}', rows: [] };
    const kit = await prepareCard(cfg, 'http://localhost:3000');
    expect(kit.aliases.get('lora')).toBe('mc-shot-lora');
    expect(JSON.stringify(kit.mount)).toContain('.b{font-family:\\"mc-shot-lora\\"}');
  });

  it.each(['.a{font-family: Lora}', '.a{font-family: Lora } .b{x:1}', 'p{font-family: Lora, serif;}'])('renames the family in %s', async (text) => {
    expect(await configGoogleFonts({ css: aliasInText(text, new Set(['lora']), () => undefined) })).toEqual([]);
    expect(aliasInText(text, new Set(['lora']), () => undefined)).toContain('mc-shot-lora');
  });
});

describe('removing an accepted font rule leaves no slash pair on the mount', () => {
  const ORIGIN = fixture.origin;
  const IMPORT = '@import url("https://fonts.googleapis.com/css2?family=Lora");';
  const FACE = '@font-face{font-family:"X";src:url("https://fonts.gstatic.com/s/x.woff2")}';
  const cases = [
    `/* fonts */\n${IMPORT}\n/* rest */\n.a{color:red}`,
    `${IMPORT}/* a */${IMPORT}/* b */`,
    `/* a */${FACE}/* b */`,
    `/* a */ ${IMPORT} /* b */ ${FACE} /* c */ .a{color:red}`,
    `.a{color:red}/**/${IMPORT}/**/.b{color:blue}`,
  ];

  it.each(cases.map((c) => [JSON.stringify(c), c] as const))('classify and mount agree on %s', async (_l, css) => {
    const config = { type: 'custom:magic-card', css };
    const kit = await prepareCard(config, ORIGIN);
    expect(kit.lock).toBeNull();
    expect(findRemoteAssets(kit.mount, ORIGIN)).toEqual([]);
    expect((await classifyCard(config, ORIGIN)).lock).toBeNull();
    expect(kit.plan.sheets.length).toBeGreaterThan(0);
  });

  it('keeps the rules around the removed one', async () => {
    const kit = await prepareCard({ type: 'custom:magic-card', css: `/* a */${IMPORT}/* b */.a{color:red}` }, ORIGIN);
    expect(kit.mount.css).toContain('.a{color:red}');
    expect(kit.mount.css).not.toContain('@import');
  });
});

describe('a long run of font-family rules (R-26)', () => {
  it('renames every family in 50,000 rules without recursion', () => {
    const text = '.a{font-family:Lora}'.repeat(50_000);
    let missing = 0;
    const out = aliasInText(text, new Set(['lora']), () => missing++);
    expect(out.split('mc-shot-lora').length - 1).toBe(50_000);
    expect(out).not.toContain('Lora');
    expect(missing).toBe(0);
  });

  it('counts a missing family once per rule', () => {
    let missing = 0;
    aliasInText('.a{font-family:Lora}'.repeat(3000), new Set(), () => missing++);
    expect(missing).toBe(3000);
  });

  it('renames every family in prepareCard css', async () => {
    const config = { type: 'custom:magic-card', font_family: 'Lora', css: '.a{font-family:Lora}'.repeat(20_000) };
    const kit = await prepareCard(config, fixture.origin);
    expect((kit.mount.css as string).split('mc-shot-lora').length - 1).toBe(20_000);
  });
});

describe('Google Fonts are used only when Magic Card Utils allows them', () => {
  const lato = { type: 'custom:magic-card', font_family: 'Lato, sans-serif' };
  const gate = (window as unknown as { magicCardUtils?: unknown });
  const saved = gate.magicCardUtils;

  afterEach(() => {
    gate.magicCardUtils = saved;
  });

  it('plans no Google URL, host or alias and makes no request while the switch is off', async () => {
    gate.magicCardUtils = { settings: { googleFonts: false } };
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const kit = await prepareCard(lato, 'http://localhost:3000');
    expect(kit.plan).toEqual({ fontHosts: [], sheets: [] });
    expect(kit.aliases.size).toBe(0);
    expect(JSON.stringify(kit.mount)).not.toContain('mc-shot-');
    expect(await classifyCard(lato, 'http://localhost:3000')).toEqual({ lock: null, fontHosts: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('plans no Google URL without Magic Card Utils at all', async () => {
    delete gate.magicCardUtils;
    expect((await prepareCard(lato, 'http://localhost:3000')).plan.sheets).toEqual([]);
    expect(aliasInText('font-family: Lato', new Set(), () => undefined)).toBe('font-family: Lato');
  });

  it('plans the css2 URL of the family when the switch is on', async () => {
    gate.magicCardUtils = { settings: { googleFonts: true } };
    const kit = await prepareCard(lato, 'http://localhost:3000');
    expect(kit.plan.sheets).toEqual([{ url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' }]);
    expect(kit.plan.fontHosts).toEqual(['fonts.googleapis.com', 'fonts.gstatic.com']);
    expect(kit.aliases.get('lato')).toBe('mc-shot-lato');
  });
});
