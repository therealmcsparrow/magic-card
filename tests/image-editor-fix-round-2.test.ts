import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import type { ImageExt } from '../src/image-editor/chunk';
import { imageStyles } from '../src/image-editor/styles';
import { fromCorners } from '../src/svg-editor/model';

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 1400, height: 800, right: 1400, bottom: 800, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 4000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
const svg = (inner: string): string => `<svg viewBox="0 0 400 300">${inner}</svg>`;
const A = '<path id="a" data-name="First" d="M0 0H100V100H0Z" fill="#ff0000"/>';
const item = (s: string) => ({ id: 'pic', name: 'Pic', svg: s, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' });

function wire(markup: string, over: Record<string, (m: any) => unknown> = {}) {
  const hass = {
    language: 'en-GB',
    user: { is_admin: true },
    callWS: vi.fn(async (m: any) => {
      if (over[m.type]) return over[m.type](m);
      if (m.type === 'magic_card_utils/images_list') return { images: [{ id: 'pic', name: 'Pic', view_box: '0 0 400 300', bytes: 1, bindings: 0, updated_at: 'u1' }] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [item(markup)] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: { id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' } };
      return {};
    }),
  };
  return { hass };
}

async function mount(source: object, markup = '', over: Record<string, (m: any) => unknown> = {}) {
  const w = wire(markup, over);
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source, hass: w.hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  return { el, ext: el.img as unknown as ImageExt };
}
const open = (markup: string, over: Record<string, (m: any) => unknown> = {}) => mount({ kind: 'image', id: 'pic' }, markup, over);
const blank = () => mount({ kind: 'image-blank', width: 400, height: 300 });
const live = (el: Ed): string => String((el as unknown as { live: string }).live ?? '');
const noteText = (el: Ed): string => (el.note?.lines ?? []).join(' ');
const root = (el: Ed) => el.renderRoot as ShadowRoot;
const rectOf = (el: Ed) => fromCorners(el.doc, 'rect', [10, 10], [100, 100]);
const reject = (e: unknown) => ({ 'magic_card_utils/images_save': () => Promise.reject(e) });
const picture = () => ({ canvas: document.createElement('canvas'), w: 100, h: 100 });
const css = (): string => imageStyles.cssText.replace(/\s+/g, ' ');

beforeEach(async () => {
  // a closed editor puts focus back on its opener one tick later
  await new Promise((r) => setTimeout(r, 5));
  __resetIconSourceForTests();
  __resetImageEditorForTests();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('save error wording', () => {
  it('an unknown server code is not called unreachable', async () => {
    const { ext } = await open(svg(A), reject({ code: 'save_failed' }));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => noteText(el).length > 0);
    expect(noteText(el)).toContain('reported an error');
    expect(noteText(el)).not.toContain('Could not reach');
  });

  it('a failure with no server code still says it could not reach the server', async () => {
    const { ext } = await open(svg(A), reject(new Error('socket closed')));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => noteText(el).length > 0);
    expect(noteText(el)).toContain('Could not reach Magic Card Utils');
  });
});

describe('a refused save', () => {
  it('unauthorized keeps focus inside the editor, on the canvas', async () => {
    const { ext } = await open(svg(A), reject({ code: 'unauthorized' }));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => ext.readOnly);
    await settle(el);
    expect(root(el).activeElement?.tagName).toBe('MC-PATH-CANVAS');
  });

  it('the view-only grid does not inherit the full workspace areas', () => {
    expect(css()).toMatch(/\.vw > \.left, \.vw > \.center, \.vw > \.insp \{ grid-area: auto; \}/);
  });
});

describe('opening', () => {
  it('Edit image lands on the canvas, not on the editor host', async () => {
    const { el } = await open(svg(A));
    expect(root(el).activeElement?.tagName).toBe('MC-PATH-CANVAS');
  });
});

describe('Canvas size window', () => {
  it('opens on the shape that is chosen', async () => {
    const { el, ext } = await open(svg(A));
    ext.openSize(root(el).querySelector<HTMLElement>('header button')!);
    await settle(el);
    await new Promise((r) => setTimeout(r, 20));
    const active = root(el).activeElement as HTMLElement;
    expect(active.getAttribute('role')).toBe('radio');
    expect(active.getAttribute('aria-checked')).toBe('true');
  });
});

describe('announcements', () => {
  it('says the same words twice when asked twice', async () => {
    const { el } = await blank();
    el.say('Same');
    await until(() => live(el) === 'Same');
    el.say('Same');
    expect(live(el)).toBe('');
    await until(() => live(el) === 'Same');
  });
});

describe('the size meter', () => {
  it('says Too big to save once, as one alert', async () => {
    const { el, ext } = await open(svg(A));
    el.out = { ...el.out, bytes: 312 * 1024, error: undefined } as never;
    ext.shell.requestUpdate();
    await settle(el);
    expect(root(el).querySelectorAll('.img-meter [role=alert]')).toHaveLength(1);
    const all = root(el).querySelector('.img-meter')!.textContent!.replace(/\s+/g, ' ');
    expect(all.match(/Too big to save/g)).toHaveLength(1);
  });
});

describe('names and labels', () => {
  it('the Image name field has a visible label tied to it', async () => {
    const { el } = await open(svg(A));
    const input = root(el).querySelector<HTMLInputElement>('#img-title-name')!;
    const label = root(el).querySelector<HTMLLabelElement>('label[for=img-title-name]')!;
    expect(input).toBeTruthy();
    expect(label.textContent).toBe('Image name');
    expect(label.classList.contains('sr')).toBe(false);
  });

  it('the card editor layer names its dialog', async () => {
    const { openLayer } = await import('../src/editor/custom/layer');
    const host = document.createElement('div');
    const close = openLayer(host, undefined, undefined, 'Image editor');
    expect(document.querySelector('dialog.mc-editor-layer')?.getAttribute('aria-label')).toBe('Image editor');
    close();
  });
});

describe('Reference picture panel', () => {
  async function withPanel() {
    const w = await blank();
    (w.el as HTMLElement).getBoundingClientRect = () => ({ ...rect(), top: 0, bottom: 360, height: 360 }) as DOMRect;
    w.ext.refOpen = true;
    w.el.requestUpdate();
    await settle(w.el);
    return { ...w, panel: root(w.el).querySelector<HTMLElement>('#ref-panel')! };
  }

  it('never grows past the bottom of a 360 px window and scrolls inside', async () => {
    const { panel } = await withPanel();
    panel.getBoundingClientRect = () => ({ ...rect(), top: 150, bottom: 700, height: 550 }) as DOMRect;
    Object.defineProperty(window, 'innerHeight', { value: 360, configurable: true });
    panel.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(panel.style.maxHeight).toBe('202px');
    expect(css()).toMatch(/\.ref-panel \{[^}]*overflow: auto/);
  });

  it('brings the focused control into view', async () => {
    const { panel } = await withPanel();
    const target = panel.querySelector<HTMLElement>('#ref-pick')!;
    const spy = vi.fn();
    target.scrollIntoView = spy;
    target.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(spy).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
  });

  it('names the nudge buttons by what they do and keeps Hide out of a status', async () => {
    const { el, ext } = await withPanel();
    ext.ref = picture();
    el.requestUpdate();
    await settle(el);
    const names = [...root(el).querySelectorAll('#ref-panel [aria-label="Move the picture"] button')].map((b) => b.textContent!.trim());
    expect(names).toEqual(['Move picture left', 'Move picture right', 'Move picture up', 'Move picture down']);
    expect(root(el).querySelector('.ref-pill')!.querySelector('[role=status]')).toBeNull();
  });
});

describe('gradient stops', () => {
  it('a disabled Remove stop carries its reason as its description', async () => {
    const { el, ext } = await blank();
    el.addShape(rectOf(el));
    await settle(el);
    (ext as any).edit((s: any) => ({ ...s, look: { ...(s.look ?? {}), fill: { t: 'linear', s: [{ o: 0, c: '#ff0000' }, { o: 1, c: '#0000ff' }], p: [0, 0, 1, 0] } } }), 'Fill');
    await settle(el);
    const rm = root(el).querySelector<HTMLElement>('button[aria-label="Remove stop 1"]');
    expect(rm).toBeTruthy();
    expect(rm!.getAttribute('aria-disabled')).toBe('true');
    expect(root(el).querySelector(`#${rm!.getAttribute('aria-describedby')}`)?.textContent).toBe('A gradient needs at least 2 stops.');
  });
});

describe('gradient handles', () => {
  it('say where the handle went after an arrow key', async () => {
    const { el, ext } = await blank();
    el.addShape(rectOf(el));
    await settle(el);
    (ext as any).edit((q: any) => ({ ...q, look: { ...(q.look ?? {}), fill: { t: 'linear', s: [{ o: 0, c: '#ff0000' }, { o: 1, c: '#0000ff' }], p: [0, 0, 1, 0] } } }), 'Fill');
    await settle(el);
    const h = root(el).querySelector<HTMLElement>('.gh-pt')!;
    expect(h).toBeTruthy();
    h.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await until(() => /: x -?\d+, y -?\d+/.test(live(el)));
  });
});

describe('what a new shape starts with', () => {
  it('has a thin outline in the Accent colour', async () => {
    const { el } = await blank();
    el.addShape(rectOf(el));
    await settle(el);
    const s = el.doc.shapes[0];
    expect(s.stroke).toBe('accent');
    expect(s.width).toBeGreaterThanOrEqual(2);
    expect(s.look).toBeUndefined();
  });

  it('keeps a line as it was drawn', async () => {
    const { el } = await blank();
    el.addShape(fromCorners(el.doc, 'line', [0, 0], [50, 50]));
    expect(el.doc.shapes[0].fill).toBe('none');
    expect(el.doc.shapes[0].stroke).toBe('main');
  });

  it('is 60 % opaque while a reference picture shows, so the picture stays visible, and says so', async () => {
    const { el, ext } = await blank();
    ext.ref = picture();
    el.addShape(rectOf(el));
    await settle(el);
    expect(el.doc.shapes[0].look?.opacity).toBe(60);
    await until(() => live(el).includes('Opacity set to 60 %'));
    expect(live(el)).toContain('Rectangle 1 added.');
    expect(el.out.svg).toContain('opacity="0.6"');
  });

  it('stays fully opaque when the picture is hidden', async () => {
    const { el, ext } = await blank();
    ext.ref = picture();
    ext.shown = false;
    el.addShape(rectOf(el));
    expect(el.doc.shapes[0].look).toBeUndefined();
  });
});

describe('As on a card', () => {
  it('turns the canvas colours to the card colours with the entity off, and back', async () => {
    const { el } = await blank();
    const toggle = (): HTMLButtonElement => [...root(el).querySelectorAll<HTMLButtonElement>('.toolbar button')].find((b) => b.textContent!.trim() === 'As on a card')!;
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    toggle().click();
    await settle(el);
    expect(toggle().getAttribute('aria-pressed')).toBe('true');
    expect(root(el).querySelector('svg.art')!.getAttribute('style')).toContain('--state-inactive-color');
    toggle().click();
    await settle(el);
    expect(root(el).querySelector('svg.art')!.getAttribute('style')).not.toContain('--state-inactive-color');
  });
});

describe('styles', () => {
  it('gradient handles are at least 24 px and forced colours mark pressed controls', () => {
    expect(css()).toMatch(/\.gh-pt \{[^}]*width: 24px;[^}]*height: 24px/);
    expect(css()).toMatch(/@media \(forced-colors: active\) \{[^}]*aria-pressed='true'[^}]*Highlight/);
  });
});
