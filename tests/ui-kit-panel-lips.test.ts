import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { LitElement, html } from 'lit';
import { PanelLips, ScrollbarWatch, scrollbarWidth, kitLip } from '../src/ui-kit';
import {
  LIP_CLASSES,
  LIP_GEOMETRY,
  LIP_GUTTER_PX,
  LIP_HOST_ATTR,
  LIP_Z_MAX,
  PANEL_CHANGE_EVENT,
  PANEL_EDITORS,
  PANEL_HINT_PREFIX,
  PANEL_IDS,
  PANEL_MEMORY_MAX,
  PANEL_MEMORY_PREFIX,
  type PanelLipSpec,
  type PanelLipStrings,
  type PanelLipsOptions,
} from '../src/contracts/ui-kit-lips';

const SPECS: PanelLipSpec[] = [
  { id: 'layers', side: 'start', controls: 'layers', name: 'Layers panel', noun: 'layers', hideLabel: 'Hide layers (Ctrl+\\)', showLabel: 'Show layers (Ctrl+\\)' },
  { id: 'inspector', side: 'end', controls: 'inspector', name: 'Inspector panel', noun: 'inspector', hideLabel: 'Hide inspector (Ctrl+\\)', showLabel: 'Show inspector (Ctrl+\\)' },
];
const STRINGS: PanelLipStrings = {
  locale: 'en',
  hidden: '{panels} hidden',
  shown: '{panels} shown',
  hintOne: 'The {noun} panel is hidden, as you left it.',
  hintMany: 'Some panels are hidden, as you left them.',
  hintMigrated: 'The layers panel is hidden, as you collapsed it before.',
  hintShortcut: 'Shortcut: Ctrl+\\ or Cmd+\\',
  gotIt: 'Got it',
};

let nextOptions: Partial<PanelLipsOptions> = {};
let nextCols: Record<string, boolean> = { layers: true, inspector: true };

class LipHost extends LitElement {
  lips: PanelLips;
  cols = nextCols;
  constructor() {
    super();
    this.lips = new PanelLips(this, { editor: 'card-studio', panels: SPECS, strings: STRINGS, ...nextOptions });
  }
  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this.attachShadow({ mode: 'open' });
  }
  protected willUpdate(): void {
    this.lips.columns(this.cols);
  }
  protected render() {
    const l = this.lips;
    return html`${l.status()}
      <div class="grid">
        <nav id="layers" data-lip=${l.state('layers')} data-dir=${l.dir} ?inert=${l.isHidden('layers')}><input class="in" /></nav>
        ${l.lip('layers')}
        <main><slot></slot></main>
        ${l.lip('inspector')}
        <aside id="inspector" data-lip=${l.state('inspector')} data-dir=${l.dir} ?inert=${l.isHidden('inspector')}><input class="in2" /></aside>
      </div>`;
  }
}
customElements.define('lip-test-host', LipHost);

const flush = async (el: LitElement): Promise<void> => {
  await el.updateComplete;
  await Promise.resolve();
};
async function mount(opts: Partial<PanelLipsOptions> = {}, cols: Record<string, boolean> = { layers: true, inspector: true }): Promise<LipHost> {
  nextOptions = opts;
  nextCols = cols;
  const el = document.createElement('lip-test-host') as LipHost;
  document.body.append(el);
  await flush(el);
  return el;
}
const q = <T extends HTMLElement>(el: LipHost, sel: string): T => el.shadowRoot!.querySelector<T>(sel)!;
const lipOf = (el: LipHost, id: string): HTMLButtonElement => q<HTMLButtonElement>(el, `.lip[aria-controls="${id}"]`);
const status = (el: LipHost): string => q(el, '.lip-status').textContent ?? '';
const frame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));

function key(init: KeyboardEventInit & { altGraph?: boolean }): KeyboardEvent {
  const { altGraph, ...rest } = init;
  const e = new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true, ...rest });
  if (altGraph !== undefined) Object.defineProperty(e, 'getModifierState', { value: (k: string) => k === 'AltGraph' && altGraph });
  return e;
}

const realStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')!;
/** Replaces window.localStorage for one test: a map-backed store whose methods can be swapped, or a getter. */
function fakeStorage(over: Partial<Storage> & { getter?: () => never } = {}): { calls: string[]; data: Map<string, string> } {
  const data = new Map<string, string>();
  const calls: string[] = [];
  const base = {
    getItem: (k: string) => (calls.push('getItem'), data.has(k) ? (data.get(k) as string) : null),
    setItem: (k: string, v: string) => (calls.push('setItem'), void data.set(k, String(v))),
    removeItem: (k: string) => (calls.push('removeItem'), void data.delete(k)),
    clear: () => data.clear(),
  };
  const { getter, ...methods } = over;
  const store = { ...base, ...methods };
  Object.defineProperty(window, 'localStorage', getter ? { configurable: true, get: getter } : { configurable: true, value: store });
  return { calls, data };
}
beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  Object.defineProperty(window, 'localStorage', realStorage);
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  localStorage.clear();
});

