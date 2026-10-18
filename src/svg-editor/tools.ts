import type { Pt, PrimitiveKind } from '../contracts/path-model';
import { S } from './strings';
import { D } from './bind';
import { toEditPaths, fromCorners, fromPrimitive, newShape, nameFor, type Doc, type Shape } from './model';

/*
 * Draw tools on the stage: rectangle, ellipse, line, polygon / star and freehand, and the Hand tool.
 * Three ways in for every shape (WCAG 2.5.7): drag from corner to corner, click two corners, or the
 * keyboard crosshair (arrows move it, Enter sets a corner). The canvas never sees these pointers; the
 * pen and the point tools are the canvas's own.
 */

export type Tool = 'select' | 'node' | 'pen' | 'rect' | 'ellipse' | 'line' | 'polygon' | 'shapes' | 'free' | 'hand';
export const SHAPE_TOOLS: readonly Tool[] = ['rect', 'ellipse', 'line', 'polygon', 'shapes'];
export const DRAW_TOOLS: readonly Tool[] = [...SHAPE_TOOLS, 'free', 'hand'];

export interface ToolOpts {
  r: number;
  sides: number;
  inner: number;
  star: boolean;
  prim: PrimitiveKind;
}

export interface Live {
  shape?: Shape;
  from?: Pt;
  cursor?: Pt;
  trail?: Pt[];
}

export interface StageHost {
  tool: Tool;
  opts: ToolOpts;
  doc: Doc;
  snapOn: boolean;
  grid: number;
  /** The safe area is shown: its edges and centre lines are snap lines too. */
  safeOn?: boolean;
  point(e: { clientX: number; clientY: number }): Pt;
  centre(): Pt;
  setLive(l: Live | undefined): void;
  addShape(s: Shape): void;
  panBy(dx: number, dy: number): void;
  say(text: string): void;
  space: boolean;
}

interface Gesture {
  id: number;
  a: Pt;
  client: Pt;
  started: boolean;
  trail: Pt[];
  pan?: Pt;
}

const SLOP = 4;
const KEYS: Record<string, Pt> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
const clean = (v: number): number => Math.round(v * 1e4) / 1e4;

export class Gestures {
  private g?: Gesture;
  private pending?: Pt;
  private cursor?: Pt;

  constructor(private h: StageHost) {}

  /** Is the current tool one of ours? */
  get active(): boolean {
    return DRAW_TOOLS.includes(this.h.tool);
  }

