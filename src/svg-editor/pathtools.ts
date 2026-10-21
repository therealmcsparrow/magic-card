import type { Box, EditPath, Pt } from '../contracts/path-model';
import { PREVIEW_DEBOUNCE_MS, SIMPLIFY_DEFAULT } from '../contracts/path-tools';
import type { PanelState, PathTool, PathToolsChunk, PathToolsDeps, ToolOptions, ToolRefusal, ToolResult } from '../contracts/path-tools';
import { loadPathBooleans } from '../path-booleans/loader';
import { loadPathTools } from '../path-tools/loader';
import { D } from './bind';
import { asPath, isOff, newShape, pruneGroups, shapeBox, uid, type Doc, type Shape } from './model';
import type { McSvgEditor } from './mc-svg-editor';
import { t } from './i18n';
import { PT_NAME } from './names';

/*
 * Path tools in the editor (contract svg-editor, path-tools 1.0.0): which layers a tool works on, why it
 * can't, the document after a result, and the panel flow (open, preview, Apply, Cancel). The geometry, the panel
 * template and their words are in the lazy chunk; nothing here runs before a tool is first used.
 */

export const PATH_BUTTONS: readonly PathTool[] = ['outline-stroke', 'offset', 'simplify', 'join', 'split'];

export interface PtState {
  tool: PathTool;
  st: PanelState;
  c: PathToolsChunk;
  deps: PathToolsDeps;
  line?: [Pt, Pt];
  at?: McSvgEditor['pointCtx'];
  res?: Planned;
  timer?: ReturnType<typeof setTimeout>;
}

/** The result (before and after are the panel's anchor counts) or the refusal; no refusal and no document means nothing to preview. */
type Planned = { doc: Doc; sel: string[]; prev: Shape[]; before: number; after: number; refusal?: undefined } | { doc?: undefined; refusal?: ToolRefusal; before?: undefined; after?: undefined };

const closed = (p: EditPath): boolean => p.closed && p.anchors.length >= 3;
const opened = (p: EditPath): boolean => !p.closed && p.anchors.length > 1;
const count = (ps: EditPath[]): number => ps.reduce((n, p) => n + p.anchors.length, 0);
/** Visible, unlocked layers that pass the test. */
const usable = (d: Doc, f: (s: Shape) => boolean): Shape[] => d.shapes.filter((s) => f(s) && !isOff(d, s, 'hidden') && !isOff(d, s, 'locked'));

/** Why the tool can not start, or undefined. Same text in the button list, the menus and the live region. */
export function ptReason(ed: McSvgEditor, tool: PathTool): string | undefined {
  if (tool === 'split') {
    const c = ed.pointCtx;
    return !c || (!c.p.closed && (c.i === 0 || c.i === c.p.anchors.length - 1)) ? t('Select one point between the ends with the Node tool.') : undefined;
  }
  const on = usable(ed.doc, (s) => ed.sel.includes(s.id));
  if (!on.length) return t('Select a shape first.');
  const ps = on.flatMap((s) => s.paths);
  if (tool === 'outline-stroke') return on.some((s) => s.stroke !== 'none' && s.width > 0) ? undefined : t('This shape has no stroke to outline.');
  if (tool === 'offset') return ps.some(closed) ? undefined : t('Select a closed shape. Open lines have no area.');
  if (tool === 'join') return ps.some(opened) ? undefined : t('Join works on open paths. Use Split first to open a closed one.');
  return undefined;
}

/** Does the box lie within reach of the segment's own box? */
const near = (b: Box | undefined, [ax, ay]: Pt, [bx, by]: Pt): boolean => !!b && b.x <= Math.max(ax, bx) && b.x + b.w >= Math.min(ax, bx) && b.y <= Math.max(ay, by) && b.y + b.h >= Math.min(ay, by);