describe('1 toggle', () => {
  it('click, Enter and Space swap aria-expanded and title, keep the name and the focus, and stay silent', async () => {
    const el = await mount();
    const lip = lipOf(el, 'layers');
    expect(lip.getAttribute('aria-label')).toBe('Layers panel');
    expect(lip.getAttribute('aria-expanded')).toBe('true');
    expect(lip.getAttribute('aria-controls')).toBe('layers');
    expect(lip.title).toBe('Hide layers (Ctrl+\\)');
    lip.focus();
    lip.click();
    await flush(el);
    const after = lipOf(el, 'layers');
    expect(after).toBe(lip);
    expect(after.getAttribute('aria-expanded')).toBe('false');
    expect(after.getAttribute('aria-label')).toBe('Layers panel');
    expect(after.title).toBe('Show layers (Ctrl+\\)');
    expect(el.shadowRoot!.activeElement).toBe(lip);
    await frame();
    expect(status(el)).toBe('');
    // Enter and Space fire click on a native button; the lip has no other activation path
    lip.click();
    await flush(el);
    expect(lipOf(el, 'layers').getAttribute('aria-expanded')).toBe('true');
    expect(lip.outerHTML).not.toMatch(/pointerdown|onpointer/);
  });

  it('the chevron svg is hidden from the accessibility tree', async () => {
    const el = await mount();
    expect(lipOf(el, 'layers').querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('2 a hidden panel stays mounted', () => {
  it('keeps its node, nested scrollTop and selection; data-lip and inert set; not focusable', async () => {
    const el = await mount();
    const panel = q(el, '#layers');
    const inner = document.createElement('div');
    const sr = inner.attachShadow({ mode: 'open' });
    const scroller = document.createElement('div');
    sr.append(scroller);
    panel.append(inner);
    scroller.scrollTop = 1000;
    const input = q<HTMLInputElement>(el, '.in');
    input.value = 'draft';
    lipOf(el, 'layers').click();
    await flush(el);
    expect(q(el, '#layers')).toBe(panel);
    expect(panel.dataset.lip).toBe('hidden');
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(input.value).toBe('draft');
    expect(scroller.scrollTop).toBe(1000);
    lipOf(el, 'layers').click();
    await flush(el);
    expect(panel.dataset.lip).toBe('shown');
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(scroller.scrollTop).toBe(1000);
  });

  it('visibility carries the behaviour when inert is ignored', async () => {
    const css = kitLip.cssText;
    expect(css).toMatch(/\[data-lip=['"]?hidden['"]?\]\s*\{[^}]*visibility:\s*hidden/);
    expect(css).toMatch(/\[data-lip=['"]?hidden['"]?\]\s*\{[^}]*pointer-events:\s*none/);
  });
});

describe('3 shortcut', () => {
  it('works from a text field and from a nested shadow root, and prevents the key', async () => {
    const el = await mount();
    const input = q<HTMLInputElement>(el, '.in2');
    const e = key({});
    input.dispatchEvent(e);
    await flush(el);
    expect(e.defaultPrevented).toBe(true);
    expect(el.lips.state('layers')).toBe('hidden');
    expect(el.lips.state('inspector')).toBe('hidden');
    const nested = document.createElement('div');
    const deep = document.createElement('input');
    nested.attachShadow({ mode: 'open' }).append(deep);
    el.append(nested);
    deep.dispatchEvent(key({ metaKey: true, ctrlKey: false }));
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
    expect(el.lips.state('inspector')).toBe('shown');
  });

  it('ignores repeat, isComposing, defaultPrevented, Shift and Alt', async () => {
    const el = await mount();
    const target = q(el, 'main');
    for (const init of [{ repeat: true }, { isComposing: true }, { shiftKey: true }, { altKey: true }]) {
      const e = key(init);
      target.dispatchEvent(e);
      expect(e.defaultPrevented).toBe(false);
    }
    const taken = key({});
    const take = (ev: Event): void => ev.preventDefault();
    document.body.addEventListener('keydown', take, { capture: true });
    target.dispatchEvent(taken);
    document.body.removeEventListener('keydown', take, { capture: true });
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
  });

  it('hides all, then shows the remembered set; a lip click clears it', async () => {
    const el = await mount();
    const target = q(el, 'main');
    lipOf(el, 'layers').click();
    await flush(el);
    target.dispatchEvent(key({}));
    await flush(el);
    expect(el.lips.state('inspector')).toBe('hidden');
    target.dispatchEvent(key({}));
    await flush(el);
    expect(el.lips.state('inspector')).toBe('shown');
    expect(el.lips.state('layers')).toBe('hidden');
  });

  it('a lip click clears the remembered set', async () => {
    const el = await mount();
    const target = q(el, 'main');
    lipOf(el, 'layers').click();
    await flush(el);
    target.dispatchEvent(key({})); // inspector hidden by key, remembered
    await flush(el);
    lipOf(el, 'inspector').click(); // shown by lip: memory cleared
    await flush(el);
    lipOf(el, 'inspector').click(); // hidden by lip
    await flush(el);
    target.dispatchEvent(key({}));
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
    expect(el.lips.state('inspector')).toBe('shown');
  });

  it("leaves 'off' panels and suspended alone; with no lip it prevents the key and announces nothing", async () => {
    const el = await mount({}, { layers: false, inspector: true });
    const changes = vi.fn();
    el.addEventListener(PANEL_CHANGE_EVENT, changes);
    q(el, 'main').dispatchEvent(key({}));
    await flush(el);
    expect(el.lips.state('layers')).toBe('off');
    expect(el.lips.state('inspector')).toBe('hidden');
    expect(changes).toHaveBeenCalledTimes(1);
    el.lips.suspended = true;
    await flush(el);
    localStorage.clear();
    changes.mockClear();
    const e = key({});
    q(el, 'main').dispatchEvent(e);
    await frame();
    expect(e.defaultPrevented).toBe(true);
    expect(changes).not.toHaveBeenCalled();
    expect(status(el)).toBe('Inspector hidden'.length ? status(el) : '');
    expect(localStorage.getItem(PANEL_MEMORY_PREFIX + 'card-studio')).toBeNull();
  });

  it('works when a field inside stops keydown propagation (capture phase), with Ctrl and Meta', async () => {
    const el = await mount();
    const field = document.createElement('div');
    field.addEventListener('keydown', (e) => e.stopPropagation());
    const input = document.createElement('input');
    field.append(input);
    el.append(field);
    input.dispatchEvent(key({}));
    await flush(el);
    expect(el.lips.state('layers')).toBe('hidden');
    input.dispatchEvent(key({ ctrlKey: false, metaKey: true }));
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
  });

  it('adds and removes the listener with { capture: true }', async () => {
    const add = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    const remove = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
    const el = await mount();
    expect(add.mock.calls.some((c) => c[0] === 'keydown' && (c[2] as AddEventListenerOptions)?.capture === true)).toBe(true);
    el.remove();
    expect(remove.mock.calls.some((c) => c[0] === 'keydown' && (c[2] as AddEventListenerOptions)?.capture === true)).toBe(true);
    expect(el.hasAttribute(LIP_HOST_ATTR)).toBe(false);
  });

  it('nested hosts: the innermost holding focus acts, the outer one does not', async () => {
    const outer = await mount();
    nextOptions = {};
    const inner = document.createElement('lip-test-host') as LipHost;
    outer.append(inner);
    await flush(inner);
    expect(inner.hasAttribute(LIP_HOST_ATTR)).toBe(true);
    const innerInput = q<HTMLInputElement>(inner, '.in');
    const e = key({});
    innerInput.dispatchEvent(e);
    await flush(outer);
    await flush(inner);
    expect(inner.lips.state('layers')).toBe('hidden');
    expect(outer.lips.state('layers')).toBe('shown');
    expect(e.defaultPrevented).toBe(true);
    // the outer host acts when focus is outside the inner one
    q(outer, 'main').dispatchEvent(key({}));
    await flush(outer);
    expect(outer.lips.state('layers')).toBe('hidden');
  });

  it('the outer host neither acts nor prevents when the inner one has nothing to toggle', async () => {
    const outer = await mount();
    nextCols = { layers: false, inspector: false };
    const inner = document.createElement('lip-test-host') as LipHost;
    outer.append(inner);
    await flush(inner);
    const e = key({});
    q(inner, '.in').dispatchEvent(e);
    await flush(outer);
    expect(outer.lips.state('layers')).toBe('shown');
    expect(e.defaultPrevented).toBe(true); // the inner controller took the key
  });

  it('AltGr + key producing \\ types it and toggles nothing', async () => {
    const el = await mount();
    const changes = vi.fn();
    el.addEventListener(PANEL_CHANGE_EVENT, changes);
    const input = q<HTMLInputElement>(el, '.in');
    const ctrlAlt = key({ altKey: true });
    input.dispatchEvent(ctrlAlt);
    const chromium = key({ ctrlKey: false, altKey: false, altGraph: true });
    input.dispatchEvent(chromium);
    await frame();
    expect(ctrlAlt.defaultPrevented).toBe(false);
    expect(chromium.defaultPrevented).toBe(false);
    expect(el.lips.state('layers')).toBe('shown');
    expect(changes).not.toHaveBeenCalled();
    expect(status(el)).toBe('');
  });

  it("keys 'manual': no listener on the host; handleKey applies the matcher", async () => {
    const el = await mount({ keys: 'manual' });
    q(el, 'main').dispatchEvent(key({}));
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
    const e = key({});
    Object.defineProperty(e, 'composedPath', { value: () => [q(el, 'main'), el] });
    expect(el.lips.handleKey(e)).toBe(true);
    expect(e.defaultPrevented).toBe(true);
    await flush(el);
    expect(el.lips.state('layers')).toBe('hidden');
  });
});

describe('4 memory', () => {
  const KEY = PANEL_MEMORY_PREFIX + 'card-studio';

  it('stores the hidden ids in declared order under one key per editor and removes it when all are shown', async () => {
    const el = await mount();
    lipOf(el, 'inspector').click();
    lipOf(el, 'layers').click();
    await flush(el);
    expect(localStorage.getItem(KEY)).toBe('layers,inspector');
    lipOf(el, 'inspector').click();
    lipOf(el, 'layers').click();
    await flush(el);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('reads the stored state on connect', async () => {
    localStorage.setItem(KEY, 'inspector');
    const el = await mount();
    expect(el.lips.state('inspector')).toBe('hidden');
    expect(el.lips.state('layers')).toBe('shown');
    expect(el.lips.restoredFrom).toBe('stored');
  });

  it.each([
    ['unknown id', 'nope'],
    ['__proto__', '__proto__'],
    ['constructor', 'constructor,toString'],
    ['empty', ''],
    ['too long', 'layers,'.repeat(PANEL_MEMORY_MAX)],
    ['spaces', ' layers'],
    ['another editor id', 'side'],
  ])('ignores a hostile value: %s', async (_n, value) => {
    localStorage.setItem(KEY, value);
    const el = await mount();
    expect(el.lips.state('layers')).toBe('shown');
    expect(el.lips.state('inspector')).toBe('shown');
    expect(el.lips.restoredFrom).toBe('none');
  });

  it('drops duplicates and unknown ids but keeps the known ones', async () => {
    localStorage.setItem(KEY, 'layers,layers,__proto__,inspector');
    const el = await mount();
    expect(el.lips.state('layers')).toBe('hidden');
    expect(el.lips.state('inspector')).toBe('hidden');
  });

  it.each(['getter', 'getItem', 'setItem', 'removeItem'])('blocked storage (%s throws): panels open shown and toggling still works', async (what) => {
    let thrown = 0;
    const boom = (): never => {
      thrown++;
      throw new DOMException('denied', 'SecurityError');
    };
    fakeStorage(what === 'getter' ? { getter: boom } : ({ [what]: boom } as Partial<Storage>));
    const el = await mount();
    expect(el.lips.state('layers')).toBe('shown');
    lipOf(el, 'layers').click();
    await flush(el);
    expect(el.lips.state('layers')).toBe('hidden');
    lipOf(el, 'layers').click();
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
    expect(thrown).toBeGreaterThan(0);
  });

  it('fallback runs once when the key is absent, passes the allow-list and is written', async () => {
    const fallback = vi.fn(() => ['layers', 'bogus']);
    const el = await mount({ fallback });
    expect(fallback).toHaveBeenCalledTimes(1);
    expect(el.lips.state('layers')).toBe('hidden');
    expect(el.lips.restoredFrom).toBe('fallback');
    expect(localStorage.getItem(KEY)).toBe('layers');
    el.lips.restore();
    expect(fallback).toHaveBeenCalledTimes(1);
    expect(el.lips.restoredFrom).toBe('stored');
  });

  it('a throwing or empty fallback changes nothing', async () => {
    const el = await mount({ fallback: () => { throw new Error('x'); } });
    expect(el.lips.restoredFrom).toBe('none');
    document.body.innerHTML = '';
    const el2 = await mount({ fallback: () => null });
    expect(el2.lips.restoredFrom).toBe('none');
  });

  it('the panel ids come from the contract allow-list for every editor', () => {
    for (const e of PANEL_EDITORS) expect(PANEL_IDS[e].length).toBeGreaterThan(0);
    expect(PANEL_IDS['card-studio']).toEqual(['layers', 'inspector']);
  });
});

describe('5 columns and suspended', () => {
  it("'off' renders no lip and keeps the memory", async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount({}, { layers: false, inspector: true });
    expect(el.lips.state('layers')).toBe('off');
    expect(el.shadowRoot!.querySelector('.lip[aria-controls="layers"]')).toBeNull();
    expect(q(el, '#layers').dataset.lip).toBe('off');
    expect(localStorage.getItem(PANEL_MEMORY_PREFIX + 'card-studio')).toBe('layers');
    el.cols = { layers: true, inspector: true };
    el.requestUpdate();
    await flush(el);
    expect(el.lips.state('layers')).toBe('hidden');
  });

  it('columns() with unchanged input requests no update', async () => {
    const el = await mount();
    const spy = vi.spyOn(el, 'requestUpdate');
    el.lips.columns({ layers: true, inspector: true });
    expect(spy).not.toHaveBeenCalled();
    el.lips.columns({ layers: true, inspector: false });
    expect(spy).toHaveBeenCalled();
  });

  it('suspended turns every panel off', async () => {
    const el = await mount();
    el.lips.suspended = true;
    await flush(el);
    expect(el.lips.active).toBe(false);
    expect(el.shadowRoot!.querySelectorAll('.lip').length).toBe(0);
  });

  it('reveal() on an off or shown panel writes nothing', async () => {
    const el = await mount({}, { layers: false, inspector: true });
    const { calls } = fakeStorage();
    await el.lips.reveal('layers');
    await el.lips.reveal('inspector');
    expect(calls.filter((c) => c !== 'getItem')).toEqual([]);
  });

  it('reveal() shows a hidden column panel, saves it and resolves after the update', async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'inspector');
    const el = await mount();
    await el.lips.reveal('inspector');
    expect(q(el, '#inspector').dataset.lip).toBe('shown');
    expect(localStorage.getItem(PANEL_MEMORY_PREFIX + 'card-studio')).toBeNull();
  });
});

describe('6 focus', () => {
  it('hiding the focused panel by lip API or shortcut moves focus to its lip', async () => {
    const el = await mount();
    q<HTMLInputElement>(el, '.in').focus();
    expect(el.shadowRoot!.activeElement).toBe(q(el, '.in'));
    el.lips.hide('layers');
    await flush(el);
    await flush(el);
    expect(el.shadowRoot!.activeElement).toBe(lipOf(el, 'layers'));
    el.lips.show('layers');
    await flush(el);
    q<HTMLInputElement>(el, '.in2').focus();
    q<HTMLInputElement>(el, '.in2').dispatchEvent(key({}));
    await flush(el);
    await flush(el);
    expect(el.shadowRoot!.activeElement).toBe(lipOf(el, 'inspector'));
  });

  it('showing never moves focus', async () => {
    const el = await mount();
    el.lips.hide('layers');
    await flush(el);
    q<HTMLInputElement>(el, '.in2').focus();
    el.lips.show('layers');
    await flush(el);
    await flush(el);
    expect(el.shadowRoot!.activeElement).toBe(q(el, '.in2'));
  });
});

describe('8 kitLip text', () => {
  const css = kitLip.cssText;
  it('puts left/right before inset-inline-*, :focus before :focus-visible, and has rtl rules', () => {
    expect(css.indexOf('left: var(--mc-lip-at-start')).toBeLessThan(css.indexOf('inset-inline: var(--mc-lip-at-start'));
    expect(css.indexOf('right: var(--mc-lip-at-end')).toBeLessThan(css.indexOf('inset-inline: auto var(--mc-lip-at-end'));
    expect(css.indexOf('.lip:focus ')).toBeLessThan(css.indexOf('.lip:focus:not(:focus-visible)'));
    expect(css.indexOf('.lip:focus:not(:focus-visible)')).toBeLessThan(css.indexOf('.lip:focus-visible'));
    expect(css).toMatch(/\[data-dir=['"]?rtl['"]?\]/);
    expect(css).toMatch(/\[data-lip=['"]?hidden['"]?\]\[data-dir=['"]?rtl['"]?\]\s*\{[^}]*translateX\(calc\(-1 \*/);
  });
  it('avoids features above the Chromium 85 floor', () => {
    expect(css).not.toContain(':dir(');
    expect(css).not.toMatch(/(^|[\s;{])translate\s*:/);
    expect(css).not.toContain('color-mix(');
    expect(css).not.toContain('scrollbar-gutter');
    expect(css).not.toContain(':has(');
    expect(css).not.toContain(':host-context');
  });
  it('never groups :focus-visible with another selector', () => {
    const lists = css.match(/[^{}]+\{/g) ?? [];
    for (const l of lists) if (l.includes(':focus-visible')) expect(l).not.toContain(',');
  });
  it('keeps the z-index at or below LIP_Z_MAX', () => {
    for (const m of css.matchAll(/z-index:\s*([^;]+);/g)) {
      const v = /var\(--mc-lip-z,\s*(\d+)\)/.exec(m[1]);
      expect(v).not.toBeNull();
      expect(Number(v![1])).toBeLessThanOrEqual(LIP_Z_MAX);
    }
  });
  it('writes rules for the contract classes and takes colours from tokens', () => {
    for (const c of LIP_CLASSES) expect(css).toContain(`.${c}`);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
  it('a host in rtl renders data-dir=rtl on the lip and the panel', async () => {
    const el = document.createElement('lip-test-host') as LipHost;
    el.setAttribute('dir', 'rtl');
    document.body.append(el);
    await flush(el);
    expect(lipOf(el, 'layers').dataset.dir).toBe('rtl');
    expect(q(el, '#layers').dataset.dir).toBe('rtl');
  });
});

describe('9 status region', () => {
  it('is present and empty after the first render, also when suspended', async () => {
    const el = await mount();
    const region = q(el, '.lip-status');
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(region.textContent).toBe('');
    el.lips.suspended = true;
    await flush(el);
    expect(q(el, '.lip-status').textContent).toBe('');
  });

  it('names the changed panels in declared order with the list format', async () => {
    const el = await mount();
    q(el, 'main').dispatchEvent(key({}));
    await flush(el);
    await frame();
    await flush(el);
    expect(status(el)).toBe('Layers and inspector hidden');
    q(el, 'main').dispatchEvent(key({}));
    await flush(el);
    await frame();
    await flush(el);
    expect(status(el)).toBe('Layers and inspector shown');
  });

  it('announces the same text twice by emptying the region first', async () => {
    const el = await mount();
    const seen: string[] = [];
    new MutationObserver(() => seen.push(status(el))).observe(q(el, '.lip-status'), { childList: true, characterData: true, subtree: true });
    for (let i = 0; i < 4; i++) {
      q(el, 'main').dispatchEvent(key({}));
      await flush(el);
      await frame();
      await flush(el);
    }
    await Promise.resolve();
    expect(seen.filter((s) => s === 'Layers and inspector hidden').length).toBe(2);
    expect(seen.filter((s) => s === '').length).toBeGreaterThanOrEqual(2);
  });

  it('a lip toggle uses no status text', async () => {
    const el = await mount();
    lipOf(el, 'layers').click();
    await flush(el);
    await frame();
    expect(status(el)).toBe('');
  });

  it('an invalid locale or a missing Intl.ListFormat still announces, joined with ", "', async () => {
    const el = await mount({ strings: { ...STRINGS, locale: 'x_' } });
    q(el, 'main').dispatchEvent(key({}));
    await frame();
    await flush(el);
    expect(status(el)).toBe('Layers, inspector hidden');

    document.body.innerHTML = '';
    localStorage.clear();
    const original = Intl.ListFormat;
    (Intl as unknown as { ListFormat?: unknown }).ListFormat = undefined;
    try {
      const el2 = await mount();
      q(el2, 'main').dispatchEvent(key({}));
      await frame();
      await flush(el2);
      expect(status(el2)).toBe('Layers, inspector hidden');
    } finally {
      (Intl as unknown as { ListFormat?: unknown }).ListFormat = original;
    }
  });

  it('puts text through a text binding, never HTML', async () => {
    const el = await mount({ strings: { ...STRINGS, hidden: '<b>{panels}</b> hidden' } });
    q(el, 'main').dispatchEvent(key({}));
    await frame();
    await flush(el);
    expect(q(el, '.lip-status').querySelector('b')).toBeNull();
  });
});

describe('10 hint', () => {
  const HINT = PANEL_HINT_PREFIX + 'card-studio';
  const hint = (el: LipHost): HTMLElement | null => el.shadowRoot!.querySelector('.lip-hint');

  it('shows for stored state, directly after its lip, with aria-describedby', async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount();
    const h = hint(el)!;
    expect(h).not.toBeNull();
    expect(h.textContent).toContain('The layers panel is hidden');
    expect(h.id).toBe('layers-hint');
    expect(lipOf(el, 'layers').nextElementSibling).toBe(h);
    expect(lipOf(el, 'layers').getAttribute('aria-describedby')).toBe('layers-hint');
    expect(h.querySelector('.lip-hint-keys')).not.toBeNull();
  });

  it('does not show after a hide in this visit', async () => {
    const el = await mount();
    lipOf(el, 'layers').click();
    await flush(el);
    expect(hint(el)).toBeNull();
    expect(lipOf(el, 'layers').hasAttribute('aria-describedby')).toBe(false);
  });

  it('shows migrated text for the fallback and one hint for two hidden panels', async () => {
    const el = await mount({ fallback: () => ['layers'] });
    expect(hint(el)!.textContent).toContain('as you collapsed it before');
    document.body.innerHTML = '';
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers,inspector');
    const el2 = await mount();
    expect(el2.shadowRoot!.querySelectorAll('.lip-hint').length).toBe(1);
    expect(hint(el2)!.textContent).toContain('Some panels are hidden');
    expect(lipOf(el2, 'inspector').hasAttribute('aria-describedby')).toBe(false);
  });

  it('is dismissed by its button, writes "1" and returns focus to the lip', async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount();
    const btn = hint(el)!.querySelector('button')!;
    btn.focus();
    btn.click();
    await flush(el);
    expect(hint(el)).toBeNull();
    expect(localStorage.getItem(HINT)).toBe('1');
    expect(el.shadowRoot!.activeElement).toBe(lipOf(el, 'layers'));
  });

  it('is dismissed by Escape inside it, and the key is consumed', async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount();
    const outside = vi.fn();
    document.body.addEventListener('keydown', outside);
    const e = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true });
    hint(el)!.querySelector('button')!.dispatchEvent(e);
    await flush(el);
    expect(e.defaultPrevented).toBe(true);
    expect(outside).not.toHaveBeenCalled();
    expect(hint(el)).toBeNull();
  });

  it('is dismissed by any show', async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount();
    lipOf(el, 'layers').click();
    await flush(el);
    expect(hint(el)).toBeNull();
    expect(localStorage.getItem(HINT)).toBe('1');
  });

  it('only the exact value "1" counts as seen', async () => {
    for (const v of ['true', '11', ' 1', '']) {
      document.body.innerHTML = '';
      localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
      localStorage.setItem(HINT, v);
      const el = await mount();
      expect(hint(el), `value ${JSON.stringify(v)}`).not.toBeNull();
    }
    document.body.innerHTML = '';
    localStorage.setItem(HINT, '1');
    const el = await mount();
    expect(hint(el)).toBeNull();
  });

  it('blocked storage shows it again on each such open', async () => {
    const fake = fakeStorage({
      setItem: () => {
        throw new DOMException('full', 'QuotaExceededError');
      },
    });
    fake.data.set(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount();
    hint(el)!.querySelector('button')!.click();
    await flush(el);
    expect(hint(el)).toBeNull();
    document.body.innerHTML = '';
    const el2 = await mount();
    expect(hint(el2)).not.toBeNull();
  });

  it('waits while the panel is off', async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount({}, { layers: false, inspector: true });
    expect(hint(el)).toBeNull();
    el.cols = { layers: true, inspector: true };
    el.requestUpdate();
    await flush(el);
    expect(hint(el)).not.toBeNull();
  });
});

describe('11 geometry helpers', () => {
  const fake = (offsetWidth: number, clientWidth: number, border = 0): HTMLElement => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'offsetWidth', { value: offsetWidth, configurable: true });
    Object.defineProperty(el, 'clientWidth', { value: clientWidth, configurable: true });
    if (border) el.style.border = `${border}px solid`;
    return el;
  };

  it('measures offsetWidth - clientWidth for a 0, 15 and 17 px bar', () => {
    expect(scrollbarWidth(fake(800, 800))).toBe(0);
    expect(scrollbarWidth(fake(800, 785))).toBe(15);
    expect(scrollbarWidth(fake(800, 783))).toBe(17);
  });

  it('subtracts inline borders and never goes below 0', () => {
    document.body.append(fake(802, 800, 1));
    const el = fake(802, 800, 1);
    document.body.append(el);
    expect(scrollbarWidth(el)).toBe(0);
    expect(scrollbarWidth(fake(790, 800))).toBe(0);
  });

  it('ScrollbarWatch updates on resize and disconnects with the host', async () => {
    const callbacks: Array<() => void> = [];
    const disconnect = vi.fn();
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(cb: () => void) {
        callbacks.push(cb);
      }
      observe(): void {}
      unobserve(): void {}
      disconnect = disconnect;
    } as unknown as typeof ResizeObserver;
    try {
      const host = await mount();
      const scroller = fake(800, 800);
      const seen: number[] = [];
      const watch = new ScrollbarWatch(host, (w) => seen.push(w));
      watch.watch(scroller);
      expect(watch.width).toBe(0);
      Object.defineProperty(scroller, 'clientWidth', { value: 785 });
      callbacks[callbacks.length - 1]();
      expect(watch.width).toBe(15);
      Object.defineProperty(scroller, 'clientWidth', { value: 800 });
      callbacks[callbacks.length - 1]();
      expect(watch.width).toBe(0);
      expect(seen).toEqual([15, 0]);
      watch.hostDisconnected();
      expect(disconnect).toHaveBeenCalled();
    } finally {
      globalThis.ResizeObserver = original;
    }
  });

  it('the contract names the geometry model per editor and the gutter size', () => {
    expect(LIP_GUTTER_PX).toBe(40);
    expect(LIP_GEOMETRY['card-studio']).toBe('overlay');
    expect(LIP_GEOMETRY['anim-studio']).toBe('overlay');
    expect(LIP_GEOMETRY['svg-editor']).toBe('gutter');
    expect(LIP_GEOMETRY['shape-studio']).toBe('gutter');
  });
});

describe('lip focus, Escape on the lip, touch extension', () => {
  it('a click focuses the lip, so the shortcut works after a pointer click in WebKit', async () => {
    const el = await mount();
    const lip = lipOf(el, 'layers');
    expect(el.shadowRoot!.activeElement).toBeNull();
    lip.click();
    await flush(el);
    expect(el.shadowRoot!.activeElement).toBe(lipOf(el, 'layers'));
  });

  it('the click decides from the state at click time', async () => {
    const el = await mount();
    const lip = lipOf(el, 'layers');
    el.lips.hide('layers');
    lip.click();
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
  });

  it('Escape on a lip that carries the hint dismisses the hint and the key goes no further', async () => {
    localStorage.setItem(PANEL_MEMORY_PREFIX + 'card-studio', 'layers');
    const el = await mount();
    const outside = vi.fn();
    document.body.addEventListener('keydown', outside);
    const lip = lipOf(el, 'layers');
    expect(lip.getAttribute('aria-describedby')).toBeTruthy();
    lip.focus();
    const e = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true });
    lip.dispatchEvent(e);
    await flush(el);
    document.body.removeEventListener('keydown', outside);
    expect(e.defaultPrevented).toBe(true);
    expect(outside).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector('.lip-hint')).toBeNull();
    expect(localStorage.getItem(PANEL_HINT_PREFIX + 'card-studio')).toBe('1');
    expect(el.shadowRoot!.activeElement).toBe(lipOf(el, 'layers'));
  });

  it('Escape on a lip without a hint is left alone', async () => {
    const el = await mount();
    const outside = vi.fn();
    document.body.addEventListener('keydown', outside);
    const e = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true });
    lipOf(el, 'layers').dispatchEvent(e);
    document.body.removeEventListener('keydown', outside);
    expect(e.defaultPrevented).toBe(false);
    expect(outside).toHaveBeenCalled();
  });

  it('the touch extension adds what the 1 px border takes, so the target is a full 44 px', () => {
    const css = kitLip.cssText.replace(/\s+/g, ' ');
    expect(css).toMatch(/\.lip\[data-side='start'\]::after \{ left: 100%; right: auto; inset-inline: 100% auto; width: 17px; \}/);
    expect(css).toMatch(/\.lip\[data-side='end'\]::after \{ right: 100%; left: auto; inset-inline: auto 100%; width: 17px; \}/);
    expect(css).toMatch(/\.lip\[aria-expanded='false'\]::after \{ width: calc\(17px \+ var\(--mc-lip-pull, 0px\)\); \}/);
  });
});

describe('ScrollbarWatch and the shortcut in Preview', () => {
  const sized = (offsetWidth: number, clientWidth: number): HTMLElement => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'offsetWidth', { value: offsetWidth, configurable: true });
    Object.defineProperty(el, 'clientWidth', { value: clientWidth, configurable: true });
    return el;
  };
  type Created = { observed: Element[]; disconnect: ReturnType<typeof vi.fn> };
  function stubObserver(): { made: Created[]; restore: () => void } {
    const made: Created[] = [];
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      private rec: Created = { observed: [], disconnect: vi.fn() };
      constructor() {
        made.push(this.rec);
      }
      observe(el: Element): void {
        this.rec.observed.push(el);
      }
      unobserve(): void {}
      disconnect(): void {
        this.rec.disconnect();
      }
    } as unknown as typeof ResizeObserver;
    return { made, restore: () => void (globalThis.ResizeObserver = original) };
  }

  it('an equal measurement requests no update and does not call onChange', async () => {
    const host = await mount();
    const onChange = vi.fn();
    const watch = new ScrollbarWatch(host, onChange);
    const scroller = sized(800, 785);
    watch.watch(scroller);
    expect(onChange).toHaveBeenCalledTimes(1);
    const request = vi.spyOn(host, 'requestUpdate');
    watch.watch(scroller);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(request).not.toHaveBeenCalled();
    expect(watch.width).toBe(15);
  });

  it('a changed element list replaces the observer, an unchanged one keeps it', async () => {
    const stub = stubObserver();
    try {
      const host = await mount();
      const watch = new ScrollbarWatch(host);
      const a = sized(800, 800);
      const b = sized(900, 900);
      watch.watch(a, b);
      watch.watch(a, b);
      expect(stub.made).toHaveLength(1);
      watch.watch(a);
      expect(stub.made).toHaveLength(2);
      expect(stub.made[0].disconnect).toHaveBeenCalled();
      expect(stub.made[1].observed).toEqual([a]);
    } finally {
      stub.restore();
    }
  });

  it('without ResizeObserver, watch() still measures and a null scroller reads 0', async () => {
    const original = globalThis.ResizeObserver;
    // @ts-expect-error removing the API for this test
    delete globalThis.ResizeObserver;
    try {
      const host = await mount();
      const watch = new ScrollbarWatch(host);
      watch.watch(sized(800, 783));
      expect(watch.width).toBe(17);
      watch.watch(null);
      expect(watch.width).toBe(0);
    } finally {
      globalThis.ResizeObserver = original;
    }
  });

  it('in Preview the shortcut is prevented and changes, announces, writes and fires nothing', async () => {
    const el = await mount();
    const changes = vi.fn();
    el.addEventListener(PANEL_CHANGE_EVENT, changes);
    el.lips.suspended = true;
    await flush(el);
    const e = key({});
    q(el, 'main').dispatchEvent(e);
    await frame();
    await flush(el);
    expect(e.defaultPrevented).toBe(true);
    expect(changes).not.toHaveBeenCalled();
    expect(status(el)).toBe('');
    expect(localStorage.getItem(PANEL_MEMORY_PREFIX + 'card-studio')).toBeNull();
    el.lips.suspended = false;
    await flush(el);
    expect(el.lips.state('layers')).toBe('shown');
    expect(el.lips.state('inspector')).toBe('shown');
  });
});
