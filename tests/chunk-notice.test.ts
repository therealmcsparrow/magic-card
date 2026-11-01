import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import '../src/index';
import { chunkNotice, noticeStyles } from '../src/card/chunk-notice';
import { BUILD_VERSION, TIMING, lazyChunk, onChunkChange, type LazyChunkControl } from '../src/utils/lazy-chunk';
import { __setLazyImporterForTests, lazyChunks } from '../src/utils/lazy-chunks';
import type { LazyChunkModule } from '../src/contracts/lazy-module';
import type { MagicCardConfig } from '../src/types';
import { html, render } from 'lit';
import { ModuleRegistry } from '../src/modules/module-registry';

// a 404 chunk shows a visible, keyboard-focusable retry state, never a blank tile.

const ok = (): LazyChunkModule => ({ BUILD: BUILD_VERSION, install: () => {} });
type CardEl = HTMLElement & { setConfig(c: MagicCardConfig): void; updateComplete: Promise<boolean>; hass?: unknown };

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  TIMING.silent = 0;
  TIMING.background = [];
  // the notice fills a frame after its container: a real frame, not the microtask frame of the test setup
  (globalThis as { requestAnimationFrame?: unknown }).requestAnimationFrame = (cb: () => void) => void setTimeout(cb, 16);
});
afterEach(() => {
  document.body.replaceChildren();
  offs.splice(0).forEach((off) => off());
  for (const n of ['seasonal', 'markdown', 'slider', 'layers'] as const) __setLazyImporterForTests(n, undefined);
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const frame = async () => {
  await new Promise((r) => setTimeout(r, 40));
};
async function failedChunk(importer: () => Promise<LazyChunkModule>, name: 'markdown' | 'seasonal' = 'markdown'): Promise<LazyChunkControl> {
  const chunk = lazyChunk(name, importer);
  expect(await chunk.load()).toBe(false);
  return chunk;
}
/** A host with a shadow root that draws the notice template like the card does, and again on every chunk change. */
type Host = HTMLElement & { updateComplete: Promise<void>; shadowRoot: ShadowRoot };
const offs: Array<() => void> = [];
async function notice(chunk: LazyChunkControl): Promise<Host> {
  const el = document.createElement('div') as unknown as Host;
  const root = el.attachShadow({ mode: 'open' });
  document.body.append(el);
  const draw = () => render(chunkNotice(chunk), root);
  offs.push(onChunkChange(draw));
  draw();
  el.updateComplete = Promise.resolve();
  return el;
}
const q = (el: Element, sel: string) => el.shadowRoot!.querySelector<HTMLElement>(sel);
const css = noticeStyles.cssText;

describe('the notice element', () => {
  it('creates the empty status container first and fills it a frame later, so screen readers announce it', async () => {
    const chunk = await failedChunk(() => Promise.reject(new Error('404')));
    const el = await notice(chunk);
    const status = q(el, '[role="status"]')!;
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent!.trim()).toBe('');
    await frame();
    await el.updateComplete;
    expect(q(el, '[role="status"]')).toBe(status); // the same container, now filled
    expect(status.textContent).toContain('The text block did not load. The rest of this card works.');
  });

  it('is one icon, one message and a real 44 px <button type=button> described by the message', async () => {
    const el = await notice(await failedChunk(() => Promise.reject(new Error('404'))));
    await frame();
    await el.updateComplete;
    const buttons = el.shadowRoot!.querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    const b = buttons[0];
    expect(b.type).toBe('button');
    expect(b.textContent!.trim()).toBe('Try again');
    expect(b.getAttribute('aria-label')).toBeNull();
    const msg = q(el, '.mc-n span')!;
    expect(b.getAttribute('aria-describedby')).toBe(msg.id);
    expect(msg.textContent).toContain('did not load');
    expect(q(el, 'ha-icon')!.getAttribute('aria-hidden')).toBe('true');
    expect(b.tabIndex).toBeGreaterThanOrEqual(0);
    expect(css).toMatch(/\.mc-n button\s*{[^}]*min-height:\s*44px/);
  });

  it('is always in flow: no absolute or fixed notice, no clipping, no fixed height, no colour on text from --mc-primary', () => {
    const rule = (sel: string) => new RegExp(`(?:^|})\\s*${sel.replace(/[.*]/g, '\\$&')}\\s*{([^}]*)}`).exec(css)![1];
    const n = rule('.mc-n');
    expect(n).not.toMatch(/position|overflow|max-height|\bheight\s*:|margin:\s*-/);
    expect(css.match(/position:\s*(absolute|fixed)/g)).toHaveLength(1); // the visually hidden "loaded" text only
    expect(rule('.mc-v')).toMatch(/position:\s*absolute/);
    // text, border and focus ring use --mc-text: HA's default light --primary-color is 2.63:1 on white, under the 3:1 a border needs
    expect(css).not.toContain('--mc-primary');
    expect(rule('.mc-n button')).toMatch(/border:\s*1px solid var\(--mc-text/);
    // Chromium 85 / Safari 16.4 floor: none of the newer selectors or functions
    expect(css).not.toMatch(/:is\(|color-mix\(|inset:|aspect-ratio|:focus-visible/);
    expect(css).toMatch(/\.mc-n button:focus\s*{[^}]*outline:\s*2px solid var\(--mc-text/);
    // opaque notice background; the var() fallback is the only fallback (no second, plain declaration)
    expect(n).toMatch(/background:\s*var\(--mc-bg, #fff\)/);
    expect(n.match(/background:/g)).toHaveLength(1);
  });

  it('"Try again" is one extra attempt: aria-disabled, focus stays, then "Still not loading" and a second button', async () => {
    let release!: () => void;
    let calls = 0;
    const chunk = await failedChunk(() => {
      calls++;
      return calls <= 2 ? Promise.reject(new Error('404')) : new Promise((_, no) => (release = () => no(new Error('404'))));
    });
    const el = await notice(chunk);
    await frame();
    await el.updateComplete;
    const b = q(el, 'button')!;
    b.focus();
    b.click();
    await el.updateComplete;
    expect(calls).toBe(3);
    expect(q(el, 'button')!.getAttribute('aria-disabled')).toBe('true');
    expect(q(el, 'button')!.hasAttribute('disabled')).toBe(false); // focus survives
    expect(q(el, 'button')!.textContent!.trim()).toBe('Try again');
    expect(q(el, '[role="status"]')!.getAttribute('aria-busy')).toBe('true');
    q(el, 'button')!.click(); // pressed while busy: ignored
    expect(calls).toBe(3);
    release();
    await frame();
    await el.updateComplete;
    expect(q(el, '[role="status"]')!.getAttribute('aria-busy')).toBe('false');
    expect(q(el, '.mc-n span')!.textContent).toContain('Still not loading. Try again in a moment, or reload the page.');
    const labels = [...el.shadowRoot!.querySelectorAll('button')].map((x) => x.textContent!.trim());
    expect(labels).toEqual(['Try again', 'Reload page']);
  });

  it('a retry that works removes the notice, says so once in the same container, and keeps focus on the page', async () => {
    let calls = 0;
    const chunk = await failedChunk(async () => {
      if (calls++ < 2) throw new Error('404');
      return ok();
    });
    const el = await notice(chunk);
    await frame();
    await el.updateComplete;
    const status = q(el, '[role="status"]')!;
    const b = q(el, 'button')!;
    b.focus();
    expect(el.shadowRoot!.activeElement).toBe(b);
    b.click();
    await frame();
    await el.updateComplete;
    expect(q(el, 'button')).toBeNull();
    expect(q(el, '[role="status"]')).toBe(status);
    expect(status.textContent).toContain('The text block loaded.');
    // focus moved off the removed node onto the status container, not left on a removed button or the page top
    expect(status.tabIndex).toBe(-1);
    expect(el.shadowRoot.activeElement).toBe(status);
    await new Promise((r) => setTimeout(r, 1600));
    await el.updateComplete;
    expect(status.textContent!.trim()).toBe('');
  });

  it('recovery without focus in the notice does not move focus', async () => {
    let calls = 0;
    const chunk = await failedChunk(async () => {
      if (calls++ < 2) throw new Error('404');
      return ok();
    });
    const other = document.body.appendChild(document.createElement('button'));
    const el = await notice(chunk);
    await frame();
    await el.updateComplete;
    other.focus();
    await chunk.retry();
    await frame();
    await el.updateComplete;
    expect(document.activeElement).toBe(other);
    expect(q(el, '[role="status"]')!.hasAttribute('tabindex')).toBe(false);
  });

  it('a mismatch shows the one-tap update tile at once, with no "Try again"', async () => {
    const chunk = await failedChunk(async () => ({ BUILD: 'another-release', install: () => {} }));
    expect(chunk.failure()).toBe('mismatch');
    const el = await notice(chunk);
    await frame();
    await el.updateComplete;
    const buttons = [...el.shadowRoot!.querySelectorAll('button')];
    expect(buttons.map((x) => x.textContent!.trim())).toEqual(['Magic Card updated. Tap to reload.']);
  });

  it('names no chunk and no key on the card: the chunk name goes to console.warn only', async () => {
    const el = await notice(await failedChunk(() => Promise.reject(new Error('404'))));
    await frame();
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).not.toMatch(/chunk|manifest|magic-card-markdown/i);
    expect(String(warn.mock.calls[0][0])).toContain('magic-card-markdown.js did not load');
  });

  it('every part name has a Dutch text', () => {
    const read = (f: string) => JSON.parse(readFileSync(resolve(__dirname, `../src/card/i18n/${f}.json`), 'utf8')) as Record<string, { text: string }>;
    const gb = read('en-GB');
    const nl = read('nl');
    for (const id of ['The animation', 'The custom shape', 'The seasonal effect', 'The background', 'The flow style', 'The slider', 'The text block', 'Part of this card', '{part} loaded.', '{part} did not load. The rest of this card works.', 'Try again', 'Reload page', 'Magic Card updated. Tap to reload.', 'Still the old version. Clear the browser cache, then reload.', 'How to clear the cache']) {
      const key = Object.keys(gb).find((k) => gb[k].text === id);
      expect(key, id).toBeTruthy();
      expect(nl[key!]?.text, id).toBeTruthy();
    }
  });
});

describe('a card with a chunk that 404s', () => {
  const card = async (config: Partial<MagicCardConfig>): Promise<CardEl> => {
    const el = document.createElement('magic-card') as CardEl;
    el.setConfig({ type: 'custom:magic-card', rows: [], ...config } as MagicCardConfig);
    document.body.append(el);
    await el.updateComplete;
    return el;
  };
  const settle = async (el: CardEl) => {
    for (let i = 0; i < 4; i++) {
      await frame();
      await el.updateComplete;
    }
  };

  it('a feature chunk: the notice is the last child of the card content, with a focusable "Try again", and the base still renders', async () => {
    __setLazyImporterForTests('seasonal', () => Promise.reject(new Error('404')));
    const el = await card({ seasonal: 'winter', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 't', type: 'text', text: 'Hello' }] }] }] } as never);
    await settle(el);
    const content = el.shadowRoot!.querySelector('.mc-card-content')!;
    expect(content.textContent).toContain('Hello');
    const n = content.lastElementChild as HTMLElement;
    expect(n.getAttribute('role')).toBe('status');
    const b = n.querySelector('button')!;
    expect(b.textContent!.trim()).toBe('Try again');
    expect(n.textContent).toContain('The seasonal effect did not load. The rest of this card works.');
    b.focus();
    expect(el.shadowRoot!.activeElement).toBe(b);
    expect(el.hasAttribute('mc-fail')).toBe(true);
  });

  it('pressing it loads the chunk, removes the notice and the card shows the feature', async () => {
    let up = false;
    __setLazyImporterForTests('seasonal', async () => {
      if (!up) throw new Error('404');
      return lazyChunks.seasonal.module() ?? ok();
    });
    const el = await card({ seasonal: 'winter' } as never);
    await settle(el);
    expect(el.shadowRoot!.querySelector('.mc-n button')).not.toBeNull();
    up = true;
    el.shadowRoot!.querySelector<HTMLElement>('.mc-n button')!.click();
    await settle(el);
    expect(lazyChunks.seasonal.ready()).toBe(true);
    expect(el.shadowRoot!.querySelector('.mc-n')).toBeNull();
    expect(el.hasAttribute('mc-fail')).toBe(false);
  });

  it('a lazy module shows it in its own slot, after the failed box, once the retry is used up', async () => {
    // a lazy module whose view never arrived (the shared markdown chunk is installed by the test setup)
    const gone = lazyChunk('markdown', () => Promise.reject(new Error('404')));
    ModuleRegistry.registerLazy(
      {
        metadata: { type: 'lazy-fail-test' as never, name: 'Lazy fail', description: 'test', category: 'content' as never, icon: 'mdi:test' },
        createDefault: () => ({ type: 'lazy-fail-test' }) as never,
        validate: () => [],
        placeholder: (_c, state) => html`<div class="ph ${state}"></div>`,
      },
      gone,
    );
    const el = await card({ rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'lazy-fail-test' }] }] }] } as never);
    await settle(el);
    const slot = el.shadowRoot!.querySelector('.mc-module-wrapper')!;
    expect(slot.querySelector('.ph.failed')).not.toBeNull(); // the stub's own box stays
    expect(slot.querySelector('.mc-n')).not.toBeNull();
    // the card does not add a second notice for a chunk its modules already show
    expect(el.shadowRoot!.querySelectorAll('.mc-n')).toHaveLength(1);
  });

  it('a lazy module: a Try again from the keyboard keeps focus in the card and says the part loaded', async () => {
    let up = false;
    const chunk = lazyChunk('markdown', async () => {
      if (!up) throw new Error('404');
      return {
        BUILD: BUILD_VERSION,
        install: () => ModuleRegistry.provideView('lazy-retry-test' as never, { renderPreview: () => html`<p class="real">Real</p>` }),
      };
    });
    ModuleRegistry.registerLazy(
      {
        metadata: { type: 'lazy-retry-test' as never, name: 'Lazy retry', description: 'test', category: 'content' as never, icon: 'mdi:test' },
        createDefault: () => ({ type: 'lazy-retry-test' }) as never,
        validate: () => [],
        placeholder: (_c, state) => html`<div class="ph ${state}"></div>`,
      },
      chunk,
    );
    const el = await card({ rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'lazy-retry-test' }] }] }] } as never);
    await settle(el);
    const slot = el.shadowRoot!.querySelector('.mc-module-wrapper')!;
    const b = slot.querySelector<HTMLButtonElement>('.mc-n button')!;
    b.focus();
    expect(el.shadowRoot!.activeElement).toBe(b);
    up = true;
    b.click();
    await settle(el);
    expect(slot.querySelector('.real')).not.toBeNull();
    expect(slot.querySelector('.mc-n')).toBeNull();
    const status = slot.querySelector<HTMLElement>('[role="status"]')!;
    expect(status.textContent).toContain('loaded.');
    expect(el.shadowRoot!.activeElement).toBe(status);
    expect(el.shadowRoot!.activeElement).not.toBeNull();
  });

  it('a plain card, and a card that needs another chunk, gets no notice and no status container', async () => {
    __setLazyImporterForTests('seasonal', () => Promise.reject(new Error('404')));
    const failing = await card({ seasonal: 'winter' } as never);
    await settle(failing);
    expect(failing.shadowRoot!.querySelector('.mc-n')).not.toBeNull();
    const plain = await card({ rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 't', type: 'text', text: 'Plain' }] }] }] } as never);
    await settle(plain);
    expect(plain.shadowRoot!.querySelector('.mc-n')).toBeNull();
    expect(plain.shadowRoot!.querySelector('[role="status"]')).toBeNull();
  });

  it('a healthy card has no notice element', async () => {
    const el = await card({ seasonal: 'winter' } as never);
    await settle(el);
    expect(el.shadowRoot!.querySelector('.mc-n')).toBeNull();
    expect(el.shadowRoot!.querySelector('[role="status"]')).toBeNull();
  });
});
