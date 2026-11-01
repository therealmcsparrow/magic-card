import { html, nothing, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { DRAG_EDGE_PX, DRAG_START_PX, type TreePlace } from '../contracts/svg-editor';
import type { MenuEntry } from '../contracts/path-canvas';
import { readDirection } from '../ui-kit/controllers/direction';
import { glyph } from '../ui-kit/glyphs';
import { arrangeOrder, byId, groupChain, groupItems, layoutRows, outsideSafe, toneOf, tryMove, under, type Doc, type MoveWhy, type TreeRow } from './model';
import type { McSvgEditor } from './mc-svg-editor';
import { t } from './i18n';
import { MOVE_WHY, TONE } from './names';

/* The layer tree: rows over the nested groups (role=tree), keys, grip drag with drop targets, and the moves that need no drag. */

export type Drop = 'before' | 'after' | 'into';
export interface DragState {
  id: string;
  row?: string;
  how?: Drop;
  place?: TreePlace;
  why?: MoveWhy;
}

/** The DOM / selection key of a row: a group is `g:<id>`, a layer its id. */
const K = (r: TreeRow): string => (r.group ? `g:${r.id}` : r.id);
const aria = (b: boolean): string => (b ? 'true' : 'false');
const nameOf = (d: Doc, id: string): string => d.groups.find((g) => g.id === id)?.name ?? byId(d, id)?.name ?? '';
const same = (a: Doc, b: Doc): boolean => a.shapes.length === b.shapes.length && a.shapes.every((s, i) => s === b.shapes[i]) && a.groups.length === b.groups.length && a.groups.every((g, i) => g === b.groups[i]);

/** Top quarter above, bottom quarter below, the middle of a group row into it; a layer row splits in the middle. */
export function dropFor(y: number, r: Pick<DOMRect, 'top' | 'height'>, group: boolean, open: boolean): Drop {
  const f = (y - r.top) / r.height;
  if (f < 0.25) return 'before';
  if (group) return f < 0.75 || open ? 'into' : 'after';
  return f < 0.5 ? 'before' : 'after';
}

function placeFor(rows: TreeRow[], id: string, t: TreeRow, how: Drop): TreePlace {
  if (how === 'into') return { parent: t.id, index: 0 };
  const me = rows.find((r) => r.id === id)!;
  return { parent: t.parent ?? null, index: t.index + (how === 'after' ? 1 : 0) - (me.parent === t.parent && me.index < t.index ? 1 : 0) };
}

function whyText(d: Doc, why: MoveWhy, place: TreePlace): string {
  if (why === 'depth') return t('svg-editor.layers.groups-can-be-4-levels-deep');
  if (why === 'locked') return t('svg-editor.layers.name-is-locked', { name: groupChain(d, place.parent ?? undefined).find((g) => g.locked)?.name ?? '' });
  return t(MOVE_WHY[why === 'self' ? 'self' : 'none']);
}

/** The item the menu and the buttons act on: a group when its row is current and exactly its layers are picked, else the single picked layer. */
export function subject(ed: McSvgEditor): string | undefined {
  const c = ed.cur;
  if (c?.startsWith('g:')) {
    const u = under(ed.doc, c.slice(2)).map((s) => s.id);
    if (u.length === ed.sel.length && u.every((i) => ed.sel.includes(i))) return c.slice(2);
  }
  return ed.sel.length === 1 ? ed.sel[0] : undefined;
}

const keyOf = (ed: McSvgEditor, id: string): string => (ed.doc.groups.some((g) => g.id === id) ? `g:${id}` : id);

function focusRow(ed: McSvgEditor, key: string): void {
  ed.cur = key;
  ed.updateComplete.then(() => ed.renderRoot.querySelector<HTMLElement>(`.tree [data-id="${key}"]`)?.focus());
}

/** Say why in the list's status line and the live region. */
function refuse(ed: McSvgEditor, text: string): void {
  ed.tmsg = text;
  ed.say(text);
}

function announce(ed: McSvgEditor, id: string, into: boolean): void {
  const r = layoutRows(ed.doc, true).find((x) => x.id === id);
  if (!r) return;
  const n = nameOf(ed.doc, id);
  ed.say(into && r.parent ? t('svg-editor.layers.name-moved-into-group-position-pos-of', { name: n, group: nameOf(ed.doc, r.parent), pos: r.index + 1, total: r.size }) : into ? t('svg-editor.layers.name-moved-to-the-top-level-position-pos', { name: n, pos: r.index + 1, total: r.size }) : t('svg-editor.layers.name-moved-position-pos-of-total', { name: n, pos: r.index + 1, total: r.size }));
}

/** Move an item to a place: one history step, announced; a refusal changes nothing and says why. */
export function moveTo(ed: McSvgEditor, id: string, place: TreePlace): boolean {
  const r = tryMove(ed.doc, id, place);
  if (r.why) {
    refuse(ed, whyText(ed.doc, r.why, place));
    return false;
  }
  if (same(r.doc, ed.doc)) return false;
  ed.tmsg = '';
  ed.apply(r.doc, 'Move layer');
  announce(ed, id, true);
  focusRow(ed, keyOf(ed, id));
  return true;
}

/** Up (later in paint order) or down among the siblings; a group moves as one block. */
export function stepOrder(ed: McSvgEditor, id: string, dir: 1 | -1): void {
  const ids = ed.doc.groups.some((g) => g.id === id) ? under(ed.doc, id).map((s) => s.id) : [id];
  const d = arrangeOrder(ed.doc, ids, dir === 1 ? 'forward' : 'backward');
  if (d === ed.doc) return refuse(ed, t('svg-editor.layers.it-cannot-move-further'));
  ed.tmsg = '';
  ed.apply(d, 'Reorder');
  announce(ed, id, false);
  focusRow(ed, keyOf(ed, id));
}

/** Alt+Shift+Right / Left and their menu items: into the group right above (as its bottom item), or out, right below its group. */
export function stepGroup(ed: McSvgEditor, id: string, dir: 'in' | 'out'): void {
  const rows = layoutRows(ed.doc, true);
  const me = rows.find((r) => r.id === id);
  if (!me) return;
  if (dir === 'in') {
    const above = rows.find((r) => r.parent === me.parent && r.index === me.index - 1);
    if (!above?.group) return refuse(ed, t('svg-editor.layers.there-is-no-group-above'));
    moveTo(ed, id, { parent: above.id, index: above.kids });
  } else {
    const par = rows.find((r) => r.id === me.parent);
    if (!par) return refuse(ed, t('svg-editor.layers.it-is-already-at-the-top-level'));
    moveTo(ed, id, { parent: par.parent ?? null, index: par.index + 1 });
  }
}

// ── the "Move to…" submenu ──

export function moveMenu(ed: McSvgEditor): MenuEntry | undefined {
  const id = subject(ed);
  if (!id) return undefined;
  const d = ed.doc;
  const rows = layoutRows(d, true);
  const me = rows.find((r) => r.id === id)!;
  const ids = d.groups.some((g) => g.id === id) ? under(d, id).map((s) => s.id) : [id];
  const why = (p: TreePlace): string | undefined => {
    const w = tryMove(d, id, p).why;
    return w ? whyText(d, w, p) : undefined;
  };
  const above = rows.find((r) => r.parent === me.parent && r.index === me.index - 1);
  const e = (eid: string, label: string, reason?: string, sep?: boolean): MenuEntry => ({ id: eid, label, reason, separatorBefore: sep });
  return {
    id: 'moveto',
    label: t('svg-editor.layers.move-to'),
    items: [
      e('mv:up', t('svg-editor.layers.move-up'), arrangeOrder(d, ids, 'forward') === d ? t('svg-editor.layers.it-cannot-move-further') : undefined),
      e('mv:down', t('svg-editor.layers.move-down'), arrangeOrder(d, ids, 'backward') === d ? t('svg-editor.layers.it-cannot-move-further') : undefined),
      e('mv:in', t('svg-editor.layers.move-into-group-above'), above?.group ? undefined : t('svg-editor.layers.there-is-no-group-above')),
      e('mv:out', t('svg-editor.layers.move-out-of-group'), me.parent ? undefined : t('svg-editor.layers.it-is-already-at-the-top-level')),
      e('mv:top', t('svg-editor.layers.top-level'), me.parent ? why({ parent: null, index: 0 }) : t('svg-editor.layers.it-is-already-at-the-top-level'), true),
      ...d.groups.map((g) => e(`mv:to:${g.id}`, t('svg-editor.layers.into-name', { name: g.name }), why({ parent: g.id, index: 0 }))),
    ],
  };
}

export function runMove(ed: McSvgEditor, how: string, arg?: string): void {
  const id = subject(ed);
  if (!id) return;
  if (how === 'up' || how === 'down') stepOrder(ed, id, how === 'up' ? 1 : -1);
  else if (how === 'in' || how === 'out') stepGroup(ed, id, how);
  else moveTo(ed, id, how === 'top' ? { parent: null, index: 0 } : { parent: arg!, index: 0 });
}

// ── drag by the grip ──

/** The row under a pointer height, with the drop it would be. */
function retarget(ed: McSvgEditor): void {
  const p = ed.dragPend;
  if (!p || !ed.drag) return;
  const id = p.id;
  const el = [...ed.renderRoot.querySelectorAll<HTMLElement>('.tree [role=treeitem]')].find((x) => {
    const b = x.getBoundingClientRect();
    return p.cy >= b.top && p.cy < b.bottom;
  });
  const rows = layoutRows(ed.doc, true);
  const t = el && rows.find((r) => K(r) === el.dataset.id);
  if (!el || !t || t.id === id) {
    if (ed.drag.row) ed.drag = { id };
    return;
  }
  const how = dropFor(p.cy, el.getBoundingClientRect(), t.group, ed.doc.groups.find((g) => g.id === t.id)?.open !== false);
  const place = placeFor(rows, id, t, how);
  const why = tryMove(ed.doc, id, place).why;
  const k = K(t);
  if (ed.drag.row !== k || ed.drag.how !== how || ed.drag.why !== why) ed.drag = { id, row: k, how, place, why };
}

function scrollTick(ed: McSvgEditor): void {
  const p = ed.dragPend;
  if (!p || !ed.drag) return;
  const sc = ed.listScroller();
  if (sc) {
    const b = sc.getBoundingClientRect();
    const v = p.cy < b.top + DRAG_EDGE_PX ? -(DRAG_EDGE_PX - Math.max(0, p.cy - b.top)) : p.cy > b.bottom - DRAG_EDGE_PX ? DRAG_EDGE_PX - Math.max(0, b.bottom - p.cy) : 0;
    if (v) {
      sc.scrollTop += Math.round(v / 3) || Math.sign(v);
      retarget(ed);
    }
  }
  p.raf = requestAnimationFrame(() => scrollTick(ed));
}

export function endDrag(ed: McSvgEditor, drop: boolean): boolean {
  const d = ed.drag;
  const p = ed.dragPend;
  if (p?.raf) cancelAnimationFrame(p.raf);
  ed.dragPend = undefined;
  ed.drag = undefined;
  if (!d) return false;
  if (drop && d.place && !d.why) moveTo(ed, d.id, d.place);
  else if (drop && d.why && d.place) refuse(ed, whyText(ed.doc, d.why, d.place));
  return true;
}

function gripDown(ed: McSvgEditor, e: PointerEvent, id: string): void {
  e.stopPropagation(); // no long-press menu, no row click
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  ed.dragPend = { id, x: e.clientX, y: e.clientY, cy: e.clientY };
}

function gripMove(ed: McSvgEditor, e: PointerEvent): void {
  const p = ed.dragPend;
  if (!p) return;
  p.cy = e.clientY;
  if (!ed.drag) {
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < DRAG_START_PX) return;
    ed.drag = { id: p.id };
    ed.tmsg = '';
    scrollTick(ed);
  }
  retarget(ed);
}

