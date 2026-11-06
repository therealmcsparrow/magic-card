import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import { boolReason, boolState } from '../src/svg-editor/combine';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import type { ImageExt } from '../src/image-editor/chunk';
import type { Shape } from '../src/svg-editor/model';
import { IMAGE_ID_RE } from '../src/contracts/svg-image';

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
let width = 1400;
const rect = (): DOMRect => ({ left: 0, top: 0, width, height: 800, right: width, bottom: 800, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 4000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
const CLIP = '<defs><clipPath id="c"><rect x="0" y="0" width="50" height="50"/></clipPath></defs>';
const A = '<path id="a" data-name="First" d="M0 0H100V100H0Z" fill="#ff0000"/>';
const B = '<path id="b" data-name="Last" d="M200 0H300V100H200Z" fill="#00ff00"/>';
const WIN = '<rect id="win" x="10" y="10" width="80" height="80" fill="#0000ff" clip-path="url(#c)"/>';
const svg = (inner: string): string => `<svg viewBox="0 0 400 300">${inner}</svg>`;
const WITH_PART = svg(`${CLIP}${A}${WIN}${B}`);
const item = (s: string) => ({ id: 'pic', name: 'Pic', svg: s, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' });

function wire(markup: string, admin = true) {
  const calls: any[] = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: admin },
    callWS: vi.fn(async (m: any) => {
      calls.push(m);
      if (m.type === 'magic_card_utils/images_list') return { images: [{ id: 'pic', name: 'Pic', view_box: '0 0 400 300', bytes: 1, bindings: 0, updated_at: 'u1' }] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [item(markup)] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: { id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' } };
      return {};
    }),
  };
  return { hass, calls, saves: () => calls.filter((c) => c.type === 'magic_card_utils/images_save') };
}

async function mount(source: object, markup = '', admin = true): Promise<{ el: Ed; ext: ImageExt; saves: () => any[]; calls: any[] }> {
  const w = wire(markup, admin);
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source, hass: w.hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  return { el, ext: el.img as unknown as ImageExt, saves: w.saves, calls: w.calls };
}
const open = (markup: string, admin = true) => mount({ kind: 'image', id: 'pic' }, markup, admin);
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
const text = (el: Ed): string => el.renderRoot.textContent ?? '';
const shape = (el: Ed, id: string): Shape => el.doc.shapes.find((s) => s.id === id)!;
const part = (s: Shape): { m: string; d: Map<string, string>; i: string[] } | undefined => (s.look as any)?.part;
const art = (el: Ed): Element => el.renderRoot.querySelector('svg.art')!;
const drawnParts = (el: Ed): string => [...art(el).querySelectorAll('g[style*="--mc-image-main"]')].map((g) => g.innerHTML).join('');
async function save(el: Ed, saves: () => any[], n = 1): Promise<string> {
  el.apply({ ...el.doc, name: `Pic ${n}` }, 'Rename image', 'name');
  await settle(el);
  (el.img as any).save();
  await until(() => saves().length === n);
  return saves()[n - 1].image.svg;
}

beforeEach(() => {
  width = 1400;
  __resetIconSourceForTests();
  __resetImageEditorForTests();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('imported part layers: opening', () => {
  it('keeps an element the editor cannot edit between two paths as one locked layer, in its place', async () => {
    const { el } = await open(WITH_PART);
    expect(el.stage).toBe('edit');
    expect(el.img!.readOnly).toBe(false);
    expect(el.doc.shapes.map((s) => s.id)).toEqual(['a', 'win', 'b']);
    const p = shape(el, 'win');
    expect(p.locked).toBe(true);
    expect(part(p)).toBeTruthy();
    expect(p.name).toBe('Imported part');
    expect(part(shape(el, 'a'))).toBeUndefined();
    expect(shape(el, 'a').locked).toBeFalsy();
    expect(text(el)).not.toContain('cannot change yet');
  });

  it('turns a run of adjacent parts into one layer and keeps separate runs apart', async () => {
    const W2 = '<rect id="win2" x="50" y="50" width="20" height="20" fill="#0000ff" clip-path="url(#c)"/>';
    const one = await open(svg(`${CLIP}${A}${WIN}${W2}${B}`));
    expect(one.el.doc.shapes.map((s) => s.id)).toEqual(['a', 'win', 'b']);
    expect(part(shape(one.el, 'win'))!.m).toContain('id="win2"');
    mounted.splice(0).forEach((e) => e.remove());
    const two = await open(svg(`${CLIP}${A}${WIN}${B}${W2}`));
    expect(two.el.doc.shapes.map((s) => s.id)).toEqual(['a', 'win', 'b', 'win2']);
    expect(shape(two.el, 'win').name).toBe('Imported part');
    expect(shape(two.el, 'win2').name).toBe('Imported part 2');
  });

  it('gives a part without an id a valid new one and uses the data-name as its name', async () => {
    const { el } = await open(svg(`${CLIP}${A}<rect data-name="Window" x="1" y="1" width="9" height="9" clip-path="url(#c)"/>${B}`));
    expect(el.doc.shapes).toHaveLength(3);
    const p = el.doc.shapes[1];
    expect(IMAGE_ID_RE.test(p.id)).toBe(true);
    expect(p.name).toBe('Window');
    expect(new Set(el.doc.shapes.map((s) => s.id)).size).toBe(3);
  });

  it('keeps a part in the group where it was', async () => {
    const { el } = await open(svg(`${CLIP}<g id="grp"><path id="a" d="M0 0H10V10Z"/>${WIN}</g>`));
    const a = shape(el, 'a');
    expect(a.group).toBeTruthy();
    expect(shape(el, 'win').group).toBe(a.group);
  });

  it.each([
    ['a clip path', svg(`${CLIP}<path id="a" d="M0 0H20V20H0Z" clip-path="url(#c)"/>`)],
    ['fill opacity', svg('<path id="a" d="M0 0H20V20H0Z" fill="#fff" fill-opacity="0.5"/>')],
    ['group opacity', svg('<g opacity="0.5"><path id="a" d="M0 0H20V20H0Z"/><path id="b" d="M30 0H40V20H30Z"/></g>')],
    ['a colour keyword', svg('<path id="a" d="M0 0H20V20H0Z" fill="currentColor"/>')],
    ['a gradient transform', svg('<defs><linearGradient id="g" x1="0" x2="1" gradientTransform="rotate(30)"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><path id="a" d="M0 0H20V20H0Z" fill="url(#g)"/>')],
    ['an unknown gradient', svg('<path id="a" d="M0 0H20V20H0Z" fill="url(#nope)"/>')],
    ['text with a transform', svg('<path id="p" d="M0 0H20V20H0Z" fill="#fff"/><text id="a" x="1" y="1" transform="rotate(5)">Hi</text>')],
    ['text in a transformed group', svg('<g transform="translate(5 5)"><text id="a" x="1" y="1">Hi</text></g>')],
    ['text in other units', svg('<text id="a" x="1" y="1" font-size="2em">Hi</text>')],
    ['opacity on the whole image', '<svg viewBox="0 0 400 300" opacity="0.5"><path id="a" d="M0 0H20V20H0Z"/></svg>'],
  ])('opens %s editable, as a locked layer', async (_n, markup) => {
    const { el } = await open(markup);
    expect(el.stage).toBe('edit');
    expect(el.img!.readOnly).toBe(false);
    expect(el.doc.shapes.some((s) => !!part(s))).toBe(true);
    expect(text(el)).not.toContain('cannot change yet');
  });

  it('opens an image that is only a part, and can save it', async () => {
    const { el, saves } = await open(svg(`${CLIP}${WIN}`));
    expect(el.doc.shapes.map((s) => s.id)).toEqual(['win']);
    const out = await save(el, saves);
    expect(out).toContain('id="win"');
    expect(out).toContain('<clipPath id="c"');
  });
});

describe('imported part layers: saving', () => {
  it('writes the part back in its place with its definitions once, and a second round trip changes nothing', async () => {
    const W2 = '<rect id="win2" x="50" y="50" width="20" height="20" fill="#0000ff" clip-path="url(#c)"/>';
    const first = await open(svg(`${CLIP}${A}${WIN}${B}${W2}`));
    const out1 = await save(first.el, first.saves);
    expect(out1.indexOf('id="a"')).toBeLessThan(out1.indexOf('id="win"'));
    expect(out1.indexOf('id="win"')).toBeLessThan(out1.indexOf('id="b"'));
    expect(out1.indexOf('id="b"')).toBeLessThan(out1.indexOf('id="win2"'));
    expect(out1.match(/<clipPath /g)).toHaveLength(1);
    expect(out1.match(/clip-path="url\(#c\)"/g)).toHaveLength(2);
    expect(out1).toMatch(/<g[^>]*id="win"[^>]*data-name="Imported part"/);
    mounted.splice(0).forEach((e) => e.remove());
    const second = await open(out1);
    expect(second.el.doc.shapes.map((s) => s.id)).toEqual(['a', 'win', 'b', 'win2']);
    expect(second.el.doc.shapes.map((s) => !!part(s))).toEqual([false, true, false, true]);
    const out2 = await save(second.el, second.saves);
    expect(out2).toBe(out1);
  });

  it('carries the transform and paints of the groups round a part', async () => {
    const { el, saves } = await open(svg(`${CLIP}<g transform="translate(5 7)" fill="#00ff00" stroke="#000" stroke-width="3"><rect id="win" x="1" y="1" width="9" height="9" clip-path="url(#c)"/></g>`));
    const out = await save(el, saves);
    expect(out).toMatch(/<g[^>]*id="win"[^>]*>(?:<g>)?<g[^>]*transform="translate\(5 7\)"[^>]*fill="#00ff00"/);
    expect(out).toContain('stroke-width="3"');
    expect(out).toContain('clip-path="url(#c)"');
  });

  it('hides, renames, reorders and deletes it like any layer', async () => {
    const { el, saves } = await open(WITH_PART);
    el.renameShape('win', 'Window');
    el.reorder('win', 1);
    await settle(el);
    expect(el.doc.shapes.map((s) => s.id)).toEqual(['a', 'b', 'win']);
    expect(el.dirty).toBe(true);
    const out = await save(el, saves);
    expect(out).toContain('data-name="Window"');
    expect(out.indexOf('id="b"')).toBeLessThan(out.indexOf('id="win"'));
    el.select(['win']);
    el.patch({ hidden: true }, 'Hide');
    await settle(el);
    expect(art(el).querySelector('rect[x="10"]')).toBeNull();
    const hidden = await save(el, saves, 2);
    expect(hidden).not.toContain('id="win"');
    el.patch({ hidden: false }, 'Hide');
    el.deleteSelected();
    await settle(el);
    expect(el.doc.shapes.map((s) => s.id)).toEqual(['a', 'b']);
  });

  it('is not changed by move, size or paint edits', async () => {
    const { el } = await open(WITH_PART);
    const before = shape(el, 'win');
    el.select(['win']);
    el.nudge(5, 0);
    el.setBox({ x: 40, w: 90 }, 'Move');
    el.rotate(15);
    el.flip('h');
    (el.img as unknown as ImageExt).edit((s) => ({ ...s, fill: 'accent' }), 'Paint');
    await settle(el);
    expect(shape(el, 'win')).toBe(before);
  });

  it('stays locked when Unlock is pressed, so a move or a resize still changes nothing', async () => {
    const { el } = await open(WITH_PART);
    const before = shape(el, 'win');
    el.select(['win']);
    el.patch({ locked: false }, 'Lock');
    await settle(el);
    expect(shape(el, 'win').locked).toBe(true);
    el.nudge(5, 0);
    el.setBox({ x: 40 }, 'Move');
    await settle(el);
    expect(shape(el, 'win').paths).toBe(before.paths);
  });

  it('leaves booleans out with the reason', async () => {
    const { el } = await open(WITH_PART);
    const st = boolState(el.doc, ['a', 'win']);
    expect(st.leftOut).toBe(1);
    expect(st.lockedOnly).toBe(true);
    expect(boolReason(st, 'union')).toMatch(/locked|second shape/i);
  });

  it('counts the part in the size meter and in the empty check', async () => {
    const { el } = await open(svg(`${CLIP}${WIN}`));
    expect(el.out.error).toBeUndefined();
    expect(el.out.bytes).toBeGreaterThan(100);
  });
});

describe('imported part layers: the canvas', () => {
  it('draws the part from the svg-image api with ids and classes kept out of the editor', async () => {
    const { el } = await open(svg(`${CLIP}${A}<rect id="sh-name" class="board" x="10" y="10" width="80" height="80" fill="#0000ff" clip-path="url(#c)"/>`));
    el.apply({ ...el.doc, name: 'x' }, 'Rename image', 'name');
    el.select(['sh-name']);
    el.patch({ hidden: true }, 'Hide');
    el.patch({ hidden: false }, 'Hide');
    await settle(el);
    const drawn = art(el).querySelector('rect[x="10"][width="80"]');
    expect(drawn).toBeTruthy();
    expect(drawn!.hasAttribute('class')).toBe(false);
    expect(drawn!.getAttribute('id')).not.toBe('sh-name');
    expect(el.renderRoot.querySelectorAll('[id="sh-name"]')).toHaveLength(1);
    const ref = /url\(#([^)]+)\)/.exec(drawn!.getAttribute('clip-path')!)![1];
    expect(ref).not.toBe('c');
    expect(el.renderRoot.querySelector(`[id="${ref}"]`)?.localName).toBe('clipPath');
    expect(art(el).querySelector('g[style*="--mc-image-main"]')).toBeTruthy();
  });

  it('resolves the layer colours inside a part', async () => {
    const { el } = await open(svg(`${CLIP}<rect id="win" x="1" y="1" width="9" height="9" fill="var(--mc-image-accent)" clip-path="url(#c)"/>`));
    const g = art(el).querySelector('g[style*="--mc-image-accent"]') as SVGElement;
    expect(g.getAttribute('style')).toContain('--mc-image-accent:var(--a)');
  });
});

describe('imported part layers: the layer list and the inspector', () => {
  it('shows the part as a layer with its lock on, and the reason where the colours would be', async () => {
    const { el } = await open(WITH_PART);
    const row = el.renderRoot.querySelector('[role=treeitem][data-id="win"]')!;
    expect(row).toBeTruthy();
    expect(row.querySelector('button[aria-label="Imported part stays locked: imported parts cannot be edited."]')).toBeTruthy();
    expect(row.querySelector('button[aria-label^="Unlock"]')).toBeNull();
    el.select(['win']);
    await settle(el);
    expect(el.renderRoot.querySelector('#fill-kind')).toBeNull();
    expect(text(el)).toContain('This part keeps its own colours.');
    expect(text(el)).toContain('Rename, reorder, hide or delete it.');
    el.select(['a']);
    await settle(el);
    expect(el.renderRoot.querySelector('#fill-kind')).toBeTruthy();
    expect(text(el)).not.toContain('This part keeps its own colours.');
  });

  it('can be reached and picked with the keyboard at 200 % zoom', async () => {
    width = 700;
    const { el } = await open(WITH_PART);
    expect(el.layout).toBe('compact');
    const opener = [...el.renderRoot.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === 'Layers')!;
    opener.click();
    await settle(el);
    const rows = [...el.renderRoot.querySelectorAll<HTMLElement>('[role=treeitem]')];
    expect(rows.map((r) => r.dataset.id)).toEqual(['b', 'win', 'a']);
    const key = (t: HTMLElement, k: string): void => void t.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, composed: true, cancelable: true }));
    rows[0].focus();
    key(rows[0], 'ArrowDown');
    const row = el.renderRoot.querySelector<HTMLElement>('[role=treeitem][data-id="win"]')!;
    expect(el.renderRoot.activeElement).toBe(row);
    key(row, 'Enter');
    await settle(el);
    expect(el.sel).toEqual(['win']);
    expect(row.getAttribute('aria-selected')).toBe('true');
    const lock = row.querySelector<HTMLButtonElement>('button[aria-label*="stays locked"]')!;
    expect(lock.getAttribute('aria-label')).toBe('Imported part stays locked: imported parts cannot be edited.');
  });
});

describe('imported part layers: files', () => {
  it('imports a file with parts, keeps them and says so in the summary', async () => {
    const { el, ext } = await mount({ kind: 'image-blank', width: 400, height: 300 });
    ext.importSvg(WITH_PART, 'room.svg');
    await settle(el);
    expect(el.doc.shapes.map((s) => s.id)).toEqual(['a', 'win', 'b']);
    const w = el.renderRoot.querySelector('mc-ui-window')!;
    expect(w.textContent).toContain('Nothing was removed.');
    expect(w.textContent).toContain('kept as locked layers');
    expect(w.textContent).not.toContain('left out');
  });

  it('says nothing about locked layers when there are none', async () => {
    const { el, ext } = await mount({ kind: 'image-blank', width: 400, height: 300 });
    ext.importSvg(svg(A), 'plain.svg');
    await settle(el);
    expect(el.renderRoot.querySelector('mc-ui-window')!.textContent).not.toContain('locked');
  });

  it('opens a file as a new image with its parts', async () => {
    const { el } = await mount({ kind: 'image-svg', svg: WITH_PART });
    expect(el.stage).toBe('edit');
    expect(el.doc.shapes.map((s) => !!part(s))).toEqual([false, true, false]);
    expect(el.renderRoot.querySelector('mc-ui-window')!.textContent).toContain('kept as locked layers');
  });
});

describe('imported part layers: limits', () => {
  const BIG = `<defs><mask id="m">${'<rect x="1" y="1" width="2" height="2" fill="#fff"/>'.repeat(2400)}</mask></defs>`;
  const MANY = svg(`${BIG}${Array.from({ length: 30 }, (_, i) => `<path id="p${i}" d="M0 0H10V10Z"/><rect id="w${i}" width="5" height="5" mask="url(#m)"/>`).join('')}`);

  it('opens an image whose parts would repeat a large definition many times view-only, without building them', async () => {
    const { el } = await open(MANY);
    expect(el.stage).toBe('edit');
    expect(el.img!.readOnly).toBe(true);
    expect(text(el)).toContain('cannot change yet');
    expect(el.doc.shapes.filter((s) => !!part(s)).length).toBeLessThan(20);
  });

  it('refuses to import such a file', async () => {
    const { el, ext } = await mount({ kind: 'image-blank', width: 400, height: 300 });
    ext.importSvg(MANY, 'many.svg');
    el.requestUpdate();
    await settle(el);
    expect(el.renderRoot.querySelector('mc-ui-window')!.getAttribute('variant')).toBe('alert');
    expect(el.doc.shapes).toHaveLength(0);
  });
});

describe('imported part layers: hostile files', () => {
  const HOSTILE = svg(
    `${CLIP}<script>alert(1)</script>${A}` +
      '<rect id="win" x="1" y="1" width="9" height="9" clip-path="url(#c)" onclick="evil()" onload="evil()" style="fill:red" fill="javascript:alert(1)"/>' +
      '<foreignObject><div>x</div></foreignObject>' +
      '<a href="javascript:evil()"><rect id="lnk" width="5" height="5" clip-path="url(#c)"/></a>' +
      '<image href="data:image/png;base64,AAAA" clip-path="url(#c)"/>' +
      '<use href="#a" clip-path="url(#c)"/>' +
      '<rect id="hook" width="3" height="3" clip-path="url(#c)" fill="url(https://evil.example/x.svg#g)" mask="url(//evil.example/m)"/>',
  );
  const BAD = /<script|onclick|onload|javascript|foreignObject|<a[ >]|<image|<use|style=|data:|evil|href/i;

  it('never lets markup past the sanitiser into a part, the canvas or a save', async () => {
    const { el, ext } = await mount({ kind: 'image-blank', width: 400, height: 300 });
    ext.importSvg(HOSTILE, 'bad.svg');
    await settle(el);
    expect(el.doc.shapes.some((s) => !!part(s))).toBe(true);
    const held = el.doc.shapes.map((s) => (part(s) ? `${part(s)!.m}${[...part(s)!.d.values()].join('')}` : '')).join('');
    expect(held).not.toMatch(BAD);
    expect(drawnParts(el)).not.toMatch(BAD);
    expect(art(el).querySelectorAll('script,foreignObject,a,image,use')).toHaveLength(0);
    for (const n of art(el).querySelectorAll('*')) for (const a of n.getAttributeNames()) expect(a.startsWith('on')).toBe(false);
    expect(el.renderRoot.textContent).toContain('Removed');
    const built = await ext.buildSave({ id: 'bad', name: 'Bad' });
    const out = built.ok ? built.input.svg : '';
    expect(out).not.toMatch(BAD);
    expect(out).toContain('id="win"');
  });

  it('sanitises a stored image that was written with hostile parts', async () => {
    const { el, saves } = await open(HOSTILE);
    expect(el.stage).toBe('edit');
    const out = await save(el, saves);
    expect(out).not.toMatch(BAD);
    expect(drawnParts(el)).toMatch(/clip-path/);
    expect(drawnParts(el)).not.toMatch(BAD);
  });

  it('draws parts only through api.fragment: the chunk holds no SVG sink', () => {
    const dir = join(process.cwd(), 'src', 'image-editor');
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.ts') && n !== 'messages.gen.ts')) {
      const src = readFileSync(join(dir, f), 'utf8');
      expect(src, f).not.toMatch(/unsafeSVG|innerHTML|outerHTML|insertAdjacentHTML|createContextualFragment|image\/svg\+xml['"`]\s*\}/);
      expect(src, f).not.toMatch(/from '\.\.\/(icons\/svg-sanitize|svg-image\/sanitize)'/);
    }
  });
});