  private snap(p: Pt, off: boolean): Pt {
    const s = this.h.grid;
    if (!this.h.snapOn || off) return p;
    // a safe-area line (edge or centre) wins when it is nearer than the grid point
    const ax = (v: number): number => {
      const g = s > 0 ? clean(Math.round(v / s) * s) : v;
      const l = this.h.safeOn ? [2, 12, 22].reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a)) : g;
      return Math.abs(l - v) < Math.abs(g - v) ? l : g;
    };
    return [ax(p[0]), ax(p[1])];
  }

  private build(a: Pt, b: Pt, square: boolean): Shape | undefined {
    const t = this.h.tool;
    if (!SHAPE_TOOLS.includes(t) || (Math.abs(b[0] - a[0]) < 0.01 && Math.abs(b[1] - a[1]) < 0.01)) return undefined;
    const o = this.h.opts;
    if (t === 'shapes') return fromPrimitive(this.h.doc, o.prim, S.prim[o.prim], a, b, square);
    const kind = t === 'polygon' ? (o.star ? 'star' : 'polygon') : (t as 'rect' | 'ellipse' | 'line');
    return fromCorners(this.h.doc, kind, a, b, { r: o.r, sides: o.sides, inner: o.inner, square: square && kind !== 'line' });
  }

  reset(): void {
    this.g = undefined;
    this.pending = undefined;
    this.cursor = undefined;
    this.h.setLive(undefined);
  }

  /** Esc: true when there was something to end. */
  cancel(): boolean {
    const had = !!this.g || !!this.pending || !!this.cursor;
    if (had) this.reset();
    return had;
  }

  down(e: PointerEvent): boolean {
    if (!this.active || (e.pointerType === 'mouse' && e.button !== 0) || this.h.space) return false;
    const p = this.h.point(e);
    this.g = { id: e.pointerId, a: this.pending ?? this.snap(p, e.altKey), client: [e.clientX, e.clientY], started: false, trail: [p] };
    if (this.h.tool === 'hand') this.g.pan = [e.clientX, e.clientY];
    return true;
  }

  move(e: PointerEvent): boolean {
    const g = this.g;
    const t = this.h.tool;
    if (!g || g.id !== e.pointerId) {
      if (this.pending && SHAPE_TOOLS.includes(t)) {
        const b = this.snap(this.h.point(e), e.altKey);
        this.h.setLive({ shape: this.build(this.pending, b, e.shiftKey), from: this.pending, cursor: b });
        return true;
      }
      return false;
    }
    if (!g.started && Math.hypot(e.clientX - g.client[0], e.clientY - g.client[1]) < SLOP) return true;
    g.started = true;
    if (t === 'hand' && g.pan) {
      this.h.panBy(e.clientX - g.pan[0], e.clientY - g.pan[1]);
      g.pan = [e.clientX, e.clientY];
    } else if (t === 'free') {
      g.trail.push(this.h.point(e));
      this.h.setLive({ trail: g.trail });
    } else {
      const b = this.snap(this.h.point(e), e.altKey);
      this.h.setLive({ shape: this.build(g.a, b, e.shiftKey), from: g.a, cursor: b });
    }
    return true;
  }

  up(e: PointerEvent): boolean {
    const g = this.g;
    if (!g || g.id !== e.pointerId) return false;
    this.g = undefined;
    const t = this.h.tool;
    if (t === 'hand') return true;
    if (t === 'free') {
      this.h.setLive(undefined);
      if (g.started) this.finishFree(g.trail);
      return true;
    }
    const b = this.snap(this.h.point(e), e.altKey);
    if (g.started || this.pending) {
      this.finish(g.a, b, e.shiftKey);
    } else {
      this.pending = g.a;
      this.h.setLive({ from: g.a, cursor: g.a });
    }
    return true;
  }

  private finish(a: Pt, b: Pt, square: boolean): void {
    this.pending = undefined;
    this.cursor = undefined;
    this.h.setLive(undefined);
    const s = this.build(a, b, square);
    if (s) this.h.addShape(s);
  }

  private finishFree(trail: Pt[]): void {
    const r = D.fitFreehand(trail, 0.3);
    if (!r.d) return;
    const paths = toEditPaths(r.d);
    if (!paths.length) return;
    this.h.addShape(newShape('path', paths, r.closed ? { name: nameFor(this.h.doc, 'path') } : { name: nameFor(this.h.doc, 'path'), fill: 'none', stroke: 'main', auto: true }));
  }

  /** The keyboard crosshair. Returns true when the key was ours. */
  key(e: KeyboardEvent): boolean {
    if (!this.active || !SHAPE_TOOLS.includes(this.h.tool)) return false;
    const grid = this.h.snapOn && this.h.grid > 0 ? this.h.grid : 0.5;
    const d = KEYS[e.key];
    if (d) {
      const step = e.altKey ? 0.1 : e.shiftKey ? grid * 4 : grid;
      const c = this.cursor ?? this.pending ?? this.h.centre();
      this.cursor = [clean(c[0] + d[0] * step), clean(c[1] + d[1] * step)];
      this.h.setLive({ shape: this.pending ? this.build(this.pending, this.cursor, false) : undefined, from: this.pending, cursor: this.cursor });
      this.h.say(`x ${this.cursor[0]}, y ${this.cursor[1]}`);
      return true;
    }
    if (e.key === 'Enter') {
      const c = this.cursor ?? this.h.centre();
      this.cursor = c;
      if (!this.pending) {
        this.pending = c;
        this.h.setLive({ from: c, cursor: c });
        this.h.say(S.firstCorner);
      } else this.finish(this.pending, c, false);
      return true;
    }
    return false;
  }
}