// ── the tree ──

function rowKey(e: KeyboardEvent, ed: McSvgEditor, r: TreeRow): void {
  const tag = (e.target as HTMLElement).tagName;
  if (tag === 'INPUT') return;
  // Enter and Space on a row button (eye, padlock, chevron, ungroup) belong to the button: the browser turns them into its click.
  if (tag === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
  const k = K(r);
  const all = [...(e.currentTarget as HTMLElement).parentElement!.querySelectorAll<HTMLElement>('[role=treeitem]')];
  const i = all.indexOf(e.currentTarget as HTMLElement);
  const go = (j: number): void => all[Math.max(0, Math.min(all.length - 1, j))]?.focus();
  const rtl = readDirection(e.currentTarget as Element) === 'rtl';
  const fwd = rtl ? 'ArrowLeft' : 'ArrowRight';
  const eat = (): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  if (e.altKey) {
    const lr = e.key === 'ArrowRight' || e.key === 'ArrowLeft';
    const ud = e.key === 'ArrowUp' || e.key === 'ArrowDown';
    if ((e.shiftKey && lr) || (!e.shiftKey && ud)) {
      eat();
      if (lr) stepGroup(ed, r.id, e.key === fwd ? 'in' : 'out');
      else stepOrder(ed, r.id, e.key === 'ArrowUp' ? 1 : -1);
    }
    return;
  }
  if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
    eat();
    const b = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ed.openRowMenu(k, e.currentTarget as HTMLElement, [b.left + 24, b.bottom], false);
    return;
  }
  const open = r.group && ed.doc.groups.find((g) => g.id === r.id)?.open !== false;
  ed.tmsg = '';
  switch (e.key) {
    case 'ArrowDown':
      eat();
      go(i + 1);
      break;
    case 'ArrowUp':
      eat();
      go(i - 1);
      break;
    case 'Home':
      eat();
      go(0);
      break;
    case 'End':
      eat();
      go(all.length - 1);
      break;
    case fwd:
      if (r.group) {
        eat();
        if (open) go(i + 1);
        else ed.toggleGroup(r.id);
      }
      break;
    case rtl ? 'ArrowRight' : 'ArrowLeft':
      if (open || r.parent) {
        eat();
        if (open) ed.toggleGroup(r.id);
        else focusRow(ed, `g:${r.parent}`);
      }
      break;
    case 'F2':
      eat();
      ed.renaming = k;
      ed.updateComplete.then(() => ed.renderRoot.querySelector<HTMLInputElement>('.rename')?.select());
      break;
    case ' ':
    case 'Enter':
      eat();
      pick(ed, r, e.shiftKey || e.ctrlKey || e.metaKey);
      break;
  }
}

