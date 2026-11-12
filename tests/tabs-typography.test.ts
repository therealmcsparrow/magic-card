// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { describe, it, expect, afterEach } from 'vitest';
import '../src/index';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';
import { tabLook } from '../src/modules/layout/tabs-look';
import { tabsStyles } from '../src/modules/layout/tabs-styles';
import { configFontCandidates as configGoogleFonts } from '../src/google-fonts/loader';
import { GOOGLE_FONTS } from '../src/editor/components/font-picker';

afterEach(() => {
  document.body.innerHTML = '';
});

const tabsModule = (design: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
  id: 't', type: 'tabs', ...extra, design,
  tabs: [{ label: 'One', modules: [{ type: 'text', text: 'first' }] }, { label: 'Two', modules: [{ type: 'text', text: 'second' }] }],
});

describe('tab typography: the font family', () => {
  it('a Google Font in tab_font_family is found in the card config, so the card loads it', () => {
    const cfg = cardConfig([tabsModule({ tab_font_family: 'Lato, sans-serif' })]);
    expect(configGoogleFonts(cfg)).toContain('Lato');
  });
  it('a quoted Google Font in a nested tab design is found too', () => {
    const inner = tabsModule({ tab_font_family: '"Open Sans", sans-serif' });
    const cfg = cardConfig([{ id: 'o', type: 'tabs', tabs: [{ label: 'A', modules: [inner] }] }]);
    expect(configGoogleFonts(cfg)).toContain('Open Sans');
  });
  it('a mounted card with a Google tab font adds the stylesheet link to the document head', async () => {
    (window as unknown as { magicCardUtils?: unknown }).magicCardUtils = { settings: { googleFonts: true } };
    await mountCard(cardConfig([tabsModule({ tab_font_family: 'Poppins, sans-serif' })]), makeHass({}));
    await new Promise((r) => setTimeout(r, 100));
    delete (window as unknown as { magicCardUtils?: unknown }).magicCardUtils;
    expect(document.head.querySelector('link[data-mc-font="Poppins"]')).not.toBeNull();
  });
  it('every family the font picker offers passes the validator unchanged', () => {
    for (const f of GOOGLE_FONTS) {
      const family = f.name.includes(' ') ? `"${f.name}", sans-serif` : `${f.name}, sans-serif`;
      expect(tabLook({ tab_font_family: family }).vars['--mc-tt-ff'], family).toBe(family);
    }
  });
});

describe('tab typography: the weight', () => {
  it('no rule pins the active tab to a fixed weight, so tab_font_weight reaches the active tab in every style', () => {
    const fixed = [...tabsStyles.cssText.matchAll(/([^{}]*\.active[^{}]*)\{([^{}]*font-weight:\s*(?!var\()[^;}]+[^{}]*)\}/g)].map((m) => m[0]);
    expect(fixed).toEqual([]);
  });
});

describe('tab typography: the keys end to end', () => {
  it('size, weight, family and transform become properties on the bar and tokens the rules read', async () => {
    const card = await mountCard(
      cardConfig([tabsModule({ tab_font_size: '1.2em', tab_font_weight: 300, tab_font_family: 'Lato, sans-serif', tab_text_transform: 'uppercase' })]),
      makeHass({}),
    );
    const bar = card.shadowRoot!.querySelector<HTMLElement>('.mc-tabs')!;
    expect(bar.getAttribute('data-mc-tab')!.split(' ').sort()).toEqual(['family', 'size', 'transform', 'weight']);
    for (const [p, v] of [['--mc-tt-fs', '1.2em'], ['--mc-tt-fw', '300'], ['--mc-tt-ff', 'Lato, sans-serif'], ['--mc-tt-tt', 'uppercase']]) {
      expect(bar.style.getPropertyValue(p)).toBe(v);
    }
  });
});