function plan(p: PtState, d: Doc, sel: readonly string[]): Planned {
  const { c, deps, st, tool } = p;
  const k = Math.max(d.vb.w, d.vb.h) / 24;
  const rep = new Map<string, Shape[]>();
  let before = 0;
  let after = 0;
  let fail: ToolRefusal | undefined;
  const done = (r: ToolResult, from: EditPath[]): EditPath[] | undefined => {
    if (r.ok) {
      before += count(from);
      after += count(r.paths);
      return r.paths;
    }
    fail ??= r.reason;
    return undefined;
  };
  const opt = (s?: Shape): ToolOptions => ({ frame: d.vb, fillRule: s?.rule }) as ToolOptions;
  const edit = (s: Shape, paths: EditPath[], over: Partial<Shape> = {}): Shape => ({ ...asPath(s), paths, angle: undefined, ...over });
  /** One layer per part: the first keeps the id, all are named "<name> n". */
  const parts = (s: Shape, list: EditPath[][]): Shape[] => list.map((x, i) => edit(s, x, { id: i ? uid() : s.id, name: `${s.name} ${i + 1}` }));
  let t = usable(d, (s) => sel.includes(s.id));

  if (tool === 'split') {
    const { sub, i } = p.at!;
    const s = d.shapes.find((x) => x.id === p.at!.s.id);
    const e = s?.paths[sub];
    const r = e && done(c.split(e, i), [e]);
    if (s && r) {
      const paths = s.paths.slice();
      paths[sub] = r[0];
      rep.set(s.id, r.length > 1 ? parts(s, [paths, [r[1]]]) : [edit(s, paths)]);
    }
  } else if (tool === 'join') {
    const o = t.flatMap((s) => s.paths.filter(opened).map((x) => ({ s, x })));
    const [a, b] = o;
    const r = a && done(c.join(a.x, b?.x, opt()), b ? [a.x, b.x] : [a.x]);
    if (a && r) {
      rep.set(a.s.id, [edit(a.s, a.s.paths.map((x) => (x === a.x ? r[0] : x)).filter((x) => !b || x !== b.x || b.s !== a.s))]);
      if (b && b.s !== a.s) {
        const left = b.s.paths.filter((x) => x !== b.x);
        rep.set(b.s.id, left.length ? [edit(b.s, left)] : []);
      }
    } else if (!a) fail = 'not-open';
  } else if (tool === 'knife') {
    const [a, b] = p.line!;
    if (!sel.length) t = usable(d, (s) => near(shapeBox(s), a, b));
    const r = c.knife(t.map((s) => s.paths), a, b, opt(t[0]), deps);
    if (!r.ok) fail = r.reason;
    else
      t.forEach((s, n) => {
        const pieces = r.pieces.filter((x) => x.operand === n);
        if (!r.cut[n] || pieces.length < 2) return;
        before += count(s.paths);
        after += pieces.reduce((m, x) => m + count(x.paths), 0);
        rep.set(s.id, parts(s, pieces.map((x) => x.paths)));
      });
  } else {
    for (const s of t) {
      if (tool === 'outline-stroke') {
        if (s.stroke === 'none' || s.width <= 0) continue;
        const r = done(c.outlineStroke(s.paths, { width: s.width, cap: s.cap, join: s.join }, opt(s), deps), s.paths);
        if (!r) continue;
        const ring = { fill: s.stroke, stroke: 'none' as const, rule: 'nonzero' as const };
        // the result is named "<name> outline" so a round-capped line that looks the same is plainly a new shape
        const named = / outline$/.test(s.name) ? s.name : `${s.name} outline`;
        rep.set(s.id, s.fill === 'none' ? [edit(s, r, { ...ring, name: named })] : [edit(s, s.paths, { stroke: 'none' }), newShape('path', r, { ...ring, name: named, group: s.group })]);
      } else if (tool === 'offset') {
        const cl = s.paths.filter(closed);
        if (!cl.length) continue;
        const r = done(c.offset(cl, (st.amount ?? 1) * k, st.join ?? 'round', opt(s), deps), cl);
        if (!r) continue;
        rep.set(s.id, [edit(s, [...r, ...s.paths.filter((x) => !closed(x))], { rule: 'nonzero' })]);
      } else {
        const r = c.simplify(s.paths, (st.tolerance ?? SIMPLIFY_DEFAULT) * k, !!st.smooth, opt(s), deps);
        const x = r.ok || r.reason !== 'no-change' ? done(r, s.paths) : undefined;
        if (x) rep.set(s.id, [edit(s, x)]);
      }
    }
  }
  if (fail || !rep.size) return { refusal: fail ?? (tool === 'simplify' ? 'no-change' : tool === 'offset' ? 'no-area' : tool === 'outline-stroke' ? 'no-stroke' : undefined) };
  const out = [...rep.values()].flat();
  return { doc: pruneGroups({ ...d, shapes: d.shapes.flatMap((s) => rep.get(s.id) ?? [s]) }), sel: out.map((s) => s.id), prev: out, before, after };
}