function pick(ed: McSvgEditor, r: TreeRow, add: boolean): void {
  const ids = r.group ? under(ed.doc, r.id).map((s) => s.id) : [r.id];
  const on = ids.every((i) => ed.sel.includes(i));
  ed.cur = K(r);
  ed.select(add ? (on ? ed.sel.filter((x) => !ids.includes(x)) : [...new Set([...ed.sel, ...ids])]) : ids);
  if (!add) ed.say(t('svg-editor.layers.name-selected', { name: nameOf(ed.doc, r.id) }));
}

function renameKey(e: KeyboardEvent, ed: McSvgEditor, k: string): void {
  e.stopPropagation();
  if (e.key === 'Enter') {
    e.preventDefault();
    ed.renameShape(k, (e.target as HTMLInputElement).value);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    ed.renaming = undefined;
  }
}

function rowView(ed: McSvgEditor, r: TreeRow, cur: string, unsafe: Set<string>): TemplateResult {
  const d = ed.doc;
  const k = K(r);
  const g = d.groups.find((x) => x.id === r.id);
  const s = g ? undefined : byId(d, r.id)!;
  const item = (g ?? s)!;
  const ids = g ? under(d, r.id).map((x) => x.id) : [r.id];
  const on = ids.every((i) => ed.sel.includes(i));
  const open = g?.open !== false;
  const name = item.name;
  const hid = !!item.hidden;
  const lck = !!item.locked;
  const why = s && ed.img?.lockNote(s);
  const dr = ed.drag;
  const tab = k === cur ? 0 : -1;
  const off = groupChain(d, r.parent).some((x) => x.hidden || x.locked);
  const cls = `row${g ? ' grp' : ''}${on ? ' on' : ''}${off ? ' off' : ''}${dr?.id === r.id ? ' dragging' : ''}${dr?.row === k ? (dr.why ? ' drop-no' : ` drop-${dr.how}`) : ''}`;
  const toggle = (patch: { hidden: boolean } | { locked: boolean }, label: string) => (e: Event): void => {
    e.stopPropagation();
    if (g) ed.editGroup(g.id, patch, label);
    else if (label === 'Hide') ed.editShapes([r.id], (x) => ({ ...x, ...patch }), label);
    else ed.apply(ed.replaceOne(s!, patch), label);
  };
  const ib = (label: string, cls2: string, g2: Parameters<typeof glyph>[0], on2: (e: Event) => void, pressed?: boolean): TemplateResult =>
    html`<button type="button" class=${`icon-btn xs ${cls2}`.trim()} tabindex=${tab} aria-pressed=${pressed === undefined ? nothing : aria(pressed)} aria-label=${label} title=${label} @click=${on2}>${glyph(g2, 16)}</button>`;
  return html`<div
    class=${cls}
    role="treeitem"
    aria-level=${r.level}
    aria-setsize=${r.size}
    aria-posinset=${r.index + 1}
    aria-expanded=${g ? aria(open) : nothing}
    aria-selected=${aria(on)}
    tabindex=${tab}
    data-id=${k}
    style=${`--lvl:${r.level - 1}`}
    @click=${(e: MouseEvent) => pick(ed, r, e.shiftKey || e.ctrlKey || e.metaKey)}
    @dblclick=${() => (ed.renaming = k)}
    @keydown=${(e: KeyboardEvent) => rowKey(e, ed, r)}
    @contextmenu=${(e: MouseEvent) => ed.rowContext(e, k)}
    @pointerdown=${(e: PointerEvent) => ed.pressDown(e, k)}
    @pointermove=${ed.pressMove}
    @pointerup=${ed.pressEnd}
    @pointercancel=${ed.pressEnd}
  >
    <button
      type="button"
      class="icon-btn xs grip"
      tabindex="-1"
      aria-label=${t('svg-editor.layers.drag-to-move-name', { name })}
      title=${t('svg-editor.layers.drag-to-move-name', { name })}
      @click=${(e: Event) => e.stopPropagation()}
      @pointerdown=${(e: PointerEvent) => gripDown(ed, e, r.id)}
      @pointermove=${(e: PointerEvent) => gripMove(ed, e)}
      @pointerup=${() => endDrag(ed, true)}
      @pointercancel=${() => endDrag(ed, false)}
    >${glyph('dragVertical', 16)}</button>
    ${g ? ib(open ? t('svg-editor.layers.collapse-name', { name }) : t('svg-editor.layers.expand-name', { name }), 'chev', open ? 'chevronDown' : 'chevronRight', (e) => {
      e.stopPropagation();
      ed.toggleGroup(g.id);
    }) : nothing}
    ${ib(hid ? t('svg-editor.layers.show-name', { name }) : t('svg-editor.layers.hide-name', { name }), '', hid ? 'eyeOffOutline' : 'eyeOn', toggle({ hidden: !hid }, 'Hide'), hid)}
    ${ib(why ?? (lck ? t('svg-editor.layers.unlock-name', { name }) : t('svg-editor.layers.lock-name', { name })), '', lck ? 'lock' : 'lockOpenVariant', why ? (e) => (e.stopPropagation(), ed.say(why)) : toggle({ locked: !lck }, 'Lock'), why ? undefined : lck)}
    ${ed.renaming === k
      ? html`<input class="rename input" type="text" .value=${name} @click=${(e: Event) => e.stopPropagation()} @keydown=${(e: KeyboardEvent) => renameKey(e, ed, k)} @blur=${(e: Event) => ed.renameShape(k, (e.target as HTMLInputElement).value)} />`
      : html`<span class="nm" title=${name}>${name}</span>`}
    ${s && ed.dualOn ? html`<span class="chip">${t(TONE[toneOf(s)])}</span>` : nothing}
    ${s && unsafe.has(s.id) ? html`<span class="chip is-warn" title=${t('svg-editor.layers.reaches-outside-the-20-x-20-safe-area')}>!<span class="sr">${t('svg-editor.layers.reaches-outside-the-20-x-20-safe-area')}</span></span>` : nothing}
    ${g ? ib(t('svg-editor.layers.ungroup-name', { name }), '', 'ungroup', (e) => {
      e.stopPropagation();
      ed.ungroupSel(g.id);
    }) : nothing}
  </div>`;
}

