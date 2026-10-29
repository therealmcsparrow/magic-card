import { afterEach, describe, expect, it } from 'vitest';
import '../src/index';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';
import { hoverRule, provideTabHoverBorder } from '../src/utils/css-utils';
import { tabBorderStyle } from '../src/utils/tab-border';
import * as extras from '../src/modules/lazy/extras-chunk';

/*
 * The hover Border of a tabs module's tab buttons is built by the parsers in the modules-extra chunk, which hands the
 * function to css-utils.ts when it installs; magic-card.js holds none of the tab border parsers.
 */

const hover = { border_width: '2px', border_style: 'dashed', border_color: 'red blue' } as never;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('hoverRule before the chunk provides the tab border', () => {
  it('writes no button border', () => {
    provideTabHoverBorder(undefined);
    expect(hoverRule('m', hover, { tabs: true })).toBe('');
  });

  it('still writes the other hover keys of a tabs module', () => {
    provideTabHoverBorder(undefined);
    expect(hoverRule('m', { font_size: 20, border_width: '2px' } as never, { tabs: true })).toContain('.mc-tabs-header');
  });

  it('writes the button border once it is provided', () => {
    provideTabHoverBorder(tabBorderStyle);
    const rule = hoverRule('m', hover, { tabs: true });
    expect(rule).toContain('border-width: 2px !important');
    expect(rule).toContain('border-style: dashed !important');
    expect(rule).toContain('border-color: red blue !important');
  });

  it('is not used for a module that is not a tabs module', () => {
    provideTabHoverBorder(tabBorderStyle);
    expect(hoverRule('m', hover)).toBe('[data-mc-hover="m"]:hover { border-width: 2px !important; border-style: dashed !important; border-color: red blue !important; }');
  });
});

describe('a card with a tabs module', () => {
  it('gets the hover border of the buttons once the chunk has installed and the card renders again', async () => {
    provideTabHoverBorder(undefined);
    const tabs = {
      id: 't',
      type: 'tabs',
      tabs: [{ label: 'One', modules: [] }],
      design: { hover: { border_width: '2px', border_style: 'solid', border_color: 'red' } },
    };
    const c = await mountCard(cardConfig([tabs]), makeHass({}));
    const hoverCss = () => [...c.shadowRoot!.querySelectorAll('style[data-mc-hover-styles]')].map((s) => s.textContent).join(' ');
    expect(hoverCss()).toBe('');
    extras.install();
    (c as unknown as { requestUpdate(): void }).requestUpdate();
    await (c as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(hoverCss()).toContain('.mc-tabs-header');
    expect(hoverCss()).toMatch(/border-color: red !important/);
  });
});
