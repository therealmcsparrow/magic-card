// The theme editor's list view sits on the panel's canvas, and the editing view's top bar sheds items as it narrows.
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ThemeBackend } from '../src/contracts/theme-editor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEl = HTMLElement & Record<string, any>;
const tick = async (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function deepAll(root: ParentNode, sel: string): AnyEl[] {
  const out: AnyEl[] = [...root.querySelectorAll<AnyEl>(sel)];
  for (const el of root.querySelectorAll<AnyEl>('*')) if (el.shadowRoot) out.push(...deepAll(el.shadowRoot, sel));
  return out;
}
async function settle(el: AnyEl, rounds = 4): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    for (const e of deepAll(el, '*')) if (e.updateComplete) await e.updateComplete;
    if (el.updateComplete) await el.updateComplete;
    await tick(15);
  }
}

// ---- a controllable layout -------------------------------------------------------------------------------------
let observers: { cb: ResizeObserverCallback; targets: Set<Element> }[] = [];
let currentWidth = 1280;
class FakeRO {
  rec: { cb: ResizeObserverCallback; targets: Set<Element> };
  constructor(cb: ResizeObserverCallback) {
    this.rec = { cb, targets: new Set() };
    observers.push(this.rec);
  }
  observe(el: Element) { this.rec.targets.add(el); }
  unobserve(el: Element) { this.rec.targets.delete(el); }
  disconnect() { this.rec.targets.clear(); }
}
function fireResize(width: number, height = 800) {
  currentWidth = width;
  for (const o of observers) {
    const entries = [...o.targets].map((target) => ({ target, contentRect: { width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0 } }));
    if (entries.length) o.cb(entries as unknown as ResizeObserverEntry[], {} as ResizeObserver);
  }
}
let reducedMotion = false;
const restore: Array<() => void> = [];
function stubLayout() {
  vi.stubGlobal('ResizeObserver', FakeRO);
  for (const prop of ['clientWidth', 'offsetWidth'] as const) {
    const d = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop) ?? Object.getOwnPropertyDescriptor(Element.prototype, prop);
    Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get: () => currentWidth });
    restore.push(() => (d ? Object.defineProperty(HTMLElement.prototype, prop, d) : Reflect.deleteProperty(HTMLElement.prototype, prop)));
  }
  const rect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    return { x: 0, y: 0, left: 0, top: 0, right: currentWidth, bottom: 800, width: currentWidth, height: 800, toJSON() {} } as DOMRect;
  };
  restore.push(() => (Element.prototype.getBoundingClientRect = rect));
  const mm = window.matchMedia;
  window.matchMedia = ((q: string) => ({ matches: /prefers-reduced-motion/.test(q) ? reducedMotion : false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia;
  restore.push(() => (window.matchMedia = mm));
}

const backend: ThemeBackend = {
  list: vi.fn(async () => ({ include: { state: 'ok' as const, dir_exists: true, hint: 'frontend:\n  themes: !include_dir_merge_named themes' }, files: [], loaded: [] })),
  get: vi.fn(async () => { throw Object.assign(new Error('not found'), { code: 'not_found' }); }),
  save: vi.fn(async (req) => ({ name: req.name, file: `themes/${req.name}.yaml`, mtime: 200, loaded: true })),
  remove: vi.fn(async () => undefined),
  presets: { list: vi.fn(async () => []), save: vi.fn(), remove: vi.fn(async () => undefined) },
};

beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).MagicCard = { version: 'x', apiVersion: 1, loadEditor: async () => true };
  if (!customElements.get('mc-color-picker')) {
    customElements.define('mc-color-picker', class extends HTMLElement {
      value = ''; label = ''; gradient = '';
      connectedCallback(): void { this.attachShadow({ mode: 'open' }).innerHTML = '<input class="input" />'; }
    });
  }
  await import('../src/theme-editor/index');
});

let host: AnyEl | undefined;
beforeEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
  sessionStorage.clear();
  observers = [];
  reducedMotion = false;
  stubLayout();
});
afterEach(() => {
  host?.remove();
  host = undefined;
  vi.unstubAllGlobals();
  while (restore.length) restore.pop()!();
});

const hassOf = (dark: boolean) => ({ language: 'en-GB', locale: { language: 'en-GB' }, themes: { darkMode: dark, themes: {} } });

async function mount(width: number, dark: boolean) {
  currentWidth = width;
  host = document.createElement('magic-card-theme-editor') as AnyEl;
  host.hass = hassOf(dark);
  document.body.appendChild(host);
  host.backend = backend;
  fireResize(width);
  await settle(host, 6);
  return host;
}
/** The list view of the host. */
async function openList(opts: { width?: number; dark?: boolean } = {}) {
  const h = await mount(opts.width ?? 1280, !!opts.dark);
  fireResize(opts.width ?? 1280);
  await settle(h);
  return { h, start: () => deepAll(h.shadowRoot!, 'mcte-start-view')[0] };
}
/** A new blank theme, opened in the editor view. */
async function openEditor(opts: { width?: number; dark?: boolean } = {}) {
  const width = opts.width ?? 1280;
  const { h, start } = await openList(opts);
  const s = start();
  s.openCreate();
  await settle(h);
  (s.shadowRoot!.querySelector('mc-ui-window')!.querySelector('button[type=submit]') as HTMLElement).click();
  await settle(h, 6);
  // the first open in a cold run lazy-loads the editor view: wait for it instead of counting settle rounds
  for (let i = 0; i < 40 && !deepAll(h.shadowRoot!, 'mcte-editor-view')[0]; i++) await settle(h, 1);
  const ed = deepAll(h.shadowRoot!, 'mcte-editor-view')[0];
  fireResize(width);
  ed._w = width;
  await settle(ed);
  fireResize(width);
  await settle(ed);
  const root = ed.shadowRoot!;
  const re = async () => settle(ed);
  return { h, ed, root, settle: re };
}

describe('theme editor layout', () => {
  it('the list view has no studio frame of its own', async () => {
    const { h, start } = await openList();
    expect(start()).toBeTruthy();
    expect(deepAll(h.shadowRoot!, 'mc-ui-studio-frame')).toHaveLength(0);
  });

  it('wide bar: title, previewing note, wall tablet and Save as my preset', async () => {
    const { root } = await openEditor({ width: 1280 });
    expect(root.querySelector('.studio-title')).not.toBeNull();
    expect(root.querySelector('.previewing')).not.toBeNull();
    expect(root.querySelector('.tablet-toggle')).not.toBeNull();
    expect(root.querySelector('.savepreset')).not.toBeNull();
  });

  it('below 1100 px the title and previewing note go; wall tablet and Save as my preset stay', async () => {
    const { root } = await openEditor({ width: 1000 });
    expect(root.querySelector('.studio-title')).toBeNull();
    expect(root.querySelector('.previewing')).toBeNull();
    expect(root.querySelector('.tablet-toggle')).not.toBeNull();
    expect(root.querySelector('.savepreset')).not.toBeNull();
  });

  it('below 900 px Save as my preset moves into the more menu', async () => {
    const { root, settle: re } = await openEditor({ width: 800 });
    expect(root.querySelector('.savepreset')).toBeNull();
    (root.querySelector('button.more') as HTMLElement).click();
    await re();
    const items = [...root.querySelectorAll('[role="menuitem"]')].map((e) => e.textContent!.trim());
    expect(items).toContain('Save as my preset');
  });
});