/** The tree with its status line (drop target, refusal reason). */
export function layerTree(ed: McSvgEditor): TemplateResult {
  const rows = layoutRows(ed.doc);
  const unsafe = new Set(outsideSafe(ed.doc));
  const keys = rows.map(K);
  const first = rows.find((r) => (r.group ? under(ed.doc, r.id).every((x) => ed.sel.includes(x.id)) : ed.sel.includes(r.id))) ?? rows[0];
  const cur = ed.cur && keys.includes(ed.cur) ? ed.cur : first && K(first);
  const dr = ed.drag;
  const status = dr?.why && dr.place ? whyText(ed.doc, dr.why, dr.place) : ed.tmsg;
  return html`<div class=${`tree${dr ? ' dragging' : ''}`} role="tree" aria-label=${t('svg-editor.layers.layers')} aria-multiselectable="true" @focusin=${(e: Event) => {
      const k = (e.target as HTMLElement).closest<HTMLElement>('[role=treeitem]')?.dataset.id;
      if (k && k !== ed.cur) ed.cur = k;
    }}>${repeat(rows, K, (r) => rowView(ed, r, cur ?? '', unsafe))}</div>
    <p class=${`help dstat${dr?.why ? ' is-no' : ''}`}>${status}</p>`;
}

/** Add group is refused (with the reason as text) when the picked items would end up deeper than the limit. */
export const groupBlocked = (ed: McSvgEditor): boolean => ed.sel.length > 1 && !groupItems(ed.doc, ed.sel).group;