export async function openTool(ed: McSvgEditor, tool: PathTool, line?: [Pt, Pt]): Promise<void> {
  if (ed.ptBusy) return;
  const why = tool === 'knife' ? undefined : ptReason(ed, tool);
  if (why) {
    ed.say(why);
    return;
  }
  ed.ptBusy = tool;
  let l;
  try {
    // both chunks load together on first use
    const [c, b] = await Promise.all([loadPathTools(), loadPathBooleans()]);
    l = c && b ? { c, deps: { booleans: b, draw: D } } : undefined;
  } finally {
    ed.ptBusy = undefined;
  }
  if (!l) {
    ed.noteFail(t('Couldn\'t load the path tools. Try again.'), () => void openTool(ed, tool, line));
    return;
  }
  ed.note = undefined;
  const p = { tool, ...l, st: { tool, amount: 1, join: 'round', tolerance: SIMPLIFY_DEFAULT, smooth: false }, line, at: tool === 'split' ? ed.pointCtx : undefined } as PtState;
  ed.pt = { ...p, res: plan(p, ed.doc, ed.sel) };
  void ed.updateComplete.then(() => ed.renderRoot.querySelector<HTMLElement>('.pt-panel input, .pt-panel [data-act=apply]')?.focus());
}

/** Rerun the preview after PREVIEW_DEBOUNCE_MS. */
export function later(ed: McSvgEditor): void {
  const p = ed.pt;
  if (!p) return;
  clearTimeout(p.timer);
  p.timer = setTimeout(() => ed.pt && (ed.pt = { ...ed.pt, res: plan(ed.pt, ed.doc, ed.sel) }), PREVIEW_DEBOUNCE_MS);
}

/** Close the panel and go back to the control that opened the tool. */
function close(ed: McSvgEditor, { tool, timer }: PtState): void {
  clearTimeout(timer);
  ed.pt = undefined;
  void ed.updateComplete.then(() => ed.renderRoot.querySelector<HTMLElement>(tool === 'knife' ? '.rail [aria-keyshortcuts=K]' : '[data-menu=path]')?.focus());
}

export function change(ed: McSvgEditor, patch: Partial<PanelState>): void {
  const p = ed.pt;
  if (!p) return;
  ed.pt = { ...p, st: { ...p.st, ...patch } };
  later(ed);
}

export function cancel(ed: McSvgEditor): void {
  const p = ed.pt;
  if (!p) return;
  close(ed, p);
}

export function apply(ed: McSvgEditor): void {
  const p = ed.pt;
  if (!p) return;
  const r = plan(p, ed.doc, ed.sel);
  if (!r.doc) return;
  ed.apply(r.doc, t(PT_NAME[p.tool]));
  ed.select(r.sel);
  ed.noteUndo(t('{name} applied: {before} points before, {after} after.', { name: t(PT_NAME[p.tool]), before: r.before, after: r.after }));
  close(ed, p);
}

/** The panel state the chunk's template shows. */
export const panelState = (p: PtState): PanelState => ({ ...p.st, ...p.res, busy: !p.res });
